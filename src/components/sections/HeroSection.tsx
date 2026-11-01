import React from 'react';
import { HeroCanvas3D } from '../canvas/HeroCanvas3D';
import { ArrowDownRight, Terminal as TerminalIcon, Sparkles, Code2, Cpu } from 'lucide-react';
import { sound } from '../../utils/audio';

interface HeroSectionProps {
  onOpenTerminal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTerminal }) => {
  const scrollToProjects = () => {
    sound.playClick();
    const target = document.querySelector('#projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between pt-28 pb-10 px-4 sm:px-8 overflow-hidden select-none">
      {/* 3D WebGL Canvas Layer */}
      <HeroCanvas3D />

      {/* Cyber Grid & Vignette Overlays */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 radial-vignette pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center items-start pointer-events-none">
        {/* System Protocol Pill */}
        <div className="pointer-events-auto inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider mb-6 shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span>DHRUV TANWAR // QUANTUM PROTOCOL ACTIVE</span>
        </div>

        {/* Main Kinetic Headline */}
        <div className="space-y-1 mb-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-display tracking-tight text-white uppercase leading-[0.95]">
            <span className="block text-gradient-cyan drop-shadow-[0_5px_25px_rgba(0,240,255,0.25)]">
              ARCHITECTING
            </span>
            <span className="block text-white/95 drop-shadow-[0_5px_30px_rgba(255,255,255,0.1)]">
              THE NEXT WEB.
            </span>
          </h1>
        </div>

        {/* Technical Subtitle */}
        <p className="max-w-xl text-slate-300 text-sm sm:text-base md:text-lg font-light leading-relaxed mb-8 backdrop-blur-sm bg-black/20 p-2 rounded-lg border border-white/5 pointer-events-auto">
          Full-Stack MERN Developer & Creative Technologist bridging the chasm between bulletproof scalable backend architecture and mind-bending 3D interactive experiences.
        </p>

        {/* Interactive Action Hub */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-4">
          <button
            onClick={scrollToProjects}
            onMouseEnter={() => sound.playHover()}
            className="group relative px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-mono font-bold text-xs sm:text-sm text-black tracking-wider uppercase overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_45px_rgba(0,240,255,0.8)] transition-all duration-300 flex items-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              EXPLORE ARTIFACTS
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-25 transition-opacity" />
          </button>

          <button
            onClick={() => {
              sound.playTerminal();
              onOpenTerminal();
            }}
            onMouseEnter={() => sound.playHover()}
            className="px-6 py-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase hover:bg-cyan-950/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
          >
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span>ACCESS TERMINAL</span>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="relative z-10 w-full max-w-6xl mx-auto pt-6 border-t border-cyan-500/15 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-3 pointer-events-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>RENDER ENGINE: WEBGL / THREE.JS</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>LATENCY: &lt;10MS</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span>COORDINATES: 28°N 77°E</span>
          <span className="hidden md:inline text-cyan-500/70">ROTATION: ACTIVE</span>
          <span className="text-slate-400">SCROLL TO ENGAGE ↓</span>
        </div>
      </div>
    </section>
  );
};
