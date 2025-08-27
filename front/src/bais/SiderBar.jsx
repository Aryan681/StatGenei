import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../compo/auth/context";
import { gsap } from "gsap";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const sidebarRef = useRef(null);
  const timeoutRef = useRef(null);

  // GSAP animation for sidebar appearance
  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      { x: -300, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const DropdownMenu = () => (
    <div className="absolute left-full ml-2 top-0 w-48 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-red-200/30 py-1 z-50">
      <button
        onClick={() => {
          handleLogout();
          setShowDropdown(false);
        }}
        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/contact", label: "Contact", icon: "📞" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full z-50 bg-gradient-to-b from-pink-500 to-red-500 border-r border-red-400/30 backdrop-blur-sm
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          shadow-xl
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white rounded-full p-1 shadow-md hover:scale-110 transition-transform duration-200"
        >
          <svg
            className="w-4 h-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
            />
          </svg>
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-red-400/30">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-12 w-12 rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
            {!isCollapsed && (
              <span className="text-xl font-bold text-white drop-shadow-md whitespace-nowrap">
                StatGenie
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group
                ${isActive(item.path) 
                  ? "bg-white/20 text-white shadow-inner" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              {isActive(item.path) && !isCollapsed && (
                <div className="w-1 h-6 bg-yellow-400 rounded-full ml-auto"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-400/30">
          {user ? (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors duration-200
                ${showDropdown ? "bg-white/20" : "hover:bg-white/10"}
                ${isCollapsed ? "justify-center" : ""}
              `}>
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-red-600 font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-white/70 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-white transition-transform duration-200 ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </div>
              {showDropdown && <DropdownMenu />}
            </div>
          ) : (
            <div className={`space-y-2 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
              <Link
                to="/login"
                className={`flex items-center justify-center p-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors duration-200
                  ${isCollapsed ? "w-12 h-12" : ""}
                `}
              >
                {isCollapsed ? "🔐" : "Login"}
              </Link>
              {!isCollapsed && (
                <Link
                  to="/register"
                  className="block w-full p-3 rounded-xl bg-yellow-400 text-red-600 font-medium text-center hover:bg-yellow-300 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Collapsed Hover Labels */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2">
            {navItems.map((item, index) => (
              <div
                key={item.path}
                className="absolute left-2 bg-white/95 backdrop-blur-md rounded-lg px-3 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                style={{ top: `${120 + index * 60}px` }}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content margin for sidebar */}
      <style jsx>{`
        main {
          margin-left: ${isCollapsed ? '80px' : '256px'};
          transition: margin-left 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;