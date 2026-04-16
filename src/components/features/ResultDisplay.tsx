'use client';

import { Download, RotateCcw, Copy, Check } from 'lucide-react';
import { useState } from 'react';

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
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageUrl}`;
    link.download = `removed_bg_${originalFileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        });
      }
    };
    img.src = `data:image/png;base64,${imageUrl}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Result Image */}
      <div className="relative group">
        {/* Checkerboard Background */}
        <div
          className="absolute inset-0 rounded-2xl"
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
        
        <div className="relative p-4">
          <img
            src={`data:image/png;base64,${imageUrl}`}
            alt="Result with background removed"
            className="w-full rounded-xl shadow-2xl"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm">
              Transparent Background
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
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
          onClick={handleCopy}
          className="flex items-center gap-2 px-6 py-3 rounded-xl
            bg-white/10 border border-white/20
            text-white font-semibold transition-all duration-300
            hover:bg-white/20 hover:border-white/30
            active:scale-95"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
          <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl
            bg-white/5 border border-white/10
            text-white/70 font-semibold transition-all duration-300
            hover:bg-white/10 hover:text-white hover:border-white/20
            active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Remove Another</span>
        </button>
      </div>
    </div>
  );
}