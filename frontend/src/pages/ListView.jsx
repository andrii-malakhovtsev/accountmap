import React, { useState } from 'react';
import { getIconUrl } from './../utilities/iconService';

const ListView = ({ entities, onSelectAccount, selectedId }) => {
  const [activeTab, setActiveTab] = useState('connections');

  const accounts = Array.from(new Map(
    entities.flatMap(c => c.accounts || []).map(a => [a.id, a])
  ).values());

  const displayItems = activeTab === 'connections' ? entities : accounts;

  return (
    <div className="w-full h-full overflow-y-auto p-8 bg-[#0a0a0a] custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Connections / Accounts toggle - original look with sliding pill animation */}
        <div className="relative flex gap-2 p-1 bg-white/5 rounded-xl w-fit border border-white/10">
          <div
            className="absolute top-1 bottom-1 rounded-lg bg-blue-600 shadow-lg transition-all duration-300 ease-out"
            style={{
              left: activeTab === 'accounts' ? 'calc(50% + 4px)' : '4px',
              width: 'calc(50% - 6px)',
            }}
          />
          <button
            type="button"
            onClick={() => setActiveTab('connections')}
            className="relative z-10 flex-1 py-2 px-6 text-[10px] font-black uppercase tracking-widest transition-colors rounded-lg min-w-0 whitespace-nowrap cursor-pointer"
          >
            <span className={activeTab === 'connections' ? 'text-white' : 'text-gray-500 hover:text-white'}>
              Connections ({entities.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className="relative z-10 flex-1 py-2 px-6 text-[10px] font-black uppercase tracking-widest transition-colors rounded-lg min-w-0 whitespace-nowrap cursor-pointer"
          >
            <span className={activeTab === 'accounts' ? 'text-white' : 'text-gray-500 hover:text-white'}>
              Accounts ({accounts.length})
            </span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black border-b border-white/5">
          <div className="col-span-5">Entity / Name</div>
          <div className="col-span-4">Type / Identity</div>
          <div className="col-span-3 text-right">Status</div>
        </div>

        {displayItems.map((item) => {
          const isConn = !!item.accounts;
          const iconKey = isConn ? item.type : item.name;
          const isSelected = item.id === selectedId;

          return (
            <div 
              key={item.id}
              onClick={() => onSelectAccount(item)}
              className={`grid grid-cols-12 gap-4 px-6 py-4 rounded-xl border transition-all cursor-pointer items-center group
                ${isSelected 
                  ? 'bg-blue-600/10 border-blue-500/50' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
            >
              <div className="col-span-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white p-2 shrink-0">
                  <img src={getIconUrl(iconKey)} className="w-full h-full object-contain" alt="" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-white uppercase truncate">
                    {item.name || item.type}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono truncate">{item.id}</span>
                </div>
              </div>

              <div className="col-span-4 flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  {isConn ? 'Connection' : 'Account'}
                </span>
                <span className="text-xs text-gray-300 font-mono truncate">
                  {isConn ? item.value : item.username}
                </span>
              </div>

              <div className="col-span-3 text-right">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase">
                  {isConn ? `${item.accounts?.length} Linked` : 'Active'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListView;