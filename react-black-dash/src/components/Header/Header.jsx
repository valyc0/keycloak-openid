import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import './Header.css';

const Header = ({ onToggleSidebar, sidebarCollapsed }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    try {
      auth.logout({
        post_logout_redirect_uri: window.location.origin
      });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const userInfo = {
    name: auth.user?.profile?.given_name || auth.user?.profile?.name,
    email: auth.user?.profile?.email,
    picture: auth.user?.profile?.picture,
    username: auth.user?.profile?.preferred_username
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={`header d-flex justify-content-between align-items-center ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="d-flex align-items-center">
        <button
          className="btn btn-link text-white d-md-none me-2"
          onClick={onToggleSidebar}
          data-sidebar-toggle
        >
          <i className="fas fa-bars"></i>
        </button>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search..."
          style={{ width: '200px' }}
        />
      </div>
      <div className="d-flex align-items-center">
        <div className="dropdown">
          <div 
            className={`d-flex align-items-center dropdown-toggle ${isDropdownOpen ? 'show' : ''}`}
            onClick={handleDropdownClick}
            style={{ cursor: 'pointer' }}
          >
            <img
             src={userInfo.picture || "https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png"}
             alt="User Photo"
             className="rounded-circle"
             style={{ width: '30px', height: '30px', objectFit: 'cover' }}
           />
           <div className="ms-2 text-start">
             <div className="fw-normal" style={{ fontSize: '0.875rem' }}>{userInfo.username || userInfo.name || 'User'}</div>
             <div className="text-white-50 small" style={{ fontSize: '0.75rem', marginTop: '-3px' }}>{userInfo.email || ''}</div>
            </div>
          </div>
          <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}>
            <li>
              <a className="dropdown-item text-white" href="#">
                <i className="fas fa-cog me-2"></i>Settings
              </a>
            </li>
            <li>
              <a className="dropdown-item text-white" href="#" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;