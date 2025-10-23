import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { GoogleGenAI } from '@google/genai';
import SparklesIcon from './icons/SparklesIcon';
import LogoutIcon from './icons/LogoutIcon';

interface GeneratedImage {
  id: string;
  imageUrl: string;
  createdAt: string;
  userId: string; // Assuming userId is part of the interface
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingCaption, setGeneratingCaption] = useState<string | null>(null); // Keep state for caption generation
  const [captions, setCaptions] = useState<{ [key: string]: string }>({}); // Keep state for captions

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const q = query(
          collection(db, 'generated_images'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const imageList: GeneratedImage[] = [];

        querySnapshot.forEach((doc) => {
          imageList.push({
            id: doc.id,
            ...doc.data()
          } as GeneratedImage);
        });

        setImages(imageList);
      } catch (err: any) {
        console.error('Error loading history:', err);
        setError(err.message || 'خطا در بارگذاری تاریخچه تصاویر');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Keep the compressImage function from the original code if it's still needed elsewhere
  const compressImage = async (blob: Blob, maxWidth: number = 800): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        URL.revokeObjectURL(url);

        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (compressedBlob) => {
            if (compressedBlob) {
              resolve(compressedBlob);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          0.8
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Image load failed'));
      };

      img.src = url;
    });
  };

  // Keep the generateInstagramCaption function from the original code
  const generateInstagramCaption = async (imageUrl: string, imageId: string) => {
    setGeneratingCaption(imageId);

    try {
      // Check if API_KEY is available
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("API key not found");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // Fetch image and convert to base64
      const base64 = await new Promise<string>(async (resolve, reject) => {
        try {
          // Added credentials: 'include' if Firebase requires it or 'same-origin' if appropriate.
          // If the image is publicly accessible, 'omit' might be fine.
          const response = await fetch(imageUrl, {
            mode: 'cors', // CORS mode is often needed for cross-origin fetches
            credentials: 'omit' // Adjust if needed
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            const result = reader.result as string;

            // Simplified image compression logic within the fetch,
            // or can be handled by the compressImage function if preferred.
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const maxWidth = 800;
              let width = img.width;
              let height = img.height;

              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');
              if (!ctx) {
                resolve(result); // Fallback if context is not available
                return;
              }

              ctx.drawImage(img, 0, 0, width, height);

              try {
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(dataUrl);
              } catch (e) {
                resolve(result); // Fallback if toDataURL fails
              }
            };

            img.onerror = () => resolve(result); // Fallback on image load error
            img.src = result;
          };

          reader.onerror = () => reject(new Error('Error reading image')); // Changed from Persian
          reader.readAsDataURL(blob);
        } catch (e: any) {
          reject(new Error(e.message || 'Error downloading image')); // Changed from Persian
        }
      });

      const match = base64.match(/^data:(image\/.+);base64,(.+)$/);
      if (!match) throw new Error('Invalid image format'); // Changed from Persian

      const prompt = `این یک عکس فشن و محصول پوشاک است که برای اینستاگرام باید کپشن جذاب و خلاقانه بنویسی.

      یک کپشن فارسی برای اینستاگرام بنویس که:
      - خلاقانه و جذاب باشد
      - امجی‌های مناسب داشته باشد (حداقل 3-5 امجی)
      - بین 2 تا 4 خط باشد
      - برای فروش محصول جذاب باشد
      - هشتگ‌های مرتبط داشته باشد

      فقط کپشن را بنویس، بدون توضیح اضافی.`;

      const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const result = await model.generateContent([
        {
          inlineData: {
            data: match[2],
            mimeType: match[1],
          },
        },
        prompt,
      ]);

      const response = await result.response;
      const caption = response.text() || 'Caption not generated';
      setCaptions(prev => ({ ...prev, [imageId]: caption }));

    } catch (error: any) {
      console.error('Error generating caption:', error);
      let errorMessage = 'Error generating caption'; // Changed from Persian

      // More specific error handling for fetch errors
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Image download failed - please try again'; // Changed from Persian
      } else if (error.message) {
        errorMessage = error.message;
      }

      setCaptions(prev => ({ ...prev, [imageId]: `❌ ${errorMessage}` }));
    } finally {
      setGeneratingCaption(null);
    }
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error("Sign out error", error));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                تاریخچه تصاویر من
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-semibold"
              >
                بازگشت به پنل تولید
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center p-2 rounded-full text-slate-600 bg-white shadow-md hover:bg-slate-100 transition-colors"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <svg className="animate-spin h-16 w-16 text-violet-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-violet-600 font-semibold text-lg">در حال بارگذاری...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-red-700 mb-2">خطا در بارگذاری</h3>
            <p className="text-red-500 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all font-semibold"
            >
              <SparklesIcon className="w-5 h-5" />
              تلاش مجدد
            </button>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <SparklesIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">هنوز تصویری تولید نکرده‌اید</h3>
            <p className="text-gray-500 mb-6">برای شروع، به پنل تولید تصویر بروید</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all font-semibold"
            >
              <SparklesIcon className="w-5 h-5" />
              شروع تولید تصویر
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={image.imageUrl}
                    alt="Generated"
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      // Basic fallback for broken images
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="lightgray"/></svg>';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {new Date(image.createdAt).toLocaleDateString('fa-IR')}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <button
                    onClick={() => generateInstagramCaption(image.imageUrl, image.id)}
                    disabled={generatingCaption === image.id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-l from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingCaption === image.id ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال تولید...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        تولید کپشن اینستاگرام
                      </>
                    )}
                  </button>

                  {captions[image.id] && (
                    <div className="bg-gray-50 rounded-xl p-4 relative">
                      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {captions[image.id]}
                      </p>
                      <button
                        onClick={() => copyToClipboard(captions[image.id])}
                        className="absolute top-2 left-2 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        title="کپی کردن"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;