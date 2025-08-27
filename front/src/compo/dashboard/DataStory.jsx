import React from "react";
import { VscGraph } from "react-icons/vsc";

const DataStory = ({ dataStory, theme = "default" }) => {
  if (!dataStory) return null;

  const isGenieTheme = theme === "genie";
  const paragraphs = dataStory
    .split(". ")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const summary = paragraphs[0];
  const numericSummaries = paragraphs.slice(1, 3);
  const categoricalSummaries = paragraphs.slice(3, 6);
  const conclusion = paragraphs[6];

  return (
    <div
      className={`p-8 rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-[1.01] relative overflow-hidden
      ${
        isGenieTheme
          ? "bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border-purple-500/50 shadow-purple-500/20"
          : "bg-white border-gray-100"
      }`}
    >
      {/* Magical glowing particles */}
      {isGenieTheme && (
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: Math.random() * 6 + 3 + "px",
                height: Math.random() * 6 + 3 + "px",
                background: `radial-gradient(circle, ${
                  Math.random() > 0.5 ? "#FFD700" : "#00FFFF"
                }, transparent)`,
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDelay: Math.random() * 3 + "s",
                animationDuration: Math.random() * 4 + 3 + "s",
              }}
            ></div>
          ))}
        </div>
      )}

      <h2
        className={`text-2xl font-bold mb-6 flex items-center space-x-2
        ${isGenieTheme ? "text-yellow-300 drop-shadow-md" : "text-gray-800"}`}
      >
    
        <span>{isGenieTheme ? "📖 Magical Data Tale" : "Data Story"}</span>
      </h2>

      <div
        className={`leading-relaxed space-y-5 relative z-10
        ${isGenieTheme ? "text-purple-100" : "text-gray-600"}`}
      >
        {/* Summary */}
        <p
          className={`font-semibold text-lg border-l-4 pl-4 py-2
          ${
            isGenieTheme
              ? "border-yellow-400 text-yellow-200"
              : "border-blue-400 text-gray-700"
          }`}
        >
          ✨ {summary}.
        </p>

        {/* Key Metrics */}
        <div className="bg-gradient-to-r from-transparent to-transparent hover:to-purple-700/20 p-4 rounded-lg transition-all duration-300">
          <p
            className={`font-semibold mb-3 flex items-center
            ${isGenieTheme ? "text-cyan-300" : "text-gray-800"}`}
          >
            <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
            🔑 Key Metrics:
          </p>
          <ul className="space-y-2 ml-6">
            {numericSummaries.map((text, idx) => (
              <li
                key={idx}
                className={`flex items-start transition-all duration-200 hover:translate-x-1
                ${isGenieTheme ? "text-purple-100" : "text-gray-600"}`}
              >
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {text}.
              </li>
            ))}
          </ul>
        </div>

        {/* Distribution Insights */}
        <div className="bg-gradient-to-r from-transparent to-transparent hover:to-blue-700/20 p-4 rounded-lg transition-all duration-300">
          <p
            className={`font-semibold mb-3 flex items-center
            ${isGenieTheme ? "text-cyan-300" : "text-gray-800"}`}
          >
            <span className="w-3 h-3 bg-teal-400 rounded-full mr-2 animate-pulse"></span>
            📊 Distribution Insights:
          </p>
          <ul className="space-y-2 ml-6">
            {categoricalSummaries.map((text, idx) => (
              <li
                key={idx}
                className={`flex items-start transition-all duration-200 hover:translate-x-1
                ${isGenieTheme ? "text-purple-100" : "text-gray-600"}`}
              >
                <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {text}.
              </li>
            ))}
          </ul>
        </div>

        {/* Conclusion */}
        <div className="bg-gradient-to-r from-transparent to-transparent hover:to-purple-700/20 p-4 rounded-lg transition-all duration-300">
          <p
            className={`font-semibold mb-3 flex items-center
            ${isGenieTheme ? "text-yellow-300" : "text-gray-800"}`}
          >
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
            🎯 Conclusion:
          </p>
          <p
            className={`italic ml-6 border-l-2 pl-4 py-2 transition-all duration-200 hover:translate-x-1
            ${
              isGenieTheme
                ? "border-purple-400 text-yellow-200"
                : "border-gray-300 text-gray-600"
            }`}
          >
            {conclusion}.
          </p>
        </div>
      </div>

      {/* Decorative corner elements */}
      {isGenieTheme && (
        <>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-400 opacity-60"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-teal-400 opacity-60"></div>
        </>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-8px) rotate(5deg);
            opacity: 0.7;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DataStory;
