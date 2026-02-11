
import React, { useRef } from 'react';

interface HeaderProps {
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, onImport }) => {
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    importInputRef.current?.click();
  };
  
  return (
    <header className="py-6">
      <div className="container mx-auto text-center relative px-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-light sm:text-5xl md:text-6xl">
          <span className="text-accent">InfoFi</span> Mission Control
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-medium sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Your daily tracker for check-ins & missions across the cryptoverse.
        </p>
        <div className="absolute top-0 right-4 sm:right-8 flex items-center h-full space-x-2">
            <input 
                type="file" 
                ref={importInputRef} 
                onChange={onImport} 
                className="hidden" 
                accept="application/json"
            />
            <button
              onClick={handleImportClick}
              className="px-3 py-2 text-sm bg-slate-200 hover:bg-slate-300 text-light font-bold rounded-lg transition-colors"
            >
              Import Data
            </button>
            <button
              onClick={onExport}
              className="px-3 py-2 text-sm bg-accent hover:bg-fuchsia-600 text-white font-bold rounded-lg transition-colors"
            >
              Export Data
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
