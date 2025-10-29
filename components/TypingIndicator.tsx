import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1.5 p-1">
      <div className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-accent rounded-full animate-bounce"></div>
    </div>
  );
};

export default TypingIndicator;
