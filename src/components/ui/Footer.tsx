import React, { useState, useEffect } from 'react';
import { ArrowUp, Heart, Coffee } from 'lucide-react';
import { sound } from '../../utils/audio';

export const Footer: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/5 bg-[#07060a] py-12 px-4 sm:px-8 text-[#a39ea8] font-sans text-xs select-none">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-[#f3d2a2] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f3d2a2] animate-ping" />
            <span>IST {time || '23:55:00'}</span>
          </div>
          <span className="hidden sm:inline text-slate-700">•</span>
          <div className="font-megante text-white text-sm">DHRUV TANWAR</div>
        </div>

        {/* Center */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Crafted with</span>
          <Coffee className="w-3.5 h-3.5 text-[#f3d2a2]" />
          <span>& 3D WebGL</span>
        </div>

        {/* Right */}
        <button
          onClick={scrollToTop}
          onMouseEnter={() => sound.playHover()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#f3d2a2]/40 text-slate-300 hover:text-[#f3d2a2] transition-all"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#f3d2a2]" />
        </button>
      </div>
    </footer>
  );
};
