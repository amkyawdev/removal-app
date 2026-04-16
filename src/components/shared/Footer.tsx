'use client';

import { Globe, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/50 text-sm">
            © {new Date().getFullYear()} BGRemover. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center
                text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center
                text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}