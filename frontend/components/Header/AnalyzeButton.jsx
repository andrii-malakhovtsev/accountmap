import React, { useState } from "react";
import NavButton from "./NavButton";
import SeriousIcons from "../SeriousIcons";

const AnalyzeButton = ({ onResult }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    onResult(null); 
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`);
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
      icon={isAnalyzing ? SeriousIcons.Loading : SeriousIcons.Sparkle}
      label="AI Analyze"
      subtext="Run pattern analysis on your map."
      colorClass={isAnalyzing ? "bg-blue-600/10 animate-pulse" : "bg-white/5"}
      iconColor="text-blue-400"
    />
  );
};

export default AnalyzeButton;