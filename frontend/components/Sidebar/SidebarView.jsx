import React from 'react';
import { getIconUrl } from './../../src/utilities/iconService';

const SidebarView = ({ selectedAccount, connections, allNodes, onSelectAccount, onAddClick }) => {
  const isHub = selectedAccount?.isHub;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
          {isHub ? `Impacted Accounts (${connections.length})` : `Linked Connections (${connections.length})`}
        </label>
        <div className="flex flex-col gap-2">
          {connections.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelectAccount(allNodes.find(n => n.id === item.id) || item)}
              className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-2 rounded-lg group hover:bg-blue-600/20 hover:border-blue-500/50 cursor-pointer transition-all"
            >
              <div className="w-6 h-6 bg-white rounded p-1 flex items-center justify-center shrink-0">
                <img src={getIconUrl(item.name)} className="w-full h-full object-contain" alt="" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] text-gray-200 font-bold truncate">{item.name}</span>
                <span className="text-[9px] text-gray-500 font-mono truncate">{isHub ? item.username : (item.value || item.type)}</span>
              </div>
            </div>
          ))}

          <button 
            onClick={onAddClick}
            className="w-full py-4 border-2 border-dashed border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-xl flex items-center justify-center transition-all group mt-2"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-blue-400">
              + Link {isHub ? "Account" : "Connection"}
            </span>
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Internal Notes</label>
        <textarea 
          rows="6"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none resize-none"
          readOnly
          value={selectedAccount.notes || "No notes available."}
        />
      </div>
    </div>
  );
};

export default SidebarView;