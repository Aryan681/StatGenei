// Loader.js
import React from 'react';
import "./loader.css"
// You'll need a subtle animation. Let's define keyframes for a shimmer effect directly in CSS or via a utility class
// For simplicity, I'll use Tailwind CSS classes that will require some custom CSS.
// You might add this to your global CSS file (e.g., index.css or a dedicated animations.css)
/*
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer-bg {
  background: linear-gradient(to right, #333 8%, #444 18%, #333 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
*/

export default function Loader() {
  // Helper for a generic skeleton block
  const SkeletonBlock = ({ width = 'full', height = 'h-4', className = '' }) => (
    <div className={`shimmer-bg rounded-md ${width} ${height} ${className}`}></div>
  );

  return (
    <div className="p-6"> {/* Add some padding to match the dashboard's overall spacing */}
      {/* Top row of 4 small cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#2d2e31] p-4 rounded-2xl shadow-lg border border-[#3E4044] h-28 flex flex-col justify-between">
            <SkeletonBlock width="w-2/3" />
            <SkeletonBlock width="w-1/2" />
          </div>
        ))}
      </div>

      {/* Second row of 4 small cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#2d2e31] p-4 rounded-2xl shadow-lg border border-[#3E4044] h-28 flex flex-col justify-between">
            <SkeletonBlock width="w-2/3" />
            <SkeletonBlock width="w-1/2" />
          </div>
        ))}
      </div>

      {/* Third row: 3 small cards + 1 date range card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
        {/* Date Range Card */}
        <div className="bg-gradient-to-br from-purple-800/20 to-purple-900/20 p-4 rounded-2xl shadow-lg border border-purple-500/50 h-28 flex flex-col justify-between">
          <SkeletonBlock width="w-3/4" />
          <SkeletonBlock width="w-full" height="h-6" />
        </div>
      </div>

      {/* Bottom row of 2 larger chart cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-[#2d2e31] to-[#262626] p-6 rounded-2xl shadow-lg border border-[#3E4044] h-96 flex flex-col">
            <SkeletonBlock width="w-1/3" className="mb-4" /> {/* Placeholder for chart title */}
            <SkeletonBlock height="h-full" className="flex-grow" /> {/* Main chart area */}
            <div className="mt-4 p-4 rounded-lg bg-gray-800 border border-gray-700 flex items-start space-x-3">
              <SkeletonBlock width="w-full" height="h-4" /> {/* Summary text */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}