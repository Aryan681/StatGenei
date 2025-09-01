import React from "react";
import { VscGraph } from "react-icons/vsc";

const DataStory = ({ dataStory }) => {
  if (!dataStory) return null;

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
      className={`p-8 rounded-2xl shadow-lg border hover:border-purple-400 border-[#3E4044] transition-all duration-300 relative 
      bg-gradient-to-br from-[#2d2e31] to-[#262626]`}
    >
      <h2
        className={`text-2xl font-bold mb-6 flex items-center space-x-2 text-white`}
      >
        <VscGraph className="text-purple-400 w-7 h-7" />
        <span>Data Story</span>
      </h2>

      <div
        className={`leading-relaxed space-y-5 relative z-10 text-gray-300`}
      >
        {/* Summary */}
        <p
          className={`font-semibold text-lg border-l-4 pl-4 py-2 border-purple-600 text-gray-200`}
        >
          {summary}.
        </p>

        {/* Key Metrics with hover effect */}
        <div className="bg-[#2d2e31] p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:bg-[#3d3e41] group cursor-pointer">
          <p
            className={`font-semibold mb-3 flex items-center text-purple-400`}
          >
            <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
            🔑 Key Metrics:
          </p>
          <ul className="space-y-2 ml-6">
            {numericSummaries.map((text, idx) => (
              <li
                key={idx}
                className={`flex items-start transition-all duration-200 text-gray-300 group-hover:text-white`}
              >
                <span className="w-2 h-2 bg-purple-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {text}.
              </li>
            ))}
          </ul>
        </div>

        {/* Distribution Insights with hover effect */}
        <div className="bg-[#2d2e31] p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:bg-[#3d3e41] group cursor-pointer">
          <p
            className={`font-semibold mb-3 flex items-center text-purple-400`}
          >
            <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
            📊 Distribution Insights:
          </p>
          <ul className="space-y-2 ml-6">
            {categoricalSummaries.map((text, idx) => (
              <li
                key={idx}
                className={`flex items-start transition-all duration-200 text-gray-300 group-hover:text-white`}
              >
                <span className="w-2 h-2 bg-purple-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {text}.
              </li>
            ))}
          </ul>
        </div>

        {/* Conclusion with hover effect */}
        <div className="bg-[#2d2e31] p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:bg-[#3d3e41] group cursor-pointer">
          <p
            className={`font-semibold mb-3 flex items-center text-purple-400`}
          >
            <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
            🎯 Conclusion:
          </p>
          <p
            className={`italic ml-6 border-l-2 pl-4 py-2 text-gray-300 border-[#3E4044] group-hover:text-white group-hover:border-purple-400 transition-all duration-200`}
          >
            {conclusion}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataStory;