import React, { useState } from "react";
import NavButton from "./NavButton";

const AnalyzeButton = ({ onResult }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (typeof onResult !== "function") {
      console.error("AnalyzeButton: onResult prop is missing!");
      return;
    }

    setIsAnalyzing(true);
    onResult(null); 
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`);
      
      if (!response.ok) {
        if (response.status === 404) throw new Error("Endpoint not found (404)");
        throw new Error("Analysis failed");
      }
      
      const data = await response.text(); 
      onResult(data);
    } catch (err) {
      console.error("AI Error:", err);
      onResult(`Error: ${err.message}. Ensure backend is running.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <NavButton
      onClick={handleAnalyze}
      icon={isAnalyzing ? "⌛" : "✨"}
      label={isAnalyzing ? "Analyzing..." : "AI Analyze"}
      subtext="Run a quick analysis of your map"
      colorClass={isAnalyzing ? "bg-blue-900/20 animate-pulse" : "bg-white/5 hover:bg-white/10"}
      iconColor="text-blue-400"
    />
  );
};

export default AnalyzeButton;