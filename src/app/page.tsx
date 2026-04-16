'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, Zap, Shield, Clock } from 'lucide-react';
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

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-cyan" />
            <span className="text-sm text-white/70">AI-Powered Background Removal</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Remove Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-electric-violet">Backgrounds</span>
            <br className="hidden md:block" /> in Seconds
          </h1>
          
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Upload your image and let AI remove the background instantly. 
            Free, fast, and completely private.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-xl">
          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 text-red-400 bg-red-500/10 px-5 py-4 rounded-2xl border border-red-500/20">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
              <div className="flex flex-col items-center justify-center gap-6">
                {/* Animated Loader */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-white/10" />
                  <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-cyan border-t-transparent animate-spin" />
                  <div className="absolute inset-2 w-16 h-16 rounded-full border-4 border-electric-violet border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                </div>
                
                <div className="text-center">
                  <p className="text-white font-semibold text-lg">Processing your image...</p>
                  <p className="text-white/50 text-sm mt-1">This usually takes 5-15 seconds</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan to-electric-violet animate-pulse rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
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

          {/* Upload */}
          {!result && !isLoading && (
            <ImageUploader onUpload={handleUpload} />
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Process in seconds' },
            { icon: Shield, title: 'Private & Secure', desc: 'Your images stay local' },
            { icon: Clock, title: '24/7 Available', desc: 'No waiting in queue' },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-electric-violet/20 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">{feature.title}</h3>
                <p className="text-white/40 text-xs">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}