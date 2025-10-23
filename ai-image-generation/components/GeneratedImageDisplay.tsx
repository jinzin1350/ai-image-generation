
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface GeneratedImageDisplayProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center">
      <svg className="animate-spin h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-slate-600 font-medium">Generating your AI photoshoot...</p>
      <p className="text-sm text-slate-500">This may take a moment.</p>
  </div>
);

const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({ image, isLoading, error }) => {
  return (
    <div className="w-full h-full bg-slate-200 rounded-2xl flex items-center justify-center p-4 aspect-square lg:aspect-[3/4]">
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-600 bg-red-100 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Generation Failed</h3>
          <p>{error}</p>
        </div>
      ) : image ? (
        <img src={image} alt="Generated fashion photoshoot" className="max-h-full max-w-full object-contain rounded-xl shadow-2xl" />
      ) : (
        <div className="text-center text-slate-500">
          <SparklesIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-600">Your AI Photoshoot</h3>
          <p className="mt-1">Your generated image will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default GeneratedImageDisplay;
