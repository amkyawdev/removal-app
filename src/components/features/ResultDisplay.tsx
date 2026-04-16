'use client';

import { Download, RotateCcw } from 'lucide-react';
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
      {/* Image */}
      <div className="relative rounded-xl overflow-hidden bg-checkerboard">
        <img
          src={`data:image/png;base64,${imageUrl}`}
          alt="Result"
          className="w-full"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #1a1a2e 25%, transparent 25%),
              linear-gradient(-45deg, #1a1a2e 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #1a1a2e 75%),
              linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-cyan hover:bg-cyan/80 text-black font-medium rounded-xl transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Download</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
        >
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}