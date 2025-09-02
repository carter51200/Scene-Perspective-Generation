
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  sourceImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, sourceImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="image-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative aspect-video w-full border-2 border-dashed rounded-lg flex flex-col justify-center items-center text-center p-4 cursor-pointer transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-cyan-900/30' : 'border-gray-600 hover:border-cyan-500 hover:bg-gray-800/50'}`}
      >
        {sourceImage ? (
          <img src={sourceImage} alt="Source Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <UploadIcon />
            <span className="font-semibold">Click to upload or drag & drop</span>
            <span className="text-xs">PNG, JPG, WEBP</span>
          </div>
        )}
      </label>
      <input
        type="file"
        id="image-upload"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
    </div>
  );
};
