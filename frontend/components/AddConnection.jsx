import React from 'react';

const AddConnection = ({ onClick, variant = "header" }) => {
  const isHeader = variant === "header";

  const styles = isHeader
    ? "flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-bold transition"
    : "px-10 py-4 border border-white/20 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded hover:bg-white/5 transition-all";

  return (
    <button className={styles} onClick={onClick}>
      <span className="text-blue-400">🔗</span>
      ADD CONNECTION
    </button>
  );
};

export default AddConnection;