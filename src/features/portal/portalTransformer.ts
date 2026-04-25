import type {
  GitHubRepo,
  GitHubRelease,
  PortalConfigV1,
  PortalItem,
  AllowedIcon,
  PortalItemKind,
} from '../../types/portal';

// ─────────────────────────────────────────────────────────────────────────────
//  Portal Item Transformer
//  Converts GitHub repo data + portal.config.json → internal PortalItem model
// ─────────────────────────────────────────────────────────────────────────────

/** Infer a reasonable icon from language / kind */
function inferIcon(repo: GitHubRepo, kind: PortalItemKind): AllowedIcon {
  if (kind === 'download') return 'download';
  if (kind === 'link') return 'link';
  if (kind === 'page') return 'book';
  const lang = repo.language?.toLowerCase();
  if (lang === 'python') return 'terminal';
  if (lang === 'typescript' || lang === 'javascript') return 'code';
  if (lang === 'html') return 'globe';
  if (lang === 'shell') return 'terminal';
  if (lang === 'rust' || lang === 'c++' || lang === 'c') return 'cpu';
  return 'box';
}

/** Slugify a string for use as an ID */
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Transform raw GitHub data + optional config into a PortalItem.
 * This is the ONLY place where the mapping logic lives.
 */
export function transformToPortalItem(params: {
  repo: GitHubRepo;
  config?: PortalConfigV1;
  readmeContent?: string;
  latestRelease?: GitHubRelease;
  configError?: string;
  renderReadme: boolean;
  showReleases: boolean;
}): PortalItem {
  const {
    repo,
    config,
    readmeContent,
    latestRelease,
    configError,
    renderReadme,
    showReleases,
  } = params;

  const kind: PortalItemKind = config?.kind ?? 'card';
  const slug = config?.slug ?? toSlug(repo.name);

  return {
    id: slug,
    kind,
    title: config?.title ?? repo.name,
    description:
      config?.description ?? repo.description ?? 'Sin descripción.',
    section: config?.section ?? 'Proyectos',
    nav: config?.nav ?? false,
    order: config?.order ?? 999,
    icon: config?.icon ?? inferIcon(repo, kind),
    tags: config?.tags ?? repo.topics ?? [],
    visibility: config?.visibility ?? 'public',
    style: config?.style ?? 'default',
    featured: config?.featured ?? false,
    hero: config?.hero,
    readme: renderReadme && (config?.readme !== false) && !config?.iframe,
    iframe: config?.iframe ?? false,
    repo,
    releases: showReleases && (config?.releases !== false),
    links: config?.links ?? [],
    download: config?.download,
    action: config?.action,
    badges: config?.badges ?? [],
    repo,
    readmeContent,
    latestRelease,
    configError,
    updatedAt: repo.updated_at,
  };
}

/** Filter items to show (exclude hidden and draft) */
export function filterVisibleItems(items: PortalItem[]): PortalItem[] {
  return items.filter((item) => item.visibility === 'public');
}

/** Sort items: by order ascending, then by updated date descending */
export function sortItems(items: PortalItem[]): PortalItem[] {
  return [...items].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

/** Group items by section */
export function groupBySection(
  items: PortalItem[]
): Map<string, PortalItem[]> {
  const map = new Map<string, PortalItem[]>();
  for (const item of items) {
    const existing = map.get(item.section) ?? [];
    map.set(item.section, [...existing, item]);
  }
  return map;
}
