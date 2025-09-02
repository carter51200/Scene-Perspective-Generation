
import React from 'react';
import { CameraIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-cyan-400/20 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500/20 p-2 rounded-lg">
             <CameraIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">
              Forensic Spatial Analyzer
            </h1>
            <p className="text-sm text-cyan-300">
              AI-Powered Scene Perspective Generation
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
