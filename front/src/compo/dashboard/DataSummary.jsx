import React from "react";
import {
  VscSymbolNamespace,
  VscGraph,
  VscTable,
  VscLayers,
  VscTypeHierarchy,
} from "react-icons/vsc";

const renderKeyValue = (obj, theme) => {
  if (typeof obj !== "object" || obj === null) {
    return (
      <span className={`font-medium ${theme.textMuted}`}>{String(obj)}</span>
    );
  }
  return (
    <ul className="space-y-2 text-sm">
      {Object.entries(obj).map(([key, value]) => (
        <li key={key} className="flex justify-between items-start">
          <span className={`font-semibold w-1/2 ${theme.heading}`}>
            {key.replace(/_/g, " ")}:
          </span>
          {typeof value === "object" && !Array.isArray(value) ? (
            <div className="flex-1 ml-4">{renderKeyValue(value, theme)}</div>
          ) : (
            <span className={`font-medium w-1/2 text-right ${theme.text}`}>
              {String(value)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

const DataSummary = ({ data, theme }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dataset Shape & Missing Values (Combined into one section as per the theme) */}
   <div
  className={`lg:col-span-1 p-6 rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-[1.02] 
              bg-gradient-to-br from-green-400 to-emerald-500 border-emerald-500/60 shadow-emerald-500/30
              relative overflow-hidden group cursor-pointer`}
>
  {/* Animated background overlay on hover */}
  <div className="absolute inset-0 bg-gradient-to-br from-green-300/0 to-emerald-400/0 
                 group-hover:from-green-300/20 group-hover:to-emerald-400/30 
                 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
  
  {/* Glowing border effect */}
  <div className="absolute inset-0 rounded-2xl border-2 border-transparent 
                 group-hover:border-white/40 group-hover:animate-pulse 
                 transition-all duration-300"></div>
  
  {/* Floating sparkles */}
  <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full 
                 opacity-0 group-hover:opacity-70 group-hover:animate-bounce 
                 transition-opacity duration-300"></div>
  
  <div className="relative z-10">
    {/* Missing Values Header */}
    <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-white drop-shadow-md">
      <VscSymbolNamespace className="text-white text-2xl group-hover:text-yellow-300 transition-colors duration-300" />
      <span className="group-hover:text-yellow-200 transition-colors duration-300">
        🌿 Missing Values
      </span>
    </h2>
    
    {/* Content */}
    {data.missing_values ? (
      <div className="pr-2 transform group-hover:translate-x-1 transition-transform duration-300">
        {renderKeyValue(data.missing_values, {
          ...theme,
          text: "text-white",
          keyColor: "text-yellow-200",
          valueColor: "text-emerald-100"
        })}
      </div>
    ) : (
      <p className="text-emerald-100 group-hover:text-yellow-200 transition-colors duration-300">
        ✨ No missing values detected.
      </p>
    )}
  </div>

  {/* Bottom accent bar */}
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent 
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

  {/* Hover glow effect */}
  <div className="absolute inset-0 bg-white/0 rounded-2xl 
                 group-hover:bg-white/10 group-hover:blur-md 
                 transition-all duration-500 -z-10"></div>
</div>

      {/* Numeric Summary - Gold Gradient */}
      <div
        className={`lg:col-span-2 p-6 rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-[1.01]
        bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-500/60  shadow-orange-500/30`}
      >
        <h2
          className={`text-xl font-semibold mb-4 flex items-center space-x-2 text-purple-900 drop-shadow-md`}
        >
          <VscTypeHierarchy className="text-purple-800 text-2xl" />
          <span>Numerical Magic</span>
        </h2>
        {data.numeric_summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(data.numeric_summary).map(
              ([metricName, summaryData], idx) => (
                <div key={idx} className="overflow-x-auto">
                  <h3 className="text-lg font-bold mb-2 text-purple-800">
                    {metricName}
                  </h3>
                  <table
                    className={`table-auto w-full text-sm border-collapse text-purple-900`}
                  >
                    <thead>
                      <tr className="bg-yellow-300/50 text-purple-900">
                        <th className="border px-2 py-1 text-left border-yellow-400">
                          Metric
                        </th>
                        <th className="border px-2 py-1 text-left border-yellow-400">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(summaryData).map(
                        ([key, value], subIdx) => (
                          <tr
                            key={subIdx}
                            className="hover:bg-yellow-300/20 transition-colors"
                          >
                            <td
                              className={`border px-2 py-1 font-medium border-yellow-400 text-purple-800`}
                            >
                              {key.replace(/_/g, " ")}
                            </td>
                            <td
                              className={`border px-2 py-1 border-yellow-400 text-purple-900 font-semibold`}
                            >
                              {typeof value === "object" && value !== null
                                ? Object.entries(value).map(
                                    ([subKey, subValue]) => (
                                      <div
                                        key={subKey}
                                        className="flex justify-between"
                                      >
                                        <span className="font-normal text-purple-800">
                                          {subKey.replace(/_/g, " ")}:
                                        </span>
                                        <span className="ml-2 text-purple-900 font-bold">
                                          {String(subValue)}
                                        </span>
                                      </div>
                                    )
                                  )
                                : String(value)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-purple-800">No numeric summary available.</p>
        )}
      </div>

      {/* Categorical Summary - Blue Gradient */}
      <div
        className={`lg:col-span-3 p-6 rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-[1.01]
    bg-gradient-to-br from-teal-400 to-blue-500 border-teal-500/60 shadow-blue-500/30`}
      >
        <h2
          className={`text-xl font-semibold mb-4 flex items-center space-x-2 text-white drop-shadow-md`}
        >
          <VscLayers className="text-white text-2xl" />
          <span>Categorical Enchantments</span>
        </h2>
        {data.categorical_summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.categorical_summary).map(
              ([metricName, summaryData]) => (
                <div
                  key={metricName}
                  className="bg-purple-900/40 p-4 rounded-lg transition-all duration-300 
                        hover:bg-purple-800/60 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 
                        border border-purple-700/30 hover:border-purple-500/60 
                        group cursor-pointer transform-gpu"
                >
                  {/* Animated background effect on hover */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-teal-400/0 via-blue-500/0 to-purple-600/0 
                             group-hover:from-teal-400/10 group-hover:via-blue-500/10 group-hover:to-purple-600/20 
                             rounded-lg transition-all duration-500 opacity-0 group-hover:opacity-100"
                  ></div>

                  {/* Glowing border effect */}
                  <div
                    className="absolute inset-0 rounded-lg border-2 border-transparent 
                             group-hover:border-yellow-300/30 group-hover:animate-pulse 
                             transition-all duration-300"
                  ></div>

                  {/* Floating effect */}
                  <div className="relative transform-gpu transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="text-lg font-bold mb-3 text-cyan-200 group-hover:text-yellow-300 transition-colors duration-300">
                      {metricName.replace(/_/g, " ")}
                    </h3>
                    <div className="space-y-2 text-sm relative z-10">
                      {Object.entries(summaryData).map(([key, value]) => {
                        if (
                          key === "top_5_values" &&
                          typeof value === "object" &&
                          value !== null
                        ) {
                          return (
                            <div
                              key={key}
                              className="transition-all duration-300 group-hover:scale-[1.02]"
                            >
                              <p className="text-purple-300 font-medium mb-1 group-hover:text-cyan-200 transition-colors duration-300">
                                Top Values:
                              </p>
                              <ul className="space-y-0.5">
                                {Object.entries(value).map(([label, count]) => (
                                  <li
                                    key={label}
                                    className="flex justify-between items-center text-cyan-100 
                                         group-hover:text-white transition-colors duration-200"
                                  >
                                    <span className="truncate max-w-[60%] group-hover:font-medium transition-all duration-300">
                                      {label}
                                    </span>
                                    <span
                                      className="font-semibold text-white group-hover:text-yellow-300 
                                               group-hover:scale-110 transition-all duration-200"
                                    >
                                      {count}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={key}
                            className="flex justify-between items-center py-1 
                                 group-hover:bg-purple-700/30 group-hover:px-2 group-hover:-mx-2 group-hover:rounded 
                                 transition-all duration-200"
                          >
                            <span className="font-medium text-purple-300 group-hover:text-cyan-200 transition-colors duration-300">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <span
                              className="text-white font-semibold group-hover:text-yellow-300 
                                       group-hover:scale-110 transition-all duration-200"
                            >
                              {String(value)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Magic sparkle effect on hover */}
                    <div
                      className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full 
                               opacity-0 group-hover:opacity-100 group-hover:animate-ping 
                               transition-opacity duration-300"
                    ></div>

                    {/* Subtle glow behind the card */}
                    <div
                      className="absolute inset-0 bg-yellow-200/0 rounded-lg 
                               group-hover:bg-yellow-200/10 group-hover:blur-md 
                               transition-all duration-500 -z-10"
                    ></div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-purple-300">No categorical summary available.</p>
        )}
      </div>
    </div>
  );
};

export default DataSummary;
