import { z } from 'zod';
import type { PortalConfigV1, AllowedIcon } from '../types/portal';

// ─────────────────────────────────────────────────────────────────────────────
//  Zod schema — portal.config.json v1
//  Validates repository config files. Strict enums prevent XSS/injection.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_ICONS: [AllowedIcon, ...AllowedIcon[]] = [
  'code', 'book', 'download', 'link', 'tool', 'star', 'box', 'terminal',
  'globe', 'file', 'folder', 'zap', 'layers', 'cpu', 'bot', 'game',
  'music', 'image', 'settings', 'shield', 'heart', 'package',
];

const PortalActionSchema = z.object({
  type: z.enum([
    'open-url', 'open-github', 'open-pages',
    'download-latest-release', 'download-asset', 'open-readme',
  ]),
  target: z.string().url().optional().or(z.string().min(1).optional()),
  label: z.string().max(80).optional(),
});

const PortalDownloadSchema = z.object({
  source: z.enum(['latest', 'named-asset', 'manual-url']),
  assetName: z.string().max(260).optional(),
  url: z.string().url().optional(),
  label: z.string().max(80).optional(),
});

const PortalHeroSchema = z.object({
  tagline: z.string().max(200).optional(),
  // Only allow https image URLs — prevents data-url injection
  image: z.string().url().startsWith('https://').optional(),
});

const PortalBadgeSchema = z.object({
  label: z.string().max(40),
  color: z.enum(['blue', 'green', 'red', 'yellow', 'purple', 'gray', 'orange']).optional(),
});

const PortalLinkSchema = z.object({
  label: z.string().max(80),
  url: z.string().url(),
  icon: z.enum(ALLOWED_ICONS).optional(),
});

export const PortalConfigSchema = z.object({
  version: z.literal(1),
  kind: z.enum(['page', 'card', 'download', 'link']),
  title: z.string().min(1).max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens')
    .max(80)
    .optional(),
  description: z.string().max(500).optional(),
  section: z.string().max(60).optional(),
  nav: z.boolean().optional(),
  order: z.number().int().min(0).max(9999).optional(),
  icon: z.enum(ALLOWED_ICONS).optional(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  visibility: z.enum(['public', 'hidden', 'draft']).optional(),
  style: z.enum(['default', 'featured', 'compact', 'minimal']).optional(),
  hero: PortalHeroSchema.optional(),
  featured: z.boolean().optional(),
  readme: z.boolean().optional(),
  iframe: z.boolean().optional(),
  releases: z.boolean().optional(),
  links: z.array(PortalLinkSchema).max(20).optional(),
  download: PortalDownloadSchema.optional(),
  action: PortalActionSchema.optional(),
  badges: z.array(PortalBadgeSchema).max(10).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────

export type PortalConfigInput = z.input<typeof PortalConfigSchema>;

/**
 * Parses raw JSON (string or object) into a validated PortalConfigV1.
 * Returns `{ data }` on success or `{ error }` on failure — never throws.
 */
export function parsePortalConfig(
  raw: unknown
): { data: PortalConfigV1; error?: never } | { data?: never; error: string } {
  const result = PortalConfigSchema.safeParse(raw);
  if (result.success) {
    return { data: result.data as PortalConfigV1 };
  }
  const messages = result.error.errors
    .map((e) => `${e.path.join('.')}: ${e.message}`)
    .join('; ');
  return { error: messages };
}
