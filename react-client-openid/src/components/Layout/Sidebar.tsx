import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

interface SidebarProps {
  onToggle?: () => void;
}

const Sidebar = ({ onToggle }: SidebarProps) => {
  const location = useLocation();
  const auth = useAuth();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside id="left-panel" className="left-panel">
      <nav className="navbar navbar-expand-sm navbar-default">
        <div id="main-menu" className="main-menu collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <li className={isActive('/dashboard') ? 'active' : ''}>
              <Link to="/dashboard" onClick={() => {
                if (window.innerWidth < 768 && onToggle) {
                  onToggle();
                }
              }}>
                <i className="menu-icon fa fa-laptop"></i>Dashboard
              </Link>
            </li>
            <li className={isActive('/about') ? 'active' : ''}>
              <Link to="/about" onClick={() => {
                if (window.innerWidth < 768 && onToggle) {
                  onToggle();
                }
              }}>
                <i className="menu-icon fa fa-info-circle"></i>About
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
