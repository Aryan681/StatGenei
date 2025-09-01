import React, { forwardRef } from 'react';

const NewFooter = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="bg-gray-900 py-12 px-8 border-t border-white border-opacity-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-6">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-20 w-20 rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
            <h1 className="text-xl font-bold">StatGenei</h1>
          </div>
          <p className="text-gray-400">
            Transforming raw data into actionable insights with AI-powered
            analytics.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6">Product</h4>
          <ul className="space-y-3 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Use Cases
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                API
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6">Resources</h4>
          <ul className="space-y-3 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Tutorials
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6">Company</h4>
          <ul className="space-y-3 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-white border-opacity-10 mt-12 pt-8 text-center text-gray-400">
        <p>© {new Date().getFullYear()} DataInsight. All rights reserved.</p>
      </div>
    </footer>
  );
});

export default NewFooter;