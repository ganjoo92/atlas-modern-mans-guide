import React, { useState } from 'react';
import { HYGIENE_HABITS } from '../constants';
import { SparklesIcon } from './Icons';

const HygieneChecklist: React.FC = () => {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg border border-gray-700/50">
             <div className="flex items-center mb-4">
                <SparklesIcon className="h-7 w-7 text-green-400 mr-3" />
                <h2 className="text-2xl font-bold">Daily Hygiene Habits</h2>
            </div>
            <p className="text-text-secondary mb-6">Small details make a big difference. Master these basics for a polished presence.</p>
            <div className="space-y-4">
                {HYGIENE_HABITS.map(item => (
                     <div key={item.id} className="flex items-start">
                        <button onClick={() => toggleItem(item.id)} className="flex-shrink-0 h-6 w-6 rounded-md border-2 border-gray-600 mr-4 mt-1 flex items-center justify-center transition-colors hover:border-green-500">
                           {checkedItems.has(item.id) && <div className="h-4 w-4 bg-green-500 rounded-sm"></div>}
                        </button>
                        <div>
                           <p className={`font-semibold ${checkedItems.has(item.id) ? 'line-through text-text-secondary' : 'text-text-primary'}`}>{item.name}</p>
                           <p className="text-sm text-text-secondary">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HygieneChecklist;
