import React, { useState } from 'react';
import { HeroCanvas3D } from '../canvas/HeroCanvas3D';
import { Magnetic } from '../ui/Magnetic';
import { Bug, Sparkles, Coffee, ArrowDownRight, Laugh, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

export const HeroSection: React.FC = () => {
  const [bugClicks, setBugClicks] = useState(0);
  const [buttonMessage, setButtonMessage] = useState('✦ SQUASH 1 BUG');

  const funnyMessages = [
    'Bug squashed! (+2 unexpected features created)',
    'Error 418: I am a teapot 🫖',
    'Now 99 bugs in the code, take one down, 127 bugs in the code...',
    'Deleting node_modules... just kidding 💀',
    'git push --force origin main (don’t tell senior dev)',
    'It compiled on the first try. I am suspicious.',
    'Works on my machine! You just need my exact laptop.',
  ];

  const handleFixBug = () => {
    sound.playClick();
    const nextCount = bugClicks + 1;
    setBugClicks(nextCount);

    const randomMsg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    setButtonMessage(randomMsg);

    if (nextCount % 3 === 0) {
      sound.playSuccess();
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#f3d2a2', '#d8b4fe', '#fbcfe8', '#ffffff'],
      });
    }
  };

  const scrollToContact = () => {
    sound.playClick();
    const target = document.querySelector('#contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between pt-32 pb-12 px-4 sm:px-8 overflow-hidden select-none">
      {/* Liquid Molten Chrome & Chromatic Refraction 3D Canvas */}
      <HeroCanvas3D />

      {/* Avant-Garde Aurora Glow */}
      <div className="absolute inset-0 aurora-bg opacity-75 pointer-events-none" />

      {/* Main Editorial Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center items-start pointer-events-none">
        
        {/* Top Avant-Garde Editorial Meta */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-3 text-[11px] font-mono tracking-widest text-[#a39ea8] uppercase mb-8">
          <span className="px-3 py-1 rounded-full bg-[#14121d]/80 border border-[#f3d2a2]/25 text-[#f3d2a2] flex items-center gap-2 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f3d2a2] animate-ping" />
            [ EXHIBITION // 2026 ]
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">DHRUV TANWAR — FULL-STACK ARCHITECT</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-[#d8b4fe]">[ LIQUID AVANT-GARDE ]</span>
        </div>

        {/* Big Avant-Garde MEGANTE Headline */}
        <div className="space-y-1 mb-6">
          <h1 className="text-4xl sm:text-7xl md:text-9xl font-megante tracking-tight text-[#fdfbf7] uppercase leading-[0.92] drop-shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
            <span className="block text-gradient-champagne">
              SITE IS UNDER
            </span>
            <span className="block text-gradient-aurora italic">
              DEVELOPMENT
            </span>
            <span className="block text-white/95">
              FOR NOW.
            </span>
          </h1>
        </div>

        {/* Editorial Subtitle with Humor & Human Voice */}
        <div className="pointer-events-auto max-w-2xl bg-[#14121d]/85 border border-[#f3d2a2]/20 rounded-2xl p-5 sm:p-7 backdrop-blur-xl mb-8 shadow-2xl">
          <p className="text-[#f7f5f2] text-sm sm:text-base leading-relaxed font-sans mb-3">
            <span className="font-bold text-[#f3d2a2]">"Works on my machine™"</span> — but currently convincing production to cooperate.
          </p>
          <p className="text-[#a39ea8] text-xs sm:text-sm leading-relaxed font-sans">
            Instead of giving you another cookie-cutter AI portfolio with fake cyber jargon, I’m handcrafting an authentic, liquid avant-garde experience from scratch. Drag the molten chrome sculpture behind this text, click below to squash some imaginary bugs, or scroll down to explore the craft.
          </p>
        </div>

        {/* Magnetic Interactive Action Buttons */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-4 mb-8">
          <Magnetic strength={0.35}>
            <button
              onClick={handleFixBug}
              onMouseEnter={() => sound.playHover()}
              className="group relative px-7 py-4 rounded-full bg-gradient-to-r from-[#f3d2a2] via-[#fbcfe8] to-[#d8b4fe] font-sans font-bold text-xs sm:text-sm text-black tracking-wider uppercase overflow-hidden shadow-[0_0_30px_rgba(243,210,162,0.35)] hover:shadow-[0_0_50px_rgba(243,210,162,0.65)] transition-all duration-300 flex items-center gap-2.5"
            >
              <Bug className="w-4 h-4 text-black group-hover:rotate-45 transition-transform" />
              <span>{buttonMessage}</span>
            </button>
          </Magnetic>

          <Magnetic strength={0.35}>
            <button
              onClick={scrollToContact}
              onMouseEnter={() => sound.playHover()}
              className="px-7 py-4 rounded-full bg-[#14121d]/90 border border-white/15 text-white font-sans text-xs sm:text-sm font-semibold tracking-wider hover:border-[#f3d2a2]/50 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
            >
              <Mail className="w-4 h-4 text-[#f3d2a2]" />
              <span>SAY HELLO DIRECTLY</span>
            </button>
          </Magnetic>
        </div>

        {/* High-Fashion Humorous Telemetry Badges */}
        <div className="pointer-events-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-2xl font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#14121d]/75 border border-white/5 flex items-center gap-3">
            <Coffee className="w-4 h-4 text-[#f3d2a2]" />
            <div>
              <div className="text-[10px] text-[#a39ea8] uppercase">Chai / Coffee</div>
              <div className="font-bold text-white">4.5 Cups / day</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#14121d]/75 border border-white/5 flex items-center gap-3">
            <Bug className="w-4 h-4 text-[#fbcfe8]" />
            <div>
              <div className="text-[10px] text-[#a39ea8] uppercase">Bugs Handled</div>
              <div className="font-bold text-white">{bugClicks > 0 ? `${bugClicks * 2} new` : 'Plenty'}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#14121d]/75 border border-white/5 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#d8b4fe]" />
            <div>
              <div className="text-[10px] text-[#a39ea8] uppercase">Localhost Faith</div>
              <div className="font-bold text-white">100% Solid</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#14121d]/75 border border-white/5 flex items-center gap-3">
            <Laugh className="w-4 h-4 text-[#e8a87c]" />
            <div>
              <div className="text-[10px] text-[#a39ea8] uppercase">AI Jargon</div>
              <div className="font-bold text-white">0% Banned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Bar with Drag Guidance */}
      <div className="relative z-10 w-full max-w-6xl mx-auto pt-8 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-[#a39ea8] gap-3 pointer-events-none">
        <div className="flex items-center gap-2 text-[#f3d2a2]">
          <span className="w-2 h-2 rounded-full bg-[#f3d2a2] animate-ping" />
          <span>REAL-TIME GLSL CHROMATIC REFRACTION: 60-120 FPS</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">DRAG CANVAS TO ROTATE MOLTEN CHROME</span>
          <span className="text-[#fdfbf7] flex items-center gap-1">
            SCROLL TO EXPLORE <ArrowDownRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
};
