import React, { useRef } from "react";
import AddAccount from "./AddAccount";
import AddConnection from "./AddConnection";

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="h-16 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-[60]">
      <div className="flex items-center gap-6">
        <h2 className="font-black text-xl tracking-tighter text-blue-500 uppercase">
          AccountMap
        </h2>

        {hasData && (
          <div className="flex items-center gap-2 border-l border-white/10 pl-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <AddAccount onClick={onAddAccount} variant="header" />
            <AddConnection onClick={onAddConnection} variant="header" />

            <button
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 rounded-lg text-[10px] font-black tracking-widest transition uppercase"
              onClick={handleUploadClick}
            >
              <span className="text-blue-400">📥</span>
              Upload CSV
            </button>

            <button
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 rounded-lg text-[10px] font-black tracking-widest transition uppercase"
              onClick={() => console.log("Analyze clicked")}
            >
              <span className="text-blue-400">✨</span>
              Analyze
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => console.log(e.target.files[0])}
              className="hidden"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {hasData && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
              <button
                onClick={() => setCurrentView("map")}
                className={`px-4 py-1 rounded-md text-[10px] font-black tracking-widest transition uppercase ${
                  currentView === "map" 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setCurrentView("list")}
                className={`px-4 py-1 rounded-md text-[10px] font-black tracking-widest transition uppercase ${
                  currentView === "list" 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                List
              </button>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`px-4 py-2 rounded-lg transition text-[10px] font-black tracking-widest uppercase border ${
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