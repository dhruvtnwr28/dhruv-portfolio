import React, { useState } from 'react';
import { HeroCanvas3D } from '../canvas/HeroCanvas3D';
import { Sparkles, Bug, Coffee, ArrowDown, Laugh, Heart, Github, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

export const HeroSection: React.FC = () => {
  const [bugClicks, setBugClicks] = useState(0);
  const [buttonMessage, setButtonMessage] = useState('Click to "Fix" 1 Bug');

  const funnyMessages = [
    'Bug squashed! (+2 unexpected features created)',
    'Error 418: I am a teapot 🫖',
    'Now 99 bugs in the code, take one down, 127 bugs in the code...',
    'Deleting node_modules... just kidding 💀',
    'git push --force origin main (don’t tell anyone)',
    'It compiled without errors. Something is terribly wrong.',
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f3d2a2', '#d8a7ff', '#f2b8c6'],
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
    <section className="relative w-full min-h-screen flex flex-col justify-between pt-32 pb-14 px-4 sm:px-8 overflow-hidden select-none">
      {/* Aesthetic 3D Liquid Pearl Canvas */}
      <HeroCanvas3D />

      {/* Warm Ambient Glows */}
      <div className="absolute inset-0 aurora-bg opacity-70 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center items-start pointer-events-none">
        
        {/* Playful Status Pill */}
        <div className="pointer-events-auto inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#13111b]/80 border border-[#f3d2a2]/30 text-[#f3d2a2] text-xs font-mono tracking-wider mb-6 shadow-[0_0_25px_rgba(243,210,162,0.15)] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f3d2a2] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f3d2a2]" />
          </span>
          <span>DHRUV TANWAR ✦ HARD WORK IN PROGRESS</span>
        </div>

        {/* Big Bold Headline with MEGANTE Font */}
        <div className="space-y-2 mb-6">
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-megante tracking-normal text-[#fdfbf7] uppercase leading-[0.95] drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
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

        {/* Humorous Human Subtitle */}
        <div className="pointer-events-auto max-w-2xl bg-[#13111b]/80 border border-[#f3d2a2]/20 rounded-2xl p-5 sm:p-6 backdrop-blur-xl mb-8 shadow-xl">
          <p className="text-[#eae6df] text-sm sm:text-base leading-relaxed font-sans mb-3">
            <span className="font-bold text-[#f3d2a2]">"Works on my machine™"</span> — but I'm currently convincing production to agree.
          </p>
          <p className="text-[#a39ea8] text-xs sm:text-sm leading-relaxed">
            Instead of giving you another cookie-cutter AI template with fake cyber matrix text, I'm handcrafting something genuinely special. In the meantime, feel free to play with the 3D liquid sculpture behind this text or click around before I accidentally break localhost again.
          </p>
        </div>

        {/* Interactive Humorous Bug Fixer Deck */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={handleFixBug}
            onMouseEnter={() => sound.playHover()}
            className="group relative px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#f3d2a2] to-[#d8a7ff] font-sans font-bold text-xs sm:text-sm text-black tracking-wide uppercase overflow-hidden shadow-[0_0_30px_rgba(243,210,162,0.3)] hover:shadow-[0_0_45px_rgba(243,210,162,0.6)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-2.5"
          >
            <Bug className="w-4 h-4 text-black group-hover:rotate-45 transition-transform" />
            <span>{buttonMessage}</span>
          </button>

          <button
            onClick={scrollToContact}
            onMouseEnter={() => sound.playHover()}
            className="px-6 py-3.5 rounded-xl bg-[#13111b]/90 border border-white/10 text-white font-sans text-xs sm:text-sm font-semibold tracking-wide hover:border-[#f3d2a2]/50 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
          >
            <Mail className="w-4 h-4 text-[#f3d2a2]" />
            <span>Drop Me an Email</span>
          </button>
        </div>

        {/* Playful Realtime Developer Badges */}
        <div className="pointer-events-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-2xl font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#13111b]/70 border border-white/5 flex items-center gap-2.5">
            <Coffee className="w-4 h-4 text-[#f3d2a2]" />
            <div>
              <div className="text-[10px] text-[#a39ea8]">Chai / Coffee</div>
              <div className="font-bold text-white">4.5 Cups / day</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#13111b]/70 border border-white/5 flex items-center gap-2.5">
            <Bug className="w-4 h-4 text-[#f2b8c6]" />
            <div>
              <div className="text-[10px] text-[#a39ea8]">Bugs Created</div>
              <div className="font-bold text-white">{bugClicks > 0 ? `${bugClicks * 2} new` : 'Plenty'}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#13111b]/70 border border-white/5 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#d8a7ff]" />
            <div>
              <div className="text-[10px] text-[#a39ea8]">Localhost Faith</div>
              <div className="font-bold text-white">100% Solid</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#13111b]/70 border border-white/5 flex items-center gap-2.5">
            <Laugh className="w-4 h-4 text-[#e8a87c]" />
            <div>
              <div className="text-[10px] text-[#a39ea8]">AI Jargon</div>
              <div className="font-bold text-white">0% Banned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Aesthetic Telemetry Bar */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-8 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-[#a39ea8] gap-3 pointer-events-none">
        <div className="flex items-center gap-2 text-[#f3d2a2]">
          <span className="w-2 h-2 rounded-full bg-[#f3d2a2] animate-ping" />
          <span>REAL-TIME 3D LIQUID SHADER: ACTIVE</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">DRAG CANVAS TO ROTATE SCULPTURE</span>
          <span className="text-[#fdfbf7]">SCROLL FOR STORY ↓</span>
        </div>
      </div>
    </section>
  );
};
