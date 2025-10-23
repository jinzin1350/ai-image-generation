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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {optionsToShow.map((option) => (
          <div
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ease-in-out transform hover:scale-105 ${
              selectedId === option.id
                ? 'ring-4 ring-indigo-500 shadow-xl'
                : 'ring-2 ring-slate-200 hover:ring-indigo-300 hover:shadow-lg'
            }`}
          >
            <div className="relative">
              <img src={option.imageUrl} alt={option.name} className="w-full h-32 sm:h-36 object-cover" />
              {selectedId === option.id && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
              )}
            </div>
            <div className={`p-3 text-center text-sm font-semibold transition-colors ${
              selectedId === option.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
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