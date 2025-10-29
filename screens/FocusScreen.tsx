import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, ArrowPathIcon } from '../components/Icons';

const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

const FocusScreen: React.FC = () => {
  const [time, setTime] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && time > 0) {
      timerRef.current = setInterval(() => {
        setTime(t => t - 1);
      }, 1000);
    } else if (time === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      // Vibrate and play a sound
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      
      setIsActive(false);
      if (isBreak) {
        setIsBreak(false);
        setTime(FOCUS_TIME);
      } else {
        setIsBreak(true);
        setTime(BREAK_TIME);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, time, isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setIsBreak(false);
    setTime(FOCUS_TIME);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = isBreak ? ((BREAK_TIME - time) / BREAK_TIME) * 100 : ((FOCUS_TIME - time) / FOCUS_TIME) * 100;

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center pb-16 md:pb-0">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">Focus Mode</h1>
        <p className="text-lg text-text-secondary mt-2">
          {isBreak ? "Time for a short break. Recharge." : "Commit to a block of uninterrupted work."}
        </p>
      </header>

      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
          <circle className="text-secondary" strokeWidth="5" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className="text-accent"
            strokeWidth="5"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={(2 * Math.PI * 45) * (1 - progress / 100)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        </svg>
        <div className="relative z-10">
          <h2 className="text-6xl md:text-7xl font-bold font-mono text-text-primary">{formatTime(time)}</h2>
        </div>
      </div>
      
      <div className="flex items-center space-x-6 mt-8">
        <button onClick={resetTimer} className="p-4 rounded-full bg-secondary hover:bg-gray-700 transition-colors" aria-label="Reset Timer">
          <ArrowPathIcon className="w-8 h-8 text-text-secondary" />
        </button>
        <button onClick={toggleTimer} className="p-6 rounded-full bg-accent text-primary hover:bg-sky-300 transition-colors" aria-label={isActive ? 'Pause Timer' : 'Start Timer'}>
          {isActive ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
        </button>
        <div className="w-20"></div>
      </div>
    </div>
  );
};

export default FocusScreen;
