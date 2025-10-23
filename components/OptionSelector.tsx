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
    <div className="w-full space-y-4">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>

      {isCategorized && (
        <div className="relative">
          <select
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-700 py-2.5 px-4 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
            aria-label="Select model category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {optionsToShow.map((option) => (
          <div
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ease-in-out transform hover:scale-105 ${
              selectedId === option.id ? 'ring-3 ring-indigo-500 shadow-md' : 'ring-1 ring-slate-200 hover:ring-indigo-300 hover:shadow-sm'
            }`}
          >
            <img src={option.imageUrl} alt={option.name} className="w-full h-24 sm:h-28 object-cover" />
            <div className={`p-2 text-center text-xs sm:text-sm font-medium transition-colors ${selectedId === option.id ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-700'}`}>
              {option.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;