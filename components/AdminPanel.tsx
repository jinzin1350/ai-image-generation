
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../firebase';
import SparklesIcon from './icons/SparklesIcon';
import UploadIcon from './icons/UploadIcon';

interface SampleUpload {
  category: string;
  beforeImage: File | null;
  afterImage: File | null;
  beforePreview: string | null;
  afterPreview: string | null;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [upload, setUpload] = useState<SampleUpload>({
    category: 'زنانه',
    beforeImage: null,
    afterImage: null,
    beforePreview: null,
    afterPreview: null,
  });

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (type: 'before' | 'after', file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUpload(prev => ({
          ...prev,
          [`${type}Image`]: file,
          [`${type}Preview`]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!upload.beforeImage || !upload.afterImage) {
      setError('لطفاً هر دو تصویر قبل و بعد را آپلود کنید');
      return;
    }

    setLoading(true);

    try {
      // Upload before image to Firebase Storage
      const beforeRef = ref(storage, `samples/${Date.now()}_before_${upload.beforeImage.name}`);
      await uploadBytes(beforeRef, upload.beforeImage);
      const beforeUrl = await getDownloadURL(beforeRef);

      // Upload after image to Firebase Storage
      const afterRef = ref(storage, `samples/${Date.now()}_after_${upload.afterImage.name}`);
      await uploadBytes(afterRef, upload.afterImage);
      const afterUrl = await getDownloadURL(afterRef);

      // Save to Firestore
      await addDoc(collection(db, 'samples'), {
        category: upload.category,
        beforeImageUrl: beforeUrl,
        afterImageUrl: afterUrl,
        createdAt: new Date().toISOString(),
      });

      setSuccess('نمونه با موفقیت آپلود شد!');
      
      // Reset form
      setUpload({
        category: 'زنانه',
        beforeImage: null,
        afterImage: null,
        beforePreview: null,
        afterPreview: null,
      });

      if (beforeInputRef.current) beforeInputRef.current.value = '';
      if (afterInputRef.current) afterInputRef.current.value = '';

    } catch (err) {
      console.error('Error uploading sample:', err);
      setError('خطا در آپلود نمونه. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
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
                پنل ادمین
              </h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            آپلود نمونه کار جدید
          </h2>
          <p className="text-gray-600 mb-8 font-medium">
            تصاویر قبل و بعد را برای نمایش در صفحه نمونه کارها آپلود کنید
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Selection */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                دسته‌بندی
              </label>
              <select
                value={upload.category}
                onChange={(e) => setUpload(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 font-semibold text-gray-700"
              >
                <option value="زنانه">زنانه</option>
                <option value="مردانه">مردانه</option>
                <option value="دخترانه">دخترانه</option>
                <option value="پسرانه">پسرانه</option>
              </select>
            </div>

            {/* Before Image Upload */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                تصویر قبل (محصول اصلی)
              </label>
              <input
                ref={beforeInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('before', e.target.files?.[0] || null)}
                className="hidden"
              />
              <div
                onClick={() => beforeInputRef.current?.click()}
                className="group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-violet-500 hover:bg-violet-50 transition-all"
              >
                {upload.beforePreview ? (
                  <img
                    src={upload.beforePreview}
                    alt="قبل"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-violet-500 mb-3" />
                    <p className="text-gray-600 font-semibold">کلیک کنید یا تصویر را بکشید</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP</p>
                  </div>
                )}
              </div>
            </div>

            {/* After Image Upload */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                تصویر بعد (تولید شده)
              </label>
              <input
                ref={afterInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('after', e.target.files?.[0] || null)}
                className="hidden"
              />
              <div
                onClick={() => afterInputRef.current?.click()}
                className="group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-violet-500 hover:bg-violet-50 transition-all"
              >
                {upload.afterPreview ? (
                  <img
                    src={upload.afterPreview}
                    alt="بعد"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-violet-500 mb-3" />
                    <p className="text-gray-600 font-semibold">کلیک کنید یا تصویر را بکشید</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 font-semibold text-center">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-600 font-semibold text-center">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !upload.beforeImage || !upload.afterImage}
              className="w-full py-4 bg-gradient-to-l from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال آپلود...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  آپلود نمونه کار
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
