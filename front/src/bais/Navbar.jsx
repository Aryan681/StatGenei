import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../compo/auth/context";
import { gsap } from "gsap";

const Navbar = ({ scrollToDashboard, scrollToFooter, scrollToHome }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navbarRef = useRef(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animation for navbar appearance
  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
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
    }, 150);
  };

  const DropdownMenu = () => (
    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-purple-200/30 py-1 z-50">
      <button
        onClick={() => {
          handleLogout();
          setShowDropdown(false);
        }}
        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full">
      <nav
        ref={navbarRef}
        className={`
          mx-auto z-50 w-[98%] max-w-6xl mt-4 px-4 sm:px-6 lg:px-8
          transition-all duration-300 
          ${isScrolled 
            ? "bg-white/90 backdrop-blur-md shadow-lg border border-purple-100/30" 
            : "bg-gradient-to-r from-pink-500 to-red-500 border-b border-red-400/30 backdrop-blur-sm"
          }
          rounded-2xl
          flex items-center justify-between h-16
        `}
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-12 w-12 rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
            <span className={`text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent ${isScrolled ? "" : "drop-shadow-md"}`}>
              StatGenie
            </span>
          </Link>
        </div>

        {/* Desktop Menu - Hidden on small screens */}
        <div ref={menuRef} className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            onClick={scrollToHome}
            className={`relative px-3 py-2 font-medium transition duration-300 ease-in-out focus:outline-none group ${
              isScrolled ? "text-gray-700 hover:text-purple-600" : "text-purple-100 hover:text-yellow-300"
            }`}
          >
            Home
            <span className={`absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 group-hover:w-full ${
              isScrolled ? "" : "group-hover:shadow-lg group-hover:shadow-yellow-400/30"
            }`}></span>
          </Link>

          <Link
            to="/Dashboard"
            onClick={scrollToDashboard}
            className={`relative px-3 py-2 font-medium transition duration-300 ease-in-out focus:outline-none group ${
              isScrolled ? "text-gray-700 hover:text-purple-600" : "text-purple-100 hover:text-yellow-300"
            }`}
          >
            Dashboard
            <span className={`absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 group-hover:w-full ${
              isScrolled ? "" : "group-hover:shadow-lg group-hover:shadow-yellow-400/30"
            }`}></span>
          </Link>

          <a
            onClick={(e) => {
              e.preventDefault();
              scrollToFooter();
            }}
            href="#footer"
            className={`relative px-3 py-2 font-medium transition duration-300 ease-in-out focus:outline-none group ${
              isScrolled ? "text-gray-700 hover:text-purple-600" : "text-purple-100 hover:text-yellow-300"
            }`}
          >
            Contact
            <span className={`absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 group-hover:w-full ${
              isScrolled ? "" : "group-hover:shadow-lg group-hover:shadow-yellow-400/30"
            }`}></span>
          </a>

          {user ? (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`flex items-center space-x-2 transition-colors duration-200 font-medium cursor-pointer ${
                isScrolled ? "text-gray-700 hover:text-purple-600" : "text-purple-100 hover:text-yellow-300"
              }`}>
                <span>{user.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
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
              </div>
              {showDropdown && <DropdownMenu />}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isScrolled 
                    ? "text-purple-600 hover:bg-purple-50 border border-purple-200" 
                    : "text-yellow-300 hover:bg-purple-700/30 border border-purple-400/30"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isScrolled 
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg" 
                    : "bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 hover:shadow-lg hover:shadow-yellow-400/30"
                }`}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`transition-colors duration-200 ${
              isScrolled ? "text-gray-700" : "text-purple-100"
            }`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full backdrop-blur-md border-t rounded-b-xl px-4 py-4 ${
            isScrolled 
              ? "bg-white/95 border-gray-100/30" 
              : "bg-purple-900/95 border-purple-500/30"
          }`}>
            <ul className="flex flex-col space-y-3">
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHome();
                    setIsMenuOpen(false);
                  }}
                  href="#home"
                  className={`block py-2 font-medium transition duration-300 ${
                    isScrolled ? "text-gray-700 hover:text-purple-600" : "text-purple-100 hover:text-yellow-300"
                  }`}
                >
                  Home
                </a>
              </li>
              <li>
                <Link
                  to="/Dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 font-medium transition duration-300 ${
                    isScrolled ? "text-gray-700 hover:text-purple-600" : "text-purple-100 hover:text-yellow-300"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToFooter();
                    setIsMenuOpen(false);
                  }}
                  href="#footer"
                  className={`block py-2 font-medium transition duration-300 ${
                    isScrolled ? "text-gray-700 hover:text-purple-600" : "text-purple-100 hover:text-yellow-300"
                  }`}
                >
                  Contact
                </a>
              </li>
              <li className="pt-3 border-t border-gray-200/30">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 font-medium transition duration-300 ${
                      isScrolled ? "text-gray-700 hover:text-purple-600" : "text-purple-100 hover:text-yellow-300"
                    }`}
                  >
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className={`py-2 text-center font-medium rounded-lg transition-all duration-300 ${
                        isScrolled 
                          ? "text-purple-600 hover:bg-purple-50 border border-purple-200" 
                          : "text-yellow-300 hover:bg-purple-700/30 border border-purple-400/30"
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className={`py-2 text-center font-medium rounded-lg transition-all duration-300 ${
                        isScrolled 
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" 
                          : "bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900"
                      }`}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;