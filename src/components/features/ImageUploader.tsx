'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { isValidImageType, isValidImageSize } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!isValidImageType(file)) {
        setError('Invalid file. Use JPEG, PNG, WebP, or GIF.');
        return;
      }

      if (!isValidImageSize(file, 10)) {
        setError('File too large. Max 10MB.');
        return;
      }

      onUpload(file);
      setUploaded(true);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="hidden"
      />

      {/* Square Upload Box */}
      <div 
        onClick={handleClick}
        className={`
          aspect-square w-full max-w-sm mx-auto flex flex-col items-center justify-center cursor-pointer rounded-2xl
          border-2 border-dashed transition-all duration-300
          ${uploaded 
            ? 'border-green-500 bg-green-500/10' 
            : 'border-white/30 hover:border-cyan hover:bg-white/5'
          }
        `}
      >
        {/* Icon */}
        <div className="mb-4">
          {uploaded ? (
            <CheckCircle2 className="w-14 h-14 text-green-400" />
          ) : (
            <Upload className="w-14 h-14 text-white/50" />
          )}
        </div>

        {/* Text Lines with spacing */}
        <div className="text-center space-y-1">
          {uploaded ? (
            <p className="text-white text-lg font-medium">Image ready</p>
          ) : (
            <>
              <p className="text-white text-lg font-medium">Click to upload</p>
              <p className="text-white/40">or drag and drop</p>
            </>
          )}
        </div>
        
        {!uploaded && (
          <p className="text-white/30 text-sm mt-3">JPEG, PNG, WebP, GIF up to 10MB</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center gap-2 text-red-400 text-sm mt-4">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}