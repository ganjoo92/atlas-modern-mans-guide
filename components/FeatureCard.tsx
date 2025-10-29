import React from 'react';

interface FeatureCardProps {
  // Fix: Changed icon prop type to be compatible with React.FC, which can return null.
  icon: React.FC<React.ComponentProps<'svg'>>;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-gradient-to-br from-surface to-secondary/80 p-6 rounded-2xl shadow-card hover:shadow-card-hover border border-border/50 hover:border-accent/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 backdrop-blur-sm"
    >
      <div className="flex items-center mb-4">
        <div className="p-3 bg-gradient-to-r from-accent/20 to-accent-light/20 rounded-xl group-hover:from-accent/30 group-hover:to-accent-light/30 transition-all duration-300">
          <Icon className="h-6 w-6 text-accent group-hover:text-accent-light transition-colors duration-300" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary ml-4 group-hover:text-accent transition-colors duration-300">{title}</h3>
      </div>
      <p className="text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors duration-300">{description}</p>
      
      <div className="mt-4 flex items-center text-accent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-sm font-medium">Explore</span>
        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default FeatureCard;