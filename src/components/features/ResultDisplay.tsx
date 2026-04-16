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
    <div className="w-full space-y-4">
      {/* Result Image */}
      <div className="relative group">
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #1a1a2e 25%, transparent 25%),
              linear-gradient(-45deg, #1a1a2e 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #1a1a2e 75%),
              linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)
            `,
            backgroundSize: '16px 16px',
          }}
        />
        <div className="relative p-2">
          <img
            src={`data:image/png;base64,${imageUrl}`}
            alt="Result"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
            bg-gradient-to-r from-cyan to-electric-violet
            text-white text-sm font-medium
            hover:shadow-lg hover:shadow-cyan/20 transition-all
            active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
            bg-white/10 border border-white/20
            text-white/80 text-sm font-medium
            hover:bg-white/20 transition-all
            active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
            bg-white/5 border border-white/10
            text-white/50 text-sm font-medium
            hover:bg-white/10 hover:text-white/70 transition-all
            active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New</span>
        </button>
      </div>
    </div>
  );
}