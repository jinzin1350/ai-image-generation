
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import SparklesIcon from './icons/SparklesIcon';

interface Sample {
  id: string;
  category: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  createdAt: string;
}

interface SamplesByCategory {
  [category: string]: Sample[];
}

const SamplesPage: React.FC = () => {
  const navigate = useNavigate();
  const [samples, setSamples] = useState<SamplesByCategory>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSamples = async () => {
      try {
        const { data, error } = await supabase
          .from('samples')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const loadedSamples: Sample[] = data.map(item => ({
          id: item.id,
          category: item.category,
          beforeImageUrl: item.before_image_url,
          afterImageUrl: item.after_image_url,
          createdAt: item.created_at,
        }));

        // Group by category
        const grouped: SamplesByCategory = {};
        loadedSamples.forEach(sample => {
          if (!grouped[sample.category]) {
            grouped[sample.category] = [];
          }
          grouped[sample.category].push(sample);
        });

        setSamples(grouped);
      } catch (error) {
        console.error('Error loading samples:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSamples();
  }, []);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-l from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                فتوشوت هوشمند
              </h1>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-l from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 font-semibold text-sm"
            >
              ورود به پنل
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 rounded-full px-5 py-2 mb-6">
            <SparklesIcon className="w-5 h-5 text-violet-600" />
            <span className="text-violet-700 font-semibold text-sm">نمونه کارهای تولید شده با Gemini AI</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            قبل و بعد از
            <br />
            <span className="bg-gradient-to-l from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              تولید تصاویر
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            ببینید چگونه هوش مصنوعی ما محصولات شما را به عکس‌های استودیویی حرفه‌ای تبدیل می‌کند
          </p>
        </div>
      </section>

      {/* Samples Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <svg className="animate-spin h-16 w-16 text-violet-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-violet-600 font-semibold text-lg">در حال بارگذاری نمونه کارها...</p>
            </div>
          ) : Object.keys(samples).length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl font-semibold">هنوز نمونه کاری آپلود نشده است</p>
            </div>
          ) : (
            Object.entries(samples).map(([category, items]) => (
              <div key={category} className="mb-20 last:mb-0">
                <h3 className="text-4xl font-black text-gray-900 mb-10 text-center">
                  {category}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-12">
                  {items.map((sample) => (
                    <div key={sample.id} className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
                      <div className="grid grid-cols-2">
                        {/* Before */}
                        <div className="relative group">
                          <img
                            src={sample.beforeImageUrl}
                            alt="قبل"
                            className="w-full h-80 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute bottom-4 left-0 right-0 text-center">
                            <span className="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-bold text-sm">
                              قبل
                            </span>
                          </div>
                        </div>
                        
                        {/* After */}
                        <div className="relative group">
                          <img
                            src={sample.afterImageUrl}
                            alt="بعد"
                            className="w-full h-80 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute bottom-4 left-0 right-0 text-center">
                            <span className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold text-sm">
                              بعد
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Arrow Indicator */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-bl from-violet-600 to-indigo-600 rounded-3xl shadow-2xl p-16 text-center">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-5xl font-black text-white mb-6">
                آماده برای تولید عکس‌های خودتان؟
              </h3>
              <p className="text-2xl text-violet-100 mb-10 font-medium">
                همین الان شروع کنید و نتایج شگفت‌انگیز بگیرید
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-3 px-12 py-6 text-xl font-black text-violet-600 bg-white rounded-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <SparklesIcon className="w-7 h-7" />
                شروع رایگان
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-3xl font-black">فتوشوت هوشمند</h4>
            </div>
            <p className="text-gray-400 mb-8 text-lg font-medium">ساخته شده با قدرت هوش مصنوعی Gemini</p>
            <div className="text-sm text-gray-500 font-medium">
              © 2025 تمامی حقوق محفوظ است
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SamplesPage;
