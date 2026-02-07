import React, { useState, useMemo } from 'react';
import { getIconUrl } from './../../src/utilities/iconService';
import SidebarView from './SidebarView';
import SidebarAccountForm from './SidebarAccountForm';
import SidebarConnectionForm from './SidebarConnectionForm';

const Sidebar = ({ isOpen, onClose, viewMode, selectedAccount, onSelectAccount, rawEntities }) => {
  const [form, setForm] = useState({ name: '', username: '', notes: '', type: 'mail', value: '' });
  const [errors] = useState({}); // Dummy errors for your form styles

  const isHub = !!selectedAccount?.type;

  const associatedNodes = useMemo(() => {
    if (!selectedAccount || viewMode !== 'view') return [];
    return isHub 
      ? (selectedAccount.accounts || []) 
      : rawEntities.filter(c => c.accounts?.some(a => a.id === selectedAccount.id));
  }, [selectedAccount, rawEntities, isHub, viewMode]);

  return (
    <aside className={`absolute right-0 top-16 bottom-0 w-80 bg-[#0f0f0f]/95 backdrop-blur-xl border-l border-white/10 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 relative">
          <button onClick={onClose} className="absolute -top-4 -right-4 p-2 text-gray-500 hover:text-white">✕</button>
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-4 mb-4 shadow-2xl">
            <img
              src={getIconUrl(viewMode === 'view' ? selectedAccount?.name : (viewMode === 'createAccount' ? form.name : form.type))} 
              className="max-w-full max-h-full object-contain"
              alt=""
              onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/633/633600.png'; }}
            />
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tighter">
            {viewMode === 'view' ? selectedAccount?.name : (viewMode === 'createAccount' ? "New Account" : "New Connection")}
          </h2>
        </div>

        {/* Form Logic */}
        {viewMode === 'createAccount' && (
          <SidebarAccountForm form={form} errors={errors} onChange={(f, v) => setForm(p => ({...p, [f]: v}))} />
        )}
        {viewMode === 'createConnection' && (
          <SidebarConnectionForm form={form} errors={errors} onChange={(f, v) => setForm(p => ({...p, [f]: v}))} />
        )}
        {viewMode === 'view' && selectedAccount && (
          <SidebarView 
            selectedAccount={selectedAccount} 
            connections={associatedNodes} 
            onSelectAccount={onSelectAccount} 
          />
        )}
      </div>

      {/* Static Footer Buttons */}
      <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
        {viewMode !== 'view' ? (
          <button className="w-full py-3 bg-blue-600 text-white text-[10px] font-black rounded-md uppercase tracking-[0.2em]">
            Create {viewMode === 'createAccount' ? "Account" : "Connection"}
          </button>
        ) : (
          <>
            <button className="w-full py-3 bg-white/5 text-white text-[10px] font-black rounded-md uppercase tracking-[0.2em]">
              Save Changes
            </button>
            <button className="w-full py-3 border border-red-900/30 text-red-500/70 text-[10px] font-black rounded-md uppercase tracking-[0.2em]">
              Delete {isHub ? "Connection" : "Account"}
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;