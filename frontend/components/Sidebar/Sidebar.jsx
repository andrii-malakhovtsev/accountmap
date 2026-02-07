import React, { useState, useEffect } from 'react';
import { getIconUrl } from './../../src/utilities/iconService';
import SidebarAccountForm from './SidebarAccountForm';
import SidebarConnectionForm from './SidebarConnectionForm'; 
import SidebarView from './SidebarView';

const Sidebar = ({ isOpen, onClose, viewMode, selectedAccount, allNodes, onSelectAccount, onSave }) => {
  const [form, setForm] = useState({ name: '', username: '', notes: '', type: 'mail', value: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ name: '', username: '', notes: '', type: 'mail', value: '' });
    setErrors({});
  }, [viewMode, isOpen]);

  const validate = (name, val, type) => {
    if (name === 'name' || name === 'username') return val.trim().length > 0;
    if (name === 'value') {
      if (type === 'mail') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (type === 'phone') return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{4,6}$/.test(val);
      return val.trim().length > 0;
    }
    return true;
  };

  const handleInputChange = (field, val) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: val };
      const isValid = validate(field, val, newForm.type);
      setErrors(errs => ({ ...errs, [field]: !isValid }));
      return newForm;
    });
  };

  const handleSaveClick = () => {
    onSave({
      ...form,
      isConnection: viewMode === 'createConnection',
      id: `node-${Date.now()}`,
    });
  };

  const isConnection = selectedAccount?.isConnection;
  const associatedNodes = isConnection 
    ? (selectedAccount.accounts || [])
    : allNodes.filter(node => node.isConnection && node.accounts?.some(acc => acc.id === selectedAccount?.id));

  const isFormValid = viewMode === 'view' ? true : (
    form.name && !errors.name && (
      viewMode === 'createAccount' 
        ? (form.username && !errors.username) 
        : (form.value && !errors.value)
    )
  );

  return (
    <aside className={`absolute right-0 top-16 bottom-0 w-80 bg-[#0f0f0f]/95 backdrop-blur-xl border-l border-white/10 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out pointer-events-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="flex flex-col items-center mb-8 relative">
          <button onClick={onClose} className="absolute -top-4 -right-4 p-2 text-gray-500 hover:text-white transition-colors">✕</button>
          
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-4 shadow-2xl mb-4 transition-transform hover:scale-105">
            <img
              src={getIconUrl(viewMode === 'view' ? selectedAccount?.name : form.name)} 
              className="max-w-full max-h-full object-contain"
              alt="" 
              onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/633/633600.png'; }}
            />
          </div>
          
          <h2 className="text-xl font-bold text-white tracking-tight text-center truncate w-full uppercase">
            {viewMode === 'view' ? (selectedAccount?.name || "Select Account") : (viewMode === 'createAccount' ? "New Account" : "New Connection")}
          </h2>
          
          <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${viewMode === 'view' ? 'text-green-500' : 'text-blue-400'}`}>
            {viewMode === 'view' ? "Secure" : "Provisioning"}
          </span>
        </div>

        {viewMode === 'createAccount' && <SidebarAccountForm form={form} errors={errors} onChange={handleInputChange} />}
        {viewMode === 'createConnection' && <SidebarConnectionForm form={form} errors={errors} onChange={handleInputChange} />}
        {viewMode === 'view' && selectedAccount && (
          <SidebarView 
            selectedAccount={selectedAccount} 
            connections={associatedNodes} 
            allNodes={allNodes} 
            onSelectAccount={onSelectAccount} 
          />
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <button 
          onClick={handleSaveClick}
          disabled={!isFormValid && viewMode !== 'view'}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed text-white text-[10px] font-black rounded-md transition uppercase tracking-[0.2em]"
        >
          {viewMode === 'view' ? "Save Changes" : (viewMode === 'createAccount' ? "Create Account" : "Create Connection")}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;