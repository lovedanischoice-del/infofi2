
import React, { useState, useRef, useCallback } from 'react';

interface ImageDropzoneProps {
  logo: string | null;
  onLogoChange: (base64: string | null) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ logo, onLogoChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file.');
    }
  }, [onLogoChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleRemoveLogo = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onLogoChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-medium mb-1">Logo</label>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-accent' : 'border-slate-300'} border-dashed rounded-md transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-2 text-center w-full" onClick={handleClick} style={{ cursor: 'pointer' }}>
          {logo ? (
            <div className="relative inline-block">
                <img src={logo} alt="Logo preview" className="mx-auto h-24 w-24 object-contain rounded-md" />
                <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 leading-none hover:bg-red-700"
                    aria-label="Remove logo"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
          ) : (
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <div className="flex text-sm justify-center">
            <p className="pl-1 text-medium">
              {logo ? 'Click or drag to replace' : 'Upload a file or drag and drop'}
            </p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageDropzone;