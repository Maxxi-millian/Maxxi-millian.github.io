import { Link } from 'react-router-dom';
import type { PortalItem } from '../types/portal';
import { Icon } from './Icon';
import { Badge, Tag } from './Badge';

interface CardProps {
  item: PortalItem;
}

export function Card({ item }: CardProps) {
  const { 
    id, 
    title, 
    description, 
    icon, 
    tags, 
    style, 
    featured, 
    badges, 
    kind,
    repo
  } = item;

  const cardClasses = [
    'card-portal',
    `card-portal--${style}`,
    featured ? 'card-portal--featured' : '',
    'text-decoration-none'
  ].filter(Boolean).join(' ');

  const date = new Date(item.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <Link to={`/p/${id}`} className={cardClasses}>
        <div className="d-flex align-items-start gap-3 mb-3">
          <div className="card-portal__icon">
            <Icon name={icon} size={20} />
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <h5 className="mb-0 text-truncate fw-bold" style={{ color: 'var(--color-text)' }}>{title}</h5>
            <small className="text-muted d-block small">
              {kind.toUpperCase()} • {date}
            </small>
          </div>
        </div>

        <p className="small mb-3 flex-grow-1" style={{ color: 'var(--color-text-2)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {description}
        </p>

        {tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map(tag => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <div className="d-flex gap-1 overflow-hidden">
            {badges.map((badge, i) => (
              <Badge key={i} {...badge} />
            ))}
          </div>
          {repo.stargazers_count > 0 && (
            <div className="badge-portal badge-portal--gray d-flex align-items-center gap-1">
              <Icon name="star" size={10} /> {repo.stargazers_count}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className="card-portal">
         <div className="d-flex gap-3 mb-3">
            <div className="skeleton-box" style={{ width: '40px', height: '40px' }}></div>
            <div className="flex-grow-1">
               <div className="skeleton-box mb-2" style={{ width: '70%', height: '16px' }}></div>
               <div className="skeleton-box" style={{ width: '40%', height: '10px' }}></div>
            </div>
         </div>
         <div className="skeleton-box mb-2" style={{ width: '100%', height: '14px' }}></div>
         <div className="skeleton-box mb-3" style={{ width: '100%', height: '14px' }}></div>
         <div className="d-flex gap-2">
            <div className="skeleton-box" style={{ width: '25%', height: '18px', borderRadius: '10px' }}></div>
            <div className="skeleton-box" style={{ width: '25%', height: '18px', borderRadius: '10px' }}></div>
         </div>
      </div>
    </div>
  );
}
