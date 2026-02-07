import React from 'react';
import { getIconUrl } from './../../src/utilities/iconService';

const SidebarView = ({ selectedAccount, connections, onSelectAccount }) => {
  const isMainNodeConnection = !!selectedAccount?.accounts;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
          {isMainNodeConnection ? `Impacted Accounts (${connections.length})` : `Linked Connections (${connections.length})`}
        </label>
        <div className="flex flex-col gap-2">
          {connections.map((item) => {
            const isItemConnection = !!item.accounts;
            const iconKey = isItemConnection ? item.type : item.name;

            return (
              <div 
                key={item.id} 
                onClick={() => onSelectAccount(item)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-2 rounded-lg group hover:bg-blue-600/20 cursor-pointer transition-all"
              >
                <div className="w-8 h-8 bg-white rounded-md p-1 shrink-0">
                  <img src={getIconUrl(iconKey)} className="w-full h-full object-contain" alt="" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[11px] text-gray-200 font-bold truncate uppercase tracking-tight">
                    {item.name || item.type}
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono truncate lowercase">
                    {isItemConnection ? item.value : item.username}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Internal Notes</label>
        <textarea 
          readOnly 
          rows="6" 
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none resize-none" 
          value={selectedAccount.notes || "No notes available."} 
        />
      </div>
    </div>
  );
};

export default SidebarView;