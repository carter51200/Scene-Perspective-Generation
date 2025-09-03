import React from 'react';
import { CameraIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-indigo-500/20 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/20 p-2 rounded-lg">
             <CameraIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">
              FOCUS
            </h1>
            <p className="text-sm text-indigo-300">
              Five-Output Composition from a Unified Source
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};