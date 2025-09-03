import React, { useState } from 'react';
import type { GeneratedImage } from '../types';
import { DownloadIcon, EditIcon, InfoIcon, SaveIcon, CancelIcon } from './IconComponents';

interface GeneratedImageViewProps {
  shot: GeneratedImage;
  index: number;
  isFirst?: boolean;
  onRegenerate: (index: number, newPrompt: string) => void;
  onImageSelect: (shot: GeneratedImage) => void;
}

const ImagePlaceholder: React.FC = () => (
    <div className="w-full h-full bg-slate-800 flex items-center justify-center rounded-t-lg">
      <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);


export const GeneratedImageView: React.FC<GeneratedImageViewProps> = ({ shot, index, isFirst, onRegenerate, onImageSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(shot.prompt);

  const handleDownload = () => {
    if (!shot.imageUrl) return;
    const link = document.createElement('a');
    link.href = shot.imageUrl;
    const fileName = `${shot.name.replace(/\s+/g, '_')}_${shot.lens}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSave = () => {
    onRegenerate(index, editedPrompt);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedPrompt(shot.prompt);
    setIsEditing(false);
  };

  return (
    <div className={`
      bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden shadow-lg 
      transition-all duration-300 flex flex-col
      hover:border-indigo-500/50 hover:shadow-indigo-900/40 hover:scale-[1.02]
      ${isFirst ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-1 lg:col-span-1'} 
    `}>
      <div 
        className={`relative aspect-video w-full ${!shot.imageUrl ? 'bg-slate-800' : 'bg-black'} ${shot.imageUrl ? 'cursor-pointer' : ''}`}
        onClick={() => onImageSelect(shot)}
        title={shot.imageUrl ? 'Click to enlarge' : ''}
      >
        {shot.imageUrl ? (
          <img src={shot.imageUrl} alt={shot.name} className="w-full h-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
        {shot.isLoading && <LoadingSpinner />}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <div>
                <span className="inline-block bg-indigo-900/50 text-indigo-300 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                  {shot.lens}
                </span>
                <h3 className="font-bold text-lg text-white">{shot.name}</h3>
            </div>
        </div>
        <p className="text-sm text-slate-400 mt-1 flex-grow">{shot.description}</p>
        
        <div className="border-t border-slate-700 mt-4 pt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setIsPromptVisible(!isPromptVisible)} 
                    className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                    aria-label="Show prompt"
                    title="Show prompt"
                    >
                    <InfoIcon />
                </button>
                 {isEditing ? (
                    <>
                        <button 
                            onClick={handleSave} 
                            className="p-2 rounded-md text-green-400 hover:bg-green-900/50 transition-colors"
                            aria-label="Save prompt"
                            title="Save prompt"
                        >
                            <SaveIcon />
                        </button>
                        <button 
                            onClick={handleCancel} 
                            className="p-2 rounded-md text-red-400 hover:bg-red-900/50 transition-colors"
                            aria-label="Cancel edit"
                            title="Cancel edit"
                        >
                            <CancelIcon />
                        </button>
                    </>
                 ) : (
                    <button 
                        onClick={() => { setIsEditing(true); setIsPromptVisible(true); }}
                        className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                        aria-label="Edit prompt"
                        title="Edit prompt"
                    >
                        <EditIcon />
                    </button>
                 )}
            </div>
            <button
              onClick={handleDownload}
              disabled={!shot.imageUrl || shot.isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-sm text-slate-300 font-medium rounded-md hover:bg-indigo-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <DownloadIcon />
              Download
            </button>
        </div>
        {isPromptVisible && (
            <div className="mt-3 p-3 bg-slate-900/70 rounded-md">
                {isEditing ? (
                    <textarea 
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        className="w-full h-32 bg-slate-900 text-slate-300 text-xs p-2 border border-indigo-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        aria-label="Edit prompt text"
                    />
                ) : (
                    <p className="text-xs text-slate-400 font-mono">
                        {shot.prompt}
                    </p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};