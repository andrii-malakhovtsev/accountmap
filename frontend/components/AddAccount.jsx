import React from 'react';

const AddAccount = ({ onClick, variant = "header" }) => {
  const isHeader = variant === "header";
  
  const styles = isHeader 
    ? "flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-blue-900/20"
    : "px-10 py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]";

  return (
    <button className={styles} onClick={onClick}>
      <span className={isHeader ? "text-lg leading-none" : ""}>+</span>
      ADD ACCOUNT
    </button>
  );
};

export default AddAccount;