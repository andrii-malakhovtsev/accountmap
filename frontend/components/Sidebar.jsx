import React from 'react';
import { getIconUrl } from './../src/utilities/iconService';

const Sidebar = ({ isOpen, selectedAccount, allNodes = [], onSelectAccount }) => {
  const isHub = selectedAccount?.isHub;

  const activeData = selectedAccount || {
    name: "Select an Account",
    notes: "Please select an entity from the map or list to view detailed security parameters.",
  };

  const connections = isHub 
    ? (selectedAccount.accounts || [])
    : allNodes.filter(node => node.isHub && node.accounts?.some(acc => acc.id === selectedAccount?.id));

  const connectionCount = connections.length;

  let statusLabel = "SECURE";
  let statusColor = "text-green-500";
  
  if (isHub) {
    statusLabel = "IDENTITY HUB";
    statusColor = "text-blue-400";
  } else if (selectedAccount) {
    if (connectionCount === 1) {
      statusLabel = "WARNING";
      statusColor = "text-yellow-500";
    } else if (connectionCount === 0) {
      statusLabel = "IN DANGER";
      statusColor = "text-red-500";
    }
  } else {
    statusLabel = "IDLE";
    statusColor = "text-gray-500";
  }

  return (
    <aside 
      className={`${
        isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full'
      } transition-all duration-300 h-full bg-[#0f0f0f]/95 backdrop-blur-xl border-l border-white/10 flex flex-col overflow-hidden whitespace-nowrap pointer-events-auto shadow-2xl z-50`}
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8 flex flex-col items-center border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-4 shadow-2xl mb-4 group transition-transform hover:scale-105">
            <img
              src={getIconUrl(activeData.name)} 
              alt="" 
              className="max-w-full max-h-full object-contain"
              onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/633/633600.png'; }}
            />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight text-center truncate w-full">
            {activeData.name}
          </h2>
          <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${statusColor}`}>
            {statusLabel}
          </span>
          {isHub && (
            <span className="text-gray-500 text-[10px] font-mono mt-2">{activeData.value}</span>
          )}
        </div>

        <div className="p-6 space-y-6">
          {selectedAccount && (
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
                {isHub ? `Impacted Accounts (${connectionCount})` : `Linked Connections (${connectionCount})`}
              </label>
              <div className="flex flex-col gap-2">
                {connections.map((item) => {
                  const nodeToSelect = isHub 
                    ? allNodes.find(n => n.id === item.id) 
                    : item;

                  return (
                    <div 
                      key={item.id} 
                      onClick={() => onSelectAccount(nodeToSelect)}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-2 rounded-lg group hover:bg-blue-600/20 hover:border-blue-500/50 cursor-pointer transition-all"
                    >
                      <div className="w-6 h-6 bg-white rounded p-1 flex items-center justify-center">
                        <img 
                          src={getIconUrl(item.name)}
                          className="w-full h-full object-contain" 
                          alt="" 
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] text-gray-200 font-bold truncate">
                          {item.name}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono truncate">
                          {isHub ? item.username : (item.value || item.type)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {!isHub && connectionCount === 0 && (
                  <div className="w-full p-3 border border-red-500/20 bg-red-500/5 rounded-lg text-center">
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter animate-pulse">
                      Critical: No recovery assets linked
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
              Internal Notes
            </label>
            <br></br>
            <textarea 
              rows="6"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 transition-colors resize-none leading-relaxed"
              placeholder="Security notes..."
              defaultValue={activeData.notes}
              key={activeData.id}
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20 flex gap-2">
        <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-md transition uppercase tracking-wider">
          Save Changes
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;