import React, { useState } from 'react';
import { Sparkles, Code2, Globe, ArrowUpRight, Flame, Compass } from 'lucide-react';
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
  glowColor = 'rgba(243, 210, 162, 0.12)',
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
      className={`relative overflow-hidden rounded-3xl bg-[#121019]/75 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-[#f3d2a2]/40 p-7 flex flex-col justify-between group ${className}`}
    >
      {/* Dynamic Cursor Spotlight Glare */}
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#f3d2a2]/20 text-[#f3d2a2] text-xs font-mono mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>[ MANIFESTO // 01 ]</span>
        </div>
        <h2 className="text-3xl sm:text-6xl md:text-7xl font-megante tracking-tight text-white uppercase leading-tight">
          CRAFTING EXPERIENCES <span className="text-gradient-aurora italic">WITH SOUL</span>
        </h2>
        <p className="text-[#a39ea8] max-w-2xl text-sm sm:text-base mt-3 leading-relaxed font-sans">
          I'm Dhruv Tanwar — an engineer combining robust full-stack architecture with fluid 3D graphics and typography. No generic templates, no cutting corners.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Card 1: Core Philosophy */}
        <BentoCard className="md:col-span-2 min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 rounded-2xl bg-[#f3d2a2]/10 border border-[#f3d2a2]/20 text-[#f3d2a2]">
              <Flame className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs text-[#a39ea8] uppercase tracking-widest">
              PARADIGM
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-megante text-white mb-3 group-hover:text-[#f3d2a2] transition-colors">
            Taste Over Templates
          </h3>
          <p className="text-[#f7f5f2] text-sm sm:text-base leading-relaxed mb-6 font-sans">
            Every tool can output a template in seconds. True digital presence comes from nuance: hand-calculated GLSL optical dispersion, physics-weighted momentum scrolling, resilient distributed MERN endpoints, and typography that commands the room.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/5 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[#f3d2a2] font-bold text-lg font-megante">MERN</div>
              <div className="text-[#a39ea8] text-[11px]">Resilient Core</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[#d8b4fe] font-bold text-lg font-megante">THREE.JS</div>
              <div className="text-[#a39ea8] text-[11px]">Liquid 3D</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[#fbcfe8] font-bold text-lg font-megante">GLSL</div>
              <div className="text-[#a39ea8] text-[11px]">Chromatic Prism</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[#e8a87c] font-bold text-lg font-megante">100%</div>
              <div className="text-[#a39ea8] text-[11px]">Human Touch</div>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Status & Availability */}
        <BentoCard className="min-h-[300px]" glowColor="rgba(216, 180, 254, 0.15)">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 rounded-2xl bg-[#d8b4fe]/10 border border-[#d8b4fe]/20 text-[#d8b4fe]">
              <Globe className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs text-[#d8b4fe] flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#d8b4fe] animate-pulse" />
              AVAILABLE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-megante text-white mb-2">
            Open for Select Collaborations
          </h3>
          <p className="text-[#eae6df] text-sm leading-relaxed mb-6 font-sans">
            Ready to partner with high-ambition teams, forward-thinking startups, and creators building next-generation digital products.
          </p>
          <Magnetic strength={0.3} className="w-full mt-auto">
            <a
              href="#contact"
              onClick={() => sound.playClick()}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-[#d8b4fe]/20 to-[#f3d2a2]/20 border border-[#d8b4fe]/40 text-[#fdfbf7] font-sans text-xs font-bold uppercase tracking-wider hover:border-[#f3d2a2] hover:shadow-[0_0_20px_rgba(243,210,162,0.3)] transition-all"
            >
              <span>TRANSMIT INQUIRY</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Magnetic>
        </BentoCard>
      </div>
    </section>
  );
};
