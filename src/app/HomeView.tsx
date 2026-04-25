import { usePortal } from '../app/PortalContext';
import { Hero } from '../components/Hero';
import { Card, SkeletonCard } from '../components/Card';
import { useSearch } from '../utils/hooks';
import { Icon } from '../components/Icon';

export function HomeView() {
  const { items, loadState } = usePortal();
  const { filteredItems } = useSearch(items);

  const featuredItems = items.filter(i => i.featured);
  const hasItems = items.length > 0;

  return (
    <div className="page-enter">
      <Hero />

      {hasItems && (
        <div id="proyectos-grid" className="container pb-5 mt-4">
          {featuredItems.length > 0 && (
            <div className="mb-5">
              <h6 className="text-uppercase fw-bold text-muted mb-4 d-flex align-items-center gap-2" style={{ fontSize: '12px', letterSpacing: '1px' }}>
                <Icon name="star" size={14} className="text-warning" />
                Destaques
              </h6>
              <div className="row">
                {featuredItems.map(item => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
              <hr className="my-5 border-secondary opacity-10" />
            </div>
          )}

          <div className="row">
            {loadState === 'loading' ? (
              [1, 2, 3].map(i => <SkeletonCard key={i} />)
            ) : (
              filteredItems.map(item => (
                <Card key={item.id} item={item} />
              ))
            )}
          </div>
        </div>
      )}

      {!hasItems && loadState !== 'loading' && (
        <div className="container text-center py-5 opacity-25">
           <small className="text-uppercase tracking-widest">Aún no hay proyectos configurados en el portal</small>
        </div>
      )}
    </div>
  );
}
