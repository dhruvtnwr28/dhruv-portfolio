import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Volume2, VolumeX, Github, Menu, X, Radio } from 'lucide-react';
import { sound } from '../../utils/audio';

interface NavbarProps {
  onOpenTerminal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTerminal,
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
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Transmitter', href: '#contact' },
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
        className={`w-full max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'bg-[#090d1a]/85 backdrop-blur-xl border border-cyan-500/25 shadow-[0_4px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,255,0.1)]'
            : 'bg-[#090d1a]/50 backdrop-blur-md border border-white/10'
        }`}
      >
        {/* Brand / Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group"
          onClick={() => sound.playClick()}
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-mono font-bold text-black text-sm shadow-[0_0_15px_rgba(0,240,255,0.5)] group-hover:scale-105 transition-transform">
            <span>DT</span>
            <div className="absolute inset-0 rounded-lg bg-cyan-400 opacity-0 group-hover:opacity-40 blur transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm tracking-wide text-slate-100 group-hover:text-cyan-300 transition-colors">
              DHRUV TANWAR
            </span>
            <span className="text-[10px] font-mono text-cyan-400/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE // MERN ARCHITECT
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] rounded-full px-3 py-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              onMouseEnter={() => sound.playHover()}
              className="px-3.5 py-1 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-full transition-all duration-200"
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
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
            title={soundEnabled ? 'Mute procedural soundscapes' : 'Enable procedural soundscapes'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Interactive Terminal Trigger */}
          <button
            onClick={() => {
              sound.playTerminal();
              onOpenTerminal();
            }}
            onMouseEnter={() => sound.playHover()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>[~] CLI</span>
          </button>

          {/* GitHub Direct Link */}
          <a
            href="https://github.com/dhruvtnwr28"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            onMouseEnter={() => sound.playHover()}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
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
            className="md:hidden p-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 bg-[#090d1a]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col gap-3 font-mono text-sm z-50">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="py-2.5 px-3 rounded-lg text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors flex items-center justify-between"
            >
              <span>{link.name}</span>
              <span className="text-cyan-500 text-xs">➜</span>
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 flex items-center justify-center gap-2 font-mono text-xs font-semibold"
            >
              <TerminalIcon className="w-4 h-4" />
              <span>LAUNCH CYBER TERMINAL</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
