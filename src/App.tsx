import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/ui/Navbar';
import { CustomCursor } from './components/ui/CustomCursor';
import { HeroSection } from './components/sections/HeroSection';
import { AboutBento } from './components/sections/AboutBento';
import { SkillsMatrix } from './components/sections/SkillsMatrix';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/ui/Footer';
import { sound } from './utils/audio';

export const App: React.FC = () => {
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

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
  };

  return (
    <div className="relative min-h-screen bg-[#09080d] text-[#f7f5f2] overflow-x-hidden selection:bg-[#f3d2a2] selection:text-black">
      {/* Precision Trailing Custom Cursor */}
      <CustomCursor />

      {/* Aesthetic Floating Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Experience Flow */}
      <main>
        <HeroSection />
        <AboutBento />
        <SkillsMatrix />
        <ContactSection />
      </main>

      {/* Minimal Aesthetic Footer */}
      <Footer />
    </div>
  );
};

export default App;
