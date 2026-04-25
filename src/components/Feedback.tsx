import { Icon } from './Icon';

export function EmptyState({ title, text, onAction, actionLabel }: { 
  title: string; 
  text: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon name="package" size={48} />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__text">{text}</p>
      {onAction && (
        <button onClick={onAction} className="btn btn--secondary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="error-banner">
      <Icon name="shield" />
      <span>{message}</span>
    </div>
  );
}

export function RateLimitBanner() {
  return (
    <div className="rate-limit-banner">
      <Icon name="zap" />
      <div>
        <p className="font-semibold">Límite de API alcanzado</p>
        <p className="text-sm">La API de GitHub ha limitado las peticiones temporales. Algunos repositorios pueden no aparecer. Agrega un token de GitHub en el archivo .env para evitar esto.</p>
      </div>
    </div>
  );
}

export function DemoBanner() {
  return (
    <div className="demo-banner">
      <Icon name="settings" />
      <span>
        <strong>Modo Demostración:</strong> Estás viendo datos de ejemplo. Configura tu usuario en <code>src/config/portal.ts</code>.
      </span>
    </div>
  );
}
