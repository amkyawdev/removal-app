'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn, isValidImageType, isValidImageSize } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function ImageUploader({ onUpload, isLoading = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!isValidImageType(file)) {
        setError('Invalid file type. Please upload JPEG, PNG, WebP, or GIF.');
        return;
      }

      if (!isValidImageSize(file, 10)) {
        setError('File too large. Maximum size is 10MB.');
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

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative cursor-pointer transition-all duration-500',
          'border-2 border-dashed rounded-2xl p-12',
          'bg-white/5 backdrop-blur-sm',
          isDragging 
            ? 'border-cyan bg-cyan/10 scale-[1.02]' 
            : 'border-white/20 hover:border-cyan/50 hover:bg-white/10',
          isLoading && 'pointer-events-none opacity-50',
          uploaded && 'border-green-500/50 bg-green-500/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center gap-6">
          {/* Icon */}
          <div
            className={cn(
              'w-20 h-20 rounded-2xl flex items-center justify-center',
              'bg-gradient-to-br from-cyan/20 to-electric-violet/20',
              'border border-cyan/30 shadow-lg shadow-cyan/10',
              uploaded && 'bg-green-500/20 border-green-500/30'
            )}
          >
            {uploaded ? (
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            ) : (
              <Upload className="w-10 h-10 text-cyan" />
            )}
          </div>

          {/* Text */}
          <div className="text-center">
            {uploaded ? (
              <p className="text-xl font-semibold text-white">
                Image Ready for Processing
              </p>
            ) : (
              <>
                <p className="text-xl font-semibold text-white mb-2">
                  Drag & drop your image here
                </p>
                <p className="text-white/50">
                  or click to browse files
                </p>
              </>
            )}
          </div>

          {/* File Info */}
          {!uploaded && (
            <div className="flex items-center gap-2 text-sm text-white/40">
              <ImageIcon className="w-4 h-4" />
              <span>JPEG, PNG, WebP, GIF (max 10MB)</span>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="mt-4 relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded-xl shadow-2xl border border-white/10"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}