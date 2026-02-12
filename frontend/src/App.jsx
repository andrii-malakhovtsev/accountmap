import React, { useState, useMemo, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "./../components/Sidebar/Sidebar";
import SeriousIcons from "../components/SeriousIcons";
import MapView from "./pages/MapView";
import ListView from "./pages/ListView";
import About from "./pages/About";
import useUserStore from "./store/dataStore";
import { transformUsersToEntities } from "./utils/utils";

function AppContent() {
  const { users, fetchUsers } = useUserStore();
  const [entities, setEntities] = useState([]);
  const [healthStatus, setHealthStatus] = useState("waking");
  
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("view");
  const [is3D, setIs3D] = useState(false);

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
        else setHealthStatus("waking");
      } catch (err) {
        setHealthStatus("waking");
      }
    };
    checkRelay();
    const interval = setInterval(checkRelay, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (users && users.length > 0) {
      const transformedEntities = transformUsersToEntities(users);
      setEntities(transformedEntities);
    }
  }, [users]);

  const { processedNodes, mapLinks } = useMemo(() => {
    const nodes = [];
    const links = [];
    const seenAccountIds = new Set();
    entities.forEach((conn) => {
      nodes.push({ ...conn });
      (conn.accounts || []).forEach((acc) => {
        const accountId = String(acc.id);
        if (!seenAccountIds.has(accountId)) {
          nodes.push({ ...acc, id: accountId });
          seenAccountIds.add(accountId);
        }
        links.push({ source: String(conn.id), target: accountId });
      });
    });
    return { processedNodes: nodes, mapLinks: links };
  }, [entities]);

  const handleSelect = useCallback((entity, mode = "view") => {
    const id = entity?.id || null;
    setSelectedId(id);
    setViewMode(mode);
    setIsSidebarOpen(true);
  }, []);

  const selectedEntity = useMemo(
    () => processedNodes.find((n) => String(n.id) === String(selectedId)) || null,
    [processedNodes, selectedId],
  );

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white overflow-hidden flex flex-col font-sans">
      <Header
        hasData={entities.length > 0}
        currentView={location.pathname}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onAddAccount={() => handleSelect(null, "createAccount")}
        onAddConnection={() => handleSelect(null, "createConnection")}
        healthStatus={healthStatus}
        is3D={is3D}
        setIs3D={setIs3D}
        hideControls={isAboutPage}
      />

      <main className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
        {healthStatus !== "online" && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/60 pointer-events-none">
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-black/90 border border-white/10 rounded-full shadow-2xl">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                  Connecting to Neural Relay...
                </span>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <MapView 
              nodes={processedNodes} 
              links={mapLinks} 
              onSelectAccount={handleSelect} 
              selectedId={selectedId} 
              is3D={is3D} 
            />
          } />
          <Route path="/list" element={
            <ListView 
              entities={entities} 
              onSelectAccount={handleSelect} 
              selectedId={selectedId} 
            />
          } />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* FIXED: Changed <a> to <Link> to handle client-side routing */}
      {!isAboutPage && (
        <Link
          to="/about"
          className="fixed bottom-6 left-8 z-[150] flex items-center gap-4 p-1 group cursor-pointer"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-500 bg-black border-white/20 hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <SeriousIcons.Info className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-colors">
              About Page
            </span>
            <span className="text-[8px] text-slate-700 font-mono mt-0.5 uppercase tracking-tighter">
              Check out the team
            </span>
          </div>
        </Link>
      )}

      {!isAboutPage && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          viewMode={viewMode}
          selectedAccount={selectedEntity}
          onSelectAccount={handleSelect}
          rawEntities={entities}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}