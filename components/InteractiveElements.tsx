import React, { useState } from 'react';
import { Target, LightBulbIcon, Star, Edit } from './Icons';

interface ActionItemProps {
  id: string;
  text: string;
  completed?: boolean;
  onToggle: (id: string, completed: boolean) => void;
}

export const ActionItem: React.FC<ActionItemProps> = ({ id, text, completed = false, onToggle }) => {
  return (
    <div className="flex items-start space-x-3 p-3 bg-secondary/50 rounded-lg border border-gray-600">
      <button
        onClick={() => onToggle(id, !completed)}
        className={`mt-1 transition-colors ${completed ? 'text-green-400' : 'text-gray-400 hover:text-accent'}`}
      >
        <span className="text-lg">{completed ? '✓' : '○'}</span>
      </button>
      <span className={`text-sm ${completed ? 'text-green-400 line-through' : 'text-text-secondary'}`}>
        {text}
      </span>
    </div>
  );
};

interface ReflectionPromptProps {
  question: string;
  placeholder?: string;
  onSave: (response: string) => void;
}

export const ReflectionPrompt: React.FC<ReflectionPromptProps> = ({ 
  question, 
  placeholder = "Write your thoughts...", 
  onSave 
}) => {
  const [response, setResponse] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (response.trim()) {
      onSave(response);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 my-6">
      <div className="flex items-start space-x-3 mb-4">
        <LightBulbIcon className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-text-primary mb-2">Reflection</h4>
          <p className="text-text-secondary text-sm">{question}</p>
        </div>
      </div>
      
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-primary border border-gray-600 rounded-lg text-text-primary placeholder-gray-400 focus:border-accent focus:outline-none resize-none"
        rows={3}
      />
      
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-text-secondary">
          {response.length} characters
        </span>
        <button
          onClick={handleSave}
          disabled={!response.trim()}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved 
              ? 'bg-green-400 text-black' 
              : response.trim()
                ? 'bg-accent text-primary hover:bg-accent/90'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {saved ? '✓ Saved' : 'Save Reflection'}
        </button>
      </div>
    </div>
  );
};

interface QuickQuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  onComplete: (correct: boolean) => void;
}

export const QuickQuiz: React.FC<QuickQuizProps> = ({ 
  question, 
  options, 
  correctAnswer, 
  explanation,
  onComplete 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
      const isCorrect = selectedAnswer === correctAnswer;
      onComplete(isCorrect);
    }
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="bg-primary border border-gray-600 rounded-lg p-6 my-6">
      <div className="flex items-start space-x-3 mb-4">
        <Target className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-text-primary mb-2">Quick Check</h4>
          <p className="text-text-secondary">{question}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && setSelectedAnswer(index)}
            disabled={showResult}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              showResult
                ? index === correctAnswer
                  ? 'border-green-400 bg-green-400/10 text-green-400'
                  : index === selectedAnswer && !isCorrect
                    ? 'border-red-400 bg-red-400/10 text-red-400'
                    : 'border-gray-600 bg-secondary/50 text-text-secondary'
                : selectedAnswer === index
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-gray-600 bg-secondary hover:border-gray-500 text-text-secondary'
            }`}
          >
            <span className="font-medium mr-2">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>

      {!showResult ? (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedAnswer !== null
              ? 'bg-accent text-primary hover:bg-accent/90'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Answer
        </button>
      ) : (
          <div className="space-y-3">
            <div className={`flex items-center space-x-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              <span className="text-lg">{isCorrect ? '✓' : '✗'}</span>
              <span className="font-medium">
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </span>
            </div>          {explanation && (
            <div className="bg-secondary/50 p-3 rounded-lg">
              <p className="text-sm text-text-secondary">{explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface TakeawayCardProps {
  title: string;
  content: string;
  category?: string;
  onSave: (takeaway: { title: string; content: string; category?: string }) => void;
}

export const TakeawayCard: React.FC<TakeawayCardProps> = ({ 
  title, 
  content, 
  category, 
  onSave 
}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ title, content, category });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-accent/5 border-l-4 border-accent rounded-r-lg p-6 my-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="h-5 w-5 text-accent" />
            <h4 className="font-semibold text-text-primary">Key Takeaway</h4>
            {category && (
              <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                {category}
              </span>
            )}
          </div>
          
          <h5 className="font-medium text-text-primary mb-2">{title}</h5>
          <p className="text-text-secondary text-sm">{content}</p>
        </div>
        
        <button
          onClick={handleSave}
          className={`ml-4 p-2 rounded-lg transition-colors ${
            saved 
              ? 'bg-green-400 text-black' 
              : 'bg-accent/10 text-accent hover:bg-accent/20'
          }`}
          title="Save to your takeaways"
        >
          {saved ? <span className="text-sm">✓</span> : <Edit className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

interface ProgressChecklistProps {
  title: string;
  items: string[];
  completedItems: string[];
  onItemToggle: (item: string, completed: boolean) => void;
}

export const ProgressChecklist: React.FC<ProgressChecklistProps> = ({ 
  title, 
  items, 
  completedItems, 
  onItemToggle 
}) => {
  const completionRate = Math.round((completedItems.length / items.length) * 100);

  return (
    <div className="bg-secondary/30 rounded-lg p-6 my-6 border border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-text-primary">{title}</h4>
        <div className="flex items-center space-x-2">
          <div className="w-24 h-2 bg-gray-700 rounded-full">
            <div 
              className="h-2 bg-accent rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-sm text-text-secondary">{completionRate}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const isCompleted = completedItems.includes(item);
          return (
            <div key={index} className="flex items-center space-x-3">
              <button
                onClick={() => onItemToggle(item, !isCompleted)}
                className={`transition-colors ${
                  isCompleted ? 'text-green-400' : 'text-gray-400 hover:text-accent'
                }`}
              >
                <span className="text-sm">{isCompleted ? '✓' : '○'}</span>
              </button>
              <span className={`text-sm ${
                isCompleted ? 'text-green-400 line-through' : 'text-text-secondary'
              }`}>
                {item}
              </span>
            </div>
          );
        })}
      </div>

      {completionRate === 100 && (
        <div className="mt-4 p-3 bg-green-400/10 border border-green-400/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 text-lg">✓</span>
            <span className="text-green-400 font-medium">All tasks completed! 🎉</span>
          </div>
        </div>
      )}
    </div>
  );
};