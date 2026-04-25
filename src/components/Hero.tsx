import React from 'react';
import { usePortal } from '../app/PortalContext';
import { Icon } from './Icon';

export function Hero() {
  const { user, settings, homeItem, loadState } = usePortal();

  // While loading, show a minimal skeleton
  if (loadState === 'loading' || !user) {
    return (
      <section className="hero-section container py-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-8 text-center mt-5">
            <div className="placeholder-glow">
              <div className="rounded-circle mx-auto mb-4 placeholder" style={{ width: 140, height: 140 }} />
              <div className="placeholder col-6 mb-2" />
              <div className="placeholder col-4 mb-3" />
              <div className="placeholder col-8" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Content priority: homeItem (from portal-home repo via API) → portal.ts config → GitHub profile
  const title = homeItem?.title || settings.heroTitle || settings.portalName || user.name || user.login;
  const subtitle = homeItem?.section || settings.heroSubtitle || settings.subtitle;
  const description =
    homeItem?.description ||
    settings.heroDescription ||
    settings.description ||
    user.bio ||
    '';

  const ctaLabel = homeItem?.action?.label || settings.heroCtaLabel || 'Explorar Galería';
  const ctaUrl =
    homeItem?.action?.type === 'open-url'
      ? homeItem.action.target
      : settings.heroCtaUrl || '#proyectos-grid';

  const scrollToProjects = (e: React.MouseEvent) => {
    if (ctaUrl === '#proyectos-grid' || ctaUrl === '#proyectos') {
      e.preventDefault();
      const el = document.getElementById('proyectos-grid');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section container py-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-lg-8 text-center mt-5">
          <div className="position-relative d-inline-block mb-4 animate-fade-in">
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="hero-avatar rounded-circle border-4 border-primary shadow-lg p-1 bg-dark"
              style={{ width: '140px', height: '140px', objectFit: 'cover' }}
            />
            <div className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 shadow animate-pulse">
              <Icon name="zap" size={20} className="text-white" />
            </div>
          </div>

          <h1
            className="display-4 fw-black mb-3 animate-slide-up"
            style={{
              letterSpacing: '-1.5px',
              background: 'linear-gradient(45deg, var(--color-text), var(--color-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </h1>

          <div className="h5 fw-light text-muted mb-4 mx-auto animate-slide-up opacity-75" style={{ maxWidth: '700px', lineHeight: '1.6' }}>
            {subtitle && (
              <span className="d-block mb-2 text-primary fw-bold text-uppercase small tracking-widest">
                {subtitle}
              </span>
            )}
            {description && <p className="mb-0">{description}</p>}
          </div>

          <div className="d-flex justify-content-center gap-3 mt-5 flex-wrap animate-slide-up">
            <a
              href={ctaUrl}
              onClick={scrollToProjects}
              className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-lg d-flex align-items-center gap-2"
            >
              <Icon name="image" />
              <span>{ctaLabel}</span>
            </a>

            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-secondary btn-lg rounded-pill px-5 py-3 d-flex align-items-center gap-2 mt-2 mt-sm-0"
            >
              <Icon name="layers" />
              <span>GitHub</span>
            </a>
          </div>

          <div className="row mt-5 pt-4 justify-content-center opacity-75 animate-fade-in">
            <div className="col-auto px-4 text-center border-end border-secondary">
              <div className="h4 fw-bold mb-0">{user.public_repos}</div>
              <small className="text-uppercase text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                Repositorios
              </small>
            </div>
            <div className="col-auto px-4 text-center">
              <div className="h4 fw-bold mb-0">{user.followers}</div>
              <small className="text-uppercase text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                Seguidores
              </small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
