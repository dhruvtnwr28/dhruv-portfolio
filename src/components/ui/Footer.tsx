import React, { useState, useEffect } from 'react';
import { ArrowUp, Terminal, Shield, Heart } from 'lucide-react';
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
    <footer className="w-full border-t border-cyan-500/15 bg-[#03050a] py-12 px-4 sm:px-8 text-slate-500 font-mono text-xs select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Telemetry */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SYS_TIME: {time || '23:12:00'} UTC+5:30</span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <div>DHRUV TANWAR // FULL-STACK ARCHITECT</div>
        </div>

        {/* Center Copyright */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Crafted with</span>
          <span className="text-cyan-400 font-bold">Three.js</span>
          <span>+</span>
          <span className="text-purple-400 font-bold">React</span>
          <span>+</span>
          <span className="text-emerald-400 font-bold">MERN</span>
        </div>

        {/* Right Actions: Back to Top */}
        <button
          onClick={scrollToTop}
          onMouseEnter={() => sound.playHover()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all shadow-sm"
        >
          <span>RETURN TO APEX</span>
          <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>
    </footer>
  );
};
