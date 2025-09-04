
import React, { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses =
    "fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg backdrop-blur-md transition-all transform duration-300";
  const glassClasses =
    "bg-white/20 border border-white/30"; 

  return (
    <div className={`${baseClasses} ${glassClasses}`}>
      <div className="flex items-center space-x-3 text-white">
        {type === "success" ? (
          <FaCheckCircle className="text-xl text-green-400" />
        ) : (
          <FaExclamationCircle className="text-xl text-red-400" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white text-opacity-70 hover:text-opacity-100 font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
