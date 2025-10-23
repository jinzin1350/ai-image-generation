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
    <div className="w-full space-y-5">
      {title && <h2 className="text-lg font-bold text-slate-800">{title}</h2>}

      {isCategorized && (
        <div className="relative">
          <select
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
            className="w-full appearance-none bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-slate-800 py-3 px-4 pr-10 rounded-xl leading-tight font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all shadow-sm"
            aria-label="Select model category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-indigo-600">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {optionsToShow.map((option) => (
          <div
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-150 ${
              selectedId === option.id
                ? 'ring-2 ring-indigo-500 shadow-lg scale-105'
                : 'ring-1 ring-slate-200 hover:ring-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="relative">
              <img src={option.imageUrl} alt={option.name} className="w-full h-16 sm:h-20 object-cover" />
              {selectedId === option.id && (
                <div className="absolute inset-0 bg-indigo-600 bg-opacity-20 flex items-center justify-center">
                  <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                </div>
              )}
            </div>
            <div className={`p-1.5 text-center text-xs font-medium transition-colors ${
              selectedId === option.id
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-50 text-slate-700'
            }`}>
              {option.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;