import React, { useState, useEffect } from "react";
import { setStoredData, getStoredData } from "../compo/dashboard/utils/Storage";
import { uploadFileAndAnalyze } from "../compo/dashboard/utils/Api";
import FileUpload from "../compo/dashboard/FileUpload";
import KpiCards from "../compo/dashboard/Kpicard";
import Charts from "../compo/dashboard/Charts";
import DataStory from "../compo/dashboard/DataStory";
import DataSummary from "../compo/dashboard/DataSummary";
import Sidebar from "../bais/Siderbar";
import { FaDownload } from "react-icons/fa";
import "./dash.css";
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowUpTray,
} from "react-icons/hi2";
import { AiOutlineSearch } from "react-icons/ai";

const Dashboard = () => {
  const [data, setData] = useState(getStoredData);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State moved here

  const toggleSidebar = () => { // Function to toggle state
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    setStoredData(data);
  }, [data]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("dashboardData");
      localStorage.removeItem("dashboardDataTimestamp");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const responseData = await uploadFileAndAnalyze(file);
      setData(responseData);
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.error || "Failed to process the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen font-sans">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      {/* Main Content Area: Margin changes based on isSidebarCollapsed */}
      <div
        className={`flex-1 p-8 overflow-y-auto bg-[#212121d8] transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl bevan-regular mt-3 text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {data && (
              <>
                <div className="flex items-center space-x-2 text-sm"></div>
                <button
                  onClick={() => alert("Export functionality coming soon...")}
                  className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <HiOutlineArrowUpTray className="mr-2" />
                  Export file
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FaDownload className="mr-2" />
                  Import
                </button>
              </>
            )}
          </div>
        </div>
        {/* KPI Cards */}
        {data?.kpis && (
          <div className="pl-6 mb-8">
            <KpiCards kpis={data.kpis} theme="dark" />
          </div>
        )}
        {/* Charts & Summary */}
        <div className="space-y-6 mb-2">
          <div className="pl-6">
            {data?.charts && <Charts charts={data.charts} theme="dark" />}
          </div>
          <div className="p-6">
            {data && <DataSummary data={data} theme="dark" />}
          </div>
        </div>
        {/* Data Story */}
        {data?.data_story && (
          <div className="ml-8">
            <DataStory dataStory={data.data_story} theme="dark" />
          </div>
        )}
        {/* Empty state */}
        {!loading && !data && (
          <div className="text-center py-20">
            <div>
              <FileUpload
                onFileSelect={handleFileSelect}
                loading={loading}
                onUpload={handleUpload}
                theme="dark"
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="text-center py-16">
            <div className="spinner-border text-purple-600 mb-4" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-slate-400">Analyzing your data...</p>
          </div>
        )}
      </div>
      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className=" bg-[#212121d8] p-8 rounded-xl shadow-lg w-full max-w-lg border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Import File
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <FileUpload
              onFileSelect={handleFileSelect}
              loading={loading}
              onUpload={handleUpload}
              theme="dark"
            />
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;