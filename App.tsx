import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageView } from './components/GeneratedImageView';
import { generateImageFromPrompt } from './services/geminiService';
import { SHOT_PROFILES } from './constants';
import type { GeneratedImage } from './types';
import { ErrorIcon, SparklesIcon } from './components/IconComponents';
import { ImageModal } from './components/ImageModal';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceMimeType, setSourceMimeType] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSourceImage(reader.result as string);
      setSourceMimeType(file.type);
      setGeneratedImages([]);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!sourceImage || !sourceMimeType) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(SHOT_PROFILES.map(p => ({ ...p, imageUrl: null, isLoading: true })));

    // data:image/png;base64, -> remove this prefix
    const base64Data = sourceImage.split(',')[1];

    try {
      const imageGenerationPromises = SHOT_PROFILES.map(profile =>
        generateImageFromPrompt(base64Data, sourceMimeType, profile.prompt)
      );

      const results = await Promise.allSettled(imageGenerationPromises);

      const newGeneratedImages = SHOT_PROFILES.map((profile, index) => {
        const result = results[index];
        if (result.status === 'fulfilled') {
          return { ...profile, imageUrl: result.value, isLoading: false };
        } else {
          console.error(`Failed to generate image for "${profile.name}":`, result.reason);
          return { ...profile, imageUrl: null, isLoading: false }; // Keep placeholder on individual failure
        }
      });
      setGeneratedImages(newGeneratedImages);

    } catch (err) {
      console.error('Error generating images:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate images. ${errorMessage}`);
      setGeneratedImages([]); // Clear placeholders on error
    } finally {
      setIsLoading(false);
    }
  }, [sourceImage, sourceMimeType]);

  const handleRegenerateImage = useCallback(async (index: number, newPrompt: string) => {
    if (!sourceImage || !sourceMimeType) {
      setError('Source image is missing.');
      return;
    }

    setGeneratedImages(prev => 
      prev.map((image, i) => i === index ? { ...image, isLoading: true } : image)
    );

    const base64Data = sourceImage.split(',')[1];

    try {
      const result = await generateImageFromPrompt(base64Data, sourceMimeType, newPrompt);
      setGeneratedImages(prev =>
        prev.map((image, i) => i === index ? { ...image, imageUrl: result, prompt: newPrompt, isLoading: false } : image)
      );
    } catch (err) {
      console.error(`Error regenerating image at index ${index}:`, err);
      // Optionally set an error on the specific image, for now, we just stop loading
      setGeneratedImages(prev =>
        prev.map((image, i) => i === index ? { ...image, isLoading: false } : image)
      );
      setError(`Failed to regenerate image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [sourceImage, sourceMimeType]);

  const handleSelectImage = (image: GeneratedImage) => {
    if (image.imageUrl) {
      setSelectedImage(image);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
          <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">1. Upload Source Image</h2>
              <ImageUploader onImageUpload={handleImageUpload} sourceImage={sourceImage} />
            </div>
            <div className="w-full lg:w-2/3 mt-4 lg:mt-0">
               <h2 className="text-xl font-semibold text-indigo-400 mb-4">2. Generate Perspectives</h2>
               <p className="text-slate-400 mb-6">
                 Click the button to analyze the spatial composition and generate 5 consistent master plates with different camera perspectives. You can refine each shot individually after generation.
               </p>
              <button
                onClick={handleGenerate}
                disabled={!sourceImage || isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-indigo-900/50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Perspectives...
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    Analyze & Generate Shots
                  </>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="w-full bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
              <ErrorIcon />
              <strong>Error:</strong> {error}
            </div>
          )}

          {(generatedImages.length > 0) && (
            <div className="w-full mt-8">
              <h2 className="text-2xl font-bold text-center text-indigo-400 mb-8">Generated Master Plates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((img, index) => (
                  <GeneratedImageView 
                    key={index} 
                    index={index}
                    shot={img} 
                    isFirst={index===0} 
                    onRegenerate={handleRegenerateImage}
                    onImageSelect={handleSelectImage}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      {selectedImage && (
        <ImageModal
          shot={selectedImage}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;