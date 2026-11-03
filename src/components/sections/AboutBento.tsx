import React, { useState } from 'react';
import { Sparkles, Code2, Globe, ArrowUpRight, Flame, Compass, Box } from 'lucide-react';
import { Magnetic } from '../ui/Magnetic';
import { sound } from '../../utils/audio';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(0, 240, 255, 0.15)',
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        sound.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl bg-[#060f26]/75 backdrop-blur-xl border border-[#00f0ff]/15 transition-all duration-300 hover:border-[#00f0ff]/45 p-7 flex flex-col justify-between group shadow-xl ${className}`}
    >
      {/* Dynamic Cyan Cursor Spotlight Glare */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const AboutBento: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-28 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Box className="w-3.5 h-3.5" />
          <span>[ TESSERACT MANIFESTO ]</span>
        </div>
        <h2 className="text-3xl sm:text-6xl md:text-7xl font-megante tracking-tight text-white uppercase leading-tight">
          CRAFTING SYSTEMS <span className="text-gradient-tesseract italic">WITH RAW ENERGY</span>
        </h2>
        <p className="text-slate-400 max-w-2xl text-sm sm:text-base mt-3 leading-relaxed font-sans">
          I'm Dhruv Tanwar — an engineer combining scalable full-stack MERN architecture with real-time 3D WebGL graphics and sharp visual precision.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Card 1: Core Philosophy */}
        <BentoCard className="md:col-span-2 min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff]">
              <Flame className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs text-[#38bdf8] uppercase tracking-widest">
              PARADIGM
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-megante text-white mb-3 group-hover:text-[#00f0ff] transition-colors">
            Taste Over Templates
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
            AI can generate boilerplate in seconds. What requires true craft is intentional design: calculating volumetric GLSL plasma noise, tuning physics-weighted momentum, and constructing resilient distributed backends that never bottleneck under pressure.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/5 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[#00f0ff] font-bold text-lg font-megante">MERN</div>
              <div className="text-slate-400 text-[11px]">Resilient Core</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[#38bdf8] font-bold text-lg font-megante">THREE.JS</div>
              <div className="text-slate-400 text-[11px]">Tesseract 3D</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[#60a5fa] font-bold text-lg font-megante">GLSL</div>
              <div className="text-slate-400 text-[11px]">Plasma Core</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-white font-bold text-lg font-megante">100%</div>
              <div className="text-slate-400 text-[11px]">Human Touch</div>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Status & Availability */}
        <BentoCard className="min-h-[300px]" glowColor="rgba(56, 189, 248, 0.2)">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-[#00f0ff]">
              <Globe className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs text-[#00f0ff] flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              AVAILABLE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-megante text-white mb-2">
            Open for Select Collaborations
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
            Ready to partner with high-ambition teams, forward-thinking startups, and creators building next-generation digital products.
          </p>
          <Magnetic strength={0.3} className="w-full mt-auto">
            <a
              href="#contact"
              onClick={() => sound.playClick()}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-[#00f0ff]/20 to-[#38bdf8]/20 border border-[#00f0ff]/40 text-white font-sans text-xs font-bold uppercase tracking-wider hover:border-[#00f0ff] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all"
            >
              <span>TRANSMIT INQUIRY</span>
              <ArrowUpRight className="w-4 h-4 text-[#00f0ff]" />
            </a>
          </Magnetic>
        </BentoCard>
      </div>
    </section>
  );
};
