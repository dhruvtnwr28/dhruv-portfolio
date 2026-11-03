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
    'Tesseract overloaded with infinite energy ⚡',
    'git push --force origin main (don’t tell senior dev)',
    'It compiled on the first try. I am deeply suspicious.',
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
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#38bdf8', '#60a5fa', '#ffffff'],
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
      {/* 3D Avengers Tesseract Living Canvas */}
      <HeroCanvas3D />

      {/* Cosmic Tesseract Aurora Field */}
      <div className="absolute inset-0 tesseract-bg opacity-80 pointer-events-none" />

      {/* Main Editorial Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center items-start pointer-events-none">
        
        {/* Top Tesseract Status Pill */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-3 text-[11px] font-mono tracking-widest text-slate-400 uppercase mb-8">
          <span className="px-3.5 py-1.5 rounded-full bg-[#060f26]/80 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
            [ TESSERACT ENERGY ONLINE ]
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline">DHRUV TANWAR — FULL-STACK ARCHITECT</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-[#38bdf8]">[ COSMIC BLUE PROTOCOL ]</span>
        </div>

        {/* Big Avant-Garde MEGANTE Headline */}
        <div className="space-y-1 mb-6">
          <h1 className="text-4xl sm:text-7xl md:text-9xl font-megante tracking-tight text-[#fdfbf7] uppercase leading-[0.92] drop-shadow-[0_15px_45px_rgba(0,240,255,0.2)]">
            <span className="block text-gradient-tesseract">
              SITE IS UNDER
            </span>
            <span className="block text-gradient-cosmic italic">
              DEVELOPMENT
            </span>
            <span className="block text-white/95">
              FOR NOW.
            </span>
          </h1>
        </div>

        {/* Editorial Subtitle with Humor & Human Voice */}
        <div className="pointer-events-auto max-w-2xl bg-[#060f26]/85 border border-[#00f0ff]/25 rounded-2xl p-5 sm:p-7 backdrop-blur-xl mb-8 shadow-2xl">
          <p className="text-[#f1f5f9] text-sm sm:text-base leading-relaxed font-sans mb-3">
            <span className="font-bold text-[#00f0ff]">"Works on my machine™"</span> — currently convincing production to agree.
          </p>
          <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed font-sans">
            Instead of giving you another cookie-cutter AI portfolio, I'm hand-coding a custom cosmic experience. Click and drag the glowing <strong>Tesseract cube</strong> to rotate the Space Stone in 3D, squash a few imaginary bugs below, or reach out directly.
          </p>
        </div>

        {/* Magnetic Interactive Action Buttons */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-4 mb-8">
          <Magnetic strength={0.35}>
            <button
              onClick={handleFixBug}
              onMouseEnter={() => sound.playHover()}
              className="group relative px-7 py-4 rounded-full bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#1d4ed8] font-sans font-bold text-xs sm:text-sm text-black tracking-wider uppercase overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] transition-all duration-300 flex items-center gap-2.5"
            >
              <Bug className="w-4 h-4 text-black group-hover:rotate-45 transition-transform" />
              <span>{buttonMessage}</span>
            </button>
          </Magnetic>

          <Magnetic strength={0.35}>
            <button
              onClick={scrollToContact}
              onMouseEnter={() => sound.playHover()}
              className="px-7 py-4 rounded-full bg-[#060f26]/90 border border-[#00f0ff]/30 text-white font-sans text-xs sm:text-sm font-semibold tracking-wider hover:border-[#00f0ff] hover:bg-cyan-500/10 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
            >
              <Mail className="w-4 h-4 text-[#00f0ff]" />
              <span>SAY HELLO DIRECTLY</span>
            </button>
          </Magnetic>
        </div>

        {/* Humorous Telemetry Badges */}
        <div className="pointer-events-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-2xl font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#060f26]/75 border border-white/5 flex items-center gap-3">
            <Coffee className="w-4 h-4 text-[#00f0ff]" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Chai / Coffee</div>
              <div className="font-bold text-white">4.5 Cups / day</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060f26]/75 border border-white/5 flex items-center gap-3">
            <Bug className="w-4 h-4 text-[#38bdf8]" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Bugs Handled</div>
              <div className="font-bold text-white">{bugClicks > 0 ? `${bugClicks * 2} new` : 'Plenty'}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060f26]/75 border border-white/5 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#60a5fa]" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Localhost Faith</div>
              <div className="font-bold text-white">100% Solid</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060f26]/75 border border-white/5 flex items-center gap-3">
            <Laugh className="w-4 h-4 text-[#00f0ff]" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Tesseract Glow</div>
              <div className="font-bold text-white">Rhythmic Pulse</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Bar with Tesseract Interaction Guide */}
      <div className="relative z-10 w-full max-w-6xl mx-auto pt-8 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-3 pointer-events-none">
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
          <span>TESSERACT PULSE: LIVING HEARTBEAT // GLSL VOLUMETRIC RAYMARCH</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-cyan-300">CLICK & DRAG TO ROTATE TESSERACT</span>
          <span className="text-white flex items-center gap-1">
            SCROLL TO EXPLORE <ArrowDownRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
};
