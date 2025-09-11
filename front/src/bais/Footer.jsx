import React, { forwardRef } from "react";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const NewFooter = forwardRef((props, ref) => {
  return (
    <footer
      ref={ref}
      className="bg-black py-16 px-8 border-t border-white border-opacity-10 text-white font-sans"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Company Info & Slogan */}
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/logo.png"
              alt="StatGenie Logo"
              className="h-14 w-14 rounded-xl transition-transform duration-300 transform hover:scale-110"
            />
            <h1 className="text-3xl font-extrabold text-white">StatGenie</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Transforming raw data into actionable insights with AI-powered
            analytics. Your data's potential, unlocked.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-6 text-purple-400">
            Quick Links
          </h4>
          <ul className="space-y-3 text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-purple-300 transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="hover:text-purple-300 transition-colors duration-200"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#dashboard"
                className="hover:text-purple-300 transition-colors duration-200"
              >
                Dashboard
              </a>
            </li>
            <li>
             
            </li>
          </ul>
        </div>

        {/* Company & Legal */}

        {/* Stay Connected & Socials */}
        <div className="flex flex-col items-start">
          <h4 className="text-xl font-semibold mb-6 text-purple-400">
            Stay Connected
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            Follow us on our social media to get the latest updates and news.
          </p>
          <div className="flex space-x-4 text-gray-400">
            <a
              href="https://www.linkedin.com/in/aryansingh1-2-/"
              aria-label="LinkedIn"
              className="hover:text-purple-300 transition-colors duration-200"
            >
              <FaLinkedin className="h-6 w-6" />
            </a>
            <a
              href="https://github.com/Aryan681"
              aria-label="GitHub"
              className="hover:text-purple-300 transition-colors duration-200"
            >
              <FaGithub className="h-6 w-6" />
            </a>
            <a
              href="mailto:aryannaruka7@gmail.com"
              aria-label="Email"
              className="hover:text-purple-300 transition-colors duration-200"
            >
              <FaEnvelope className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white border-opacity-10 mt-12 pt-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} StatGenie. All rights reserved.</p>
      </div>
    </footer>
  );
});

export default NewFooter;
