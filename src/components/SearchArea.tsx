import type { PortalItemKind } from '../types/portal';
import { Icon } from './Icon';

interface SearchAreaProps {
  query: string;
  onQueryChange: (q: string) => void;
  activeKind: PortalItemKind | 'all';
  onKindChange: (k: PortalItemKind | 'all') => void;
  activeSection: string | 'all';
  onSectionChange: (s: string | 'all') => void;
  sections: string[];
}

export function SearchArea({
  query,
  onQueryChange,
  activeKind,
  onKindChange,
  activeSection,
  onSectionChange,
  sections
}: SearchAreaProps) {
  const kinds: (PortalItemKind | 'all')[] = ['all', 'page', 'card', 'download', 'link'];

  return (
    <div className="mb-5">
      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="position-relative">
            <div className="position-absolute h-100 d-flex align-items-center px-3" style={{ color: 'var(--color-text-3)' }}>
              <Icon name="link" size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar proyectos, etiquetas..." 
              className="form-control ps-5 border-secondary bg-transparent text-white"
              style={{ backgroundColor: 'var(--color-bg-2)', color: 'var(--color-text)' }}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-lg-7 d-flex flex-wrap gap-3 align-items-center">
          <div className="d-flex align-items-center gap-2">
            <small className="text-uppercase fw-bold text-muted" style={{ fontSize: '10px' }}>Tipo:</small>
            <div className="btn-group btn-group-sm">
              {kinds.map(kind => (
                <button
                  key={kind}
                  className={`btn btn-outline-secondary ${activeKind === kind ? 'active' : ''}`}
                  onClick={() => onKindChange(kind)}
                >
                  {kind === 'all' ? 'Todos' : kind}
                </button>
              ))}
            </div>
          </div>

          {sections.length > 1 && (
            <div className="d-flex align-items-center gap-2">
              <small className="text-uppercase fw-bold text-muted" style={{ fontSize: '10px' }}>Sección:</small>
              <select 
                className="form-select form-select-sm bg-transparent border-secondary w-auto"
                style={{ backgroundColor: 'var(--color-bg-2)', color: 'var(--color-text)' }}
                value={activeSection}
                onChange={(e) => onSectionChange(e.target.value)}
              >
                <option value="all">Cualquiera</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
