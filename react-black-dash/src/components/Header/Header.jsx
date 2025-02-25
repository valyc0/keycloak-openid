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
      <div className="d-flex align-items-center flex-grow-1">
        <div className="d-flex align-items-center me-3">
          <button
            className="btn btn-link text-white d-md-none me-2"
            onClick={onToggleSidebar}
            data-sidebar-toggle
          >
            <i className="fas fa-bars"></i>
          </button>
          <svg
            className="header-logo d-md-none"
            width="30"
            height="30"
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
          <span className="header-brand d-md-none text-white ms-2">My dash</span>
        </div>
        <div className="flex-grow-1">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search..."
            style={{ width: '200px' }}
          />
        </div>
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