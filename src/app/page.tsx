'use client';

import { useState } from 'react';
import { Sparkles, AlertCircle, Zap, Shield } from 'lucide-react';
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
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <ThreeBackground />
      
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-cyan" />
            <span className="text-xs text-white/60">AI-Powered</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Remove Background
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-electric-violet"> Instantly</span>
          </h1>
          
          <p className="text-sm text-white/50 max-w-md mx-auto">
            Upload your image and let AI remove the background in seconds. 
            Free, fast, and private.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-md space-y-6">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Result */}
          {result && !isLoading && (
            <ResultDisplay
              imageUrl={result}
              originalFileName={selectedFile?.name || 'image.png'}
              onDownload={() => {}}
              onReset={handleReset}
            />
          )}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="w-10 h-10 mx-auto border-3 border-white/20 rounded-full border-t-cyan animate-spin mb-3" />
              <p className="text-white/60 text-sm">Processing...</p>
            </div>
          )}

          {/* Upload */}
          {!result && !isLoading && (
            <ImageUploader onUpload={handleUpload} />
          )}
        </div>

        {/* Features */}
        <div className="mt-12 flex gap-6">
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl">
            <Zap className="w-4 h-4 text-cyan" />
            <span className="text-white/70 text-sm">Fast</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl">
            <Shield className="w-4 h-4 text-electric-violet" />
            <span className="text-white/70 text-sm">Private</span>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}