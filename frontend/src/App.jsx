import React, { useState } from 'react';
import Header from './../components/Header';
import Sidebar from './../components/Sidebar';
import MapView from './pages/MapView';
import ListView from './pages/ListView';
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('map');

  const users = [
    { id: '1', name: 'Google', domain: 'google.com' },
    { id: '2', name: 'Stripe', domain: 'stripe.com' }
  ];

  return (
    <div className="relative h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden">
      
      <div className="flex flex-col h-full w-full items-stretch">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        
        <main className="flex-1 w-full relative overflow-hidden bg-[#111]">
          {currentView === 'map' ? (
            <MapView users={users} /> 
          ) : (
            <ListView users={users} />
          )}
        </main>
      </div>

      <div className="absolute right-0 top-16 bottom-0 z-50 pointer-events-none">
         <Sidebar isOpen={isSidebarOpen} />
      </div>

    </div>
  );
}

export default App;