import React, { useEffect } from 'react';
import type { GeneratedImage } from '../types';
import { CloseIcon } from './IconComponents';

interface ImageModalProps {
  shot: GeneratedImage;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ shot, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!shot.imageUrl) return null;

  // Add some basic animation styles
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
    .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
  `;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      <style>{animationStyles}</style>
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <header className="p-4 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
            <div>
                <span className="inline-block bg-indigo-900/50 text-indigo-300 text-xs font-semibold px-2 py-1 rounded-full mb-1">
                    {shot.lens}
                </span>
                <h2 id="image-modal-title" className="text-xl font-bold text-white">{shot.name}</h2>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Close image view"
            >
                <CloseIcon />
            </button>
        </header>
        <div className="p-4 flex-grow overflow-y-auto">
            <img 
                src={shot.imageUrl} 
                alt={shot.name} 
                className="w-full h-auto object-contain rounded-lg"
            />
        </div>
        <footer className="p-4 border-t border-slate-700 flex-shrink-0 bg-slate-900/50">
            <p className="text-sm text-slate-400">{shot.description}</p>
        </footer>
      </div>
    </div>
  );
};