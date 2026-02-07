import React from 'react';

const SidebarAccountForm = ({ form, errors, onChange }) => {
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
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1 flex justify-between">
          Service Name {errors.name && form.name && <span className="text-red-500 lowercase font-normal italic text-[9px]">Required</span>}
        </label>
        <input 
          className={getInputClass('name')}
          placeholder="e.g. Netflix, GitHub"
          value={form.name}
          onChange={e => onChange('name', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1 flex justify-between">
          Username {errors.username && form.username && <span className="text-red-500 lowercase font-normal italic text-[9px]">Required</span>}
        </label>
        <input 
          className={getInputClass('username')}
          placeholder="e.g. johndoe_99"
          value={form.username}
          onChange={e => onChange('username', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Internal Notes</label>
        <textarea 
          rows="6"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500/50 resize-none outline-none"
          placeholder="Optional notes..."
          value={form.notes}
          onChange={e => onChange('notes', e.target.value)}
        />
      </div>
    </div>
  );
};

export default SidebarAccountForm;