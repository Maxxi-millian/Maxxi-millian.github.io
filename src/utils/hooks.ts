import { useState, useMemo } from 'react';
import type { PortalItem, PortalItemKind } from '../types/portal';

// ─────────────────────────────────────────────────────────────────────────────
//  useSearch — filters and search logic for the catalog
// ─────────────────────────────────────────────────────────────────────────────

interface SearchState {
  query: string;
  activeKind: PortalItemKind | 'all';
  activeSection: string | 'all';
}

interface UseSearchReturn extends SearchState {
  filteredItems: PortalItem[];
  sections: string[];
  setQuery: (q: string) => void;
  setActiveKind: (k: PortalItemKind | 'all') => void;
  setActiveSection: (s: string | 'all') => void;
  reset: () => void;
}

export function useSearch(items: PortalItem[]): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [activeKind, setActiveKind] = useState<PortalItemKind | 'all'>('all');
  const [activeSection, setActiveSection] = useState<string | 'all'>('all');

  const sections = useMemo(() => {
    const set = new Set(items.map((i) => i.section));
    return Array.from(set).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter((item) => {
      if (activeKind !== 'all' && item.kind !== activeKind) return false;
      if (activeSection !== 'all' && item.section !== activeSection) return false;
      if (q) {
        const haystack = [
          item.title,
          item.description,
          ...item.tags,
          item.section,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [items, query, activeKind, activeSection]);

  return {
    query,
    activeKind,
    activeSection,
    filteredItems,
    sections,
    setQuery,
    setActiveKind,
    setActiveSection,
    reset: () => {
      setQuery('');
      setActiveKind('all');
      setActiveSection('all');
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  useTheme — light/dark/system theme toggle
// ─────────────────────────────────────────────────────────────────────────────

type Theme = 'light' | 'dark' | 'system';

export function useTheme(defaultTheme: Theme = 'system') {
  const stored = localStorage.getItem('portal-theme') as Theme | null;
  const [theme, setThemeState] = useState<Theme>(stored ?? defaultTheme);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    if (t === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = prefersDark ? 'dark' : 'light';
    } else {
      root.dataset.theme = t;
    }
  }

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('portal-theme', t);
    applyTheme(t);
  }

  // Apply on mount
  useMemo(() => applyTheme(theme), [theme]);

  return { theme, setTheme };
}
