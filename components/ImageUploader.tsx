
import React, { useRef } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
  uploadedImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-slate-700 mb-2">1. Upload Clothing Item</h2>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <label
        className={`group flex justify-center items-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ease-in-out ${
          uploadedImage 
            ? 'border-indigo-400 bg-indigo-50' 
            : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded clothing" className="max-h-full max-w-full object-contain rounded-lg p-2" />
        ) : (
          <div className="text-center text-slate-500">
            <UploadIcon className="mx-auto h-10 w-10 mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <p className="font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm">PNG, JPG, or WEBP</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;
