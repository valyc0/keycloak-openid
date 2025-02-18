import { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    // Loader effect
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('fadeOut');
      }, 300);
    }
  }, []);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`app ${isCollapsed ? 'is-collapsed' : ''}`}>
      {/* Loader */}
      <div id='loader'>
        <div className="spinner"></div>
      </div>

      {/* Mobile Overlay */}
      <div 
        className="mobile-overlay" 
        onClick={() => {
          if (window.innerWidth <= 768) {
            setIsCollapsed(false);
          }
        }}
      />

      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="page-container">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="main-content bgc-grey-100">
          <div id="mainContent">
            <div className="row gap-20 masonry pos-r">
              <div className="masonry-sizer col-md-6"></div>
              <div className="masonry-item w-100">
                {children}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
