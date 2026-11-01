import React, { useState } from 'react';
import { Server, Code, Cpu, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/audio';

interface SkillGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  skills: Array<{ name: string; highlight: string }>;
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'mern',
    label: 'Backend & MERN Architecture',
    icon: <Server className="w-4 h-4" />,
    skills: [
      { name: 'Node.js & Express.js', highlight: 'Asynchronous event architecture & clean modular APIs' },
      { name: 'MongoDB & Mongoose', highlight: 'Data modeling, aggregation pipelines & indexing' },
      { name: 'REST & Real-Time WebSockets', highlight: 'Low-latency state synchronization' },
      { name: 'Auth & Security', highlight: 'Stateless JWT tokens, bcrypt encryption & sanitization' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend & 3D WebGL',
    icon: <Code className="w-4 h-4" />,
    skills: [
      { name: 'React & Modern JavaScript', highlight: 'State management, custom hooks & performance' },
      { name: 'Three.js & WebGL', highlight: 'Custom geometries, cameras, lights & materials' },
      { name: 'GLSL Shaders', highlight: 'Vertex displacement & procedural noise textures' },
      { name: 'Tailwind CSS & Motion', highlight: 'Responsive typography & fluid kinetic layouts' },
    ],
  },
  {
    id: 'devops',
    label: 'Tooling & Workflow',
    icon: <Cpu className="w-4 h-4" />,
    skills: [
      { name: 'Git & GitHub Collaboration', highlight: 'Version control, branch workflows & CI/CD actions' },
      { name: 'Vite & Modern Bundlers', highlight: 'Fast HMR, dynamic chunking & asset optimization' },
      { name: 'Linux / Shell Scripting', highlight: 'Terminal automation, remote VPS & environment config' },
      { name: 'Cloud & Vercel Hosting', highlight: 'Automated previews, edge deployment & domain routing' },
    ],
  },
];

export const SkillsMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mern');
  const activeGroup = SKILL_GROUPS.find((g) => g.id === activeTab) || SKILL_GROUPS[0];

  return (
    <section id="skills" className="relative w-full py-24 px-4 sm:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#f3d2a2]/20 text-[#f3d2a2] text-xs font-mono mb-4">
          <Cpu className="w-3.5 h-3.5" />
          <span>CAPABILITIES & ARSENAL</span>
        </div>
        <h2 className="text-3xl sm:text-6xl font-megante tracking-normal text-white uppercase leading-tight">
          TOOLS I USE TO <span className="text-gradient-champagne italic">BUILD IDEAS</span>
        </h2>
        <p className="text-[#a39ea8] max-w-2xl text-sm sm:text-base mt-3 leading-relaxed">
          A focused stack centered on clean JavaScript, scalable MERN backends, and expressive visual graphics.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-[#121019]/80 border border-white/10 w-fit backdrop-blur-xl">
        {SKILL_GROUPS.map((group) => {
          const isActive = group.id === activeTab;
          return (
            <button
              key={group.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(group.id);
              }}
              onMouseEnter={() => sound.playHover()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-[#f3d2a2] to-[#d8a7ff] text-black shadow-[0_0_25px_rgba(243,210,162,0.3)]'
                  : 'text-[#a39ea8] hover:text-white hover:bg-white/5'
              }`}
            >
              {group.icon}
              <span>{group.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Skills Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeGroup.skills.map((skill) => (
          <div
            key={skill.name}
            onMouseEnter={() => sound.playHover()}
            className="p-5 rounded-2xl bg-[#121019]/70 backdrop-blur-md border border-white/10 hover:border-[#f3d2a2]/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#f3d2a2] group-hover:scale-110 transition-transform" />
              <span className="font-megante text-lg text-white group-hover:text-[#f3d2a2] transition-colors">
                {skill.name}
              </span>
            </div>
            <p className="text-[#a39ea8] text-xs sm:text-sm leading-relaxed pl-6 font-sans">
              {skill.highlight}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
