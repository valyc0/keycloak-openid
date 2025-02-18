import { Link, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

interface SidebarProps {
  onToggle?: () => void;
}

const Sidebar = ({ onToggle }: SidebarProps) => {
  const location = useLocation();
  const auth = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sidebar-inner">
      {/* Sidebar Header */}
      <div className="sidebar-logo">
        <div className="peers ai-c fxw-nw">
          <div className="peer peer-greed">
            <Link className="sidebar-link td-n" to="/dashboard">
              <div className="peers ai-c fxw-nw">
                <div className="peer">
                  <div className="logo">
                    <img src="/assets/images/logo.png" alt="Logo" />
                  </div>
                </div>
                <div className="peer peer-greed">
                  <h5 className="lh-1 mB-0 logo-text">Admin</h5>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar Menu */}
      <ul className="sidebar-menu scrollable pos-r">
        <li className={`nav-item ${isActive('/dashboard') ? 'actived' : ''}`}>
          <Link className="sidebar-link" to="/dashboard" onClick={() => {
            if (window.innerWidth < 768 && onToggle) {
              onToggle();
            }
          }}>
            <span className="icon-holder">
              <i className="c-blue-500 ti-home"></i>
            </span>
            <span className="title">Dashboard</span>
          </Link>
        </li>
        
        <li className={`nav-item ${isActive('/tasks') ? 'actived' : ''}`}>
          <Link className="sidebar-link" to="/tasks" onClick={() => {
            if (window.innerWidth < 768 && onToggle) {
              onToggle();
            }
          }}>
            <span className="icon-holder">
              <i className="c-deep-purple-500 ti-list"></i>
            </span>
            <span className="title">Tasks</span>
          </Link>
        </li>

        <li className={`nav-item ${isActive('/alarms') ? 'actived' : ''}`}>
          <Link className="sidebar-link" to="/alarms" onClick={() => {
            if (window.innerWidth < 768 && onToggle) {
              onToggle();
            }
          }}>
            <span className="icon-holder">
              <i className="c-red-500 ti-bell"></i>
            </span>
            <span className="title">Alarms</span>
          </Link>
        </li>

        <li className={`nav-item ${isActive('/about') ? 'actived' : ''}`}>
          <Link className="sidebar-link" to="/about" onClick={() => {
            if (window.innerWidth < 768 && onToggle) {
              onToggle();
            }
          }}>
            <span className="icon-holder">
              <i className="c-blue-500 ti-info-alt"></i>
            </span>
            <span className="title">About</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
