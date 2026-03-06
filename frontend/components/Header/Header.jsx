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

  return (
    <header className="flex-shrink-0 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10 flex flex-col z-[3000] relative">
      <div className="h-20 min-h-[80px] flex items-center px-6 md:px-8 relative justify-between">
        
        {/* Brand / Logo Section */}
        <div className="flex items-center whitespace-nowrap z-10">
          <Link to="/" className="flex flex-col group cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[8px] md:text-[9px] text-red-600 uppercase font-black tracking-[0.2em] leading-none opacity-80">
                Demo
              </span>
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 -mt-[2px] ${
                healthStatus === "online" 
                  ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]" 
                  : "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              }`} />
            </div>

            {/* Bottom Row: Main Title */}
            <h2 className="font-black text-xl md:text-2xl tracking-tighter text-blue-500 uppercase leading-none transition-colors group-hover:text-blue-400">
              AccountMap 
            </h2>
          </Link>
        </div>

        {!hideControls ? (
          <>
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

            <div className="hidden md:flex items-center gap-3">
              {hasData && (
                <>
                  <div className="relative flex rounded-full border border-white/10 bg-black/40 p-0.5 min-w-[100px]">
                    <div
                      className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-blue-600 transition-all duration-300 ease-out"
                      style={{ left: currentView === "/list" ? "calc(50% + 1px)" : "1px" }}
                    />
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="relative z-10 flex-1 py-1.5 px-3 text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span className={currentView === "/" ? "text-white" : "text-slate-500"}>Map</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/list")}
                      className="relative z-10 flex-1 py-1.5 px-3 text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span className={currentView === "/list" ? "text-white" : "text-slate-500"}>List</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="h-8 px-3 rounded-md transition flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <SeriousIcons.Menu className="w-3 h-3" />
                    <span className="hidden lg:inline">{isSidebarOpen ? "Close" : "Menu"}</span>
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/5 hover:bg-blue-600 hover:border-blue-600 hover:text-white text-slate-400 rounded transition-all duration-300 group cursor-pointer"
            >
              <SeriousIcons.Map className="w-3 h-3 group-hover:rotate-12 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest">Main Page</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Toolbar */}
      {hasData && !hideControls && (
        <div className="md:hidden flex items-center justify-center gap-2 px-4 py-3 border-t border-white/5 bg-white/[0.02]">
          <div className="relative flex rounded-full border border-white/10 bg-black/40 p-0.5 min-w-[90px]">
            <div
              className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ left: currentView === "/list" ? "calc(50% + 1px)" : "1px" }}
            />
            <button type="button" onClick={() => navigate("/")} className="relative z-10 flex-1 py-1 px-2 text-[9px] font-bold uppercase cursor-pointer">
              <span className={currentView === "/" ? "text-white" : "text-slate-500"}>Map</span>
            </button>
            <button type="button" onClick={() => navigate("/list")} className="relative z-10 flex-1 py-1 px-2 text-[9px] font-bold uppercase cursor-pointer">
              <span className={currentView === "/list" ? "text-white" : "text-slate-500"}>List</span>
            </button>
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-1" />
          <AddAccount onClick={onAddAccount} variant="header" />
          <AddConnection onClick={onAddConnection} variant="header" />
        </div>
      )}

      {analysisResult && !hideControls && (
        <div className="absolute top-[85px] left-4 right-4 bg-blue-600 p-3 rounded-xl flex items-center justify-between shadow-2xl z-[70]">
          <p className="text-[10px] font-bold italic truncate pr-2">{analysisResult}</p>
          <button onClick={() => setAnalysisResult(null)} className="text-white/80 hover:text-white text-xs font-bold cursor-pointer">✕</button>
        </div>
      )}
    </header>
  );
};

export default Header;