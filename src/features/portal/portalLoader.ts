import type { GitHubRepo, GitHubUser, PortalItem } from '../../types/portal';
import type { PortalSettings } from '../../types/portal';
import {
  fetchUser,
  fetchRepos,
  fetchPortalConfig,
  fetchReadme,
  fetchLatestRelease,
} from '../github/githubClient';
import { parsePortalConfig } from './configSchema';
import { transformToPortalItem } from './portalTransformer';
import { GitHubRateLimitError } from '../github/githubClient';

// ─────────────────────────────────────────────────────────────────────────────
//  Portal Loader
//  Orchestrates the two-phase loading: first repos, then per-repo details.
// ─────────────────────────────────────────────────────────────────────────────

export interface PortalLoadResult {
  user: GitHubUser;
  items: PortalItem[];
  rateLimitHit: boolean;
  errors: string[];
}

function isCandidate(repo: GitHubRepo, settings: PortalSettings): boolean {
  if (repo.fork || repo.archived) return false;

  const hasTopic = repo.topics.includes(settings.requiredTopic);
  // We can't know if portal.config.json exists without fetching it,
  // so for 'topics-only' we filter by topic; for others we always try.
  switch (settings.discoveryMode) {
    case 'topics-only':
      return hasTopic;
    case 'config-only':
      return true; // Will be filtered after fetching config
    case 'topics-or-config':
    default:
      return true; // Try all repos, filter after
  }
}

export async function loadPortal(
  settings: PortalSettings,
  token?: string
): Promise<PortalLoadResult> {
  const errors: string[] = [];
  let rateLimitHit = false;

  // Phase 1 — fetch user and repo list
  const user = await fetchUser(settings.githubUsername, token);
  const allRepos = await fetchRepos(
    settings.githubUsername,
    settings.maxReposToScan,
    token
  );

  const candidates = allRepos.filter((r) => isCandidate(r, settings));

  // Phase 2 — fetch details only for candidates
  const items: PortalItem[] = [];

  await Promise.allSettled(
    candidates.map(async (repo) => {
      try {
        // Try to get portal.config.json
        const rawConfig = await fetchPortalConfig(repo, token);

        let config: ReturnType<typeof parsePortalConfig>['data'] | undefined;
        let configError: string | undefined;
        let hasConfig = false;

        if (rawConfig !== null) {
          const result = parsePortalConfig(rawConfig);
          if (result.data) {
            config = result.data;
            hasConfig = true;
          } else {
            configError = result.error;
            errors.push(`[${repo.name}] Config inválida: ${result.error}`);
            console.warn(`[portal] Config inválida en ${repo.name}:`, result.error);
          }
        }

        // Determine if this repo should appear based on discovery mode
        const hasTopic = repo.topics.includes(settings.requiredTopic);
        const shouldInclude =
          settings.discoveryMode === 'topics-only'
            ? hasTopic
            : settings.discoveryMode === 'config-only'
            ? hasConfig
            : hasTopic || hasConfig || (settings.allowFallbackWithoutConfig && hasTopic);

        if (!shouldInclude && !settings.allowFallbackWithoutConfig) return;
        if (!shouldInclude && !hasTopic && !hasConfig) return;

        // Fetch README if needed
        let readmeContent: string | undefined;
        if (settings.renderReadme && config?.readme !== false) {
          const md = await fetchReadme(repo, token);
          readmeContent = md ?? undefined;
        }

        // Fetch latest release if needed
        let latestRelease = undefined;
        if (settings.showReleases && config?.releases !== false) {
          const release = await fetchLatestRelease(repo, token);
          latestRelease = release ?? undefined;
        }

        const item = transformToPortalItem({
          repo,
          config,
          readmeContent,
          latestRelease,
          configError,
          renderReadme: settings.renderReadme,
          showReleases: settings.showReleases,
        });

        items.push(item);
      } catch (err) {
        if (err instanceof GitHubRateLimitError) {
          rateLimitHit = true;
        } else {
          errors.push(`[${repo.name}] Error inesperado: ${(err as Error).message}`);
          console.error(`[portal] Error cargando ${repo.name}:`, err);
        }
      }
    })
  );

  return { user, items, rateLimitHit, errors };
}
