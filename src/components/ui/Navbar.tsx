import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Github, Menu, X, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  onToggleSound,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Philosophy', href: '#about' },
    { name: 'Capabilities', href: '#skills' },
    { name: 'Say Hello', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    sound.playClick();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 py-4 sm:py-6 transition-all duration-300">
      <nav
        className={`w-full max-w-5xl mx-auto flex items-center justify-between px-5 sm:px-7 py-3 rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'bg-[#121019]/80 backdrop-blur-xl border border-[#f3d2a2]/20 shadow-[0_10px_35px_rgba(0,0,0,0.6)]'
            : 'bg-[#121019]/40 backdrop-blur-md border border-white/5'
        }`}
      >
        {/* Brand / Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group"
          onClick={() => sound.playClick()}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f3d2a2] to-[#d8a7ff] flex items-center justify-center font-megante font-bold text-black text-sm shadow-[0_0_20px_rgba(243,210,162,0.4)] group-hover:scale-105 transition-transform">
            <span>D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-megante text-base tracking-wider text-[#fdfbf7] group-hover:text-[#f3d2a2] transition-colors">
              DHRUV TANWAR
            </span>
            <span className="text-[10px] font-mono text-[#d8a7ff]/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f3d2a2] animate-pulse" />
              STATUS: COOKING 🍳
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              onMouseEnter={() => sound.playHover()}
              className="px-4 py-1 text-xs font-sans tracking-wide text-slate-300 hover:text-[#f3d2a2] hover:bg-white/5 rounded-full transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            onMouseEnter={() => sound.playHover()}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 hover:text-[#f3d2a2] hover:border-[#f3d2a2]/40 transition-all"
            title={soundEnabled ? 'Mute ambient soundscapes' : 'Enable ambient soundscapes'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#f3d2a2]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/dhruvtnwr28"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            onMouseEnter={() => sound.playHover()}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 hover:text-white hover:border-[#f3d2a2]/40 transition-all"
            title="GitHub Profile"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 bg-[#121019]/95 border border-[#f3d2a2]/30 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-3 font-sans text-sm z-50">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/5 hover:text-[#f3d2a2] transition-colors flex items-center justify-between"
            >
              <span>{link.name}</span>
              <span className="text-[#f3d2a2] text-xs">✦</span>
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
