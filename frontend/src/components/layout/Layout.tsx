import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuClick = () => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      setSidebarCollapsed((current) => !current);
      return;
    }
    setSidebarOpen(true);
  };

  return (
    <div className="app-shell flex min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
      />
      
      <div className="flex flex-col flex-1 w-full">
        <Navbar onMenuClick={handleMenuClick} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 transition-all duration-300">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
