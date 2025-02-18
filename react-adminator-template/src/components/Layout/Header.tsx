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
  const [showSearch, setShowSearch] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

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
      auth.removeUser();
      await auth.signoutRedirect({
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

  return (
    <div className="header navbar">
      <div className="header-container">
        <ul className="nav-left">
          <li>
            <a id='sidebar-toggle' className="sidebar-toggle" onClick={onToggleSidebar}>
              <i className="ti-menu"></i>
            </a>
          </li>
          <li className="search-box">
            <a className={`search-toggle no-pdd-right ${showSearch ? 'active' : ''}`} 
               href="#" 
               onClick={(e) => {
                 e.preventDefault();
                 setShowSearch(!showSearch);
               }}>
              <i className="search-icon ti-search pdd-right-10"></i>
              <i className="search-icon-close ti-close pdd-right-10"></i>
            </a>
          </li>
          <li className={`search-input ${showSearch ? 'show' : ''}`}>
            <input 
              className="form-control" 
              type="text" 
              placeholder="Search..." 
            />
          </li>
        </ul>
        <ul className="nav-right">
          <li className="notifications dropdown">
            <span className="counter bgc-red">3</span>
            <a href="#" className="dropdown-toggle no-after" data-bs-toggle="dropdown">
              <i className="ti-bell"></i>
            </a>
            <ul className="dropdown-menu">
              <li className="pX-20 pY-15 bdB">
                <i className="ti-bell pR-10"></i>
                <span className="fsz-sm fw-600 c-grey-900">Notifications</span>
              </li>
              <li>
                <ul className="ovY-a pos-r scrollable lis-n p-0 m-0 fsz-sm">
                  <li>
                    <a href="#" className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
                      <div className="peer mR-15">
                        <img className="w-3r bdrs-50p" src={userInfo.picture || "/assets/images/avatar/1.jpg"} alt="" />
                      </div>
                      <div className="peer peer-greed">
                        <span>
                          <span className="fw-500">New Notification</span>
                          <span className="c-grey-600">just now</span>
                        </span>
                        <p className="m-0">
                          <small className="fsz-xs">You have a new alert</small>
                        </p>
                      </div>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="dropdown" ref={dropdownRef}>
            <a href="#" 
               className="dropdown-toggle no-after peers fxw-nw ai-c lh-1" 
               onClick={(e) => {
                 e.preventDefault();
                 setShowUserMenu(!showUserMenu);
               }}>
              <div className="peer mR-10">
                <img className="w-2r bdrs-50p" src={userInfo.picture || "/assets/images/admin.jpg"} alt="" />
              </div>
              <div className="peer">
                <span className="fsz-sm c-grey-900">{userInfo.username || userInfo.name || 'User'}</span>
              </div>
            </a>
            <ul className={`dropdown-menu fsz-sm ${showUserMenu ? 'show' : ''}`}>
              <li>
                <a href="#" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                  <i className="ti-settings mR-10"></i>
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <a href="#" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                  <i className="ti-user mR-10"></i>
                  <span>Profile</span>
                </a>
              </li>
              <li role="separator" className="divider"></li>
              <li>
                <a href="#" onClick={handleLogout} className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                  <i className="ti-power-off mR-10"></i>
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
