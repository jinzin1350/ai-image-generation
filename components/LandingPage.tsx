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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-violet-100 rounded-full px-5 py-2 mb-8">
                <SparklesIcon className="w-5 h-5 text-violet-600" />
                <span className="text-violet-700 font-semibold text-sm">قدرت هوش مصنوعی Gemini</span>
              </div>

              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                عکاسی استودیویی
                <br />
                <span className="bg-gradient-to-l from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  در چند ثانیه
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                محصولات خود را با مدل‌های حرفه‌ای و پس‌زمینه‌های متنوع به نمایش بگذارید.
                <br />
                بدون نیاز به استودیو و عکاس!
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onGetStarted}
                  className="group px-10 py-5 bg-gradient-to-l from-violet-600 to-indigo-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 font-bold text-lg flex items-center gap-3"
                >
                  <SparklesIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  شروع رایگان
                </button>
                <button 
                  onClick={() => navigate('/samples')}
                  className="px-10 py-5 bg-white text-gray-700 rounded-2xl border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-300 font-bold text-lg"
                >
                  مشاهده نمونه کارها
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-4xl font-black bg-gradient-to-l from-violet-600 to-indigo-600 bg-clip-text text-transparent">25+</div>
                  <div className="text-gray-600 font-medium mt-1">مدل حرفه‌ای</div>
                </div>
                <div>
                  <div className="text-4xl font-black bg-gradient-to-l from-violet-600 to-indigo-600 bg-clip-text text-transparent">20+</div>
                  <div className="text-gray-600 font-medium mt-1">پس‌زمینه جذاب</div>
                </div>
                <div>
                  <div className="text-4xl font-black bg-gradient-to-l from-violet-600 to-indigo-600 bg-clip-text text-transparent">۱۰۰%</div>
                  <div className="text-gray-600 font-medium mt-1">کیفیت استودیویی</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl float-animation">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop"
                  alt="Fashion Model"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-black text-gray-900 mb-4">دسته‌بندی مدل‌ها</h3>
            <p className="text-xl text-gray-600 font-medium">مدل مناسب برای هر نوع محصول پوشاک</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                name: 'زنانه',
                image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
                color: 'from-pink-500 to-rose-500'
              },
              {
                name: 'مردانه',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                name: 'دخترانه',
                image: 'https://images.unsplash.com/photo-1518632945996-6cb9e69ef14c?w=400&h=500&fit=crop',
                color: 'from-purple-500 to-pink-500'
              },
              {
                name: 'پسرانه',
                image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
                color: 'from-green-500 to-emerald-500'
              },
              {
                name: 'نوزادی',
                image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((category) => (
              <div key={category.name} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
                    <h4 className="text-3xl font-black text-white mb-2">{category.name}</h4>
                    <p className="text-white/90 font-semibold text-sm">5 مدل حرفه‌ای</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-black text-gray-900 mb-4">چرا فتوشوت هوشمند؟</h3>
            <p className="text-xl text-gray-600 font-medium">بهترین راه‌حل برای عکاسی محصولات</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-violet-50 to-indigo-50 p-10 rounded-3xl hover:shadow-2xl transition-all duration-300 border border-violet-100">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-4">سریع و حرفه‌ای</h4>
              <p className="text-gray-600 leading-relaxed font-medium">
                در کمتر از 30 ثانیه عکس‌های استودیویی با کیفیت بالا تولید کنید
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-violet-50 to-indigo-50 p-10 rounded-3xl hover:shadow-2xl transition-all duration-300 border border-violet-100">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-4">تنوع بی‌نظیر</h4>
              <p className="text-gray-600 leading-relaxed font-medium">
                25 مدل حرفه‌ای و 20 پس‌زمینه جذاب برای هر سلیقه‌ای
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-violet-50 to-indigo-50 p-10 rounded-3xl hover:shadow-2xl transition-all duration-300 border border-violet-100">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-4">کیفیت تضمینی</h4>
              <p className="text-gray-600 leading-relaxed font-medium">
                استفاده از هوش مصنوعی Gemini برای بالاترین کیفیت ممکن
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Gallery */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-black text-gray-900 mb-4">نمونه کارها</h3>
            <p className="text-xl text-gray-600 font-medium">نمونه‌هایی از عکس‌های تولید شده</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
              'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
              'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop'
            ].map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <img
                  src={image}
                  alt={`Example ${index + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-bl from-violet-600 to-indigo-600 rounded-3xl shadow-2xl p-16 text-center">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-5xl font-black text-white mb-6">
                آماده شروع هستید؟
              </h3>
              <p className="text-2xl text-violet-100 mb-10 font-medium">
                همین الان عکس‌های حرفه‌ای بسازید
              </p>
              <button
                onClick={onGetStarted}
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

export default LandingPage;
