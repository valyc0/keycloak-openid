import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, isMobile, isSidebarOpen, onToggleSidebar }) => {
  const location = useLocation();

  useEffect(() => {
    const handleNavLinkClick = (e) => {
      if (isMobile) {
        onToggleSidebar(); // Close the sidebar in mobile view
      }

      // Rimuovi la classe active da tutti i link
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });

      // Aggiungi la classe active al link cliccato
      e.currentTarget.classList.add('active');
    };

    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });

    return () => {
      document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.removeEventListener('click', handleNavLinkClick);
      });
    };
  }, [isMobile, onToggleSidebar]);

  return (
    <div 
      className={`sidebar py-3 ${isCollapsed ? 'collapsed' : ''} ${
        isMobile && isSidebarOpen ? 'mobile-expanded' : ''
      }`}
    >
      <div className="sidebar-header flex-column">
        <div className="logo-section d-flex align-items-center justify-content-center">
          <svg
            className="sidebar-logo"
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5 3L32 12.25V22.75L17.5 32L3 22.75V12.25L17.5 3Z"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M17.5 8L26 13.5V20.5L17.5 26L9 20.5V13.5L17.5 8Z"
              fill="white"
            />
            <circle
              cx="17.5"
              cy="17.5"
              r="3.5"
              fill="var(--purple)"
            />
          </svg>
          <h1 className="sidebar-brand mb-0">My dash</h1>
        </div>
        <div className="menu-section d-none d-md-flex ps-4 mt-2">
          <button
            className="btn-toggle"
            onClick={onToggleSidebar}
            data-sidebar-toggle
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <i className="fas fa-tachometer-alt" aria-hidden="true"></i>
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/alarms" 
          className={`nav-link ${location.pathname === '/alarms' ? 'active' : ''}`}
        >
          <i className="fas fa-bell" aria-hidden="true"></i>
          <span>Alarms</span>
        </Link>
        <Link 
          to="/profile" 
          className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          <i className="fas fa-user" aria-hidden="true"></i>
          <span>User Profile</span>
        </Link>
        <Link 
          to="/analytics" 
          className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}
        >
          <i className="fas fa-chart-bar" aria-hidden="true"></i>
          <span>Analytics</span>
        </Link>
        <Link 
          to="/settings" 
          className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
        >
          <i className="fas fa-cog" aria-hidden="true"></i>
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;