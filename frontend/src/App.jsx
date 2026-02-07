import React, { useState, useMemo } from 'react';
import Header from './../components/Header';
import Sidebar from './../components/Sidebar';
import MapView from './pages/MapView';
import ListView from './pages/ListView';
import { dummyConnections } from './dummyData';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('map');
  const [selectedId, setSelectedId] = useState(null);

  const graphData = useMemo(() => {
    const nodeMap = new Map();
    const links = [];

    dummyConnections.forEach(conn => {
      if (!nodeMap.has(conn.id)) {
        nodeMap.set(conn.id, { 
          ...conn, 
          isHub: true 
        });
      }

      conn.accounts.forEach(acc => {
        if (!nodeMap.has(acc.id)) {
          nodeMap.set(acc.id, { 
            ...acc, 
            isHub: false
          });
        }
        
        links.push({ source: conn.id, target: acc.id });
      });
    });

    return { 
      nodes: Array.from(nodeMap.values()), 
      links,
      connections: dummyConnections 
    };
  }, []);

  const handleSelectAccount = (entity) => {
    setSelectedId(entity.id);
    setIsSidebarOpen(true);
  };

  const selectedEntity = useMemo(() => 
    graphData.nodes.find(n => n.id === selectedId), 
    [graphData.nodes, selectedId]
  );

  const allAccounts = useMemo(() => 
    graphData.nodes.filter(n => !n.isHub), 
    [graphData.nodes]
  );

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white overflow-hidden">
      <div className="flex flex-col h-full w-full items-stretch">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        
        <main className="flex-1 w-full relative overflow-hidden bg-[#111]">
          {currentView === 'map' ? (
            <MapView 
              nodes={graphData.nodes} 
              links={graphData.links}
              onSelectAccount={handleSelectAccount} 
              selectedId={selectedId} 
            /> 
          ) : (
            <ListView 
              accounts={allAccounts} 
              allNodes={graphData.nodes} 
              onSelectAccount={handleSelectAccount} 
              selectedId={selectedId} 
            />
          )}
        </main>
      </div>

      <div className="absolute right-0 top-16 bottom-0 z-50 pointer-events-none">
         <Sidebar 
           isOpen={isSidebarOpen} 
           selectedAccount={selectedEntity} 
           allNodes={graphData.nodes}
           onSelectAccount={handleSelectAccount}
         />
      </div>
    </div>
  );
}

export default App;