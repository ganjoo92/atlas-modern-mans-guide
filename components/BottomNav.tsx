
import React from 'react';
import type { View, NavItem } from '../types';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
  navItems: NavItem[];
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, navItems }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-secondary to-primary border-t border-border backdrop-blur-lg bg-opacity-90 flex justify-around p-3 shadow-glass">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center justify-center flex-1 p-3 rounded-xl transition-all duration-300 ${
            currentView === item.id 
              ? 'text-accent bg-surface shadow-card scale-105' 
              : 'text-text-secondary hover:text-accent hover:bg-surface hover:scale-102'
          }`}
        >
          <item.icon className={`h-6 w-6 mb-1 transition-all duration-300 ${
            currentView === item.id ? 'text-accent' : 'text-text-secondary'
          }`} />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
