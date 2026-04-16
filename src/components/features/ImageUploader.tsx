'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { isValidImageType, isValidImageSize } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onUpload(file);
      setUploaded(true);
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
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

  return (
    <div className="w-full">
      {/* Drop Zone - Smaller */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer transition-all duration-300
          border-2 border-dashed rounded-xl p-8
          bg-white/5 backdrop-blur-sm
          ${isDragging ? 'border-cyan bg-cyan/10' : 'border-white/20 hover:border-cyan/50'}
          ${uploaded ? 'border-green-500/50 bg-green-500/5' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan/20 to-electric-violet/20 border border-cyan/30">
            {uploaded ? (
              <CheckCircle2 className="w-7 h-7 text-green-400" />
            ) : (
              <Upload className="w-7 h-7 text-cyan" />
            )}
          </div>

          {/* Text */}
          <div className="text-center">
            {uploaded ? (
              <p className="text-white font-medium">Ready to process</p>
            ) : (
              <>
                <p className="text-white font-medium mb-1">Drop image here</p>
                <p className="text-white/40 text-xs">or click to browse</p>
              </>
            )}
          </div>

          {/* File types */}
          {!uploaded && (
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <ImageIcon className="w-3 h-3" />
              <span>JPEG, PNG, WebP, GIF (max 10MB)</span>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-400 text-xs bg-red-500/10 px-3 py-2 rounded-lg">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}