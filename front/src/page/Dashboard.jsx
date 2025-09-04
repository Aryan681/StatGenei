// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { setStoredData, getStoredData } from "../compo/dashboard/utils/Storage";
import {
  uploadFileAndAnalyze,
  getFilteredData,
  downloadReport,
} from "../compo/dashboard/utils/Api";
import FileUpload from "../compo/dashboard/FileUpload";
import KpiCards from "../compo/dashboard/Kpicard";
import Charts from "../compo/dashboard/Charts";
import DataStory from "../compo/dashboard/DataStory";
import DataSummary from "../compo/dashboard/DataSummary";
import Sidebar from "../bais/Siderbar";
import { FaDownload } from "react-icons/fa";
import { HiOutlineAdjustmentsHorizontal, HiOutlineArrowUpTray } from "react-icons/hi2";
import Toast from "../compo/dashboard/Toaster";
import Loader from "../bais/Loader";
import FilterModal from "../compo/dashboard/FilterSlicer";
import "./dash.css"
const Dashboard = () => {
  const [data, setData] = useState(getStoredData);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  useEffect(() => setStoredData(data), [data]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("dashboardData");
      localStorage.removeItem("dashboardDataTimestamp");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleFileSelect = (selectedFile) => setFile(selectedFile);
  
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
    
    setToast({ type: "success", message: "File uploaded and analyzed successfully!" });
  } catch (err) {
    console.error("API Error:", err);
    setError(err.response?.data?.error || "Failed to process the file.");
    setToast({ type: "error", message: err.response?.data?.error || "Failed to process the file." });
  } finally {
    // This block runs after try or catch.
    // Ensure the modal closes and loading state resets here.
    setLoading(false);
    setIsUploadModalOpen(false); // ✅ Move this line here
  }
};

  const handleApplyFilters = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const filteredData = await getFilteredData(data.job_id, filters);
      setData(filteredData);
      setIsFilterModalOpen(false);
    } catch (err) {
      console.error("Filter API Error:", err);
      setError(err.response?.data?.error || "Failed to apply filters.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!data?.job_id) {
      setError("No data loaded. Please upload a file first.");
      return;
    }

    setError(null);
    setDownloadLoading(true);

    try {
      await downloadReport(data.job_id, data.active_filters);
      setToast({ type: "success", message: "Report downloaded successfully!" });
    } catch (err) {
      console.error("Download Error:", err);
      setToast({ type: "error", message: "Failed to download the report." });
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen font-sans">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <div
        className={`flex-1 p-8 overflow-y-auto bg-[#212121d8] transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl bevan-regular mt-3 text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {data && (
              <>
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <HiOutlineAdjustmentsHorizontal className="mr-2" />
                  Filter
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloadLoading}
                  className={`flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${
                    downloadLoading ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {downloadLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <HiOutlineArrowUpTray className="mr-2" />
                      Export file
                    </>
                  )}
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

        {loading ? (
          <Loader />
        ) : (
          <>
            {data?.kpis && (
              <div className="pl-6 mb-8">
                <KpiCards kpis={data.kpis} theme="dark" />
              </div>
            )}
            <div className="space-y-6 mb-2">
              <div className="pl-6">{data?.charts && <Charts charts={data.charts} theme="dark" />}</div>
              <div className="p-6">{data && <DataSummary data={data} theme="dark" />}</div>
            </div>
            {data?.data_story && (
              <div className="ml-8">
                <DataStory dataStory={data.data_story} theme="dark" />
              </div>
            )}
            {!data && (
              <div className="text-center py-20">
                <FileUpload onFileSelect={handleFileSelect} loading={loading} onUpload={handleUpload} theme="dark" />
              </div>
            )}
          </>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setIsUploadModalOpen(false)}>
          <div className="bg-[#212121d8] p-8 rounded-xl shadow-lg w-full max-w-lg border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Import File</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <FileUpload onFileSelect={handleFileSelect} loading={loading} onUpload={handleUpload} theme="dark" />
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <FilterModal
          slicers={data?.slicers}
          activeFilters={data?.active_filters}
          onApply={handleApplyFilters}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Dashboard;