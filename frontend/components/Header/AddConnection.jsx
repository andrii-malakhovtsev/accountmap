import React from 'react';
import NavButton from './NavButton';

const AddConnection = ({ onClick, variant = "header" }) => {
  if (variant === "header") {
    return (
      <NavButton 
        onClick={onClick} 
        icon="🔗" 
        label="Add Connection" 
        subtext="Define a way you secure accounts"
        colorClass="bg-white/5 hover:bg-white/10" 
        iconColor="text-blue-400"
      />
    );
  }

  return (
    <button 
      className="px-10 py-4 border border-white/20 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded hover:bg-white/5 transition-all flex items-center gap-3"
      onClick={onClick}
    >
      <span className="text-blue-400 text-lg">🔗</span>
      <div>
        <span className="block text-left uppercase font-black text-[11px] tracking-[0.2em]">Add Connection</span>
      </div>
    </button>
  );
};

export default AddConnection;