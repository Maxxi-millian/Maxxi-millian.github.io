import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import type { GitHubUser, PortalItem } from '../types/portal';
import { loadPortal } from '../features/portal/portalLoader';
import { filterVisibleItems, sortItems } from '../features/portal/portalTransformer';
import { portalSettings, GITHUB_TOKEN } from '../config/portal';
import { GitHubRateLimitError } from '../features/github/githubClient';

// ─────────────────────────────────────────────────────────────────────────────
//  Portal Context
// ─────────────────────────────────────────────────────────────────────────────

export type LoadState = 'idle' | 'loading' | 'success' | 'error';

interface PortalContextValue {
  user: GitHubUser | null;
  items: PortalItem[];
  loadState: LoadState;
  error: string | null;
  rateLimitHit: boolean;
  warnings: string[];
  homeItem: PortalItem | null;
  reload: () => void;
  settings: typeof portalSettings;
}

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [items, setItems] = useState<PortalItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [rateLimitHit, setRateLimitHit] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [homeItem, setHomeItem] = useState<PortalItem | null>(null);
  const loadedOnce = useRef(false);

  const load = useCallback(async () => {
    setLoadState('loading');
    setError(null);
    setRateLimitHit(false);
    setWarnings([]);

    try {
      const result = await loadPortal(portalSettings, GITHUB_TOKEN);
      setUser(result.user);

      const visible = filterVisibleItems(result.items);
      const sorted = sortItems(visible);
      
      // Filter out the home repo from the gallery items list
      const homeRepoName = portalSettings.homeRepoName;
      const galleryItems = homeRepoName 
        ? sorted.filter(item => item.repo.name !== homeRepoName)
        : sorted;

      setItems(galleryItems);

      // Find the home repo if configured — it's just a regular repo read via API
      if (homeRepoName) {
        const homeRepo = result.items.find(
          item => item.repo.name === homeRepoName
        );
        if (homeRepo) setHomeItem(homeRepo);
      }

      setRateLimitHit(result.rateLimitHit);
      setWarnings(result.errors);
      setLoadState('success');
    } catch (err) {
      if (err instanceof GitHubRateLimitError) {
        setRateLimitHit(true);
        setError('Límite de API de GitHub alcanzado. Espera unos minutos y recarga la página.');
      } else {
        setError((err as Error).message ?? 'Error desconocido cargando el portal.');
      }
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    if (!loadedOnce.current) {
      loadedOnce.current = true;
      load();
    }
  }, [load]);

  return (
    <PortalContext.Provider
      value={{
        user,
        items,
        loadState,
        error,
        rateLimitHit,
        warnings,
        homeItem,
        reload: load,
        settings: portalSettings,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used within PortalProvider');
  return ctx;
}
