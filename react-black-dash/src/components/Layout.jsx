import PropTypes from 'prop-types';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import { useState, useEffect } from 'react';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
        setIsSidebarOpen(false);
        document.body.classList.remove('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && 
          isSidebarOpen && 
          !e.target.closest('.sidebar') && 
          !e.target.closest('[data-sidebar-toggle]')) {
        setIsSidebarOpen(false);
        document.body.classList.remove('sidebar-open');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
      document.body.classList.toggle('sidebar-open');
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="app">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
      />
      <div className={`wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
          <Header 
            onToggleSidebar={handleToggleSidebar}
            sidebarCollapsed={isSidebarCollapsed}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;