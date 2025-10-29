import React, { useState } from 'react';
import { WARDROBE_ESSENTIALS } from '../constants';
import { ScissorsIcon } from './Icons';

const WardrobeChecklist: React.FC = () => {
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
                <ScissorsIcon className="h-7 w-7 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold">Wardrobe Essentials</h2>
            </div>
            <p className="text-text-secondary mb-6">Build a versatile wardrobe with these timeless pieces. Focus on fit and quality.</p>
            <div className="space-y-4">
                {WARDROBE_ESSENTIALS.map(item => (
                    <div key={item.id} className="flex items-start">
                        <button onClick={() => toggleItem(item.id)} className="flex-shrink-0 h-6 w-6 rounded-md border-2 border-gray-600 mr-4 mt-1 flex items-center justify-center transition-colors hover:border-purple-500">
                           {checkedItems.has(item.id) && <div className="h-4 w-4 bg-purple-500 rounded-sm"></div>}
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

export default WardrobeChecklist;
