import React from 'react';

interface GroomingCardProps {
  // Fix: Changed icon prop type to be compatible with React.FC, which can return null.
  icon: React.FC<React.ComponentProps<'svg'>>;
  title: string;
  description: string;
  onClick: () => void;
}

const GroomingCard: React.FC<GroomingCardProps> = ({ icon: Icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-secondary p-6 rounded-lg shadow-lg hover:shadow-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <div className="flex items-center mb-3">
        <Icon className="h-7 w-7 text-purple-400 mr-4" />
        <h3 className="text-xl font-bold text-text-primary">{title}</h3>
      </div>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};

export default GroomingCard;