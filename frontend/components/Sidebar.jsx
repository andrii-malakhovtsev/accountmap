import React from 'react';
import { getIconUrl } from './../src/utilities/iconService';

const Sidebar = ({ isOpen, selectedAccount }) => {
  const activeData = selectedAccount || {
    name: "Select an Account",
    notes: ""
  };

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
          <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">
            Account Details
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
              Display Name
            </label>
            <input 
              type="text" 
              value={activeData.name}
              readOnly
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Account Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
              Internal Notes
            </label>
            <textarea 
              rows="6"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 transition-colors resize-none leading-relaxed"
              placeholder="Add security notes, access levels, or owner information..."
              defaultValue={activeData.notes}
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