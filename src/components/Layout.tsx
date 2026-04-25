import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { usePortal } from '../app/PortalContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { Icon } from '../components/Icon';

export function Nav() {
  const { user, items, settings, homeItem } = usePortal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Combine regular items and homeItem if it has nav: true
  const navItems = items.filter(item => item.nav);
  if (homeItem?.nav) {
    // Only add if not already in the list (safety check)
    if (!navItems.find(i => i.id === homeItem.id)) {
      navItems.unshift(homeItem);
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="nav-custom shadow-sm d-flex align-items-center">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" onClick={closeMenu}>
            {user && (
              <img 
                src={settings.avatarUrl || user.avatar_url} 
                alt="" 
                className="navbar-logo-avatar" 
              />
            )}
            <span className="fw-bold d-none d-sm-inline" style={{ color: 'var(--color-text)' }}>
              {settings.portalName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="d-none d-md-flex align-items-center gap-1 flex-grow-1 px-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-link text-muted'} text-decoration-none`}
            >
              Inicio
            </NavLink>
            {navItems.map(item => (
              <NavLink 
                key={item.id}
                to={`/p/${item.id}`} 
                className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-link text-muted'} text-decoration-none`}
              >
                {item.title}
              </NavLink>
            ))}
          </div>

          <div className="d-flex align-items-center gap-2">
            <ThemeToggle />
            <button 
              className={`btn btn-sm d-md-none ${isMenuOpen ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              style={{ zIndex: 1100, position: 'relative' }}
            >
              <Icon name={isMenuOpen ? 'zap' : 'layers'} size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay - FIXED BUG */}
      {isMenuOpen && (
        <>
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75" 
            style={{ zIndex: 1050 }}
            onClick={closeMenu}
          />
          <div 
            className="position-fixed top-0 start-0 h-100 bg-dark shadow-lg animate-slide-in" 
            style={{ 
                zIndex: 1060, 
                width: '280px', 
                backgroundColor: 'var(--color-bg-2)', 
                borderRight: '1px solid var(--color-border)' 
            }}
          >
             <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-5">
                   <span className="fw-bold text-white small text-uppercase tracking-widest">Navegación</span>
                   <button className="btn btn-sm btn-link text-muted p-0" onClick={closeMenu}>
                      <Icon name="link" size={16} />
                   </button>
                </div>
                
                <div className="d-flex flex-column gap-3">
                   <NavLink 
                      to="/" 
                      onClick={closeMenu} 
                      className={({ isActive }) => `text-decoration-none py-2 h5 fw-bold ${isActive ? 'text-primary' : 'text-light opacity-75'}`}
                   >
                      Inicio
                   </NavLink>
                   <hr className="my-2 border-secondary opacity-25" />
                   {navItems.map(item => (
                     <NavLink 
                       key={item.id} 
                       to={`/p/${item.id}`} 
                       onClick={closeMenu}
                       className={({ isActive }) => `text-decoration-none py-2 h5 fw-bold ${isActive ? 'text-primary' : 'text-light opacity-75'}`}
                     >
                       {item.title}
                     </NavLink>
                   ))}
                </div>
             </div>
          </div>
        </>
      )}
    </>
  );
}

export function Footer() {
  const { user } = usePortal();
  const year = new Date().getFullYear();

  return (
    <footer className="py-5 mt-5 border-top border-secondary text-center text-muted">
      <div className="container">
        <p className="mb-0">
          &copy; {year} {user?.name || user?.login || 'Portal'}. 
          Creado con <a href="https://github.com/J20JJJ" target="_blank" rel="noopener noreferrer" className="text-decoration-none opacity-50">GitHub Portal</a>.
        </p>
      </div>
    </footer>
  );
}
