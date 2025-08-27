import React, { useState, useEffect, useRef } from "react";
import { setStoredData, getStoredData } from "../compo/dashboard/utils/Storage";
import { uploadFileAndAnalyze } from "../compo/dashboard/utils/Api";
import FileUpload from "../compo/dashboard/FileUpload";
import KpiCards from "../compo/dashboard/Kpicard";
import DataSummary from "../compo/dashboard/DataSummary";
import DataStory from "../compo/dashboard/DataStory";
import Charts from "../compo/dashboard/Charts";

const Dashboard = () => {
  const [data, setData] = useState(getStoredData);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [smokeVisible, setSmokeVisible] = useState(false);
  const backgroundRef = useRef(null);
  const parallaxElementsRef = useRef([]);

  useEffect(() => {
    setStoredData(data);
  }, [data]);

  useEffect(() => {
    if (data) {
      setSmokeVisible(true);
      const timer = setTimeout(() => setSmokeVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [data]); // New useEffect to handle parallax with requestAnimationFrame

  useEffect(() => {
    if (backgroundRef.current) {
      parallaxElementsRef.current =
        backgroundRef.current.querySelectorAll(".parallax");
    }

    let animationFrameId;
    let lastScrollY = window.scrollY;
    let currentScrollY = window.scrollY;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const updateParallax = () => {
      currentScrollY = window.scrollY;
      lastScrollY = lerp(lastScrollY, currentScrollY, 0.2); // smooth motion

      parallaxElementsRef.current.forEach((element) => {
        const speed = parseFloat(element.getAttribute("data-speed")) || 0.5;
        const yPos = -(lastScrollY * speed);

        // Only apply translateY, keep CSS animations intact
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    animationFrameId = requestAnimationFrame(updateParallax);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.error || "Failed to process the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen p-8 font-sans relative overflow-hidden"
      ref={backgroundRef}
    >
      
            {/* Main Background with Parallax */}     {" "}
      <div
        className="absolute  inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 parallax"
        data-speed="0.1"
        style={{ willChange: "transform", height: "950vh" }}
      ></div>
            {/* Animated Magic Particles with Parallax */}     {" "}
      <div className="absolute inset-0 overflow-hidden">
               {" "}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float parallax"
            data-speed={0.2 + Math.random() * 0.3} // Different speeds for depth
            style={{
              width: Math.random() * 12 + 3 + "px",
              height: Math.random() * 12 + 3 + "px",
              background: `radial-gradient(circle, ${
                Math.random() > 0.5 ? "#FFD700" : "#00FFFF"
              }, transparent)`,
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.random() * 15 + 15 + "s",
              opacity: Math.random() * 0.6 + 0.2,
              willChange: "transform",
            }}
          ></div>
        ))}
             {" "}
      </div>
            {/* Floating Magic Carpets with Parallax */}     {" "}
      <div
        className="absolute top-20 left-5% opacity-40 animate-float-slow parallax"
        data-speed="0.3"
      >
               {" "}
        <div className="w-24 h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg transform rotate-12">
                   {" "}
          <div className="h-2 bg-yellow-500 rounded-full mt-2 mx-2"></div>     
              <div className="h-2 bg-yellow-500 rounded-full mt-1 mx-4"></div> 
               {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div
        className="absolute bottom-30 right-10% opacity-40 animate-float-slower parallax"
        data-speed="0.4"
      >
               {" "}
        <div className="w-20 h-10 bg-gradient-to-r from-teal-600 to-blue-500 rounded-lg transform -rotate-6">
                   {" "}
          <div className="h-2 bg-cyan-300 rounded-full mt-2 mx-2"></div>       
            <div className="h-2 bg-cyan-300 rounded-full mt-1 mx-4"></div>     
           {" "}
        </div>
             {" "}
      </div>
            {/* Decorative Arabian Lamps with Parallax */}     {" "}
      <div
        className="absolute left-5 top-1/4 transform -translate-y-1/2 parallax"
        data-speed="0.15"
      >
               {" "}
        <div className="w-20 h-28 bg-gradient-to-b from-yellow-500 via-orange-500 to-red-600 rounded-t-full relative">
                   {" "}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-yellow-300 rounded-full animate-pulse-glow"></div>
                   {" "}
          <div className="absolute bottom-0 w-full h-6 bg-yellow-700 rounded-b-lg"></div>
                   {" "}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-600 rounded-full"></div>
                   {" "}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-yellow-800 rounded-t-sm">
                       {" "}
            <div className="w-10 h-1 bg-yellow-600 mx-auto mt-1"></div>         {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="absolute right-5 bottom-1/4 parallax" data-speed="0.25">
               {" "}
        <div className="w-16 h-24 bg-gradient-to-b from-blue-400 via-purple-500 to-indigo-600 rounded-t-full relative">
                   {" "}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-300 rounded-full animate-pulse-glow-slow"></div>
                   {" "}
          <div className="absolute bottom-0 w-full h-5 bg-blue-800 rounded-b-lg"></div>
                   {" "}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-blue-900 rounded-t-sm">
                        <div className="w-8 h-1 bg-blue-600 mx-auto mt-1"></div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
            {/* Magical Smoke Effect when data appears */}     {" "}
      {smokeVisible && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none parallax"
          data-speed="0.05"
        >
                   {" "}
          <div className="animate-smoke">
                       {" "}
            <div className="w-64 h-64 bg-gradient-to-b from-white/10 to-transparent rounded-full filter blur-xl"></div>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
            {/* Animated Stars with Parallax */}     {" "}
      <div className="absolute inset-0">
               {" "}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle parallax"
            data-speed={0.1 + Math.random() * 0.2}
            style={{
              width: "4px",
              height: "4px",
              background: "#FFD700",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 2 + 1 + "s",
              willChange: "transform, opacity",
            }}
          ></div>
        ))}
             {" "}
      </div>
           {" "}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          33% { transform: translateY(-15px) rotate(5deg) scale(1.05); }
          66% { transform: translateY(-25px) rotate(-5deg) scale(0.95); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-15px) rotate(-8deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5),
                         0 0 40px rgba(255, 215, 0, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8),
                         0 0 80px rgba(255, 215, 0, 0.6),
                         0 0 120px rgba(255, 215, 0, 0.4);
          }
        }
        @keyframes pulse-glow-slow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.5),
                         0 0 30px rgba(0, 255, 255, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.8),
                         0 0 60px rgba(0, 255, 255, 0.6),
                         0 0 90px rgba(0, 255, 255, 0.4);
          }
        }
        @keyframes smoke {
          0% { 
            opacity: 0;
            transform: scale(0.5) translateY(100px);
            filter: blur(10px);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.2) translateY(-50px);
            filter: blur(20px);
          }
          100% { 
            opacity: 0;
            transform: scale(2) translateY(-200px);
            filter: blur(40px);
          }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 15s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-pulse-glow-slow { animation: pulse-glow-slow 4s ease-in-out infinite; }
        .animate-smoke { animation: smoke 3s ease-out forwards; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
      `}</style>
           {" "}
      <div className="max-w-7xl mx-auto relative z-10">
                {/* Animated Header with Magic Lamp */}       {" "}
        <div className="text-center mb-12 relative">
                   {" "}
          <div className="inline-block mt-18 relative animate-bounce-slow">
                       {" "}
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-purple-300 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                            StatGenie{" "}
              <span role="img" aria-label="genie">
                🧞‍♂️
              </span>
                         {" "}
            </h1>
                     {" "}
          </div>
                   {" "}
          <p className="text-center text-purple-200 mb-10 text-lg font-light animate-pulse">
                        ✨ Your wish for data insights is my command! ✨        
             {" "}
          </p>
                 {" "}
        </div>
               {" "}
        <FileUpload
          onFileSelect={handleFileSelect}
          loading={loading}
          onUpload={handleUpload}
          theme="genie"
        />
               {" "}
        {loading && (
          <div className="text-center py-16">
                       {" "}
            <div className="inline-flex items-center justify-center space-x-3 mb-4">
                           {" "}
              <div className="w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                           {" "}
              <div
                className="w-6 h-6 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
                           {" "}
              <div
                className="w-6 h-6 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
                         {" "}
            </div>
                       {" "}
            <p className="text-purple-200 text-xl font-medium">
                            The Genie is conjuring insights from your data...  
                       {" "}
            </p>
                       {" "}
            <div className="mt-4 w-48 h-2 bg-purple-700 rounded-full mx-auto overflow-hidden">
                           {" "}
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-progress"></div>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
               {" "}
        {error && (
          <div className="bg-red-900/50 border border-red-600 rounded-lg p-6 text-center mb-8 transform animate-shake">
                       {" "}
            <p className="text-red-200 font-medium text-lg">{error}</p>         {" "}
          </div>
        )}
               {" "}
        {data && (
          <div className="space-y-10 animate-fade-in-up">
                        <KpiCards kpis={data.kpis} theme="genie" />
                        <DataSummary data={data} theme="genie" />
                        <Charts charts={data.charts} theme="genie" />
                        <DataStory dataStory={data.data_story} theme="genie" /> 
                   {" "}
          </div>
        )}
               {" "}
        {!loading && !data && (
          <div className="text-center py-20">
                       {" "}
            <div className="w-28 h-36 bg-gradient-to-b from-blue-400 to-purple-600 rounded-t-full mx-auto mb-8 relative opacity-70 animate-float">
                           {" "}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-cyan-200 rounded-full animate-pulse-glow-slow"></div>
                           {" "}
              <div className="absolute bottom-0 w-full h-10 bg-blue-800 rounded-b-lg"></div>
                           {" "}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-700 rounded-full"></div>
                           {" "}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-blue-900 rounded-t-sm">
                               {" "}
                <div className="w-16 h-1 bg-blue-600 mx-auto mt-3"></div>       
                     {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <p className="text-purple-200 text-xl mb-2">
                            Rub the magical lamp by uploading your data...      
                   {" "}
            </p>
                       {" "}
            <p className="text-purple-300 animate-pulse">
                            ✨ Discover hidden treasures in your datasets ✨    
                     {" "}
            </p>
                     {" "}
          </div>
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default Dashboard;
