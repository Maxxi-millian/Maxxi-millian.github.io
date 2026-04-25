import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../app/PortalContext';
import { Icon } from '../components/Icon';
import { Badge, Tag } from '../components/Badge';
import { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function DetailView() {
  const { id } = useParams<{ id: string }>();
  const { items, loadState } = usePortal();
  const navigate = useNavigate();
  const [readmeHtml, setReadmeHtml] = useState<string | null>(null);

  const item = items.find(i => i.id === id);

  useEffect(() => {
    if (item?.readmeContent) {
      const parsed = marked.parse(item.readmeContent);
      const htmlString = typeof parsed === 'string' ? parsed : '';
      setReadmeHtml(DOMPurify.sanitize(htmlString));
    }
    window.scrollTo(0, 0);
  }, [item]);

  if (loadState === 'loading') {
    return (
      <div className="container py-5 page-enter">
        <div className="skeleton-box mb-4" style={{ width: '100px', height: '24px' }}></div>
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="skeleton-box mb-5" style={{ width: '100%', height: '400px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container py-5 text-center page-enter">
        <h2 className="mb-4">Elemento no encontrado</h2>
        <Link to="/" className="btn btn-primary px-4">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="container py-4 page-enter">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-link link-secondary px-0 mb-4 d-flex align-items-center gap-2 text-decoration-none"
      >
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>➜</span>
        atrás
      </button>

      <div className="row g-5">
        <main className="col-12 col-lg-8 order-2 order-lg-1">
          <header className="d-flex align-items-start gap-4 mb-5 border-bottom border-secondary pb-4">
            <div className="card-portal__icon m-0" style={{ width: '56px', height: '56px' }}>
              <Icon name={item.icon} size={32} />
            </div>
            <div className="flex-grow-1">
              <h1 className="h2 mb-2">{item.title}</h1>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <Badge label={item.kind.toUpperCase()} color="blue" />
                {item.badges.map((b, i) => <Badge key={i} {...b} />)}
                <small className="text-muted ms-auto">
                   Actualizado {new Date(item.updatedAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          </header>

          <p className="lead mb-5 text-muted">
            {item.description}
          </p>

          <div className="markdown-body">
            {item.iframe ? (
              <div className="iframe-container mb-4">
                {item.repo.homepage ? (
                  <>
                    <div className="rounded-4 overflow-hidden border border-secondary shadow-lg bg-white" style={{ height: '75vh' }}>
                      <iframe 
                        src={item.repo.homepage} 
                        title={item.title} 
                        className="w-100 h-100 border-0"
                      />
                    </div>
                    <div className="mt-3 p-3 bg-light border rounded-3 d-flex align-items-center gap-3">
                      <Icon name="info" size={20} className="text-primary" />
                      <small className="text-muted">
                        ¿Ves un error 404? Asegúrate de que las <strong>GitHub Pages</strong> estén activadas en los ajustes del repositorio <em>{item.repo.name}</em>.
                      </small>
                    </div>
                  </>
                ) : (
                  <div className="p-5 text-center border rounded-4 bg-light">
                    <Icon name="alert-circle" size={48} className="text-warning mb-3" />
                    <h4>URL de Galería no encontrada</h4>
                    <p className="text-muted">
                      Para mostrar este proyecto como una web, debes activar <strong>GitHub Pages</strong> en el repositorio o añadir la URL en el campo <code>homepage</code> de GitHub.
                    </p>
                    <a href={item.repo.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary mt-2">
                      Ir a Ajustes del Repo
                    </a>
                  </div>
                )}
              </div>
            ) : item.readme && readmeHtml ? (
              <div className="markdown-body" dangerouslySetInnerHTML={{ __html: readmeHtml }} />
            ) : (
              <div className="markdown-body text-center py-5 opacity-50">
                <Icon name="file-text" size={48} className="mb-3" />
                <p>Este proyecto no tiene contenido visual ni descripción detallada (README) para mostrar.</p>
              </div>
            )}
          </div>
        </main>

        <aside className="col-12 col-lg-4 order-1 order-lg-2">
          <div className="sticky-top" style={{ top: '80px' }}>
            <div className="mb-5">
              <h6 className="text-uppercase fw-bold text-muted small mb-3">Acciones</h6>
              <div className="d-grid gap-2">
                <a href={item.repo.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary shadow-sm">
                  <Icon name="code" className="me-2" /> GitHub Repo
                </a>
                {item.repo.homepage && (
                  <a href={item.repo.homepage} target="_blank" rel="noopener noreferrer" className="btn btn-primary shadow-sm">
                    <Icon name="globe" className="me-2" /> Web / Demo
                  </a>
                )}
                {item.links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary">
                    {link.icon && <Icon name={link.icon} className="me-2" />}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {item.releases && item.latestRelease && (
              <div className="mb-5 p-4 rounded-4" style={{ backgroundColor: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
                <h6 className="text-uppercase fw-bold text-muted small mb-3">Descarga Reciente</h6>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Icon name="package" size={16} />
                  <span className="fw-bold">{item.latestRelease.tag_name}</span>
                </div>
                <div className="d-grid gap-2">
                  {item.latestRelease.assets.slice(0, 3).map(asset => (
                    <a key={asset.id} href={asset.browser_download_url} className="btn btn-sm btn-outline-secondary text-start overflow-hidden text-truncate">
                       {asset.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {item.tags.length > 0 && (
              <div className="mb-5">
                <h6 className="text-uppercase fw-bold text-muted small mb-3">Etiquetas</h6>
                <div className="d-flex flex-wrap gap-1">
                  {item.tags.map(tag => <Tag key={tag} label={tag} />)}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
