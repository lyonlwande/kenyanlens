
import React from 'react'
import { NavLink } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaListAlt, FaComments, FaFileAlt, FaTimes } from 'react-icons/fa';

const SideBar = ({ onClose, isDrawer }) => {
  return (
    <div className={`flex flex-col border-r border-gray-200 min-h-full pt-6 bg-white h-full w-64 md:w-auto relative`}>
      {/* Drawer close button for mobile */}
      {isDrawer && (
        <button
          className="absolute top-2 right-2 p-2 rounded hover:bg-purple-100 text-purple-700 z-10"
          aria-label="Close sidebar menu"
          onClick={onClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>
      )}

      <NavLink end={true} to="/author" className={({ isActive }) =>  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive ? "bg-purple-700/10 border-r-4 border-purple-700 text-purple-700 font-medium" : ''}`}>
        <div className="flex items-center gap-2">
          <FaHome className="min-w-4 w-5" />
          <p className={(isDrawer ? '' : 'hidden md:inline-block')}>Dashboard</p>
        </div>
      </NavLink>

      <NavLink to="/author/addBlog" className={({ isActive }) =>  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive ? "bg-purple-700/10 border-r-4 border-purple-700 text-purple-700 font-medium" : ''}`}>
        <div className="flex items-center gap-2">
          <FaPlusCircle className="min-w-4 w-5" />
          <p className={(isDrawer ? '' : 'hidden md:inline-block')}>Add blogs</p>
        </div>
      </NavLink>

      <NavLink to="/author/listBlog" className={({ isActive }) =>  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive ? "bg-purple-700/10 border-r-4 border-purple-700 text-purple-700 font-medium" : ''}`}>
        <div className="flex items-center gap-2">
          <FaListAlt className="min-w-4 w-5" />
          <p className={(isDrawer ? '' : 'hidden md:inline-block')}>Blog Lists</p>
        </div>
      </NavLink>

      <NavLink to="/author/drafts" className={({ isActive }) =>  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive ? "bg-purple-700/10 border-r-4 border-purple-700 text-purple-700 font-medium" : ''}`}>
        <div className="flex items-center gap-2">
          <FaFileAlt className="min-w-4 w-5" />
          <p className={(isDrawer ? '' : 'hidden md:inline-block')}>Blog Drafts</p>
        </div>
      </NavLink>
      
      <NavLink to="/author/comments" className={({ isActive }) =>  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive ? "bg-purple-700/10 border-r-4 border-purple-700 text-purple-700 font-medium" : ''}`}>
        <div className="flex items-center gap-2">
          <FaComments className="min-w-4 w-5" />
          <p className={(isDrawer ? '' : 'hidden md:inline-block')}>Comments</p>
        </div>
      </NavLink>
    </div>
  )
}

export default SideBar
