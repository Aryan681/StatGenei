import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../compo/auth/context';
import {
  VscHome,
  VscDashboard,
  VscAccount,
  VscFolder,
  VscTasklist,
  VscSettingsGear,
  VscQuestion,
  VscSignOut,
  VscChevronLeft,
} from 'react-icons/vsc';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <VscHome /> },
    { to: '/dashboard', label: 'Dashboard', icon: <VscDashboard /> },
    { to: '/settings', label: 'Settings', icon: <VscSettingsGear /> },
  ];

  return (
    <div
      className={`fixed h-full bg-[#262626d6] p-6 flex flex-col justify-between z-50 shadow-lg border-r border-[#3a3a3a] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Logo, Site Name, and Collapse Button */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center space-x-2 group overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
            {!isCollapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent whitespace-nowrap">
                StatGenie
              </span>
            )}
          </Link>
          <button
            onClick={onToggle}
            className="text-white p-1 rounded-full hover:bg-purple-800 transition-colors duration-200"
          >
            <VscChevronLeft className={`h-6 w-6 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* User Name Display */}
        {user && !isCollapsed && (
          <div className="mb-8">
            <p className="text-4xl font-semibold text-purple-500">
               {user.name}
            </p>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className={`flex items-center px-1 py-2 rounded-lg font-medium transition-colors duration-200 space-x-3
                ${
                  link.to === '/dashboard' 
                    ? 'text-white bg-purple-500/80' 
                    : 'text-slate-400 hover:bg-purple-900'
                }`}
            >
              <div className="text-2xl">{link.icon}</div>
              {!isCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Actions */}
      <div className="space-y-2">
        {user ? (
          <>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-slate-400 hover:bg-purple-900 rounded-lg transition-colors duration-200 space-x-3"
            >
              <div className="text-2xl"><VscQuestion /></div>
              {!isCollapsed && <span>Contact Support</span>}
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-purple-900 rounded-lg transition-colors duration-200 space-x-3"
            >
              <div className="text-2xl"><VscSignOut /></div>
              {!isCollapsed && <span>Logout</span>}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center justify-center w-full px-4 py-2 text-center text-purple-400 border border-purple-500 hover:bg-purple-900/50 rounded-lg transition-colors duration-200"
            >
              <span className="whitespace-nowrap">Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center w-full px-4 py-2 text-center text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200"
            >
              <span className="whitespace-nowrap">Sign Up</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;