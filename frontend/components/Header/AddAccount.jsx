import React from 'react';
import NavButton from './NavButton';
import SeriousIcons from '../SeriousIcons';

const AddAccount = ({ onClick, variant = "header" }) => {
  if (variant === "header") {
    return (
      <NavButton 
        onClick={onClick} 
        icon={SeriousIcons.Plus} 
        label="New Account" 
        subtext="Create a node to represent a secure login or identity"
        colorClass="bg-blue-600/20 border-blue-500/50" 
        iconColor="text-blue-400"
      />
    );
  }

  return (
    <button 
      className="px-10 py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-2"
      onClick={onClick}
    >
      <SeriousIcons.Plus className="w-4 h-4" /> ACCOUNT
    </button>
  );
};

export default AddAccount;