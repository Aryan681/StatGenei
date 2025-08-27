// Charts.js
import React from "react";
import Plot from "react-plotly.js";
import { VscGraph } from "react-icons/vsc";
import { decodeBase64Array } from "../dashboard/utils/DecodeData";

// New color palette with shades of lavender, blue, and gold
const colorPalette = [
  "#8A2BE2", // Blue Violet (a dark lavender)
  "#6A5ACD", // Slate Blue
  "#1E90FF", // Dodger Blue
  "#4682B4", // Steel Blue
  "#B8860B", // Dark Goldenrod
  "#FFD700", // Gold
  "#F0E68C", // Khaki (a lighter gold shade)
  "#9370DB", // Medium Purple (a lighter lavender)
  "#6495ED", // Cornflower Blue
];

const Charts = ({ charts }) => {
  if (!charts || Object.keys(charts).length === 0) {
    return null;
  }

  // Find the bar chart key to give it a full-width class
  const barChartKey = Object.keys(charts).find(key => charts[key].data[0].type === 'bar');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(charts).map(([chartKey, chartConfig]) => {
        if (!chartConfig.data || !chartConfig.layout) return null;

        const updatedData = chartConfig.data.map((trace, traceIndex) => {
          const newTrace = { ...trace };

          if (
            newTrace.type === "bar" ||
            newTrace.type === "pie" ||
            newTrace.type === "histogram"
          ) {
            newTrace.marker = { ...newTrace.marker, color: colorPalette };
          } else if (
            newTrace.type === "scatter" &&
            newTrace.mode &&
            newTrace.mode.includes("lines")
          ) {
            // Use a specific color for line charts
            newTrace.line = {
              ...newTrace.line,
              color: colorPalette[3], // Using Steel Blue for lines
            };
          } else if (newTrace.type === "scatter") {
            // Use a specific color for scatter plots
            newTrace.marker = {
              ...newTrace.marker,
              color: colorPalette[2], // Using Dodger Blue for markers
            };
          }

          if (newTrace.y && newTrace.y.bdata) {
            newTrace.y = decodeBase64Array(newTrace.y.bdata, newTrace.y.dtype);
          }
          if (newTrace.x && newTrace.x.bdata) {
            newTrace.x = decodeBase64Array(newTrace.x.bdata, newTrace.x.dtype);
          }

          return newTrace;
        });
        
        const isBarChart = updatedData[0].type === "bar";
        const chartClassName = isBarChart ? "col-span-1 md:col-span-2" : "";

        return (
          <div
            key={chartKey}
            className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-[1.02] ${chartClassName}`}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <VscGraph className="text-blue-500 text-2xl" />
              <span>
                {updatedData[0].type.charAt(0).toUpperCase() +
                  updatedData[0].type.slice(1)}{" "}
                Chart
              </span>
            </h2>
            <div className="w-full h-96">
              <Plot
                data={updatedData}
                layout={{
                  ...chartConfig.layout,
                  autosize: true,
                  margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
                }}
                config={{ responsive: true }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Charts;