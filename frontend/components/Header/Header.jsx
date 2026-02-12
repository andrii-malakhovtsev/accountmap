import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  hasData,
  is3D,        
  setIs3D,     
  onAddAccount,
  onAddConnection,
  healthStatus,
  hideControls
}) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const navigate = useNavigate();

  const toggleView = () => {
    if (currentView === "/list") navigate("/");
    else navigate("/list");
  };

  const toggleDimension = () => setIs3D(!is3D);

  return (
    <header className="flex-shrink-0 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10 flex flex-col z-[100] relative">
      <div className="h-20 min-h-[80px] flex items-center px-6 md:px-8 relative justify-between">
        
        {/* Brand / Logo Section */}
        {/* Removed absolute positioning on mobile to prevent overlap with the Return button */}
        <div className="flex items-center gap-3 whitespace-nowrap z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <h2 className="font-black text-xl md:text-2xl tracking-tighter text-blue-500 uppercase flex items-center transition-colors group-hover:text-blue-400">
              AccountMap 
              <span className="text-[10px] md:text-xs text-red-600 uppercase ml-1 font-bold">demo</span>
            </h2>
          </Link>
          <div className={`h-2 w-2 rounded-full transition-all duration-500 ${
            healthStatus === "online" 
              ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
              : "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]"
          }`} />
        </div>

        {!hideControls ? (
          <>
            {/* Desktop Actions */}
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

            {/* Desktop View Controls */}
            <div className="hidden md:flex items-center gap-3">
              {hasData && (
                <>
                  <NavButton 
                    onClick={toggleDimension}
                    disabled={currentView === "/list"}
                    disabledLabel="Map Only"
                    disabledSubtext="Switch to Map View to change dimensions."
                    icon={is3D ? SeriousIcons.TwoD : SeriousIcons.ThreeD} 
                    label={is3D ? "2D Mode" : "3D Mode"}
                  />
                  <NavButton 
                    onClick={toggleView}
                    icon={currentView === "/" ? SeriousIcons.List : SeriousIcons.Map}
                    label={currentView === "/" ? "List View" : "Map View"}
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
          </>
        ) : (
          /* Clean "Return" UI for About Page */
          <div className="flex items-center animate-in fade-in slide-in-from-right-4 duration-500">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 md:px-6 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-600 hover:text-white text-blue-400 rounded-full transition-all duration-300 group"
            >
              <SeriousIcons.Map className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Return to Terminal</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Toolbar */}
      {hasData && !hideControls && (
        <div className="md:hidden flex items-center justify-center gap-2 px-4 py-3 border-t border-white/5 bg-white/[0.02]">
          <NavButton onClick={toggleView} icon={currentView === "/" ? SeriousIcons.List : SeriousIcons.Map} label="View" />
          <NavButton onClick={toggleDimension} disabled={currentView === "/list"} icon={is3D ? SeriousIcons.TwoD : SeriousIcons.ThreeD} label="Perspective" />
          <div className="h-4 w-[1px] bg-white/10 mx-1" />
          <AddAccount onClick={onAddAccount} variant="header" />
          <AddConnection onClick={onAddConnection} variant="header" />
        </div>
      )}

      {analysisResult && !hideControls && (
        <div className="absolute top-[85px] left-4 right-4 bg-blue-600 p-3 rounded-xl flex items-center justify-between shadow-2xl z-[70]">
          <p className="text-[10px] font-bold italic truncate pr-2">{analysisResult}</p>
          <button onClick={() => setAnalysisResult(null)} className="text-white/80 hover:text-white text-xs font-bold">✕</button>
        </div>
      )}
    </header>
  );
};

export default Header;