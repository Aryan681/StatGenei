import React, { useState } from "react";
import { VscLayers, VscCloudUpload } from "react-icons/vsc";

// Set a constant for the file size limit (20 MB)
const FILE_SIZE_LIMIT_MB = 20;
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MB * 1024 * 1024;

const FileUpload = ({ onFileSelect, loading, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateAndSetFile = (selectedFile) => {
    // Check if a file was selected
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    // Check file size
    if (selectedFile.size > FILE_SIZE_LIMIT_BYTES) {
      setError(`File size exceeds the limit of ${FILE_SIZE_LIMIT_MB}MB.`);
      setFile(null); // Clear the file state
      setIsUploading(false); // Stop any upload indication
      onFileSelect(null); // Notify parent component of invalid file
      return;
    }

    // File is valid, proceed
    setFile(selectedFile);
    onFileSelect(selectedFile);
    setError(null);
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 1500);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
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
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
      e.dataTransfer.clearData();
    }
  };

  const handleUploadClick = () => {
    // Only proceed if a valid file is selected and no error exists
    if (file && !error) {
      setIsUploading(true);
      onUpload();
      setTimeout(() => setIsUploading(false), 2000);
    }
  };

  return (
    <div
      className={`p-8 rounded-2xl shadow-lg border hover:border-purple-900  mb-10 transition-all duration-500 backdrop-blur-sm bg-gradient-to-br from-[#2d2e31] to-[#262626]`}
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2 text-white">
        <VscLayers className="text-purple-400" />
        <span>Upload Your File</span>
      </h2>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer relative overflow-hidden
          ${
            isDragging
              ? "border-purple-500 bg-purple-900/50 scale-105"
              : "border-purple-800 hover:bg-purple-900/40"
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <VscCloudUpload
          className={`mx-auto w-12 h-12 mb-2 transition-all duration-300 text-purple-400 ${
            isDragging ? "scale-125 animate-bounce" : ""
          }`}
        />

        <p className="font-medium transition-colors duration-300 text-gray-300">
          <span className="text-purple-300 font-bold">Drag and drop</span> your
          file here or{" "}
          <label
            htmlFor="file-upload"
            className="underline cursor-pointer text-purple-500 hover:text-purple-400"
          >
            click to upload
          </label>
        </p>

        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept="*"
          className="hidden"
        />

        {file && (
          <p className="mt-2 text-sm font-semibold transition-all duration-300 text-purple-300">
            File Selected: <span className="text-white">{file.name}</span>
          </p>
        )}
      </div>

      <button
        onClick={handleUploadClick}
        disabled={loading || !file || error}
        className={`mt-6 w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden
          ${
            loading
              ? "bg-gray-500/80 cursor-not-allowed text-gray-300"
              : !file || error
              ? "bg-black/60 cursor-not-allowed text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
            <div
              className="w-4 h-4 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-4 h-4 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <span className="ml-2">Processing...</span>
          </div>
        ) : (
          <span className="flex items-center justify-center">Analyze Data</span>
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 rounded-lg text-center font-medium text-sm animate-shake bg-red-900/70 border border-red-500 text-red-100">
          ⚠️ {error}
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FileUpload;