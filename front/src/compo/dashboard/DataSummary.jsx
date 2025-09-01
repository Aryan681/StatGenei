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
    return <span className={`font-medium text-gray-300`}>{String(obj)}</span>;
  }
  return (
    <ul className="space-y-2 text-sm ">
      {Object.entries(obj).map(([key, value]) => (
        <li key={key} className="flex justify-between items-start">
          <span className="font-semibold w-1/2 text-gray-200">
            {key.replace(/_/g, " ")}:
          </span>
          {typeof value === "object" && !Array.isArray(value) ? (
            <div className="flex-1 ml-4">{renderKeyValue(value, theme)}</div>
          ) : (
            <span className="font-medium w-1/2 text-right text-gray-300">
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
      {/* Missing Values Section */}
      <div
        className="lg:col-span-1  hover:scale-[1.01] p-6 rounded-2xl shadow-lg border border-[#4d4d4d] transition-all duration-300 relative overflow-hidden group cursor-pointer
                    bg-gradient-to-br from-[#2d2e31] to-[#262626] hover:border-purple-500 "
      >
        <div className="relative z-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-white">
            <VscSymbolNamespace className="text-purple-400 group-hover:text-white text-2xl  transition-colors duration-300" />
            <span className="group-hover:text-purple-400 transition-colors duration-300">
              Missing Values
            </span>
          </h2>
          {data.missing_values ? (
            <div className="pr-2 transform group-hover:translate-x-1 transition-transform duration-300">
              {renderKeyValue(data.missing_values, {
                ...theme,
                text: "text-gray-300",
                keyColor: "text-purple-200",
                valueColor: "text-gray-100",
              })}
            </div>
          ) : (
            <p className="text-gray-300 group-hover:text-purple-200 transition-colors duration-300">
              No missing values detected.
            </p>
          )}
        </div>
      </div>

      {/* Numeric Summary Section */}
      <div
        className="lg:col-span-2 p-6 rounded-2xl shadow-lg border hover:border-purple-500 border-[#4d4d4d] transition-all duration-300 hover:scale-[1.01]
        bg-gradient-to-br from-[#2d2e31] to-[#262626]"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-white group">
          <VscTypeHierarchy className="text-purple-400 group-hover:text-white text-2xl" />
          <span className="group-hover:text-purple-400 transition-colors duration-300">
            Numerical Summary
          </span>
        </h2>
        {data.numeric_summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(data.numeric_summary).map(
              ([metricName, summaryData], idx) => (
                <div key={idx} className="overflow-x-auto">
                  <h3 className="text-lg  font-bold mb-2 text-purple-300">
                    {metricName}
                  </h3>
                  <table className="table-auto w-full  text-sm border-collapse text-gray-200">
                    <thead>
                      <tr className="bg-gray-700/50 text-gray-300">
                        <th className="border px-2 py-1 text-left border-[#4d4d4d]">
                          Metric
                        </th>
                        <th className="border px-2 py-1 text-left border-[#4d4d4d]">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(summaryData).map(
                        ([key, value], subIdx) => (
                          <tr
                            key={subIdx}
                            className="hover:bg-[#4d4d4d]/20 transition-colors"
                          >
                            <td className="border px-2 py-1 font-medium border-[#4d4d4d]  text-gray-200">
                              {key.replace(/_/g, " ")}
                            </td>
                            <td className="border px-2 py-1 border-[#4d4d4d] text-gray-100 font-semibold">
                              {typeof value === "object" && value !== null
                                ? Object.entries(value).map(
                                    ([subKey, subValue]) => (
                                      <div
                                        key={subKey}
                                        className="flex justify-between"
                                      >
                                        <span className="font-normal text-gray-200">
                                          {subKey.replace(/_/g, " ")}:
                                        </span>
                                        <span className="ml-2 text-gray-100 font-bold">
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
          <p className="text-gray-300">No numeric summary available.</p>
        )}
      </div>

      {/* Categorical Summary Section */}
      <div
        className="lg:col-span-3 p-6 rounded-2xl shadow-lg border border-[#4d4d4d] transition-all duration-300 hover:scale-[1.01]
    bg-gradient-to-br from-[#2d2e31] to-[#262626] hover:border-purple-400"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-white">
          <VscLayers className="text-purple-400 text-2xl" />
          <span>Categorical Summary</span>
        </h2>
        {data.categorical_summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.categorical_summary).map(
              ([metricName, summaryData]) => (
                <div
                  key={metricName}
                  className="bg-[#2d2e31] p-4 rounded-lg transition-all duration-300 
                        hover:bg-[#3d3e41] hover:scale-105 hover:shadow-2xl hover:shadow-[#4d4d4d]/40 
                        border border-[#4d4d4d] hover:border-purple-500/60 
                        group cursor-pointer transform-gpu"
                >
                  <div className="relative transform-gpu transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="text-lg font-bold mb-3 text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
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
                            <div key={key}>
                              <p className="text-gray-300 font-medium mb-1 group-hover:text-purple-200 transition-colors duration-300">
                                Top Values:
                              </p>
                              <ul className="space-y-0.5">
                                {Object.entries(value).map(([label, count]) => (
                                  <li
                                    key={label}
                                    className="flex justify-between items-center text-gray-300 
                                         group-hover:text-white transition-colors duration-200"
                                  >
                                    <span className="truncate max-w-[60%] group-hover:font-medium transition-all duration-300">
                                      {label}
                                    </span>
                                    <span
                                      className="font-semibold text-white group-hover:text-purple-300 
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
                                 group-hover:bg-[#4d4d4d]/30 group-hover:px-2 group-hover:-mx-2 group-hover:rounded 
                                 transition-all duration-200"
                          >
                            <span className="font-medium text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <span
                              className="text-white font-semibold group-hover:text-purple-300 
                                       group-hover:scale-110 transition-all duration-200"
                            >
                              {String(value)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-gray-300">No categorical summary available.</p>
        )}
      </div>
    </div>
  );
};

export default DataSummary;
