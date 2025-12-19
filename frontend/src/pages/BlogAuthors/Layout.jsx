import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import useAuthStore from '../../zustandStores/authStore'
import SideBar from '../../components/blogAuthors/SideBar'

const Layout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <div className="flex items-center justify-between py-2 px-4 h-[50px] md:h-[70px]  border-b border-gray-200">
        <div className="flex items-center gap-2">
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
        <div className="flex h-[calc(100vh-70px)]"> 
         <SideBar />
         <Outlet />
        </div>
    </>
  )
}

export default Layout
