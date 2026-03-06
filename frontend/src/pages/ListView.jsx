import React, { useState } from 'react';
import { getIconUrl } from './../utilities/iconService';

const isDummyConnection = (conn) =>
  !!conn.accounts && (!conn.type || !conn.value || String(conn.type).toLowerCase() === 'dummy');

// Yellow hazard warning triangle (flat top, point down – standard ⚠ style)
const WarningIcon = () => (
  <span className="inline-flex shrink-0 w-5 h-5" style={{ transform: 'scaleY(-1)' }} aria-hidden>
    <svg className="w-full h-full block" viewBox="0 0 24 24" fill="none">
      <path fill="#eab308" stroke="#ca8a04" strokeWidth="1.2" d="M2 2L22 2L12 20z" />
      {/* ! drawn upside-down so it displays right when wrapper has scaleY(-1) */}
    <path stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" d="M12 8v1M12 9.5v5" />
    </svg>
  </span>
);

const ListView = ({ entities, onSelectAccount, selectedId }) => {
  const [activeTab, setActiveTab] = useState('connections');

  const accounts = Array.from(new Map(
    entities.flatMap(c => (c.accounts || []).map(a => [a.id, a]))
  ).values());

  const displayItems = activeTab === 'connections' ? entities : accounts;

  const getConnectionsForAccount = (accountId) =>
    entities.filter((c) => (c.accounts || []).some((a) => String(a.id) === String(accountId)));

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
          const dummy = isConn && isDummyConnection(item);
          const iconKey = isConn ? (dummy ? 'dummy' : item.type) : item.name;
          const isSelected = item.id === selectedId;
          const linkedConns = !isConn ? getConnectionsForAccount(item.id) : [];
          const onlyDummyLinks = !isConn && linkedConns.length > 0 && linkedConns.every(isDummyConnection);
          const noOrOnlyDummyLinks = !isConn && (linkedConns.length === 0 || onlyDummyLinks);
          const rowWarning = noOrOnlyDummyLinks;

          return (
            <div
              key={item.id}
              onClick={() => onSelectAccount(item)}
              className={`grid grid-cols-12 gap-4 px-6 py-4 rounded-xl border transition-all cursor-pointer items-center group
                ${rowWarning ? 'border-red-500/50 bg-red-950/20 hover:bg-red-950/30' : ''}
                ${!rowWarning && isSelected ? 'bg-blue-600/10 border-blue-500/50' : ''}
                ${!rowWarning && !isSelected ? 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]' : ''}
              `}
            >
              <div className="col-span-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white p-2 shrink-0">
                  <img src={getIconUrl(iconKey)} className="w-full h-full object-contain" alt="" />
                </div>
                <div className="flex flex-col overflow-hidden min-w-0">
                  <span className={`text-sm font-bold uppercase truncate ${dummy ? 'text-gray-500 italic' : 'text-white'}`}>
                    {isConn ? (dummy ? 'No connection' : (item.type || item.value || '—')) : (item.name || '—')}
                  </span>
                </div>
              </div>

              <div className="col-span-4 flex flex-col min-w-0">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  {isConn ? 'Connection' : 'Account'}
                </span>
                <span className="text-xs text-gray-300 truncate">
                  {isConn ? (dummy ? 'No connection' : (item.value || '—')) : (item.username || '—')}
                </span>
              </div>

              <div className="col-span-3 flex items-center justify-end">
                {isConn ? (
                  (item.accounts || []).length > 0 ? (
                    <div className="flex -space-x-2" title={`${item.accounts.length} linked`}>
                      {(item.accounts || []).slice(0, 5).map((acc) => (
                        <div key={acc.id} className="w-7 h-7 rounded-md bg-white p-0.5 border-2 border-[#0a0a0a] shrink-0 ring-1 ring-white/10 overflow-hidden">
                          <img src={getIconUrl(acc.name)} className="w-full h-full object-contain" alt="" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-500 uppercase">None</span>
                  )
                ) : linkedConns.length > 0 ? (
                  onlyDummyLinks ? (
                    <span className="flex items-center gap-1.5 text-amber-500" title="Only linked to placeholder (dummy) connection">
                      <WarningIcon />
                      <span className="text-[10px] uppercase">No real link</span>
                    </span>
                  ) : (
                    <div className="flex -space-x-2" title={`${linkedConns.filter((c) => !isDummyConnection(c)).length} connections`}>
                      {linkedConns.filter((c) => !isDummyConnection(c)).slice(0, 5).map((c) => (
                        <div key={c.id} className="w-7 h-7 rounded-md bg-white p-0.5 border-2 border-[#0a0a0a] shrink-0 ring-1 ring-white/10 overflow-hidden">
                          <img src={getIconUrl(c.type)} className="w-full h-full object-contain" alt="" />
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-500" title="Not linked to any connection">
                    <WarningIcon />
                    <span className="text-[10px] uppercase">Unlinked</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListView;