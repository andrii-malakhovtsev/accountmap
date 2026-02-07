import React from 'react';

const Header = ({ isSidebarOpen, setIsSidebarOpen, currentView, setCurrentView }) => {
  return (
    <header className="h-16 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-6">
        <h2 className="font-bold text-xl tracking-tighter text-blue-500">AccountMap</h2>

        <div className="flex items-center gap-2 border-l border-white/10 pl-6">
          <button 
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-blue-900/20"
            onClick={() => console.log('Add Account Clicked')}
          >
            <span className="text-lg leading-none">+</span>
            ADD ACCOUNT
          </button>
          
          <button 
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-bold transition"
            onClick={() => console.log('Add Connection Clicked')}
          >
            <span className="text-blue-400">🔗</span>
            ADD CONNECTION
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-black/40 rounded-lg p-1 mr-4 border border-white/5">
          <button 
            onClick={() => setCurrentView('map')}
            className={`px-4 py-1 rounded-md text-xs font-bold transition ${currentView === 'map' ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            MAP
          </button>
          <button 
            onClick={() => setCurrentView('list')}
            className={`px-4 py-1 rounded-md text-xs font-bold transition ${currentView === 'list' ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            LIST
          </button>
        </div>

        <button className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition border border-white/10 mr-2">
          🌙
        </button>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition text-sm font-medium border border-white/5"
        >
          {isSidebarOpen ? 'Hide Menu ✕' : '☰ Menu'}
        </button>
      </div>
    </header>
  );
};

export default Header;