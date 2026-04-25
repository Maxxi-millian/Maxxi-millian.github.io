import type { PortalSettings } from '../types/portal';

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN GLOBAL DEL PORTAL
//  Edita este archivo para personalizar tu portal.
// ─────────────────────────────────────────────────────────────────────────────

export const portalSettings: PortalSettings = {
  // ─── Usuario Principal ────────────────────────────────────────────────
  githubUsername: 'Maxxi-millian',

  // ─── Información del portal ───────────────────────────────────────────
  portalName: 'Maxxi Millian | Portfolio',
  subtitle: 'Digital Architect & Developer',
  description: 'Bienvenido a mi portal personal. Aquí encontrarás todos mis desarrollos, herramientas y recursos públicos.',

  // ─── Home como Repo (NUEVO) ──────────────────────────────────────────
  // Si quieres que el texto de la página de inicio se lea desde un repo,
  // pon aquí el nombre de ese repo (ej: 'portfolio-home' o 'Maxxi-millian').
  // El portal leerá el README y el portal.config.json de ese repo para decorar el Home.
  homeRepoName: 'portal-home', 

  // ─── Descubrimiento ──────────────────────────────────────────────────
  maxReposToScan: 100,
  discoveryMode: 'topics-or-config',
  requiredTopic: 'portal-item',
  allowFallbackWithoutConfig: true,

  // ─── Contenido ────────────────────────────────────────────────────────
  renderReadme: true,
  showReleases: true,
  featuredItemIds: [],

  // ─── Tema visual ─────────────────────────────────────────────────────
  defaultTheme: 'system',

  // ─── Personalización del Inicio ──────────────────────────────────────
  // Estos se usan si homeRepoName está vacío:
  heroTitle: 'Maxxi Millian', 
  heroSubtitle: 'Full Stack & Creative Developer',
  heroDescription: 'Transformando ideas complejas en experiencias tecnológicas simples y elegantes.',
  heroCtaLabel: 'Ver Proyectos',
  heroCtaUrl: '', 

  // ─── Modo de datos ───────────────────────────────────────────────────
  dataMode: 'live',
};

export const GITHUB_TOKEN: string | undefined = import.meta.env.VITE_GITHUB_TOKEN;
