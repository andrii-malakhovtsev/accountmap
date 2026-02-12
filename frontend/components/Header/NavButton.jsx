import React from 'react';

const NavButton = ({ 
  onClick, 
  icon, 
  label, 
  subtext, 
  colorClass = "bg-white/5", 
  iconColor = "text-white",
  disabled = false,
  disabledLabel, 
  disabledSubtext 
}) => {
  return (
    <div className={`group relative flex items-center justify-center ${disabled ? 'cursor-not-allowed' : ''}`}>
      <button 
        onClick={disabled ? null : onClick}
        disabled={disabled}
        className={`flex items-center justify-center w-9 h-9 ${colorClass} border border-white/10 rounded-lg transition-all 
          ${disabled 
            ? 'opacity-30 grayscale pointer-events-none' 
            : 'hover:brightness-110 active:scale-95'}`}
        aria-label={label}
      >
        <span className={`${iconColor} text-lg leading-none`}>{icon}</span>
      </button>

      {/* TOOLTIP */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-[100] origin-top">
        <div className="bg-[#151515] border border-white/10 p-3 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl w-48 text-center">
          
          <p className="text-[10px] font-black text-white uppercase tracking-[0.15em] mb-1">
            {disabled ? (disabledLabel || "Disabled in List") : label}
          </p>
          
          {subtext && (
            <p className="text-[9px] text-gray-500 font-medium leading-relaxed normal-case">
              {disabled 
                ? (disabledSubtext || "Switch back to Map View to change dimensions.") 
                : subtext}
            </p>
          )}

          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#151515] border-t border-l border-white/10 rotate-45" />
        </div>
      </div>
    </div>
  );
};

export default NavButton;