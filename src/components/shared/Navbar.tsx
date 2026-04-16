'use client';

import { Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-electric-violet flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              BG<span className="text-cyan">Remover</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Home
            </a>
            <a 
              href="#" 
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              About
            </a>
            <a 
              href="#" 
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}