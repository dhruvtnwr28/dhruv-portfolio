import React, { useState } from 'react';
import { Sparkles, Terminal, Code2, Heart, Coffee, Globe, ArrowUpRight } from 'lucide-react';
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
      className={`relative overflow-hidden rounded-2xl bg-[#121019]/75 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-[#f3d2a2]/40 p-6 flex flex-col justify-between group ${className}`}
    >
      {/* Dynamic Cursor Spotlight Glare */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const AboutBento: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-24 px-4 sm:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#f3d2a2]/20 text-[#f3d2a2] text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HUMAN STORY & ETHOS</span>
        </div>
        <h2 className="text-3xl sm:text-6xl font-megante tracking-normal text-white uppercase leading-tight">
          BUILDING DIGITAL EXPERIENCES <span className="text-gradient-aurora italic">THAT MATTER</span>
        </h2>
        <p className="text-[#a39ea8] max-w-2xl text-sm sm:text-base mt-3 leading-relaxed">
          I'm Dhruv Tanwar — a full-stack developer obsessed with high-performance MERN architecture, modern web design, and expressive 3D visuals. No clichés, just craft.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Core Philosophy */}
        <BentoCard className="md:col-span-2 min-h-[280px]">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 rounded-xl bg-[#f3d2a2]/10 border border-[#f3d2a2]/20 text-[#f3d2a2]">
              <Code2 className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs text-[#a39ea8] uppercase tracking-wider">
              PHILOSOPHY
            </span>
          </div>
          <h3 className="text-2xl font-megante text-white mb-2 group-hover:text-[#f3d2a2] transition-colors">
            Taste Over Templates
          </h3>
          <p className="text-[#eae6df] text-sm sm:text-base leading-relaxed mb-6 font-sans">
            Every developer can spin up an AI generator and prompt a page in 30 seconds. What can’t be automated is taste, nuance, micro-interactions, and the patience to hand-tune shaders, physics, and scalable database schemas until they feel buttery smooth.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5 font-mono text-xs">
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[#f3d2a2] font-bold text-lg font-megante">MERN</div>
              <div className="text-[#a39ea8] text-[11px]">Robust Engine</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[#d8a7ff] font-bold text-lg font-megante">THREE.JS</div>
              <div className="text-[#a39ea8] text-[11px]">3D Realtime</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[#f2b8c6] font-bold text-lg font-megante">GLSL</div>
              <div className="text-[#a39ea8] text-[11px]">Custom Shaders</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[#e8a87c] font-bold text-lg font-megante">100%</div>
              <div className="text-[#a39ea8] text-[11px]">Human Crafted</div>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Status & Availability */}
        <BentoCard className="min-h-[280px]" glowColor="rgba(216, 167, 255, 0.15)">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 rounded-xl bg-[#d8a7ff]/10 border border-[#d8a7ff]/20 text-[#d8a7ff]">
              <Globe className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs text-[#d8a7ff] flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#d8a7ff] animate-pulse" />
              OPEN FOR WORK
            </span>
          </div>
          <h3 className="text-xl font-megante text-white mb-2">
            Available for Select Projects
          </h3>
          <p className="text-[#eae6df] text-sm leading-relaxed mb-6 font-sans">
            Ready to contribute to ambitious engineering teams, forward-looking startups, or unique creative commissions.
          </p>
          <a
            href="#contact"
            onClick={() => sound.playClick()}
            className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#d8a7ff]/10 border border-[#d8a7ff]/30 text-[#d8a7ff] font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#d8a7ff]/20 hover:border-[#d8a7ff] transition-all"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </BentoCard>
      </div>
    </section>
  );
};
