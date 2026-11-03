import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Github, Menu, X } from 'lucide-react';
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
    { name: 'Arsenal', href: '#skills' },
    { name: 'Transmit', href: '#contact' },
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
            ? 'bg-[#060f26]/80 backdrop-blur-xl border border-[#00f0ff]/25 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(0,240,255,0.12)]'
            : 'bg-[#060f26]/40 backdrop-blur-md border border-white/10'
        }`}
      >
        {/* Brand / Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group"
          onClick={() => sound.playClick()}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f0ff] via-[#38bdf8] to-[#1d4ed8] flex items-center justify-center font-megante font-bold text-black text-sm shadow-[0_0_20px_rgba(0,240,255,0.5)] group-hover:scale-105 transition-transform">
            <span>D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-megante text-base tracking-wider text-[#fdfbf7] group-hover:text-[#00f0ff] transition-colors">
              DHRUV TANWAR
            </span>
            <span className="text-[10px] font-mono text-[#38bdf8]/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
              TESSERACT STABLE // ONLINE
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-1.5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              onMouseEnter={() => sound.playHover()}
              className="px-4 py-1 text-xs font-sans tracking-wide text-slate-300 hover:text-[#00f0ff] hover:bg-cyan-500/10 rounded-full transition-all duration-200"
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
            className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-all"
            title={soundEnabled ? 'Mute audio' : 'Enable audio'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#00f0ff]" />
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
            className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-[#00f0ff]/40 transition-all"
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
            className="md:hidden p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 bg-[#060f26]/95 border border-[#00f0ff]/30 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-3 font-sans text-sm z-50">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="py-2.5 px-3 rounded-lg text-slate-200 hover:bg-cyan-500/10 hover:text-[#00f0ff] transition-colors flex items-center justify-between"
            >
              <span>{link.name}</span>
              <span className="text-[#00f0ff] text-xs">✦</span>
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
