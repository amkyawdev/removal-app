'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn, formatFileSize, isValidImageType, isValidImageSize } from '@/lib/utils';
import { GlassCard } from './GlassCard';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageUploader({
  onUpload,
  isLoading = false,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  maxSizeMB = 10,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!isValidImageType(file)) {
        setError('Invalid file type. Please upload JPEG, PNG, WebP, or GIF.');
        return;
      }

      if (!isValidImageSize(file, maxSizeMB)) {
        setError(`File too large. Maximum size is ${maxSizeMB}MB.`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onUpload(file);
    },
    [onUpload, maxSizeMB]
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
    <GlassCard className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative cursor-pointer transition-all duration-300',
          'border-2 border-dashed rounded-xl p-8',
          'hover:border-electric-violet/50 hover:bg-white/5',
          isDragging && 'border-electric-violet bg-electric-violet/10 scale-[1.02]',
          isLoading && 'pointer-events-none opacity-50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {preview ? (
            <div className="relative w-full max-w-md">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">
                  Click to change image
                </span>
              </div>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br from-cyan/20 to-electric-violet/20',
                  'border border-cyan/30'
                )}
              >
                <Upload className="w-8 h-8 text-cyan" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white/90">
                  Drag & drop your image here
                </p>
                <p className="text-sm text-white/60 mt-1">
                  or click to browse files
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <ImageIcon className="w-4 h-4" />
                <span>JPEG, PNG, WebP, GIF (max {maxSizeMB}MB)</span>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </GlassCard>
  );
}