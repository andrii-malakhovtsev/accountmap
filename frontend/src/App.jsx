import React, { useState, useMemo } from 'react';
import Header from './../components/Header';
import Sidebar from './../components/Sidebar/Sidebar';
import MapView from './pages/MapView';
import useTestStore from './store/testStore';

function App() {
  const { entities } = useTestStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState('view'); 

  const { processedNodes, mapLinks } = useMemo(() => {
    const nodes = [];
    const links = [];
    const seenAccountIds = new Set();

    entities.forEach(conn => {
      nodes.push({ ...conn, isHub: true });
      (conn.accounts || []).forEach(acc => {
        if (!seenAccountIds.has(acc.id)) {
          nodes.push({ ...acc, isHub: false });
          seenAccountIds.add(acc.id);
        }
        links.push({ source: conn.id, target: acc.id });
      });
    });
    return { processedNodes: nodes, mapLinks: links };
  }, [entities]);

  const handleSelectAccount = (entity, mode = 'view') => {
    setSelectedId(entity?.id || null);
    setViewMode(mode);
    setIsSidebarOpen(true);
  };

  const selectedEntity = useMemo(() => 
    processedNodes.find(n => n.id === selectedId), 
    [processedNodes, selectedId]
  );

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <div className="flex flex-col h-full w-full">
        <Header 
          isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
          hasData={entities.length > 0}
          onAddAccount={() => { setViewMode('createAccount'); setIsSidebarOpen(true); }}
          onAddConnection={() => { setViewMode('createConnection'); setIsSidebarOpen(true); }}
        />
        <main className="flex-1 relative bg-[#0a0a0a]">
          <MapView 
            nodes={processedNodes} 
            links={mapLinks} 
            onSelectAccount={handleSelectAccount} 
            selectedId={selectedId} 
          />
        </main>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        viewMode={viewMode}
        selectedAccount={selectedEntity} 
        onSelectAccount={handleSelectAccount}
        rawEntities={entities}
      />
    </div>
  );
}

export default App;