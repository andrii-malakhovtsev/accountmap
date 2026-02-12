import React, { useState, useEffect } from "react";
import AddAccount from "./AddAccount";
import AddConnection from "./AddConnection";
import UploadCSV from "./UploadCSV";
import AnalyzeButton from "./AnalyzeButton";
import NavButton from "./NavButton"; 
import SeriousIcons from "../SeriousIcons";

const Header = ({
  isSidebarOpen,
  setIsSidebarOpen,
  currentView,
  setCurrentView,
  hasData,
  is3D,        
  setIs3D,     
  onAddAccount,
  onAddConnection
}) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [healthStatus, setHealthStatus] = useState("waking");

  useEffect(() => {
    const checkRelay = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ping`);
        if (response.ok) setHealthStatus("online");
      } catch (err) { setHealthStatus("waking"); }
    };
    checkRelay();
    const interval = setInterval(checkRelay, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleView = () => setCurrentView(currentView === "map" ? "list" : "map");
  const toggleDimension = () => setIs3D(!is3D);

  return (
    <header className="flex-shrink-0 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10 flex flex-col z-[60] relative">
      <div className="h-20 min-h-[80px] flex items-center px-6 md:px-8 relative">
        {/* Brand / Logo Section */}
        <div className="flex items-center gap-3 md:relative absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 whitespace-nowrap">
          <h2 className="font-black text-xl md:text-2xl tracking-tighter text-blue-500 uppercase flex items-center">
            AccountMap 
            <span className="text-[10px] md:text-xs text-red-600 uppercase ml-1 font-bold">demo</span>
          </h2>
          <div className={`h-2 w-2 rounded-full ${healthStatus === "online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500 animate-pulse"}`} />
        </div>

        {/* Desktop Toolbar - Left Side Actions */}
        <div className="hidden md:flex items-center gap-6 flex-1 ml-8">
          {hasData && (
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <AddAccount onClick={onAddAccount} variant="header" />
              <AddConnection onClick={onAddConnection} variant="header" />
              <div className="h-6 border-r border-white/10 mx-1" />
              <UploadCSV />
              <AnalyzeButton onResult={setAnalysisResult} />
            </div>
          )}
        </div>

        {/* Desktop Toolbar - Right Side View Controls */}
        <div className="hidden md:flex items-center gap-3">
          {hasData && (
            <>
              <NavButton 
                onClick={toggleDimension}
                disabled={currentView === "list"}
                disabledLabel="Map Only"
                disabledSubtext="Switch back to Map View to change dimensions."
                icon={is3D ? SeriousIcons.TwoD : SeriousIcons.ThreeD} 
                label={is3D ? "Switch to 2D" : "Switch to 3D"}
                subtext="Change the map perspective."
              />
              <NavButton 
                onClick={toggleView}
                icon={currentView === "map" ? SeriousIcons.List : SeriousIcons.Map}
                label={currentView === "map" ? "List View" : "Map View"}
                subtext="Switch visual representation."
              />
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="h-9 px-4 rounded-md transition flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase border border-white/10 bg-white/5 text-slate-400 hover:text-white"
              >
                <SeriousIcons.Menu className="w-4 h-4" />
                <span className="hidden lg:inline">{isSidebarOpen ? "Close" : "Menu"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Toolbar */}
      {hasData && (
        <div className="md:hidden flex items-center justify-center gap-2 px-4 py-3 border-t border-white/5 bg-white/[0.02]">
          <NavButton 
            onClick={toggleView}
            icon={currentView === "map" ? SeriousIcons.List : SeriousIcons.Map}
            label="View"
            colorClass="bg-blue-600/10 border-blue-500/20"
            iconColor="text-blue-400"
          />
          <NavButton 
            onClick={toggleDimension}
            disabled={currentView === "list"}
            icon={is3D ? SeriousIcons.TwoD : SeriousIcons.ThreeD}
            label="Perspective"
          />
          <div className="h-4 w-[1px] bg-white/10 shrink-0 mx-1" />
          <AddAccount onClick={onAddAccount} variant="header" />
          <AddConnection onClick={onAddConnection} variant="header" />
          <UploadCSV />
          <AnalyzeButton onResult={setAnalysisResult} />
        </div>
      )}

      {/* Analysis Result Banner */}
      {analysisResult && (
        <div className="absolute top-[85px] left-4 right-4 bg-blue-600 p-3 rounded-xl flex items-center justify-between shadow-2xl z-[70] animate-in slide-in-from-top-2">
          <p className="text-[10px] font-bold italic truncate pr-2">{analysisResult}</p>
          <button onClick={() => setAnalysisResult(null)} className="text-white/80 hover:text-white text-xs font-bold">✕</button>
        </div>
      )}
    </header>
  );
};

export default Header;