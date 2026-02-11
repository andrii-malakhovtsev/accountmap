import React, { useRef, useState, useEffect } from "react";
import AddAccount from "./AddAccount";
import AddConnection from "./AddConnection";
import { parseCSV } from "../src/utils/csvParser";
import updateDataStore from "../src/store/updateDataStore";

const Header = ({
  isSidebarOpen,
  setIsSidebarOpen,
  currentView,
  setCurrentView,
  hasData,
  onAddAccount,
  onAddConnection
}) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const { uploadBulkAccounts } = updateDataStore();
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthStatus, setHealthStatus] = useState("waking");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && !selectedFile.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file");
      event.target.value = "";
      return;
    }

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    if (!file) return;

    parseCSV(file)
      .then((csvData) => {
        uploadBulkAccounts(csvData);
      })
      .catch((error) => {
        console.error("Error parsing CSV:", error);
        alert("Failed to parse CSV file");
      });
  }, [file, uploadBulkAccounts]);

  useEffect(() => {
    const checkRelay = async () => {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ping`, { 
          signal: controller.signal 
        });
        
        clearTimeout(id);
        if (response.ok) setHealthStatus("online");
      } catch (err) {
        setHealthStatus("waking");
      }
    };

    checkRelay();
    const interval = setInterval(checkRelay, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null); 
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai,analyze`, {
        method: 'GET',
      });
      
      if (!response.ok) throw new Error("Analysis failed");
      
      const data = await response.text(); 
      setAnalysisResult(data);
    } catch (err) {
      setAnalysisResult("Failed to retrieve analysis. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <header className="h-20 min-h-[80px] flex-shrink-0 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 z-[60] relative">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <h2 className="font-black text-2xl tracking-tighter text-blue-500 uppercase">
            AccountMap 
            <span className="text-xs text-red-600 uppercase ml-1 font-bold">
              demo
            </span>
          </h2>

          <div className="group relative flex items-center mt-1">
            <div 
              className={`h-2 w-2 rounded-full transition-all duration-500 shadow-sm cursor-help ${
                healthStatus === "online" 
                  ? "bg-green-500 shadow-green-500/40"
                  : "bg-red-500 animate-pulse shadow-red-500/40"
              }`} 
            />
            
            <div className="absolute top-6 left-0 w-64 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[70] text-[10px] leading-relaxed normal-case tracking-normal">
              <p className={`font-black uppercase tracking-widest mb-2 ${healthStatus === "online" ? "text-green-400" : "text-red-400"}`}>
                Relay: {healthStatus === "online" ? "Ready & Secure" : "Initializing Engine"}
              </p>
              <p className="text-gray-400 font-medium">
                {healthStatus === "online" 
                  ? "The zero-knowledge relay is active. Handshakes will be near-instant."
                  : "The privacy engine is spinning up on a secure instance. This usually takes ~50s for cold starts."
                }
                <span className="text-white block mt-1">
                  Your local data is currently safe and accessible regardless of relay status.
                </span>
              </p>
            </div>
          </div>
        </div>

        {hasData && (
          <div className="flex items-center gap-3 border-l border-white/10 pl-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <AddAccount onClick={onAddAccount} variant="header" />
            <AddConnection onClick={onAddConnection} variant="header" />

            <button
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 rounded-lg text-[10px] font-black tracking-widest transition uppercase"
              onClick={handleUploadClick}
            >
              <span className="text-blue-400">📥</span>
              Upload CSV
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black tracking-widest transition uppercase ${
                isAnalyzing ? "text-blue-300 animate-pulse" : "text-gray-400 hover:bg-white/10"
              }`}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              <span className="text-blue-400">{isAnalyzing ? "⌛" : "✨"}</span>
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      {analysisResult && (
        <div className="absolute top-[85px] left-8 right-8 bg-blue-600/10 border border-blue-500/30 backdrop-blur-md p-3 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <p className="text-[11px] font-medium text-blue-100 italic">
            <span className="font-black mr-2">RESULT:</span> {analysisResult}
          </p>
          <button 
            onClick={() => setAnalysisResult(null)}
            className="text-blue-400 hover:text-white transition-colors p-1"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-4">
        {hasData && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex bg-black/40 rounded-xl p-1.5 border border-white/5">
              <button
                onClick={() => setCurrentView("map")}
                className={`px-6 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition uppercase ${
                  currentView === "map" 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setCurrentView("list")}
                className={`px-6 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition uppercase ${
                  currentView === "list" 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                List
              </button>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`px-5 py-2.5 rounded-xl transition text-[10px] font-black tracking-widest uppercase border ${
                isSidebarOpen 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {isSidebarOpen ? "Close Menu ✕" : "☰ Menu"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;