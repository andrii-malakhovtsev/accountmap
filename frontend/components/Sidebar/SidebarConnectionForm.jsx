import React from 'react';

const SidebarConnectionForm = ({ form, errors, onChange }) => {
  const getConnectionPlaceholder = () => {
    switch (form.type) {
      case 'mail': return 'e.g. Gmail, ProtonMail';
      case 'phone': return 'e.g. Personal iPhone';
      case 'auth': return 'e.g. Yubikey, Authy';
      default: return 'Connection Name';
    }
  };

  const getInputClass = (field) => {
    const base = "w-full bg-white/5 border rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all";
    if (!form[field]) return `${base} border-white/10 focus:border-blue-500/50`;
    return errors[field] 
      ? `${base} border-red-500/50 bg-red-500/5` 
      : `${base} border-green-500/50 bg-green-500/5`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Service Type</label>
        <select 
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none appearance-none cursor-pointer"
          value={form.type}
          onChange={e => onChange('type', e.target.value)}
        >
          <option value="mail" className="bg-[#1a1a1a]">Mail</option>
          <option value="phone" className="bg-[#1a1a1a]">Phone</option>
          <option value="auth" className="bg-[#1a1a1a]">Auth App</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1 flex justify-between">
          Connection Name {errors.name && form.name && <span className="text-red-500 lowercase font-normal italic text-[9px]">Required</span>}
        </label>
        <input 
          className={getInputClass('name')}
          placeholder={getConnectionPlaceholder()}
          value={form.name}
          onChange={e => onChange('name', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1 flex justify-between">
          Value {errors.value && form.value && <span className="text-red-500 lowercase font-normal italic text-[9px]">Invalid format</span>}
        </label>
        <input 
          className={getInputClass('value')}
          placeholder={form.type === 'phone' ? '+1 (555) 000-0000' : 'user@example.com'}
          value={form.value}
          onChange={e => onChange('value', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Internal Notes</label>
        <textarea 
          rows="4"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500/50 resize-none outline-none"
          placeholder="Security context..."
          value={form.notes}
          onChange={e => onChange('notes', e.target.value)}
        />
      </div>
    </div>
  );
};

export default SidebarConnectionForm;