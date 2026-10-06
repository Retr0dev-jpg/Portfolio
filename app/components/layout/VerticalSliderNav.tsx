'use client';

import { useEffect, useRef, useState } from 'react';
import { SECTION_ORDER } from '@/app/data/navigation';
import { useActiveSection } from '@/app/hooks/useActiveSection';
import { scrollToSection } from '@/app/lib/scroll';
import { emitCursorEvent } from '@/app/lib/cursorEvents';

const MAGNET_RADIUS = 100;
const MAGNET_STRENGTH = 0.5;

export default function VerticalSliderNav() {
  const activeIndex = useActiveSection(SECTION_ORDER);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Magnetic dots: each one leans toward the pointer while it's within the radius.
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const nav = navRef.current;
      if (!nav) return;
      // offsetLeft/Top ignore transforms, so this is the dot's resting center even mid-transition.
      const navRect = nav.getBoundingClientRect();

      dotRefs.current.forEach((dot) => {
        if (!dot) return;
        const dx = event.clientX - (navRect.left + dot.offsetLeft + dot.offsetWidth / 2);
        const dy = event.clientY - (navRect.top + dot.offsetTop + dot.offsetHeight / 2);
        const pull = Math.hypot(dx, dy) < MAGNET_RADIUS ? MAGNET_STRENGTH : 0;
        dot.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEnter = (index: number, dot: HTMLButtonElement) => {
    setHoveredIndex(index);
    const rect = dot.getBoundingClientRect();
    emitCursorEvent('dot-enter', { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  const handleLeave = () => {
    setHoveredIndex(null);
    emitCursorEvent('dot-leave');
  };

  return (
    <nav ref={navRef} aria-label="Sezioni" className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 items-center">
      {SECTION_ORDER.map((id, index) => (
        <button
          key={id}
          type="button"
          ref={(el) => {
            dotRefs.current[index] = el;
          }}
          onClick={() => scrollToSection(id)}
          onMouseEnter={(event) => handleEnter(index, event.currentTarget)}
          onMouseLeave={handleLeave}
          className="w-12 h-12 rounded-full border-0 bg-transparent transition-all duration-300 focus:outline-none z-10 flex items-center justify-center cursor-pointer"
          aria-label={`Vai alla sezione ${id}`}
          aria-current={activeIndex === index ? 'true' : undefined}
        >
          <span
            className={`block w-4 h-4 rounded-full transition-all duration-200 mix-blend-difference border-2 border-accent ${hoveredIndex === index ? 'shadow-2xl scale-110 bg-violet-500' : 'bg-white'} ${activeIndex === index ? 'scale-125' : ''}`}
          />
        </button>
      ))}
    </nav>
  );
}
