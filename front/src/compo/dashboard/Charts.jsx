// Charts.jsx
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { VscGraph } from "react-icons/vsc";
import { FaFilter } from "react-icons/fa";
import axios from "axios";

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

// Reusable Slicer component
const Slicer = ({ label, options, selectedValue, onValueChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {label}:
      </label>
      <select
        value={selectedValue}
        onChange={(e) => onValueChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-800"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const Charts = ({ charts: initialCharts, slicers, uploadedFile }) => {
  const [selectedSlicers, setSelectedSlicers] = useState({});
  const [filteredCharts, setFilteredCharts] = useState(initialCharts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize selected slicer values with the first option
  useEffect(() => {
    if (slicers) {
      const initialSlicers = {};
      Object.keys(slicers).forEach((key) => {
        if (slicers[key] && slicers[key].length > 0) {
          initialSlicers[key] = slicers[key][0];
        }
      });
      setSelectedSlicers(initialSlicers);
      setFilteredCharts(initialCharts); // Reset charts when initialCharts change
    }
  }, [slicers, initialCharts]);

  // Main filtering logic: call the backend API
  useEffect(() => {
    const fetchFilteredCharts = async () => {
      // Don't fetch if there are no slicers or no file has been uploaded
      if (!slicers || Object.keys(slicers).length === 0 || !uploadedFile) {
        setFilteredCharts(initialCharts);
        return;
      }

      setLoading(true);
      setError(null);
      const formData = new FormData();

      // Append the original file to the form data
      formData.append("file", uploadedFile, uploadedFile.name);

      // Append the filters as a JSON string
      formData.append("filters", JSON.stringify(selectedSlicers));

      try {
        const response = await axios.post(
          "http://localhost:3000/filter_charts", // Ensure this URL is correct
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        // The server sends back the fully filtered and decoded data
        setFilteredCharts(response.data.charts);
      } catch (err) {
        console.error("Failed to fetch filtered charts:", err);
        setError("Failed to apply filters. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCharts();
  }, [selectedSlicers, uploadedFile, initialCharts]);

  const handleSlicerChange = (slicerKey, value) => {
    setSelectedSlicers((prev) => ({
      ...prev,
      [slicerKey]: value,
    }));
  };

  const hasSlicers = slicers && Object.keys(slicers).length > 0;

  return (
    <div className="space-y-6">
      {/* Slicers Section */}
      {hasSlicers && (
        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <span>Filters</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(slicers).map(([slicerKey, slicerOptions]) => (
              <Slicer
                key={slicerKey}
                label={slicerKey}
                options={slicerOptions}
                selectedValue={selectedSlicers[slicerKey]}
                onValueChange={(value) => handleSlicerChange(slicerKey, value)}
              />
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-center text-gray-500">Loading charts...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Charts Section */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(filteredCharts || {}).map(([chartKey, chartConfig]) => {
            if (!chartConfig.data || !chartConfig.layout) return null;

            const updatedData = chartConfig.data.map((trace) => {
              const newTrace = { ...trace };

              // Apply color palette
              if (newTrace.type === "bar" || newTrace.type === "pie" || newTrace.type === "histogram") {
                newTrace.marker = { ...newTrace.marker, color: colorPalette };
              } else if (newTrace.type === "scatter" && newTrace.mode && newTrace.mode.includes("lines")) {
                newTrace.line = { ...newTrace.line, color: colorPalette[3] };
                newTrace.name = trace.name || "Line Chart";
              } else if (newTrace.type === "scatter") {
                newTrace.marker = { ...newTrace.marker, color: colorPalette[2] };
                newTrace.name = trace.name || "Scatter Plot";
              }
              
              return newTrace;
            });

            const isBarChart = updatedData[0]?.type === "bar";
            const chartClassName = isBarChart ? "col-span-1 md:col-span-2" : "";

            return (
              <div
                key={chartKey}
                className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-[1.02] ${chartClassName}`}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <VscGraph className="text-blue-500 text-2xl" />
                  <span>
                    {updatedData[0]?.type.charAt(0).toUpperCase() +
                      updatedData[0]?.type.slice(1)}{" "}
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
      )}
    </div>
  );
};

export default Charts;