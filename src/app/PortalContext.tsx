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
import { MOCK_USER, MOCK_ITEMS } from '../features/portal/mockData';
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
  isDemoMode: boolean;
  homeItem: PortalItem | null;
  reload: () => void;
  settings: typeof portalSettings;
}

const PortalContext = createContext<PortalContextValue | null>(null);

const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [items, setItems] = useState<PortalItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [rateLimitHit, setRateLimitHit] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [homeItem, setHomeItem] = useState<PortalItem | null>(null);
  const loadedOnce = useRef(false);

  const isDemoMode = IS_DEMO || portalSettings.dataMode === 'static-snapshot';

  const load = useCallback(async () => {
    // Demo / static-snapshot mode
    if (isDemoMode || portalSettings.githubUsername === 'octocat') {
      setUser(MOCK_USER);
      const visible = filterVisibleItems(MOCK_ITEMS);
      setItems(sortItems(visible));
      setLoadState('success');
      return;
    }

    setLoadState('loading');
    setError(null);
    setRateLimitHit(false);
    setWarnings([]);

    try {
      const result = await loadPortal(portalSettings, GITHUB_TOKEN);
      setUser(result.user);
      
      const visible = filterVisibleItems(result.items);
      setItems(sortItems(visible));

      // Resolve home item if specified
      if (portalSettings.homeRepoName) {
        const homeRepo = result.items.find(item => item.repo.name === portalSettings.homeRepoName);
        if (homeRepo) setHomeItem(homeRepo);
      }

      setRateLimitHit(result.rateLimitHit);
      setWarnings(result.errors);
      setLoadState('success');
    } catch (err) {
      if (err instanceof GitHubRateLimitError) {
        setRateLimitHit(true);
        setError(err.message);
      } else {
        setError((err as Error).message ?? 'Error desconocido cargando el portal.');
      }
      setLoadState('error');
      // If user is null (API failed), fallback to Mock User so Hero can render
      if (!user) setUser(MOCK_USER);
    }
  }, [isDemoMode, user]);

  useEffect(() => {
    if (!loadedOnce.current) {
      loadedOnce.current = true;
      load();
    }
  }, [load]);

  return (
    <PortalContext.Provider
      value={{
        user: user || MOCK_USER,
        items,
        loadState,
        error,
        rateLimitHit,
        warnings,
        isDemoMode: isDemoMode || portalSettings.githubUsername === 'octocat' || portalSettings.githubUsername === 'Maxxi-millian' && items.length === 0 && loadState === 'success',
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
