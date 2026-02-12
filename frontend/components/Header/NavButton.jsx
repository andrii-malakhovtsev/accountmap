import React from 'react';

const NavButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  subtext, 
  colorClass = "bg-white/5", 
  iconColor = "text-slate-400",
  disabled = false,
  disabledLabel, 
  disabledSubtext 
}) => {
  return (
    <div className={`group relative flex items-center justify-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <button 
        onClick={disabled ? null : onClick}
        disabled={disabled}
        className={`flex items-center justify-center w-9 h-9 ${colorClass} border border-white/10 rounded-md transition-all cursor-pointer
          ${disabled 
            ? 'opacity-20 pointer-events-none' 
            : 'hover:bg-white/10 hover:border-blue-500/50 active:scale-95'}`}
        aria-label={label}
      >
        {Icon && <Icon className={`w-4 h-4 ${iconColor} transition-colors group-hover:text-blue-400`} />}
      </button>

      {/* Tooltip logic remains same... */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-[100] origin-top">
        <div className="bg-[#0d1117] border border-white/10 p-2 rounded-md shadow-2xl w-40 text-center">
          <p className="text-[10px] font-bold text-white uppercase tracking-tight">
            {disabled ? (disabledLabel || "Locked") : label}
          </p>
          {subtext && (
            <p className="text-[9px] text-slate-500 mt-1 leading-tight normal-case">
              {disabled ? (disabledSubtext || "Unavailable") : subtext}
            </p>
          )}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0d1117] border-t border-l border-white/10 rotate-45" />
        </div>
      </div>
    </div>
  );
};

export default NavButton;