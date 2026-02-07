import React, { useState, useMemo, useEffect } from 'react';
import Header from './../components/Header';
import Sidebar from './../components/Sidebar/Sidebar';
import AddAccount from './../components/AddAccount';
import AddConnection from './../components/AddConnection';
import MapView from './pages/MapView';
import ListView from './pages/ListView';
import useTestStore from './store/testStore';

function App() {
  const entities = useTestStore((state) => state.entities);
  const addRandomEntity = useTestStore((state) => state.addRandomEntity);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('map');
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState('view'); 

  const hasData = entities.length > 0;

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'a') {
        console.log('Adding Account...');
        addRandomEntity('account');
      }
      if (key === 'c') {
        console.log('Adding Connection...');
        addRandomEntity('connection');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [addRandomEntity]);

  const handleOpenCreateAccount = () => {
    setSelectedId(null);
    setViewMode('createAccount');
    setIsSidebarOpen(true);
  };

  const handleOpenCreateConnection = () => {
    setSelectedId(null);
    setViewMode('createConnection');
    setIsSidebarOpen(true);
  };

  const handleSelectAccount = (entity) => {
    setSelectedId(entity.id);
    setViewMode('view');
    setIsSidebarOpen(true);
  };

  const handleSave = (newData) => {
    // This manually pushes to the test store for now
    useTestStore.setState((state) => ({
      entities: [...state.entities, { ...newData, id: `manual-${Date.now()}` }]
    }));
    setIsSidebarOpen(false);
  };

  const selectedEntity = useMemo(() => 
    entities.find(n => n.id === selectedId), 
    [entities, selectedId]
  );

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <div className="flex flex-col h-full w-full items-stretch">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
          hasData={hasData}
          onAddAccount={handleOpenCreateAccount}
          onAddConnection={handleOpenCreateConnection}
        />
        
        <main className="flex-1 w-full relative overflow-hidden bg-[#0a0a0a]">
          {!hasData ? (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center space-y-8 bg-[#0a0a0a]">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Vault Initialized</h2>
                <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Zero security assets detected in cluster</p>
                <p className="text-blue-500 animate-pulse text-[10px] font-bold mt-4">Press 'A' for Account or 'C' for Connection</p>
              </div>
              
              <div className="flex gap-4">
                <AddAccount onClick={handleOpenCreateAccount} variant="central" />
                <AddConnection onClick={handleOpenCreateConnection} variant="central" />
              </div>
            </div>
          ) : (
            <div className="h-full w-full">
               {currentView === 'map' ? (
                <MapView nodes={entities} links={[]} onSelectAccount={handleSelectAccount} selectedId={selectedId} /> 
              ) : (
                <ListView accounts={entities.filter(n => !n.isConnection)} allNodes={entities} onSelectAccount={handleSelectAccount} selectedId={selectedId} />
              )}
            </div>
          )}
        </main>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        viewMode={viewMode}
        selectedAccount={selectedEntity} 
        allNodes={entities}
        onSelectAccount={handleSelectAccount}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;