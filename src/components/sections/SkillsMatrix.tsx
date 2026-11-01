import React, { useState } from 'react';
import { Cpu, Server, Code, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/audio';

interface SkillGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  skills: Array<{ name: string; level: number; highlight: string }>;
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'mern',
    label: 'MERN & Backend Engine',
    icon: <Server className="w-4 h-4" />,
    skills: [
      { name: 'Node.js & Express.js', level: 95, highlight: 'High-throughput async event loops' },
      { name: 'MongoDB & Mongoose', level: 92, highlight: 'Complex aggregations & indexing' },
      { name: 'REST & WebSockets', level: 94, highlight: 'Bi-directional real-time data sync' },
      { name: 'JWT & OAuth Security', level: 90, highlight: 'Stateless auth & token rotation' },
      { name: 'API Architecture & Microservices', level: 88, highlight: 'Modular decoupled services' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend & 3D WebGL',
    icon: <Code className="w-4 h-4" />,
    skills: [
      { name: 'React.js & Hooks', level: 96, highlight: 'Custom hooks, state machines, memo' },
      { name: 'Three.js & WebGL', level: 88, highlight: 'Custom geometries, cameras & scenes' },
      { name: 'GLSL Shaders', level: 82, highlight: 'Vertex displacement & procedural noise' },
      { name: 'TypeScript & Modern JS', level: 92, highlight: 'Strict type safety & ESNext' },
      { name: 'Tailwind CSS & Animations', level: 98, highlight: 'Responsive cybernetic aesthetics' },
    ],
  },
  {
    id: 'devops',
    label: 'Systems & Tooling',
    icon: <Cpu className="w-4 h-4" />,
    skills: [
      { name: 'Git & GitHub Workflows', level: 95, highlight: 'Trunk-based dev, hooks & rebasing' },
      { name: 'Vite & Build Tooling', level: 94, highlight: 'Sub-second HMR & asset trees' },
      { name: 'Docker & Containerization', level: 85, highlight: 'Multi-stage production images' },
      { name: 'Linux & Terminal Automation', level: 88, highlight: 'Zsh scripting & server management' },
      { name: 'Cloud Deployment & CI/CD', level: 90, highlight: 'Automated builds & zero-downtime' },
    ],
  },
];

export const SkillsMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mern');
  const activeGroup = SKILL_GROUPS.find((g) => g.id === activeTab) || SKILL_GROUPS[0];

  return (
    <section id="skills" className="relative w-full py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>MODULE // 03: TECHNICAL COMPETENCY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
          CAPABILITY <span className="text-gradient-cyan">MATRIX</span>
        </h2>
        <p className="text-slate-400 max-w-2xl text-sm sm:text-base mt-2">
          A deeply calibrated engineering skillset designed to bridge heavy server-side processing with razor-sharp client-side graphics.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-[#090d1a]/80 border border-white/10 w-fit backdrop-blur-xl">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {group.icon}
              <span>{group.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Skills Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {activeGroup.skills.map((skill, idx) => (
          <div
            key={skill.name}
            onMouseEnter={() => sound.playHover()}
            className="p-5 rounded-xl bg-[#090e1a]/70 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="font-display font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-400">
                {skill.level}%
              </span>
            </div>

            <p className="text-slate-400 text-xs font-mono mb-3">
              {skill.highlight}
            </p>

            {/* Glowing Telemetry Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_#00f0ff]"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}

        {/* Global Summary Card */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-950/30 to-purple-950/20 border border-cyan-500/25 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
              // TELEMETRY SUMMARY
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Mastery is continuous. Constantly exploring emerging WebGPU paradigms, high-throughput Node.js microservices, and AI-native web interfaces.
          </p>
          <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
            <span className="text-cyan-400">STATUS:</span> CONTINUOUS ACTIVE EVOLUTION
          </div>
        </div>
      </div>
    </section>
  );
};
