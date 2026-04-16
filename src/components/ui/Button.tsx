'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-gradient-to-r from-cyan to-electric-violet text-white hover:shadow-lg hover:shadow-cyan/25 hover:scale-105 active:scale-95':
              variant === 'primary',
            'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 active:scale-95':
              variant === 'secondary',
            'bg-transparent text-white/70 hover:text-white hover:bg-white/10 active:scale-95':
              variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-base': size === 'md',
            'px-7 py-3.5 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';