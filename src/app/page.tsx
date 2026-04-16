'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { ThreeBackground } from '@/components/features/ThreeBackground';
import { ImageUploader } from '@/components/features/ImageUploader';
import { ResultDisplay } from '@/components/features/ResultDisplay';
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isLoading, error, result, removeBackground, reset } = useBackgroundRemoval();

  const handleUpload = async (file: File) => {
    setSelectedFile(file);
    await removeBackground(file);
  };

  const handleReset = () => {
    setSelectedFile(null);
    reset();
  };

  return (
    <main className="min-h-screen flex flex-col relative">
      <ThreeBackground />
      
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
            Remove <span className="text-cyan">Background</span>
          </h1>
          <p className="text-white/50">Upload an image to remove its background</p>
        </div>

        {/* Content */}
        <div className="w-full max-w-sm">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-3 rounded-xl mb-4">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {result && !isLoading && (
            <ResultDisplay
              imageUrl={result}
              originalFileName={selectedFile?.name || 'image.png'}
              onDownload={() => {}}
              onReset={handleReset}
            />
          )}

          {isLoading && (
            <div className="text-center py-16">
              <div className="w-12 h-12 mx-auto border-4 border-white/20 rounded-full border-t-cyan animate-spin mb-4" />
              <p className="text-white/70">Processing...</p>
            </div>
          )}

          {!result && !isLoading && (
            <ImageUploader onUpload={handleUpload} />
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}