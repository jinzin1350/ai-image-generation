import React from 'react';
import { useNavigate } from 'react-router-dom';
import SparklesIcon from './icons/SparklesIcon';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-l from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                فتوشوت هوشمند
              </h1>
            </div>
            <button
              onClick={onGetStarted}
              className="px-8 py-3 bg-gradient-to-l from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 font-semibold text-sm"
            >
              ورود به پنل
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-violet-100 rounded-full px-5 py-2 mb-8">
                <SparklesIcon className="w-5 h-5 text-violet-600" />
                <span className="text-violet-700 font-semibold text-sm">قدرت هوش مصنوعی Gemini</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                عکاسی استودیویی
                <br />
                <span className="bg-gradient-to-l from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  در چند ثانیه
                </span>
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                محصولات خود را با مدل‌های حرفه‌ای و پس‌زمینه‌های متنوع به نمایش بگذارید. بدون نیاز به استودیو و عکاس!
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onGetStarted}
                  className="group px-8 py-4 bg-gradient-to-l from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:shadow-violet-500/50 transition-all duration-300 font-bold text-base flex items-center gap-2"
                >
                  <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  شروع رایگان
                </button>
                <button
                  onClick={() => navigate('/samples')}
                  className="px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-300 font-bold text-base"
                >
                  مشاهده نمونه کارها
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl float-animation">
                <img
                  src="https://picsum.photos/800/1000"
                  alt="Fashion Model"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000'%3E%3Crect fill='%236366f1' width='800' height='1000'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='48'%3EModel Photo%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-gray-900 mb-3">دسته‌بندی مدل‌ها</h3>
            <p className="text-base text-gray-600 font-medium">مدل مناسب برای هر نوع محصول پوشاک</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                name: 'زنانه',
                image: 'https://picsum.photos/seed/women/400/500',
                color: 'from-pink-500 to-rose-500'
              },
              {
                name: 'مردانه',
                image: 'https://picsum.photos/seed/men/400/500',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                name: 'دخترانه',
                image: 'https://picsum.photos/seed/girls/400/500',
                color: 'from-purple-500 to-pink-500'
              },
              {
                name: 'پسرانه',
                image: 'https://picsum.photos/seed/boys/400/500',
                color: 'from-green-500 to-emerald-500'
              },
              {
                name: 'نوزادی',
                image: 'https://picsum.photos/seed/baby/400/500',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((category) => (
              <div key={category.name} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-50 group-hover:opacity-60 transition-opacity`}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                    <h4 className="text-xl font-black text-white">{category.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-gray-900 mb-3">چرا فتوشوت هوشمند؟</h3>
            <p className="text-base text-gray-600 font-medium">بهترین راه‌حل برای عکاسی محصولات</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-violet-100">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">سریع و حرفه‌ای</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                در کمتر از 30 ثانیه عکس‌های استودیویی با کیفیت بالا تولید کنید
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-violet-100">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">تنوع بی‌نظیر</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                25 مدل حرفه‌ای و 20 پس‌زمینه جذاب برای هر سلیقه‌ای
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-violet-100">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">کیفیت تضمینی</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                استفاده از هوش مصنوعی Gemini برای بالاترین کیفیت ممکن
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-bl from-violet-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-center">
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-4">
                آماده شروع هستید؟
              </h3>
              <p className="text-lg text-violet-100 mb-6 font-medium">
                همین الان عکس‌های حرفه‌ای بسازید
              </p>
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-black text-violet-600 bg-white rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <SparklesIcon className="w-5 h-5" />
                شروع رایگان
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-black">فتوشوت هوشمند</h4>
            </div>
            <p className="text-gray-400 text-sm font-medium">ساخته شده با قدرت هوش مصنوعی Gemini</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
