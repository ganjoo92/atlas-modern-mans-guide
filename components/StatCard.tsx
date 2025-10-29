import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  // Fix: Changed icon prop type to be compatible with React.FC
  icon: React.FC<React.ComponentProps<'svg'>>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-lg border border-gray-700/50">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-gray-700 mr-4 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
