import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      auth.removeUser();  // Rimuovi prima i dati locali
      await auth.signoutRedirect({
        post_logout_redirect_uri: window.location.origin // Assicura il reindirizzamento alla home dopo il logout
      });
    } catch (error) {
      console.error('Logout error:', error);
      // In caso di errore, forza il reindirizzamento
      navigate('/');
    }
  };

  // Access Keycloak user info
  const userInfo = {
    name: auth.user?.profile?.given_name || auth.user?.profile?.name,
    email: auth.user?.profile?.email,
    picture: auth.user?.profile?.picture,
    username: auth.user?.profile?.preferred_username
  };
  console.log('Auth user:', auth.user);
  console.log('Parsed user info:', userInfo);

  return (
    <header id="header" className="header">
      <div className="top-left">
        <div className="navbar-header">
          <a id="menuToggle" className="menutoggle" style={{ marginRight: '20px' }} onClick={onToggleSidebar}>
            <i className="fa fa-bars"></i>
          </a>
          <a className="navbar-brand" href="/dashboard">
            <img src="/src/assets/images/logo.png" alt="Logo" />
          </a>
          <a className="navbar-brand hidden" href="/dashboard">
            <img src="/src/assets/images/logo2.png" alt="Logo" />
          </a>
        </div>
      </div>
      <div className="top-right">
        <div className="header-menu">
          <div className="header-left">
            <button className="search-trigger">
              <i className="fa fa-search"></i>
            </button>
            <div className="form-inline">
              <form className="search-form">
                <input
                  className="form-control mr-sm-2"
                  type="text"
                  placeholder="Search ..."
                  aria-label="Search"
                />
                <button className="search-close" type="submit">
                  <i className="fa fa-close"></i>
                </button>
              </form>
            </div>

            <div className="dropdown for-notification">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="notification"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-bell"></i>
                <span className="count bg-danger">3</span>
              </button>
              <div className="dropdown-menu" aria-labelledby="notification">
                <p className="red">You have 3 Notification</p>
                <a className="dropdown-item media" href="#">
                  <i className="fa fa-check"></i>
                  <p>Server #1 overloaded.</p>
                </a>
                <a className="dropdown-item media" href="#">
                  <i className="fa fa-info"></i>
                  <p>Server #2 overloaded.</p>
                </a>
                <a className="dropdown-item media" href="#">
                  <i className="fa fa-warning"></i>
                  <p>Server #3 overloaded.</p>
                </a>
              </div>
            </div>

            <div className="dropdown for-message">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="message"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-envelope"></i>
                <span className="count bg-primary">4</span>
              </button>
              <div className="dropdown-menu" aria-labelledby="message">
                <p className="red">You have 4 Mails</p>
                <a className="dropdown-item media" href="#">
                  <span className="photo media-left">
                    <img alt="avatar" src="/src/assets/images/avatar/1.jpg" />
                  </span>
                  <div className="message media-body">
                    <span className="name float-left">Jonathan Smith</span>
                    <span className="time float-right">Just now</span>
                    <p>Hello, this is an example msg</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="user-area dropdown float-right" ref={dropdownRef}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#666', fontWeight: 500 }}>
                {userInfo.username || userInfo.name || 'User'}
              </span>
              <a
                href="#"
                className={`dropdown-toggle active ${showUserMenu ? 'show' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setShowUserMenu(!showUserMenu);
                }}
              >
                <img
                  className="user-avatar rounded-circle"
                  src={userInfo.picture || "/src/assets/images/admin.jpg"}
                  alt="User Avatar"
                />
              </a>
            </div>

            <div className={`user-menu dropdown-menu ${showUserMenu ? 'show' : ''}`}>
              <a className="nav-link" href="#">
                <i className="fa fa-user"></i>{userInfo.name || userInfo.username || 'My Profile'}
              </a>
              <a className="nav-link" href="#">
                <i className="fa fa-envelope"></i>{userInfo.email || ''}
              </a>
              <a className="nav-link" href="#">
                <i className="fa fa-bell"></i>Notifications
                <span className="count">13</span>
              </a>
              <a className="nav-link" href="#">
                <i className="fa fa-cog"></i>Settings
              </a>
              <a className="nav-link" href="#" onClick={handleLogout}>
                <i className="fa fa-power-off"></i>Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
