'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { ThreeBackground } from '@/components/features/ThreeBackground';
import { ImageUploader } from '@/components/features/ImageUploader';
import { ResultDisplay } from '@/components/features/ResultDisplay';
import { GlassCard } from '@/components/features/GlassCard';
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

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-cyan" />
            <span className="text-sm text-white/70">AI-Powered Background Removal</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Remove Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-electric-violet">Backgrounds</span>
          </h1>
          
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Upload your image and let AI remove the background instantly. 
            Free, fast, and production-ready.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-2xl">
          {error && (
            <GlassCard className="mb-6">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </GlassCard>
          )}

          {isLoading ? (
            <GlassCard>
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <Loader2 className="w-12 h-12 text-cyan animate-spin" />
                <p className="text-white/70 text-lg">Processing your image...</p>
                <p className="text-white/40 text-sm">This may take a few seconds</p>
              </div>
            </GlassCard>
          ) : result ? (
            <ResultDisplay
              imageUrl={result}
              originalFileName={selectedFile?.name || 'image.png'}
              onDownload={() => {}}
              onReset={handleReset}
            />
          ) : (
            <ImageUploader onUpload={handleUpload} />
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          {[
            { title: 'Fast Processing', desc: 'Remove backgrounds in seconds' },
            { title: 'High Quality', desc: 'AI-powered accuracy' },
            { title: 'Privacy First', desc: 'Your images stay private' },
          ].map((feature, i) => (
            <GlassCard key={i} className="text-center">
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}