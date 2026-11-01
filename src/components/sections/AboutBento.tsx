import React, { useState } from 'react';
import { Layers, Zap, Database, Terminal, ShieldCheck, Globe, Code, ArrowUpRight } from 'lucide-react';
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
      className={`relative overflow-hidden rounded-2xl bg-[#090e1a]/70 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-cyan-500/40 p-6 flex flex-col justify-between group ${className}`}
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
    <section id="about" className="relative w-full py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>MODULE // 01: ARCHITECTURAL OVERVIEW</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
          ENGINEERED FOR <span className="text-gradient-cyan">EXTREME IMPACT</span>
        </h2>
        <p className="text-slate-400 max-w-2xl text-sm sm:text-base mt-2">
          Deconstructing digital interfaces into lightning-fast MERN backends, distributed data pipelines, and jaw-dropping interactive 3D visualizations.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: The Full-Stack Core (Wide 2-columns) */}
        <BentoCard className="md:col-span-2 min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Zap className="w-6 h-6" />
            </span>
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
              PARADIGM // 01
            </span>
          </div>
          <h3 className="text-2xl font-bold font-display text-white mb-2 group-hover:text-cyan-300 transition-colors">
            Full-Stack Modern MERN & WebGL Symbiosis
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            I don't just build websites; I craft comprehensive, resilient software systems. From real-time WebSocket state machines, MongoDB data modeling, and Express APIs, to Three.js WebGL shaders that give users goosebumps on the first second of page load.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5 font-mono text-xs">
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <div className="text-cyan-400 font-bold text-lg">MERN</div>
              <div className="text-slate-400 text-[11px]">Core Backbone</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <div className="text-emerald-400 font-bold text-lg">GLSL</div>
              <div className="text-slate-400 text-[11px]">Realtime Shaders</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <div className="text-purple-400 font-bold text-lg">&lt;100ms</div>
              <div className="text-slate-400 text-[11px]">API Response</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <div className="text-pink-400 font-bold text-lg">60+ FPS</div>
              <div className="text-slate-400 text-[11px]">Fluid Motion</div>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Status & Availability */}
        <BentoCard className="min-h-[300px]" glowColor="rgba(16, 185, 129, 0.15)">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Globe className="w-6 h-6" />
            </span>
            <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AVAILABLE
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-2">
            Status & Deployment
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Currently accepting select engineering opportunities, high-impact freelance projects, and forward-thinking collaborative builds.
          </p>
          <a
            href="#contact"
            onClick={() => sound.playClick()}
            className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 hover:border-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <span>TRANSMIT INQUIRY</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </BentoCard>

        {/* Card 3: Philosophy */}
        <BentoCard className="min-h-[260px]" glowColor="rgba(168, 85, 247, 0.15)">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
              STANDARDS
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-2">
            Zero Compromises
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Every route is optimized, every database query indexed, every animation GPU-accelerated. If it lags, it does not ship.
          </p>
        </BentoCard>

        {/* Card 4: Code Radar (Wide 2-columns) */}
        <BentoCard className="md:col-span-2 min-h-[260px]">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Code className="w-6 h-6" />
            </span>
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
              TOOLING MATRIX
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-2">
            Battle-Tested Technologies
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            A fluid arsenal spanning modern JavaScript, React, Node.js, Express, MongoDB, Three.js, GLSL, Tailwind CSS, TypeScript, and Docker.
          </p>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Three.js', 'GLSL', 'TypeScript', 'TailwindCSS', 'GSAP', 'Vite', 'Git', 'REST APIs', 'WebSockets'].map((tech) => (
              <span
                key={tech}
                onMouseEnter={() => sound.playHover()}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </BentoCard>
      </div>
    </section>
  );
};
