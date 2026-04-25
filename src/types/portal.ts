// ─────────────────────────────────────────────
// Portal Types — v1
// ─────────────────────────────────────────────

export type PortalItemKind = 'page' | 'card' | 'download' | 'link';

export type PortalItemVisibility = 'public' | 'hidden' | 'draft';

export type PortalItemStyle = 'default' | 'featured' | 'compact' | 'minimal';

export type PortalActionType =
  | 'open-url'
  | 'open-github'
  | 'open-pages'
  | 'download-latest-release'
  | 'download-asset'
  | 'open-readme';

export type AllowedIcon =
  | 'code'
  | 'book'
  | 'download'
  | 'link'
  | 'tool'
  | 'star'
  | 'box'
  | 'terminal'
  | 'globe'
  | 'file'
  | 'folder'
  | 'zap'
  | 'layers'
  | 'cpu'
  | 'bot'
  | 'game'
  | 'music'
  | 'image'
  | 'settings'
  | 'shield'
  | 'heart'
  | 'package';

// ─── portal.config.json schema v1 ───────────────

export interface PortalAction {
  type: PortalActionType;
  /** URL for open-url or asset name for download-asset */
  target?: string;
  label?: string;
}

export interface PortalDownload {
  /** 'latest' uses latest GitHub release */
  source: 'latest' | 'named-asset' | 'manual-url';
  /** Required when source is 'named-asset' */
  assetName?: string;
  /** Required when source is 'manual-url' */
  url?: string;
  label?: string;
}

export interface PortalHero {
  tagline?: string;
  image?: string;
}

export interface PortalBadge {
  label: string;
  color?: string;
}

export interface PortalLink {
  label: string;
  url: string;
  icon?: AllowedIcon;
}

export interface PortalConfigV1 {
  version: 1;
  kind: PortalItemKind;
  title: string;
  slug?: string;
  description?: string;
  /** Section/category this item belongs to */
  section?: string;
  /** Show in navbar (only for kind: page) */
  nav?: boolean;
  /** Sort order (lower = first) */
  order?: number;
  icon?: AllowedIcon;
  tags?: string[];
  visibility?: PortalItemVisibility;
  style?: PortalItemStyle;
  hero?: PortalHero;
  featured?: boolean;
  /** Render the repo README inside detail view */
  readme?: boolean;
  /** Render the repo homepage (GitHub Pages) in an iframe */
  iframe?: boolean;
  /** Show release info */
  releases?: boolean;
  links?: PortalLink[];
  download?: PortalDownload;
  action?: PortalAction;
  badges?: PortalBadge[];
}

// ─── Internal Portal Item model ─────────────────

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  published_at: string;
  html_url: string;
  assets: GitHubReleaseAsset[];
  body: string | null;
}

export interface GitHubReleaseAsset {
  id: number;
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
  content_type: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  has_pages: boolean;
  default_branch: string;
  fork: boolean;
  archived: boolean;
}

export interface PortalItem {
  /** Unique identifier (slug or repo name) */
  id: string;
  kind: PortalItemKind;
  title: string;
  description: string;
  section: string;
  nav: boolean;
  order: number;
  icon: AllowedIcon;
  tags: string[];
  visibility: PortalItemVisibility;
  style: PortalItemStyle;
  featured: boolean;
  hero?: PortalHero;
  readme: boolean;
  iframe: boolean;
  releases: boolean;
  links: PortalLink[];
  download?: PortalDownload;
  action?: PortalAction;
  badges: PortalBadge[];
  /** Source GitHub repo */
  repo: GitHubRepo;
  /** Resolved README content (markdown string) */
  readmeContent?: string;
  /** Latest release info */
  latestRelease?: GitHubRelease;
  /** Config parse error (non-blocking) */
  configError?: string;
  updatedAt: string;
}

// ─── Global portal settings ─────────────────────

export type DiscoveryMode = 'topics-only' | 'config-only' | 'topics-or-config';

export type DataMode = 'live' | 'static-snapshot';

export interface PortalSettings {
  githubUsername: string;
  portalName: string;
  subtitle: string;
  description: string;
  /** Override avatar URL (defaults to GitHub avatar) */
  avatarUrl?: string;
  maxReposToScan: number;
  discoveryMode: DiscoveryMode;
  requiredTopic: string;
  allowFallbackWithoutConfig: boolean;
  renderReadme: boolean;
  showReleases: boolean;
  featuredItemIds: string[];
  defaultTheme: 'light' | 'dark' | 'system';
  dataMode: 'data-mode'; // placeholder
  // ─── Home Page Customization ────────────────────────
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  heroCtaUrl?: string;
  /** Name of a repo to use as the Home page source (e.g. 'portfolio-home') */
  homeRepoName?: string;
  githubToken?: string;
}
