import { ReactNode, useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1010) {
        document.body.classList.add('small-device');
      } else {
        document.body.classList.remove('small-device');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    const panel = document.getElementById('left-panel');
    if (window.innerWidth < 768) {
      // Mobile view
      if (panel) {
        if (panel.style.display === 'none' || !panel.style.display) {
          panel.style.display = 'block';
          document.body.classList.add('show-sidebar');
        } else {
          panel.style.display = 'none';
          document.body.classList.remove('show-sidebar');
        }
      }
    } else {
      // Tablet/Desktop view
      if (window.innerWidth < 1010) {
        if (panel) {
          panel.classList.toggle('open-menu');
        }
      } else {
        document.body.classList.toggle('open');
      }
    }
  };

  return (
    <div id="right-panel" className="right-panel">
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar onToggle={toggleSidebar} />
      <div className="content">
        <div className="animated fadeIn">
          {children}
        </div>
      </div>
      <div className="clearfix"></div>
      <Footer />
    </div>
  );
};

export default Layout;
