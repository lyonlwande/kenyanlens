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
        <img src={assets.egaTradeLogo} alt="" className='w-10 sm:w-20 md:w-16 cursor-pointer' onClick={() => navigate('/')} />
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
