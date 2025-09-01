import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { VscGraph, VscInfo } from "react-icons/vsc";
import { FaFilter } from "react-icons/fa";
import { getFilteredData } from "./utils/Api";

const colorPalette = [
  "#8A2BE2",
  "#6A5ACD",
  "#1E90FF",
  "#4682B4",
  "#B8860B",
  "#FFD700",
  "#F0E68C",
  "#9370DB",
  "#6495ED",
];

const Slicer = ({ label, options, selectedValue, onValueChange }) => (
  <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
      {label}:
    </label>
    <select
      value={selectedValue}
      onChange={(e) => onValueChange(e.target.value)}
      className="block w-full rounded-md border-gray-700 bg-[#2d2e31] text-white shadow-sm focus:border-purple-600 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
    >
      <option value="none">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const Charts = ({ charts: initialCharts, slicers, dataId }) => {
  const [selectedSlicers, setSelectedSlicers] = useState({});
  const [filteredCharts, setFilteredCharts] = useState(initialCharts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slicers) {
      const initSlicers = {};
      Object.keys(slicers).forEach((key) => {
        initSlicers[key] = "none";
      });
      setSelectedSlicers(initSlicers);
    }
    setFilteredCharts(initialCharts);
  }, [slicers, initialCharts]);

  useEffect(() => {
    const fetchFiltered = async () => {
      const filters = Object.entries(selectedSlicers)
        .filter(([_, value]) => value !== "none")
        .map(([field, value]) => ({ field, value }));
      
      if (!dataId || filters.length === 0) {
        setFilteredCharts(initialCharts);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getFilteredData(dataId, filters);
        setFilteredCharts(response.charts);
      } catch (err) {
        console.error("Failed to fetch filtered data:", err);
        setError("Failed to apply filters. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [selectedSlicers, dataId, initialCharts]);

  const handleSlicerChange = (key, value) =>
    setSelectedSlicers((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      {slicers && Object.keys(slicers).length > 0 && (
        <div className="bg-[#2d2e31] p-6 rounded-2xl shadow-inner border border-[#3E4044]">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <FaFilter className="text-purple-400" />
            <span>Filters</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(slicers).map(([key, options]) => (
              <Slicer
                key={key}
                label={key}
                options={options}
                selectedValue={selectedSlicers[key]}
                onValueChange={(val) => handleSlicerChange(key, val)}
              />
            ))}
          </div>
        </div>
      )}

      {loading && (
        <p className="text-center text-gray-400">Loading charts...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(filteredCharts || {}).map(([key, chartConfig]) => {
            if (
              !chartConfig ||
              !chartConfig.figure ||
              !chartConfig.figure.data ||
              chartConfig.figure.data.length === 0
            ) {
              return (
                <div
                  key={key}
                  className="bg-red-900/50 p-6 rounded-2xl shadow-lg border border-red-500 text-center"
                >
                  <p className="text-red-300">
                    Error: Could not render this chart.
                  </p>
                </div>
              );
            }

            const updatedData = chartConfig.figure.data.map((trace, idx) => {
              const t = { ...trace };
              if (t.type === "bar" || t.type === "pie") {
                t.marker = { ...t.marker, color: t.marker?.color || colorPalette[idx % colorPalette.length] };
              } else if (t.type === "line" || t.type === "scatter") {
                t.marker = { ...t.marker, color: t.marker?.color || colorPalette[idx % colorPalette.length] };
                t.line = { ...t.line, color: t.line?.color || colorPalette[idx % colorPalette.length] };
              }
              return t;
            });
            
            const chartTitle = chartConfig.figure.layout?.title?.text || `${key.charAt(0).toUpperCase() + key.slice(1)} Chart`;
            const chartSummary = chartConfig.summary || 'No summary available.';

            return (
              <div
                key={key}
                className="bg-gradient-to-br from-[#2d2e31] to-[#262626] p-6 rounded-2xl shadow-lg border border-[#3E4044]"
              >
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <VscGraph className="text-purple-400 text-2xl" />
                  <span>{chartTitle}</span>
                </h2>
                <div className="w-full h-96">
                  <Plot
                    data={updatedData}
                    layout={{
                      ...chartConfig.figure.layout,
                      autosize: true,
                      margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
                      plot_bgcolor: "transparent",
                      paper_bgcolor: "transparent",
                      font: {
                        color: "#ccc",
                        family: "sans-serif"
                      },
                      xaxis: {
                        ...chartConfig.figure.layout.xaxis,
                        gridcolor: '#444',
                        zerolinecolor: '#444',
                        color: '#ccc',
                      },
                      yaxis: {
                        ...chartConfig.figure.layout.yaxis,
                        gridcolor: '#444',
                        zerolinecolor: '#444',
                        color: '#ccc',
                      },
                    }}
                    config={{ responsive: true }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                
                <div className="mt-4 p-4 rounded-lg bg-gray-800 border border-gray-700 flex items-start space-x-3">
                  <VscInfo className="text-purple-400 text-xl flex-shrink-0 mt-1" />
                  <p className="text-gray-300 text-sm">
                    {chartSummary}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Charts;