'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl',
        className
      )}
    >
      {children}
    </div>
  );
}