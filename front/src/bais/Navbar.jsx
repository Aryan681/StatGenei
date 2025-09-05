import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../compo/auth/context";
import { gsap } from "gsap";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ homeRef, featuresRef, footerRef }) => {
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
      setIsScrolled(window.scrollY > 50); // This is fine, as it's a fixed scroll point
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (navbarRef.current) {
      // Adjusted GSAP values for smoother, more consistent animation
      gsap.fromTo(
        navbarRef.current,
        { y: -200, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
      );
    }
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

  const handleScroll = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
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
    <div className="fixed left-0 right-0 z-50 flex justify-center w-full">
      <nav
        ref={navbarRef}
        className={`
          mx-auto z-50 w-[98%] max-w-6xl mt-4 px-4 sm:px-6 lg:px-8
          ${
            isScrolled
              ? "bg-black/90 backdrop-blur-md shadow-lg border border-white text-white"
              : "bg-slate-50/90 backdrop-blur-sm border-b-2 border-l-2 border-r-2 text-black"
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
            <span
              className={`text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent ${
                isScrolled ? "" : "drop-shadow-md"
              }`}
            >
              StatGenie
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div ref={menuRef} className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleScroll(homeRef)}
            className={`relative px-3 py-2 font-medium transition duration-300 ease-in-out focus:outline-none group ${
              isScrolled ? "text-white hover:text-purple-600" : "text-black hover:text-blue-600"
            }`}
          >
            Home
            <span
              className={`absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 group-hover:w-full ${
                isScrolled ? "" : "group-hover:shadow-lg group-hover:shadow-yellow-400/30"
              }`}
            ></span>
          </button>

          <button
            onClick={() => handleScroll(featuresRef)}
            className={`relative px-3 py-2 font-medium transition duration-300 ease-in-out focus:outline-none group ${
              isScrolled ? "text-white hover:text-purple-600" : "text-black hover:text-blue-600"
            }`}
          >
            Features
            <span
              className={`absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 group-hover:w-full ${
                isScrolled ? "" : "group-hover:shadow-lg group-hover:shadow-yellow-400/30"
              }`}
            ></span>
          </button>

          <button
            onClick={() => handleScroll(footerRef)}
            className={`relative px-3 py-2 font-medium transition duration-300 ease-in-out focus:outline-none group ${
              isScrolled ? "text-white hover:text-purple-600" : "text-black hover:text-blue-600"
            }`}
          >
            Contact
            <span
              className={`absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 group-hover:w-full ${
                isScrolled ? "" : "group-hover:shadow-lg group-hover:shadow-yellow-400/30"
              }`}
            ></span>
          </button>
          
          {user ? (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`flex text-2xl items-center space-x-2 transition-colors duration-200 font-medium cursor-pointer ${
                  isScrolled ? "text-white hover:text-purple-600" : "text-black hover:text-purple-600"
                }`}
              >
                <FaUserCircle className="h-6 w-6" />
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
                  isScrolled ? "text-purple-600 hover:bg-purple-50 border border-purple-200" : "text-purple-600 hover:bg-purple-700/30 border border-purple-400"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isScrolled ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-black hover:shadow-lg hover:shadow-yellow-400/30"
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
              isScrolled ? "text-white" : "text-black"
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
          <div
            className={`md:hidden absolute top-full left-0 w-full backdrop-blur-md border-t rounded-b-xl px-4 py-4 ${
              isScrolled ? "bg-white/95 border-gray-100/30" : "bg-slate-50/90 border-slate-300/30"
            }`}
          >
            <ul className="flex flex-col space-y-3 text-black">
              <li>
                <button
                  onClick={() => handleScroll(homeRef)}
                  className="block py-2 font-medium transition duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll(featuresRef)}
                  className="block py-2 font-medium transition duration-300"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll(footerRef)}
                  className="block py-2 font-medium transition duration-300"
                >
                  Contact
                </button>
              </li>
              {user ? (
                <li className="pt-3 border-t border-gray-200/30">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 font-medium transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li className="pt-3 border-t border-gray-200/30">
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 text-center font-medium rounded-lg transition-all duration-300 text-black border border-gray-400 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 text-center font-medium rounded-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    >
                      Sign Up
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;