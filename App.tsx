import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

import { CATEGORIZED_MODELS, ALL_MODELS, BACKGROUNDS } from './constants';
import { generateFashionImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import OptionSelector from './components/OptionSelector';
import GeneratedImageDisplay from './components/GeneratedImageDisplay';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import SamplesPage from './components/SamplesPage';
import AdminPanel from './components/AdminPanel';
import HistoryPage from './components/HistoryPage';
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

function MainApp({ user }: { user: User }) {
  const navigate = useNavigate();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<number>(1);
  const [productDetails, setProductDetails] = useState({
    productType: '',
    color: '',
    style: '',
    modelPose: '',
    lightingStyle: '',
    shotType: ''
  });

  const isReadyToGenerate = useMemo(() => {
    return uploadedImage && selectedModelId && selectedBackgroundId && 
           productDetails.productType && productDetails.color && 
           productDetails.style && productDetails.modelPose &&
           productDetails.lightingStyle && productDetails.shotType;
  }, [uploadedImage, selectedModelId, selectedBackgroundId, productDetails]);

  const handleGenerateClick = async () => {
    if (!isReadyToGenerate || !uploadedImage) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const selectedModel = ALL_MODELS.find(m => m.id === selectedModelId) as Option;
    const selectedBackground = BACKGROUNDS.find(b => b.id === selectedBackgroundId) as Option;

    try {
      const modelImageBase64 = await imageUrlToBase64(selectedModel.imageUrl);
      const resultImage = await generateFashionImage(
        uploadedImage, 
        modelImageBase64, 
        selectedBackground,
        productDetails
      );
      setGeneratedImage(resultImage);

      // Convert base64 to blob
      const base64Response = await fetch(resultImage);
      const blob = await base64Response.blob();

      const fileName = `${user.id}/${Date.now()}.png`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('generated')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('generated')
        .getPublicUrl(fileName);

      // Save to Supabase database
      const { error: dbError } = await supabase
        .from('generated_images')
        .insert({
          user_id: user.id,
          image_url: urlData.publicUrl,
          created_at: new Date().toISOString(),
        });

      if (dbError) throw dbError;
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
    setProductDetails({
      productType: '',
      color: '',
      style: '',
      modelPose: '',
      lightingStyle: '',
      shotType: ''
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut().catch((error) => console.error("Sign out error", error));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">
                Fashion AI
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 hidden sm:block">{user.email}</span>
              <button
                onClick={() => navigate('/history')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                My History
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Sign out"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Create Stunning Product Photos with AI
          </h2>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Transform your clothing items into professional photoshoots in seconds. Just upload, select, and generate.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${uploadedImage ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white'}`}>
                {uploadedImage ? '✓' : '1'}
              </div>
              <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:block">Upload</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedModelId ? 'bg-green-500 text-white' : uploadedImage ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                {selectedModelId ? '✓' : '2'}
              </div>
              <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:block">Model</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedBackgroundId ? 'bg-green-500 text-white' : selectedModelId ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                {selectedBackgroundId ? '✓' : '3'}
              </div>
              <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:block">Background</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isReadyToGenerate ? 'bg-green-500 text-white' : selectedBackgroundId ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                {isReadyToGenerate ? '✓' : '4'}
              </div>
              <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:block">Details</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Upload */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div
                onClick={() => setExpandedSection(expandedSection === 1 ? 0 : 1)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 cursor-pointer hover:from-indigo-600 hover:to-purple-600 transition-colors"
              >
                <h3 className="text-white font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="bg-white text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                    Upload Your Product
                  </span>
                  <span className="text-2xl">{expandedSection === 1 ? '−' : '+'}</span>
                </h3>
              </div>
              {expandedSection === 1 && (
                <div className="p-6">
                  <ImageUploader onImageUpload={(img) => { setUploadedImage(img); setExpandedSection(2); }} uploadedImage={uploadedImage} />
                </div>
              )}
            </div>

            {/* Step 2: Model */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div
                onClick={() => uploadedImage && setExpandedSection(expandedSection === 2 ? 0 : 2)}
                className={`bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 transition-colors ${uploadedImage ? 'cursor-pointer hover:from-indigo-600 hover:to-purple-600' : 'opacity-60 cursor-not-allowed'}`}
              >
                <h3 className="text-white font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="bg-white text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                    Choose Your Model
                  </span>
                  <span className="text-2xl">{expandedSection === 2 ? '−' : '+'}</span>
                </h3>
              </div>
              {expandedSection === 2 && uploadedImage && (
                <div className="p-6">
                  <OptionSelector
                    title=""
                    options={CATEGORIZED_MODELS}
                    selectedId={selectedModelId}
                    onSelect={(id) => { setSelectedModelId(id); setExpandedSection(3); }}
                  />
                </div>
              )}
            </div>

            {/* Step 3: Background */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div
                onClick={() => selectedModelId && setExpandedSection(expandedSection === 3 ? 0 : 3)}
                className={`bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 transition-colors ${selectedModelId ? 'cursor-pointer hover:from-indigo-600 hover:to-purple-600' : 'opacity-60 cursor-not-allowed'}`}
              >
                <h3 className="text-white font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="bg-white text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                    Select Background
                  </span>
                  <span className="text-2xl">{expandedSection === 3 ? '−' : '+'}</span>
                </h3>
              </div>
              {expandedSection === 3 && selectedModelId && (
                <div className="p-6">
                  <OptionSelector
                    title=""
                    options={BACKGROUNDS}
                    selectedId={selectedBackgroundId}
                    onSelect={(id) => { setSelectedBackgroundId(id); setExpandedSection(4); }}
                  />
                </div>
              )}
            </div>

            {/* Step 4: Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div
                onClick={() => selectedBackgroundId && setExpandedSection(expandedSection === 4 ? 0 : 4)}
                className={`bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 transition-colors ${selectedBackgroundId ? 'cursor-pointer hover:from-indigo-600 hover:to-purple-600' : 'opacity-60 cursor-not-allowed'}`}
              >
                <h3 className="text-white font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="bg-white text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                    Customize Details
                  </span>
                  <span className="text-2xl">{expandedSection === 4 ? '−' : '+'}</span>
                </h3>
              </div>
              {expandedSection === 4 && selectedBackgroundId && (
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Product Type</label>
                  <select 
                    value={productDetails.productType}
                    onChange={(e) => setProductDetails({...productDetails, productType: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select...</option>
                    <option value="T-shirt">T-shirt</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Pants">Pants</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Dress">Dress</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <input 
                    type="text"
                    value={productDetails.color}
                    onChange={(e) => setProductDetails({...productDetails, color: e.target.value})}
                    placeholder="e.g., Blue, Red, Black"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Style</label>
                  <select 
                    value={productDetails.style}
                    onChange={(e) => setProductDetails({...productDetails, style: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select...</option>
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                    <option value="Sport">Sport</option>
                    <option value="Elegant">Elegant</option>
                    <option value="Streetwear">Streetwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Model Pose</label>
                  <select 
                    value={productDetails.modelPose}
                    onChange={(e) => setProductDetails({...productDetails, modelPose: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select...</option>
                    <option value="Standing naturally">Standing naturally</option>
                    <option value="Walking">Walking</option>
                    <option value="Sitting">Sitting</option>
                    <option value="Leaning">Leaning</option>
                    <option value="Dynamic pose">Dynamic pose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Lighting Style</label>
                  <select 
                    value={productDetails.lightingStyle}
                    onChange={(e) => setProductDetails({...productDetails, lightingStyle: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select...</option>
                    <option value="Soft studio lighting">Soft studio lighting</option>
                    <option value="Natural daylight">Natural daylight</option>
                    <option value="Dramatic side lighting">Dramatic side lighting</option>
                    <option value="Bright and even">Bright and even</option>
                    <option value="Moody and atmospheric">Moody and atmospheric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Shot Type</label>
                  <select 
                    value={productDetails.shotType}
                    onChange={(e) => setProductDetails({...productDetails, shotType: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select...</option>
                    <option value="Full body shot">Full body shot</option>
                    <option value="3/4 length shot">3/4 length shot</option>
                    <option value="Upper body close-up">Upper body close-up</option>
                    <option value="Detail shot">Detail shot</option>
                  </select>
                </div>
              </div>
            </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGenerateClick}
                  disabled={!isReadyToGenerate || isLoading}
                  className="flex-1 inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                >
                  <SparklesIcon className="w-6 h-6 mr-2" />
                  {isLoading ? 'Generating Magic...' : 'Generate Photoshoot'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-4 border-2 border-slate-300 text-base font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Result Display */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    Your AI Photoshoot
                  </h3>
                </div>
                <div className="p-6">
                  <GeneratedImageDisplay image={generatedImage} isLoading={isLoading} error={error} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    );
  }

  const HomeElement = () => {
    if (user) {
      return <MainApp user={user} />;
    }
    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }
    return <Auth />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeElement />} />
        <Route path="/samples" element={<SamplesPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/history" element={user ? <HistoryPage /> : <LandingPage onGetStarted={() => setShowLanding(false)} />} />
      </Routes>
    </Router>
  );
}

export default App;