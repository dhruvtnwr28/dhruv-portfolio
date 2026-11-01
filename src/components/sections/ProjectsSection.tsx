import React, { useState } from 'react';
import { Project } from '../../types';
import { ExternalLink, Github, Code2, Sparkles, Terminal, Box, Eye, Layers } from 'lucide-react';
import { sound } from '../../utils/audio';

const PROJECTS: Project[] = [
  {
    id: 'nexus-ai',
    title: 'NEXUS AI // Agent Orchestrator',
    tagline: 'High-Concurrency Multi-Agent Autonomous Workspace',
    description: 'An advanced full-stack AI orchestrator featuring real-time bi-directional WebSocket streaming, distributed worker queues, and dynamic node-based workflow generation.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'WebSockets', 'TailwindCSS'],
    metrics: '< 15ms WebSocket Latency // 10k concurrent streams',
    githubUrl: 'https://github.com/dhruvtnwr28',
    liveUrl: 'https://github.com/dhruvtnwr28/dhruv-portfolio',
    featured: true,
    color: '#00f0ff',
    mockupType: 'neural-ai',
  },
  {
    id: 'hyperspatial-3d',
    title: 'HYPERSPATIAL // WebGL 3D Engine',
    tagline: 'Procedural 3D Spatial Canvas & Particle Physics Sandbox',
    description: 'A cutting-edge interactive WebGL virtual dimension powered by custom GLSL simplex noise shaders, particle repulsion dynamics, and spatial procedural audio synthesis.',
    tags: ['Three.js', 'GLSL Shaders', 'React', 'TypeScript', 'Web Audio'],
    metrics: '60-120 FPS // 5,000+ Realtime Physics Particles',
    githubUrl: 'https://github.com/dhruvtnwr28',
    liveUrl: 'https://github.com/dhruvtnwr28/dhruv-portfolio',
    featured: true,
    color: '#a855f7',
    mockupType: '3d-mesh',
  },
  {
    id: 'cybervault-mern',
    title: 'CYBERVAULT // Zero-Knowledge Cloud',
    tagline: 'Distributed Encrypted Asset Storage & Access Engine',
    description: 'Enterprise-grade cloud storage system with client-side AES-256-GCM encryption, chunked parallel streaming uploads, and granular cryptographically signed access tokens.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT', 'REST'],
    metrics: 'AES-256 Military Encryption // Zero-Knowledge Auth',
    githubUrl: 'https://github.com/dhruvtnwr28',
    liveUrl: 'https://github.com/dhruvtnwr28/dhruv-portfolio',
    featured: true,
    color: '#10b981',
    mockupType: 'cloud-db',
  },
  {
    id: 'quantum-crypt',
    title: 'QUANTUM CRYPT // Market Telemetry',
    tagline: 'Sub-Millisecond High-Frequency Order-Book Terminal',
    description: 'Real-time crypto and asset intelligence platform powered by ultra-low latency WebSocket feeds, interactive order book heatmaps, and customizable indicator scripts.',
    tags: ['React', 'Node.js', 'WebSockets', 'Tailwind CSS', 'Vite'],
    metrics: 'Real-time Depth Streaming // Sub-second sync',
    githubUrl: 'https://github.com/dhruvtnwr28',
    liveUrl: 'https://github.com/dhruvtnwr28/dhruv-portfolio',
    featured: false,
    color: '#f43f5e',
    mockupType: 'terminal',
  },
];

interface ProjectCardProps {
  project: Project;
  onSelect: (p: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: '1000px' }}
      className="w-full"
      onMouseEnter={() => sound.playHover()}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative overflow-hidden rounded-2xl bg-[#080d19]/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 p-6 flex flex-col justify-between group shadow-xl transition-colors duration-300 min-h-[420px]"
      >
        {/* Dynamic Glare Reflection */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, ${project.color}, transparent 65%)`,
            opacity: glare.opacity,
          }}
        />

        {/* Visual Mockup Preview Header */}
        <div className="relative z-10 w-full h-44 rounded-xl overflow-hidden bg-black/60 border border-white/5 mb-5 flex flex-col items-center justify-center p-4">
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 cyber-grid-bg opacity-40" />

          {/* Visual Archetype Graphic */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            {project.mockupType === 'neural-ai' && (
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)] group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              </div>
            )}
            {project.mockupType === '3d-mesh' && (
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform duration-300">
                <Box className="w-8 h-8 text-purple-400" />
              </div>
            )}
            {project.mockupType === 'cloud-db' && (
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-300">
                <Layers className="w-8 h-8 text-emerald-400" />
              </div>
            )}
            {project.mockupType === 'terminal' && (
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)] group-hover:scale-110 transition-transform duration-300">
                <Terminal className="w-8 h-8 text-rose-400" />
              </div>
            )}

            <div className="font-mono text-xs text-slate-300 font-semibold tracking-wider">
              {project.metrics}
            </div>
          </div>

          {/* Corner Tech Tag */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-mono text-cyan-300">
            {project.tags[0]}
          </div>
        </div>

        {/* Content Body */}
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                {project.title}
              </h3>
            </div>
            <p className="text-cyan-400 font-mono text-xs mb-2">{project.tagline}</p>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {project.description}
            </p>
          </div>

          <div>
            {/* Tech Badges */}
            <div className="flex flex-wrap gap-1.5 mb-5 font-mono text-[11px]">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  onSelect(project);
                }}
                className="text-cyan-300 hover:text-white flex items-center gap-1.5 font-semibold py-1 px-2 rounded-lg hover:bg-cyan-500/10 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>INSPECT SPECS</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="Source Code"
                >
                  <Github className="w-4 h-4" />
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sound.playClick()}
                    className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                    title="Live Artifact"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative w-full py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
          <Code2 className="w-3.5 h-3.5" />
          <span>MODULE // 02: PRODUCTION ARTIFACTS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
          FEATURED <span className="text-gradient-cyan">DEPLOYMENTS</span>
        </h2>
        <p className="text-slate-400 max-w-2xl text-sm sm:text-base mt-2">
          Explore production-grade full-stack architectures, high-performance backends, and interactive WebGL graphical experiences. Hover to trigger 3D perspective physics.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={(p) => setSelectedProject(p)}
          />
        ))}
      </div>

      {/* Inspect Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#090e1a] border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] font-mono">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="text-xs text-cyan-400 font-semibold">ARTIFACT SPECIFICATION</span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedProject(null);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300 font-sans mb-8">
              <p className="leading-relaxed">{selectedProject.description}</p>
              
              <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs space-y-2">
                <div className="text-cyan-400 font-bold">SYSTEM TELEMETRY:</div>
                <div className="text-slate-300">Metric Standard: {selectedProject.metrics}</div>
                <div className="text-slate-300">Architecture Paradigm: Full-Stack MERN + Realtime Pipeline</div>
              </div>

              <div>
                <div className="font-mono text-xs text-slate-400 mb-2">INTEGRATED STACK:</div>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {selectedProject.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 font-mono text-xs">
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GITHUB REPO</span>
              </a>
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>LAUNCH DEPLOYMENT</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
