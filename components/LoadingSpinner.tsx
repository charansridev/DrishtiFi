import React, { useState, useEffect } from 'react';

// Stages of the simulated loading process
const loadingStages = [
  { threshold: 0, message: "Analyzing physical assets..." },
  { threshold: 20, message: "Reading handwritten ledger..." },
  { threshold: 40, message: "Assessing inventory value..." },
  { threshold: 60, message: "Calculating daily sales volume..." },
  { threshold: 80, message: "Synthesizing trust score..." },
  { threshold: 95, message: "Finalizing recommendations..." },
];

export const LoadingSpinner: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(loadingStages[0].message);

  useEffect(() => {
    // Simulate progress with a timer
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        // We stop at 99% to give the impression of waiting for the final step
        if (prevProgress >= 99) {
          clearInterval(interval);
          return 99;
        }
        
        const newProgress = prevProgress + 1;
        
        // Find the current message to display based on the progress
        const currentStage = loadingStages.slice().reverse().find(stage => newProgress >= stage.threshold);
        if (currentStage) {
          setMessage(currentStage.message);
        }
        
        return newProgress;
      });
    }, 150); // This timing simulates a ~15 second process to reach 99%

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-6 text-lg font-semibold text-slate-700 dark:text-slate-200">Generating Report</p>
      
      {/* Progress Bar and Percentage Display */}
      <div className="w-full mt-4">
        <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 transition-opacity duration-500" aria-live="polite">
                {message}
            </p>
            <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">{`${Math.round(progress)}%`}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div 
                className="bg-cyan-600 h-2.5 rounded-full transition-all duration-150 ease-linear" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>
    </div>
  );
};