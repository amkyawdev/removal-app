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
      {/* Drop Zone - No border */}
      <div
        onClick={handleClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        role="button"
        tabIndex={0}
        className={`
          cursor-pointer py-12 text-center transition-all duration-300
          hover:opacity-80
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleChange}
          className="hidden"
        />

        {/* Icon */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-white/10">
          {uploaded ? (
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          ) : (
            <Upload className="w-6 h-6 text-white/60" />
          )}
        </div>

        {/* Text */}
        {uploaded ? (
          <p className="text-white/80 text-sm">Ready - click to change</p>
        ) : (
          <>
            <p className="text-white font-medium text-sm mb-1">Drop image or click to upload</p>
            <p className="text-white/40 text-xs">JPEG, PNG, WebP, GIF (max 10MB)</p>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 px-3 py-2 rounded-lg">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}