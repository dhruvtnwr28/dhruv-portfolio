import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [cursorText, setCursorText] = useState('');

  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || window.innerWidth < 1024) {
      return;
    }

    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const onMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };

      const targetElement = e.target as HTMLElement | null;
      if (targetElement) {
        const interactive = targetElement.closest('button, a, input, textarea, [data-cursor="pointer"]');
        const customTextElem = targetElement.closest('[data-cursor-text]');

        setHovered(!!interactive);

        if (customTextElem) {
          setCursorText(customTextElem.getAttribute('data-cursor-text') || '');
        } else {
          setCursorText('');
        }
      }
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let rafId: number;
    const updateCursor = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.16;
      pos.current.y += (target.current.y - pos.current.y) * 0.16;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    rafId = requestAnimationFrame(updateCursor);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Precision inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#f3d2a2] pointer-events-none z-[9999] shadow-[0_0_12px_#f3d2a2] transition-opacity duration-150"
      />

      {/* Trailing physics ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-[#f3d2a2]/70 backdrop-blur-[1px] transition-all duration-200 flex items-center justify-center ${
          hovered
            ? 'w-14 h-14 bg-[#f3d2a2]/15 border-[#f3d2a2] scale-110 shadow-[0_0_25px_rgba(243,210,162,0.4)]'
            : clicked
            ? 'w-7 h-7 bg-[#f3d2a2]/30 scale-90'
            : 'w-10 h-10'
        }`}
      >
        {cursorText && (
          <span className="text-[10px] font-mono font-bold tracking-wider text-[#f3d2a2] uppercase">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};
