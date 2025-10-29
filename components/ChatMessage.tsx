
import React from 'react';
import { MessageAuthor, ChatMessage } from '../types';
import { SparklesIcon, UserIcon } from './Icons';
import TypingIndicator from './TypingIndicator';

interface ChatMessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

// Function to clean up markdown formatting for better UI display
const cleanText = (text: string): string => {
  return text
    // Remove excessive asterisks and clean up bold formatting
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **bold** markers
    .replace(/\*([^*]+)\*/g, '$1') // Remove *italic* markers
    // Clean up bullet points
    .replace(/^\* \*\*/gm, '• ') // Replace * ** with clean bullet
    .replace(/^\*/gm, '•') // Replace * with bullet
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double
    .trim();
};

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, isLoading }) => {
  const isMentor = message.author === MessageAuthor.MENTOR;
  const showTypingIndicator = isMentor && isLoading && !message.text;

  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`flex items-start my-2 ${isMentor ? '' : 'justify-end'}`}>
      <div className={`flex items-start ${isMentor ? 'flex-row' : 'flex-row-reverse'} max-w-2xl`}>
        <div
          className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${isMentor ? 'bg-accent' : 'bg-secondary'}`}
        >
          {isMentor ? <SparklesIcon className="h-6 w-6 text-primary" /> : <UserIcon className="h-6 w-6 text-text-primary" />}
        </div>
        <div className={`flex flex-col ${isMentor ? 'items-start' : 'items-end'}`}>
            <div
            className={`relative mx-3 px-4 py-3 rounded-2xl shadow ${
                isMentor
                ? 'bg-secondary text-text-primary rounded-bl-none'
                : 'bg-accent text-primary rounded-br-none'
            }`}
            >
            {showTypingIndicator ? (
                <TypingIndicator />
            ) : (
                <p className="text-base whitespace-pre-wrap leading-relaxed">
                {cleanText(message.text)}
                {isMentor && isLoading && <span className="inline-block w-0.5 h-4 bg-text-primary animate-pulse ml-1 align-middle"></span>}
                </p>
            )}
            </div>
            {(message.text || showTypingIndicator) && (
                 <p className="text-xs text-text-secondary mt-1 mx-4">{formattedTime}</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageComponent;
