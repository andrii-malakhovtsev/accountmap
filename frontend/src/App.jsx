<<<<<<< HEAD
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import useUserStore from "./store/dataStore";
=======
import React, { useState } from 'react';
import Header from './../components/Header';
import Sidebar from './../components/Sidebar';
import MapView from './pages/MapView';
import ListView from './pages/ListView';
>>>>>>> 8b73443 (initial UI proof of concept)

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('map');

  const { users, loading, error, fetchUsers } = useUserStore();
  console.log(users, loading, error);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
<<<<<<< HEAD
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
=======
    <div className="relative h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden">
      
      <div className="flex flex-col h-full w-full items-stretch">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        
        <main className="flex-1 w-full relative overflow-hidden bg-[#111]">
          {currentView === 'map' ? <MapView /> : <ListView />}
        </main>
      </div>

      <div className="absolute right-0 top-16 bottom-0 z-50 pointer-events-none">
         <Sidebar isOpen={isSidebarOpen} />
      </div>

    </div>
>>>>>>> 8b73443 (initial UI proof of concept)
  );
}

export default App;