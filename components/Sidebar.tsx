import React from 'react';
import type { View, NavItem } from '../types';
import { SparklesIcon } from './Icons';

interface SidebarSection {
  title?: string;
  items: NavItem[];
}

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  navSections: SidebarSection[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, navSections }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-secondary to-primary flex flex-col p-6 shadow-2xl">
      <div className="mb-10">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-accent to-accent-light rounded-xl shadow-glass">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold ml-3 text-text-primary bg-gradient-to-r from-text-primary to-accent bg-clip-text text-transparent">
            Atlas
          </h1>
        </div>
        <p className="mt-2 text-xs text-text-secondary uppercase tracking-[0.3em]">
          Forge Your Edge
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-6 pr-1">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title ?? `section-${sectionIndex}`} className="space-y-2">
            {section.title && (
              <p className="text-xs uppercase tracking-wide text-text-secondary/70 px-2">{section.title}</p>
            )}
            <div className="flex flex-col space-y-2">
              {section.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-accent to-accent-light text-white font-semibold shadow-card-hover scale-105'
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary hover:shadow-card hover:scale-102'
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 transition-all duration-300 ${
                      currentView === item.id ? 'text-white' : 'text-text-secondary group-hover:text-accent'
                    }`}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
