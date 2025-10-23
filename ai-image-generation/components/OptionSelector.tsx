import React, { useState } from 'react';
import type { Option } from '../types';

interface OptionSelectorProps {
  title: string;
  options: Option[] | Record<string, Option[]>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ title, options, selectedId, onSelect }) => {
  const isCategorized = !Array.isArray(options);
  const categories = isCategorized ? Object.keys(options) : [];
  const [currentCategory, setCurrentCategory] = useState(isCategorized ? categories[0] : '');

  const optionsToShow = isCategorized ? (options as Record<string, Option[]>)[currentCategory] : (options as Option[]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-slate-700 mb-2">{title}</h2>
      
      {isCategorized && (
        <div className="mb-4 relative">
          <select
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 transition"
            aria-label="Select model category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {optionsToShow.map((option) => (
          <div
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
              selectedId === option.id ? 'ring-4 ring-indigo-500 shadow-lg' : 'ring-2 ring-transparent hover:ring-indigo-300'
            }`}
          >
            <img src={option.imageUrl} alt={option.name} className="w-full h-32 object-cover" />
            <div className={`p-2 text-center text-sm font-medium ${selectedId === option.id ? 'bg-indigo-500 text-white' : 'bg-white text-slate-700'}`}>
              {option.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;