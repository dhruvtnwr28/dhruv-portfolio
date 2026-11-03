import React, { useState, useEffect } from 'react';
import { ArrowUp, Coffee } from 'lucide-react';
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
    <footer className="w-full border-t border-[#00f0ff]/15 bg-[#030712] py-12 px-4 sm:px-8 text-slate-400 font-sans text-xs select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-[#00f0ff] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
            <span>IST {time || '14:45:00'}</span>
          </div>
          <span className="hidden sm:inline text-slate-700">•</span>
          <div className="font-megante text-white text-sm">DHRUV TANWAR</div>
        </div>

        {/* Center */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Powered by</span>
          <span className="text-[#00f0ff] font-semibold">Tesseract 3D Engine</span>
          <span>&</span>
          <Coffee className="w-3.5 h-3.5 text-[#38bdf8]" />
        </div>

        {/* Right */}
        <button
          onClick={scrollToTop}
          onMouseEnter={() => sound.playHover()}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-[#00f0ff]/20 hover:border-[#00f0ff] text-slate-300 hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#00f0ff]" />
        </button>
      </div>
    </footer>
  );
};
