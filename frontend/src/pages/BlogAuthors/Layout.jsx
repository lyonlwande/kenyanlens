
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import useAuthStore from '../../zustandStores/authStore'
import SideBar from '../../components/blogAuthors/SideBar'

const Layout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Close sidebar on overlay click or ESC
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setSidebarOpen(false);
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="flex items-center justify-between py-2 px-4 h-[50px] md:h-[70px] border-b border-gray-200 relative z-30 bg-white">
        <div className="flex items-center gap-2">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden mr-2 p-2 rounded hover:bg-purple-100 focus:outline-none"
            aria-label="Open sidebar menu"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-7 h-7 text-purple-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img src={assets.egaTradeLogo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          <p className="text-purple-900 font-bold text-xl sm:text-2xl lg:text-3xl">KenyanLens</p>
        </div>
        <button
          className='text-sm px-8 py-2 bg-purple-700 text-white rounded-full cursor-pointer'
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main layout */}
      <div className="flex h-[calc(100vh-50px)] md:h-[calc(100vh-70px)] relative">
        {/* Sidebar: desktop static, mobile drawer */}
        <div className="hidden md:block h-full">
          <SideBar />
        </div>
        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 flex md:hidden bg-black/30"
            onClick={handleOverlayClick}
            aria-modal="true"
            role="dialog"
          >
            <div className="w-64 max-w-[80vw] bg-white h-full shadow-lg animate-slideInLeft relative">
              <SideBar onClose={() => setSidebarOpen(false)} isDrawer />
            </div>
          </div>
        )}
        {/* Main content area: always full width on mobile, margin-left on desktop */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto bg-blue-50/30">
          <Outlet />
        </div>
      </div>
      {/* Drawer animation */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.2s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  )
}

export default Layout
