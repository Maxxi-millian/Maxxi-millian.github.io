import type { PortalBadge } from '../types/portal';

export function Badge({ label, color = 'gray' }: PortalBadge) {
  return (
    <span className={`badge badge--${color}`}>
      {label}
    </span>
  );
}

export function Tag({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <span 
      className="tag" 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {label}
    </span>
  );
}
