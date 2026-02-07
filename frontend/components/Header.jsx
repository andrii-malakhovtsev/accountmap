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
  onAddConnection,
}) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const { uploadBulkAccounts } = updateDataStore();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Validation: only allow CSV files
    if (selectedFile && !selectedFile.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file");
      event.target.value = ""; // Clear the input
      return;
    }

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Parse CSV and upload when file is selected
  useEffect(() => {
    if (file) {
      parseCSV(file)
        .then((csvData) => {
          console.log("Parsed CSV data:", csvData);
          uploadBulkAccounts(csvData);
        })
        .catch((error) => {
          console.error("Error parsing CSV:", error);
          alert("Failed to parse CSV file");
        });
    }
  }, [file, uploadBulkAccounts]);

  return (
    <header className="h-20 min-h-[80px] flex-shrink-0 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 z-[60]">
      <div className="flex items-center gap-8">
        <h2 className="font-black text-2xl tracking-tighter text-blue-500 uppercase">
          AccountMap
        </h2>

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
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 rounded-lg text-[10px] font-black tracking-widest transition uppercase"
              onClick={() => console.log("Analyze clicked")}
            >
              <span className="text-blue-400">✨</span>
              Analyze
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
