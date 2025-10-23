
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { GoogleGenAI } from "@google/genai";
import SparklesIcon from './icons/SparklesIcon';
import LogoutIcon from './icons/LogoutIcon';
import { signOut } from "firebase/auth";

interface GeneratedImage {
  id: string;
  imageUrl: string;
  createdAt: string;
  userId: string;
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingCaption, setGeneratingCaption] = useState<string | null>(null);
  const [captions, setCaptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/');
        return;
      }

      const q = query(
        collection(db, 'generated_images'),
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const loadedImages: GeneratedImage[] = [];
      
      querySnapshot.forEach((doc) => {
        loadedImages.push({
          id: doc.id,
          ...doc.data()
        } as GeneratedImage);
      });

      // Sort by createdAt in JavaScript
      loadedImages.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setImages(loadedImages);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const generateInstagramCaption = async (imageUrl: string, imageId: string) => {
    setGeneratingCaption(imageId);
    
    try {
      if (!process.env.API_KEY) {
        throw new Error("کلید API یافت نشد");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Fetch image and convert to base64
      const base64 = await new Promise<string>(async (resolve, reject) => {
        try {
          const response = await fetch(imageUrl, {
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const blob = await response.blob();
          const reader = new FileReader();
          
          reader.onloadend = () => {
            const result = reader.result as string;
            
            // Compress if needed
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
                resolve(result);
                return;
              }
              
              ctx.drawImage(img, 0, 0, width, height);
              
              try {
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(dataUrl);
              } catch (e) {
                resolve(result);
              }
            };
            
            img.onerror = () => resolve(result);
            img.src = result;
          };
          
          reader.onerror = () => reject(new Error('خطا در خواندن تصویر'));
          reader.readAsDataURL(blob);
        } catch (e: any) {
          reject(new Error(e.message || 'خطا در دانلود تصویر'));
        }
      });

      const match = base64.match(/^data:(image\/.+);base64,(.+)$/);
      if (!match) throw new Error('فرمت تصویر نامعتبر است');

      const prompt = `این یک عکس فشن و محصول پوشاک است که برای اینستاگرام باید کپشن جذاب و خلاقانه بنویسی.
      
      یک کپشن فارسی برای اینستاگرام بنویس که:
      - خلاقانه و جذاب باشد
      - امجی‌های مناسب داشته باشد (حداقل 3-5 امجی)
      - بین 2 تا 4 خط باشد
      - برای فروش محصول جذاب باشد
      - هشتگ‌های مرتبط داشته باشد
      
      فقط کپشن را بنویس، بدون توضیح اضافی.`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: {
          parts: [
            {
              inlineData: {
                data: match[2],
                mimeType: match[1],
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      const caption = result.text || 'کپشن تولید نشد';
      setCaptions(prev => ({ ...prev, [imageId]: caption }));
      
    } catch (error: any) {
      console.error('Error generating caption:', error);
      let errorMessage = 'خطا در تولید کپشن';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'خطا در دانلود تصویر - لطفاً دوباره امتحان کنید';
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
