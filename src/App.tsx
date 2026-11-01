import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/ui/Navbar';
import { CustomCursor } from './components/ui/CustomCursor';
import { HeroSection } from './components/sections/HeroSection';
import { AboutBento } from './components/sections/AboutBento';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SkillsMatrix } from './components/sections/SkillsMatrix';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/ui/Footer';
import { InteractiveTerminal } from './components/sections/InteractiveTerminal';
import { sound } from './utils/audio';

export const App: React.FC = () => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize Lenis Smooth Inertia Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // Global keyboard shortcut: Backtick/Tilde opens terminal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
  };

  return (
    <div className="relative min-h-screen bg-[#04060d] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Precision Trailing Custom Cursor */}
      <CustomCursor />

      {/* Floating HUD Navbar */}
      <Navbar
        onOpenTerminal={() => setTerminalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Experience Flow */}
      <main>
        <HeroSection onOpenTerminal={() => setTerminalOpen(true)} />
        <AboutBento />
        <ProjectsSection />
        <SkillsMatrix />
        <ContactSection />
      </main>

      {/* Futuristic Telemetry Footer */}
      <Footer />

      {/* Interactive Cyber Hacker Terminal (Triggered by button or `~` key) */}
      <InteractiveTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
    </div>
  );
};

export default App;
