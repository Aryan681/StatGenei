import React from "react";
import { VscGraph } from "react-icons/vsc";

const KpiCards = ({ kpis, theme = "default" }) => {
  if (!kpis || kpis.length === 0) return null;

  // Genie-themed color variations for different cards
  const genieColors = [
    "from-yellow-300 to-orange-300", // Gold
    "from-purple-500 to-indigo-600", // Purple
    "from-teal-400 to-blue-500",     // Blue
    "from-pink-500 to-red-500",      // Red
    "from-green-400 to-emerald-500", // Green
    "from-amber-400 to-orange-500",  // Amber
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4 text-center ">
        <span className="animate-pulse">✨</span> Magical Insights <span className="animate-pulse">✨</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const colorIndex = index % genieColors.length;
          const isGenieTheme = theme === "genie";
          
          return (
            <div
              key={index}
              className={`p-6 rounded-2xl shadow-2xl border transition-all duration-500 overflow-hidden 
              hover:scale-[1.03] hover:shadow-xl relative
              ${isGenieTheme 
                ? `bg-gradient-to-br ${genieColors[colorIndex]} border-transparent text-white` 
                : "bg-white border-gray-100 text-gray-800"
              }
              ${index === kpis.length - 1 ? "sm:col-span-2" : ""}`}
              style={{
                boxShadow: isGenieTheme 
                  ? `0 10px 30px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 140, 0, 0.2)` 
                  : undefined
              }}
            >
              {/* Magic sparkle effect */}
              {isGenieTheme && (
                <>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full animate-pulse opacity-70"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-white rounded-full animate-pulse opacity-50"></div>
                </>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-semibold uppercase tracking-wide
                  ${isGenieTheme ? "text-yellow-100" : "text-gray-500"}`}>
                  {kpi.name}
                </span>
                <div className={`text-xl ${isGenieTheme ? "text-yellow-200" : "text-blue-500"}`}>
                  <VscGraph />
                </div>
              </div>
              
              <span className={`text-4xl font-extrabold block mb-2
                ${isGenieTheme ? "text-white drop-shadow-md" : "text-gray-800"}`}>
                {kpi.value}
              </span>
              
              {/* Decorative element */}
              {isGenieTheme && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60"></div>
              )}
              
              {/* Hover effect enhancement */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-300
                ${isGenieTheme ? "bg-yellow-300" : "bg-blue-100"}`}></div>
            </div>
          );
        })}
      </div>
      
      {/* Magical divider */}
      {theme === "genie" && (
        <div className="relative h-4 flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          <div className="relative bg-purple-900 px-4 text-yellow-300 text-sm font-semibold">
            ✦ Magical Insights ✦
          </div>
        </div>
      )}
    </div>
  );
};

export default KpiCards;