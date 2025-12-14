

import React, { useState } from 'react';
import { assets } from '../assets/assets.js';
import { FaArrowRight, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuthStore from '../zustandStores/authStore.js';


const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [showModal, setShowModal] = useState(false);
  return (
    <nav className="w-full px-4 sm:px-8 lg:px-16 py-2 flex items-center justify-between ">
      <div className="flex items-center gap-2">
        <img src={assets.egaTradeLogo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        <p className="text-purple-900 font-bold text-xl sm:text-2xl lg:text-3xl">KenyanLens</p>
      </div>
      {/* Right side: show login if not authenticated, else show profile pic/avatar */}
      {!user ? (
        <div className="bg-purple-500/80 rounded-xl text-black">
          <Link to="/login" className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base hover:bg-purple-600 transition-colors">
            <span>Login</span>
            <FaArrowRight />
          </Link>
        </div>
      ) : (
        <div className="flex items-center relative">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-purple-500 flex items-center justify-center bg-gray-200 ml-auto cursor-pointer"
            onClick={() => setShowModal((prev) => !prev)}
            title="Account options"
          >
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-purple-700 font-bold text-lg">
                {(() => {
                  let username = typeof user.username === 'string' ? user.username.trim() : '';
                  if (username && username.length > 0) {
                    // Find first non-space character
                    const firstChar = username.replace(/^\s+/, '').charAt(0);
                    if (firstChar) return firstChar.toUpperCase();
                  }
                  if (user.email && user.email.length > 0) return user.email.charAt(0).toUpperCase();
                  return 'U';
                })()}
              </span>
            )}
          </div>
          {/* Modal */}
          {showModal && (
            <div className="absolute right-0 top-14 z-50 bg-white border border-gray-300 rounded-xl shadow-lg py-2 w-48 flex flex-col items-stretch animate-fade-in">
              <button
                className="px-5 py-2 text-left hover:bg-purple-100/60 text-purple-900 font-medium border-b border-gray-200 flex items-center gap-3 transition-colors duration-150"
                onClick={() => { setShowModal(false); /* Navigate to profile page here if needed */ }}
              >
                <FaUser className="text-purple-700 text-lg" />
                Profile
              </button>
              <button
                className="px-5 py-2 text-left hover:bg-purple-100/60 text-purple-900 font-medium border-b border-gray-200 flex items-center gap-3 transition-colors duration-150"
                onClick={() => { setShowModal(false); /* Navigate to settings page here if needed */ }}
              >
                <FaCog className="text-purple-700 text-lg" />
                Settings
              </button>
              <button
                className="px-5 py-2 text-left hover:bg-red-50 text-red-600 font-medium flex items-center gap-3 transition-colors duration-150"
                onClick={() => { setShowModal(false); logout(); }}
              >
                <FaSignOutAlt className="text-red-600 text-lg" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar
