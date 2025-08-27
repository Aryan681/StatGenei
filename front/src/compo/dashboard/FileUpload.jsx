import React, { useState } from "react";
import { VscLayers, VscCloudUpload } from "react-icons/vsc";

const FileUpload = ({ onFileSelect, loading, onUpload, theme = "default" }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const isGenieTheme = theme === "genie";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
        setError(null);
        // Trigger success animation
        setIsUploading(true);
        setTimeout(() => setIsUploading(false), 1500);
      } else {
        setError('Only CSV files are allowed.');
        setFile(null);
        onFileSelect(null);
      }
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // FIX: Prevent default behavior that might cause downloading
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    // FIX: Check if files are available and prevent download behavior
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
      
      // FIX: Clear the data transfer to prevent any download behavior
      e.dataTransfer.clearData();
    }
  };

  const handleUploadClick = () => {
    setIsUploading(true);
    onUpload();
    // Reset animation after 2 seconds
    setTimeout(() => setIsUploading(false), 2000);
  };

  return (
    <div className={`p-8 rounded-2xl shadow-2xl border mb-10 transition-all duration-500 backdrop-blur-sm
      ${isGenieTheme 
        ? "bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-purple-500/60 shadow-lg shadow-purple-500/20" 
        : "bg-white border-gray-100"
      }`}>
      
      <h2 className={`text-2xl font-semibold mb-4 flex items-center space-x-2
        ${isGenieTheme ? "text-yellow-300 drop-shadow-md" : "text-gray-700"}`}>
        <VscLayers className={isGenieTheme ? "text-yellow-400 animate-pulse" : "text-blue-500"} />
        <span>{isGenieTheme ? "✨ Rub the Magic Lamp ✨" : "Upload Your CSV File"}</span>
      </h2>

      {/* Magical upload area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer relative overflow-hidden
          ${isDragging 
            ? isGenieTheme 
              ? "border-yellow-400 bg-yellow-500/30 scale-105 shadow-inner shadow-yellow-400/30" 
              : "border-blue-500 bg-blue-50" 
            : isGenieTheme 
              ? "border-purple-400/60 bg-purple-900/40 hover:bg-purple-800/50 backdrop-blur-sm" 
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Magic particles during drag */}
        {isDragging && isGenieTheme && (
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: Math.random() * 8 + 4 + 'px',
                  height: Math.random() * 8 + 4 + 'px',
                  background: `radial-gradient(circle, ${Math.random() > 0.5 ? '#FFD700' : '#00FFFF'}, transparent)`,
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 2 + 's',
                  animationDuration: Math.random() * 3 + 2 + 's'
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Success animation */}
        {isUploading && isGenieTheme && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 animate-pulse rounded-xl"></div>
        )}

        <VscCloudUpload className={`mx-auto w-12 h-12 mb-2 transition-all duration-300
          ${isGenieTheme 
            ? `text-yellow-400 ${isDragging ? "scale-125 animate-bounce" : "drop-shadow-md"}` 
            : "text-blue-500"
          }`} />

        <p className={`font-medium transition-colors duration-300
          ${isGenieTheme ? "text-purple-100 drop-shadow-sm" : "text-gray-600"}`}>
          <span className={isGenieTheme ? "text-yellow-300 font-bold drop-shadow-md" : "text-blue-600 font-bold"}>
            {isGenieTheme ? "✨ Summon your data ✨" : "Drag and drop"}
          </span>{" "}
          your CSV file here or{" "}
          <label htmlFor="file-upload" className={`underline cursor-pointer
            ${isGenieTheme ? "text-cyan-300 hover:text-cyan-200 drop-shadow-sm" : "text-blue-600 hover:text-blue-800"}`}>
            click to upload
          </label>
        </p>

        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
        />

        {file && (
          <p className={`mt-2 text-sm font-semibold transition-all duration-300
            ${isGenieTheme ? "text-yellow-300 animate-pulse drop-shadow-md" : "text-gray-800"}`}>
            📜 Magical Scroll: <span className={isGenieTheme ? "text-white drop-shadow-md" : ""}>{file.name}</span>
          </p>
        )}
      </div>

      {/* Magic upload button */}
      <button
        onClick={handleUploadClick}
        disabled={loading || !file}
        className={`mt-6 w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden
          ${loading 
            ? "bg-gray-500/80 cursor-not-allowed text-gray-300" 
            : !file 
              ? "bg-gray-600/80 cursor-not-allowed text-gray-400" 
              : isGenieTheme
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 shadow-lg shadow-yellow-500/40 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <span className="ml-2">{isGenieTheme ? "Conjuring Insights..." : "Processing..."}</span>
          </div>
        ) : (
          <span className="flex items-center justify-center">
            {isGenieTheme ? "🔮 Reveal Magical Insights" : "Analyze Data"}
          </span>
        )}

        {/* Button glow effect */}
        {!loading && file && isGenieTheme && (
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-15 transition-opacity duration-300 rounded-xl"></div>
        )}
      </button>

      {/* Error message with magical shake */}
      {error && (
        <div className={`mt-4 p-3 rounded-lg text-center font-medium text-sm animate-shake
          ${isGenieTheme ? "bg-red-900/70 border border-red-500 text-red-100 drop-shadow-md" : "bg-red-100 text-red-700"}`}>
          ⚠️ {error}
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default FileUpload;