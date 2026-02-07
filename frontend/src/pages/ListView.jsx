import React, { useState } from 'react';
import { getIconUrl } from './../utilities/iconService';

const ListView = ({ accounts = [], allNodes = [], onSelectAccount, selectedId }) => {
  const [viewMode, setViewMode] = useState('accounts');
  const hubs = allNodes.filter(n => n.isHub);

  return (
    <div className="w-full h-full bg-[#111] overflow-y-auto">
      <div className="p-6 border-b border-white/10 bg-[#111]/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Security Inventory</h2>
          <p className="text-gray-500 text-xs mt-1 font-mono">
            {viewMode === 'accounts' ? `Monitoring ${accounts.length} active identities` : `Managing ${hubs.length} core connections`}
          </p>
        </div>

        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setViewMode('accounts')}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${viewMode === 'accounts' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            ACCOUNTS
          </button>
          <button 
            onClick={() => setViewMode('hubs')}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${viewMode === 'hubs' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            CONNECTIONS
          </button>
        </div>
      </div>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-black/40 border-b border-white/10 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
            <th className="px-6 py-4">{viewMode === 'accounts' ? 'Service' : 'Connection Hub'}</th>
            <th className="px-6 py-4">{viewMode === 'accounts' ? 'Username' : 'Identity Type'}</th>
            <th className="px-6 py-4">{viewMode === 'accounts' ? 'Linked Connections' : 'Impacted Accounts'}</th>
            <th className="px-6 py-4 text-right">Security Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {(viewMode === 'accounts' ? accounts : hubs).map((item) => {
            const isSelected = selectedId === item.id;
            
            const linkedHubs = viewMode === 'accounts' 
              ? hubs.filter(h => h.accounts?.some(acc => acc.id === item.id))
              : [];

            const impactedAccounts = viewMode === 'hubs' ? (item.accounts || []) : [];
            const connectionCount = viewMode === 'accounts' ? linkedHubs.length : impactedAccounts.length;

            let statusLabel = item.isHub ? "Connection" : "Secure";
            let statusClass = item.isHub 
              ? "border-blue-500/20 text-blue-400 bg-blue-500/5" 
              : "bg-green-500/5 text-green-500 border-green-500/20";

            if (!item.isHub) {
              if (connectionCount === 1) {
                statusLabel = "Warning";
                statusClass = "bg-yellow-500/5 text-yellow-500 border-yellow-500/20";
              } else if (connectionCount === 0) {
                statusLabel = "In Danger";
                statusClass = "bg-red-500/5 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
              }
            }

            return (
              <tr 
                key={item.id} 
                onClick={() => onSelectAccount(item)}
                className={`transition-all cursor-pointer group ${
                  isSelected 
                    ? 'bg-blue-600/10 border-l-2 border-blue-500' 
                    : 'hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-2 shadow-inner">
                    <img 
                      src={getIconUrl(item.name)} 
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/633/633600.png'; }}
                      alt=""
                    />
                  </div>
                  <span className={`font-semibold ${isSelected ? 'text-blue-400' : 'text-gray-200'}`}>
                    {item.name}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                  {viewMode === 'accounts' ? item.username : (item.value || item.type)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 min-h-[28px]">
                    {viewMode === 'accounts' ? (
                      connectionCount > 0 ? (
                        linkedHubs.map((hub) => (
                          <div 
                            key={hub.id} 
                            title={hub.value}
                            className="w-7 h-7 rounded-md bg-white flex items-center justify-center p-1"
                          >
                            <img 
                              src={getIconUrl(hub.name)} 
                              className="w-full h-full object-contain" 
                              alt=""
                            />
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] text-red-600 uppercase font-black tracking-widest animate-pulse">Unprotected</span>
                      )
                    ) : (
                      <div className="flex -space-x-2">
                        {impactedAccounts.slice(0, 6).map((acc) => (
                          <div 
                            key={acc.id} 
                            className="w-7 h-7 rounded-full bg-white border-2 border-[#111] p-1 flex items-center justify-center shadow-lg"
                          >
                            <img src={getIconUrl(acc.name)} className="w-full h-full object-contain" alt={acc.name} />
                          </div>
                        ))}
                        {impactedAccounts.length > 6 && (
                          <div className="w-7 h-7 rounded-full bg-[#222] border-2 border-[#111] flex items-center justify-center text-[8px] font-bold text-gray-400">
                            +{impactedAccounts.length - 6}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase border transition-colors ${statusClass}`}>
                    {statusLabel}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;