import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from './firebase';

import { CATEGORIZED_MODELS, ALL_MODELS, BACKGROUNDS } from './constants';
import { generateFashionImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import OptionSelector from './components/OptionSelector';
import GeneratedImageDisplay from './components/GeneratedImageDisplay';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import SamplesPage from './components/SamplesPage';
import AdminPanel from './components/AdminPanel';
import SparklesIcon from './components/icons/SparklesIcon';
import LogoutIcon from './components/icons/LogoutIcon';
import type { Option } from './types';

// Helper to fetch an image from a URL and convert it to a base64 string
const imageUrlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  // Throw an error if the network response is not ok
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

function MainApp() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const isReadyToGenerate = useMemo(() => {
    return uploadedImage && selectedModelId && selectedBackgroundId;
  }, [uploadedImage, selectedModelId, selectedBackgroundId]);

  const handleGenerateClick = async () => {
    if (!isReadyToGenerate || !uploadedImage) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const selectedModel = ALL_MODELS.find(m => m.id === selectedModelId) as Option;
    const selectedBackground = BACKGROUNDS.find(b => b.id === selectedBackgroundId) as Option;

    try {
      const modelImageBase64 = await imageUrlToBase64(selectedModel.imageUrl);
      const resultImage = await generateFashionImage(uploadedImage, modelImageBase64, selectedBackground);
      setGeneratedImage(resultImage);
    } catch (e: any) {
      console.error("Generation failed:", e);
      setError(e.message || 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedModelId(null);
    setSelectedBackgroundId(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error("Sign out error", error));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="mb-8">
            <div className="flex justify-between items-center">
                <div className="text-center flex-grow">
                     <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
                        Fashion AI <span className="text-indigo-600">Photoshoot</span>
                    </h1>
                    <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
                        Create professional product photos in seconds. Upload your clothing item, pick a model and a background, and let AI do the rest.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 hidden sm:block">{user.email}</span>
                    <button 
                        onClick={handleSignOut} 
                        className="flex items-center justify-center p-2 rounded-full text-slate-600 bg-white shadow-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        aria-label="Sign out"
                    >
                       <LogoutIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Panel: Controls */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-8 flex flex-col">
            <ImageUploader onImageUpload={setUploadedImage} uploadedImage={uploadedImage} />
            <OptionSelector 
              title="2. Choose a Model"
              options={CATEGORIZED_MODELS} 
              selectedId={selectedModelId} 
              onSelect={setSelectedModelId} 
            />
            <OptionSelector 
              title="3. Pick a Background"
              options={BACKGROUNDS} 
              selectedId={selectedBackgroundId} 
              onSelect={setSelectedBackgroundId} 
            />
             <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleGenerateClick}
                disabled={!isReadyToGenerate || isLoading}
                className="w-full flex-grow inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300"
              >
                <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
                {isLoading ? 'Generating...' : 'Generate Photoshoot'}
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-4 border border-slate-300 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right Panel: Display */}
          <div className="flex items-center justify-center">
             <GeneratedImageDisplay image={generatedImage} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <MainApp /> : <LandingPage />} />
          <Route path="/samples" element={<SamplesPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
    </Router>
  );
}

export default App;