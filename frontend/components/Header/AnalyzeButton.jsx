import React, { useState } from "react";
import NavButton from "./NavButton";

const AnalyzeButton = ({ onResult }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    if (typeof onResult !== "function") return;

    setIsAnalyzing(true);
    onResult(null); 
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`);
      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.text(); 
      onResult(data);
    } catch (err) {
      onResult(`Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <NavButton
      onClick={handleAnalyze}
      disabled={isAnalyzing}
      disabledLabel="AI Thinking"
      disabledSubtext="The AI is currently analyzing your data. Please wait..."
      icon={isAnalyzing ? "⌛" : "✨"}
      label="AI Analyze"
      subtext="Run a quick analysis of your map"
      colorClass={isAnalyzing ? "bg-blue-900/20 animate-pulse" : "bg-white/5 hover:bg-white/10"}
      iconColor="text-blue-400"
    />
  );
};

export default AnalyzeButton;