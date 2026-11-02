import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/ui/Navbar';
import { CustomCursor } from './components/ui/CustomCursor';
import { HeroSection } from './components/sections/HeroSection';
import { KineticMarquee } from './components/ui/KineticMarquee';
import { AboutBento } from './components/sections/AboutBento';
import { SkillsMatrix } from './components/sections/SkillsMatrix';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/ui/Footer';
import { sound } from './utils/audio';

export const App: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize Lenis Smooth Inertia Scroll with Awwwards Tuning
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
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
    <div className="relative min-h-screen bg-[#08070b] text-[#f7f5f2] overflow-x-hidden selection:bg-[#f3d2a2] selection:text-black">
      {/* Precision Trailing Custom Magnetic Cursor */}
      <CustomCursor />

      {/* Aesthetic Floating Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Experience Flow */}
      <main>
        <HeroSection />

        {/* Kinetic Typography Marquee Track 1 */}
        <KineticMarquee
          speed={0.8}
          direction="left"
          text={[
            '✦ DHRUV TANWAR',
            '[ EXHIBITION // 2026 ]',
            '✦ SITE UNDER DEVELOPMENT',
            '✦ LIQUID AVANT-GARDE',
            '✦ FULL-STACK ARCHITECT',
            '✦ WORKS ON MY MACHINE™',
            '✦ AWWWARDS SOTD INSPIRATION',
          ]}
        />

        <AboutBento />
        <SkillsMatrix />

        {/* Kinetic Typography Marquee Track 2 */}
        <KineticMarquee
          speed={0.7}
          direction="right"
          className="border-b-0"
          text={[
            '✦ CHROMATIC REFRACTION',
            '✦ HANDCRAFTED GLSL SHADERS',
            '✦ 0% AI GENERATED TEMPLATES',
            '✦ TASTE OVER COOKIE-CUTTERS',
            '✦ MERN & THREE.JS',
            '✦ COFFEE LEVEL: 99.4%',
          ]}
        />

        <ContactSection />
      </main>

      {/* Minimal Aesthetic Footer */}
      <Footer />
    </div>
  );
};

export default App;
