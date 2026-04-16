'use client';

import { Download, RotateCcw, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ResultDisplayProps {
  imageUrl: string;
  originalFileName?: string;
  onDownload: () => void;
  onReset: () => void;
}

export function ResultDisplay({
  imageUrl,
  originalFileName = 'image.png',
  onDownload,
  onReset,
}: ResultDisplayProps) {
  const handleDownload = () => {
    // Convert base64 to blob and download
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageUrl}`;
    link.download = `removed_bg_${originalFileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GlassCard className="w-full">
      <div className="flex flex-col gap-4">
        <div className="relative w-full flex justify-center">
          <div className="relative group">
            {/* Checkerboard background for transparency */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #1a1a2e 25%, transparent 25%),
                  linear-gradient(-45deg, #1a1a2e 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #1a1a2e 75%),
                  linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            />
            <img
              src={`data:image/png;base64,${imageUrl}`}
              alt="Result with background removed"
              className="relative rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-xl
              bg-gradient-to-r from-cyan to-electric-violet
              text-white font-semibold transition-all duration-300
              hover:shadow-lg hover:shadow-cyan/25 hover:scale-105
              active:scale-95"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl
              bg-white/10 border border-white/20
              text-white font-semibold transition-all duration-300
              hover:bg-white/20 hover:border-white/30
              active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Image</span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}