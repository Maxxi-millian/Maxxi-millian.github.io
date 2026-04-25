import type {
  GitHubRepo,
  GitHubUser,
  GitHubRelease,
  PortalConfigV1,
} from '../../types/portal';

// ─────────────────────────────────────────────────────────────────────────────
//  GitHub REST API v3 client
//  - In-memory cache per session
//  - Optional token (VITE_GITHUB_TOKEN) for higher rate limits
//  - All raw HTML is never executed — only data is consumed
// ─────────────────────────────────────────────────────────────────────────────

const BASE = 'https://api.github.com';
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export class GitHubRateLimitError extends Error {
  constructor() {
    super('GitHub API rate limit exceeded. Try again later or add a VITE_GITHUB_TOKEN.');
    this.name = 'GitHubRateLimitError';
  }
}

export class GitHubApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

async function fetchWithCache<T>(url: string, token?: string): Promise<T | null> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data as T;
  }

  const res = await fetch(url, { headers: getHeaders(token) });

  if (res.status === 404) return null;
  if (res.status === 403 || res.status === 429) throw new GitHubRateLimitError();
  if (!res.ok) throw new GitHubApiError(res.status, `GitHub API error: ${res.status} ${res.statusText}`);

  const data = await res.json();
  cache.set(url, { data, ts: Date.now() });
  return data as T;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetch public user profile */
export async function fetchUser(username: string, token?: string): Promise<GitHubUser> {
  const data = await fetchWithCache<GitHubUser>(`${BASE}/users/${username}`, token);
  if (!data) throw new GitHubApiError(404, `User "${username}" not found.`);
  return data;
}

/** Fetch all public repos (handles pagination) */
export async function fetchRepos(
  username: string,
  maxCount: number,
  token?: string
): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  const perPage = Math.min(maxCount, 100);
  let page = 1;

  while (repos.length < maxCount) {
    const url = `${BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated&type=public`;
    const batch = await fetchWithCache<GitHubRepo[]>(url, token);
    if (!batch || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < perPage) break;
    page++;
  }

  return repos.slice(0, maxCount);
}

/** Try to fetch portal.config.json from a repo — returns null if not found */
export async function fetchPortalConfig(
  repo: GitHubRepo,
  token?: string
): Promise<unknown | null> {
  const url = `${BASE}/repos/${repo.full_name}/contents/portal.config.json`;
  const cached = cache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data;
  }

  const res = await fetch(url, { headers: getHeaders(token) });
  if (res.status === 404) return null;
  if (res.status === 403 || res.status === 429) throw new GitHubRateLimitError();
  if (!res.ok) return null;

  const file = await res.json();
  // GitHub returns base64-encoded content
  if (file.encoding === 'base64' && file.content) {
    try {
      const decoded = atob(file.content.replace(/\n/g, ''));
      const parsed = JSON.parse(decoded);
      cache.set(url, { data: parsed, ts: Date.now() });
      return parsed;
    } catch {
      return null;
    }
  }
  return null;
}

/** Fetch raw README markdown — returns null if not found */
export async function fetchReadme(
  repo: GitHubRepo,
  token?: string
): Promise<string | null> {
  const url = `${BASE}/repos/${repo.full_name}/readme`;
  const cached = cache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data as string;
  }

  const res = await fetch(url, {
    headers: { ...getHeaders(token), Accept: 'application/vnd.github.raw+json' },
  });
  if (res.status === 404) return null;
  if (res.status === 403 || res.status === 429) throw new GitHubRateLimitError();
  if (!res.ok) return null;

  const text = await res.text();
  cache.set(url, { data: text, ts: Date.now() });
  return text;
}

/** Fetch latest release — returns null if no releases */
export async function fetchLatestRelease(
  repo: GitHubRepo,
  token?: string
): Promise<GitHubRelease | null> {
  return fetchWithCache<GitHubRelease>(
    `${BASE}/repos/${repo.full_name}/releases/latest`,
    token
  );
}

/** Fetch GitHub Pages URL for a repo (if enabled) */
export function resolveHomepageUrl(repo: GitHubRepo): string | null {
  if (repo.has_pages) {
    const [owner] = repo.full_name.split('/');
    return `https://${owner}.github.io/${repo.name}`;
  }
  if (repo.homepage) return repo.homepage;
  return null;
}

/** Resolve download URL from release + download config */
export function resolveDownloadUrl(
  release: GitHubRelease | undefined,
  config: PortalConfigV1['download']
): string | null {
  if (!config) return null;

  if (config.source === 'manual-url' && config.url) return config.url;

  if (!release) return null;

  if (config.source === 'latest') return release.html_url;

  if (config.source === 'named-asset' && config.assetName) {
    const asset = release.assets.find((a) => a.name === config.assetName);
    return asset?.browser_download_url ?? null;
  }

  return null;
}

/** Invalidate the in-memory cache (useful for manual refresh) */
export function clearCache(): void {
  cache.clear();
}
