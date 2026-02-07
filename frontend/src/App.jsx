import React, { useState, useMemo, useEffect } from "react";
import Header from "./../components/Header";
import Sidebar from "./../components/Sidebar/Sidebar";
import MapView from "./pages/MapView";
import ListView from "./pages/ListView";
import useUserStore from "./store/dataStore";
import { transformUsersToEntities } from "./utils/utils";

function App() {
  const { users, fetchUsers } = useUserStore();
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Transform users to entities format
  useEffect(() => {
    if (users && users.length > 0) {
      const transformedEntities = transformUsersToEntities(users);
      setEntities(transformedEntities);
      console.log("Transformed entities:", transformedEntities);
    }
  }, [users]);

  console.log("users", users);
  console.log("entities", entities);

  const [currentView, setCurrentView] = useState("map");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("view");

  const { processedNodes, mapLinks } = useMemo(() => {
    const nodes = [];
    const links = [];
    const seenAccountIds = new Set();

    entities.forEach((conn) => {
      nodes.push(conn);
      (conn.accounts || []).forEach((acc) => {
        if (!seenAccountIds.has(acc.id)) {
          nodes.push(acc);
          seenAccountIds.add(acc.id);
        }
        links.push({ source: conn.id, target: acc.id });
      });
    });
    return { processedNodes: nodes, mapLinks: links };
  }, [entities]);

  const handleSelect = (entity, mode = "view") => {
    setSelectedId(entity?.id || null);
    setViewMode(mode);
    setIsSidebarOpen(true);
  };

  const selectedEntity = useMemo(
    () => processedNodes.find((n) => n.id === selectedId) || null,
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
      />

      <main className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
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
