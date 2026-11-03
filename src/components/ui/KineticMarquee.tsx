import React, { useEffect, useRef } from 'react';

interface KineticMarqueeProps {
  text?: string[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({
  text = [
    '✦ DHRUV TANWAR',
    '[ TESSERACT ENERGY ONLINE ]',
    '✦ SITE UNDER DEVELOPMENT',
    '✦ AVENGERS SPACE STONE ENGINE',
    '✦ MERN & THREE.JS',
    '✦ WORKS ON MY MACHINE™',
    '✦ VOLUMETRIC GLSL NEBULA',
  ],
  speed = 1.0,
  direction = 'left',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const move = speed * 40 * dt * (direction === 'left' ? -1 : 1);
      offsetRef.current += move;

      if (containerRef.current) {
        const width = containerRef.current.scrollWidth / 2;
        if (Math.abs(offsetRef.current) >= width) {
          offsetRef.current = 0;
        }
        containerRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [speed, direction]);

  return (
    <div className={`w-full overflow-hidden whitespace-nowrap select-none py-3 border-y border-[#00f0ff]/20 bg-[#060f26]/60 backdrop-blur-md ${className}`}>
      <div ref={containerRef} className="inline-flex gap-8 will-change-transform">
        {[...text, ...text, ...text].map((item, idx) => (
          <span
            key={idx}
            className="font-megante text-xs sm:text-sm tracking-widest uppercase text-[#38bdf8]/90 flex items-center gap-6"
          >
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
