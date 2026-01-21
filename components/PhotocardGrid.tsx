
import React, { useState } from 'react';
import { Photocard, IdolCategory } from '../types';

interface PhotocardGridProps {
  cards: Photocard[];
  selectedCategory: IdolCategory | 'All';
  isEditMode?: boolean;
  onUpdateCard?: (cardId: string, updatedTags: string[]) => void;
  onDeleteCard?: (cardId: string) => void;
}

const PhotocardGrid: React.FC<PhotocardGridProps> = ({ cards, selectedCategory, isEditMode, onUpdateCard, onDeleteCard }) => {
  const [selectedTag, setSelectedTag] = useState<string | 'All'>('All');
  const [newTagInput, setNewTagInput] = useState<{ [key: string]: string }>({});

  const categoryFiltered = selectedCategory === 'All' 
    ? cards 
    : cards.filter(c => c.category === selectedCategory);

  // Extract unique tags for the selected category
  const availableTags = Array.from(new Set(
    categoryFiltered.flatMap(c => c.tags || [])
  )).sort();

  const finalFiltered = selectedTag === 'All'
    ? categoryFiltered
    : categoryFiltered.filter(c => c.tags?.includes(selectedTag));

  // Reset tag selection when category changes
  React.useEffect(() => {
    setSelectedTag('All');
  }, [selectedCategory]);

  const handleAddTag = (cardId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onUpdateCard) {
      const val = newTagInput[cardId]?.trim();
      if (val) {
        const card = cards.find(c => c.id === cardId);
        const currentTags = card?.tags || [];
        if (!currentTags.includes(val)) {
          onUpdateCard(cardId, [...currentTags, val]);
        }
        setNewTagInput(prev => ({ ...prev, [cardId]: '' }));
      }
    }
  };

  const removeTag = (cardId: string, tagToRemove: string) => {
    if (onUpdateCard) {
      const card = cards.find(c => c.id === cardId);
      const updatedTags = (card?.tags || []).filter(t => t !== tagToRemove);
      onUpdateCard(cardId, updatedTags);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tag/Hashtag sub-filter */}
      {availableTags.length > 0 && (
        <div className="px-6 flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button 
            onClick={() => setSelectedTag('All')}
            className={`text-[8px] uppercase tracking-widest px-2 py-1 rounded-full border transition-all ${selectedTag === 'All' ? 'bg-black text-white border-black' : 'border-black/20 text-black/40'}`}
          >
            #All
          </button>
          {availableTags.map(tag => (
            <button 
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`text-[8px] uppercase tracking-widest px-2 py-1 rounded-full border transition-all ${selectedTag === tag ? 'bg-black text-white border-black' : 'border-black/20 text-black/40'}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 grid grid-cols-2 gap-4">
        {finalFiltered.map((card) => (
          <div key={card.id} className="group relative aspect-[2/3] bg-white overflow-hidden border border-[#cbc9c4] p-1 flex flex-col">
            <div className="flex-1 overflow-hidden relative">
              <img 
                src={card.url} 
                alt={card.title} 
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${isEditMode ? 'opacity-40 grayscale' : 'grayscale-[0.2] group-hover:grayscale-0'}`}
              />
              
              {/* Delete Button in Edit Mode */}
              {isEditMode && onDeleteCard && (
                <button 
                  onClick={() => onDeleteCard(card.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg animate-in fade-in zoom-in duration-300 z-10"
                >
                  ✕
                </button>
              )}

              {!isEditMode && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white pointer-events-none">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-tighter leading-tight">{card.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {card.tags?.map(t => (
                        <span key={t} className="text-[7px] font-bold opacity-80">#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Tag Editor UI in Edit Mode */}
            {isEditMode && (
              <div className="p-2 bg-[#f8f7f5] border-t border-[#cbc9c4] animate-in fade-in slide-in-from-bottom-1">
                <div className="flex flex-wrap gap-1 mb-2 max-h-[40px] overflow-y-auto no-scrollbar">
                  {card.tags?.map(t => (
                    <span 
                      key={t} 
                      onClick={() => removeTag(card.id, t)}
                      className="text-[7px] font-bold bg-black text-white px-1 py-0.5 rounded-sm cursor-pointer hover:bg-red-500 flex items-center gap-1"
                    >
                      #{t} <span className="text-[6px] opacity-50">✕</span>
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={newTagInput[card.id] || ''}
                  onChange={(e) => setNewTagInput(prev => ({ ...prev, [card.id]: e.target.value }))}
                  onKeyDown={(e) => handleAddTag(card.id, e)}
                  placeholder="+ #tag"
                  className="w-full text-[8px] uppercase tracking-widest font-bold bg-transparent border-b border-black/10 focus:outline-none focus:border-black py-1"
                />
              </div>
            )}
          </div>
        ))}
        {finalFiltered.length === 0 && (
          <div className="col-span-2 py-20 text-center opacity-40 italic text-sm">
            No items found in this section.
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotocardGrid;
