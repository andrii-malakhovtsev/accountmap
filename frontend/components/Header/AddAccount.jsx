import React from 'react';
import NavButton from './NavButton';

const AddAccount = ({ onClick, variant = "header" }) => {
  if (variant === "header") {
    return (
      <NavButton 
        onClick={onClick} 
        icon="+" 
        label="New Account" 
        subtext="Create a node to represent a secure login or identity"
        colorClass="bg-blue-600 shadow-blue-900/40" 
        iconColor="text-white font-bold"
      />
    );
  }

  return (
    <button 
      className="px-10 py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
      onClick={onClick}
    >
      <span>+</span> ACCOUNT
    </button>
  );
};

export default AddAccount;