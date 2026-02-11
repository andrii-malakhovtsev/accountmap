import React, { useState, useMemo, useEffect, useCallback } from "react";
import Header from "../components/Header/Header";
import Sidebar from "./../components/Sidebar/Sidebar";
import MapView from "./pages/MapView";
import ListView from "./pages/ListView";
import useUserStore from "./store/dataStore";
import { transformUsersToEntities } from "./utils/utils";

function App() {
  const { users, fetchUsers } = useUserStore();
  const [entities, setEntities] = useState([]);
  const [healthStatus, setHealthStatus] = useState("waking");
  
  const [currentView, setCurrentView] = useState("map");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("view");

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (users && users.length > 0) {
      const transformedEntities = transformUsersToEntities(users);
      setEntities(transformedEntities);
    }
  }, [users]);

  // --- STABILIZED DATA TRANSFORMATION ---
  // We use useMemo to ensure that nodes and links keep the same references
  // unless 'entities' actually changes.
  const { processedNodes, mapLinks } = useMemo(() => {
    const nodes = [];
    const links = [];
    const seenAccountIds = new Set();

    entities.forEach((conn) => {
      // Create a stable node object for the connection
      const connectionNode = { ...conn };
      nodes.push(connectionNode);

      (conn.accounts || []).forEach((acc) => {
        const accountId = String(acc.id);
        if (!seenAccountIds.has(accountId)) {
          nodes.push({ ...acc, id: accountId });
          seenAccountIds.add(accountId);
        }
        links.push({ 
          source: String(conn.id), 
          target: accountId 
        });
      });
    });

    return { processedNodes: nodes, mapLinks: links };
  }, [entities]);

  // This prevents the MapView from re-rendering every time App.jsx cycles.
  // Fix for the "dead click" issue in 2D (ONLY PULLS UP IN PROD)
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
        currentView={currentView}
        setCurrentView={setCurrentView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onAddAccount={() => handleSelect(null, "createAccount")}
        onAddConnection={() => handleSelect(null, "createConnection")}
        healthStatus={healthStatus} 
      />

      <main className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
        {healthStatus !== "online" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/40 backdrop-blur-[2px] pointer-events-none">
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-black/80 border border-white/10 rounded-full shadow-2xl">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                  Waking up the back-end just for you, it takes about 50 seconds...
                </span>
              </div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-medium max-w-[200px] text-center leading-relaxed">
                Relay is waking up on free tier infrastructure. 
                <br />
                <span className="text-gray-600 mt-1 block italic">(takes ~50 seconds)</span>
              </p>
            </div>
          </div>
        )}

        {currentView === "map" ? (
          <MapView
            nodes={processedNodes}
            links={mapLinks}
            onSelectAccount={handleSelect}
            selectedId={selectedId}
          />
        ) : (
          <ListView
            entities={entities}
            onSelectAccount={handleSelect}
            selectedId={selectedId}
          />
        )}
      </main>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        viewMode={viewMode}
        selectedAccount={selectedEntity}
        onSelectAccount={handleSelect}
        rawEntities={entities}
      />
    </div>
  );
}

export default App;