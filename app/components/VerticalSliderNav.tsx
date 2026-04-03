'use client';
import { useEffect, useState, useRef } from 'react';

function lerp(a: number, b: number, n: number) {
  return a + (b - a) * n;
}

function isDarkColor(rgb: string) {
  // Estrae i valori RGB e calcola la luminanza
  const match = rgb.match(/\d+/g);
  if (!match) return false;
  const [r, g, b] = match.map(Number);
  // Formula luminanza percepita
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
}

export default function VerticalSliderNav() {
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  // Stato per la posizione animata di ogni pallino
  const animStates = useRef<{ x: number; y: number }[]>([]);
  const animFrame = useRef<number>(0);
  const [contrastDots, setContrastDots] = useState<boolean[]>([]);

  useEffect(() => {
    // Trova solo le sezioni navigabili con id specifici
    const navigationSections = ['home', 'about', 'works', 'skills', 'projects', 'contact'];
    const foundSections = navigationSections
      .map(id => document.getElementById(id))
      .filter(section => section !== null) as HTMLElement[];
    
    setSections(foundSections);

    const handleScroll = () => {
      let current = 0;
      foundSections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          current = idx;
        }
      });
      setActiveIndex(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // inizializza
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Inizializza lo stato animato per ogni pallino
    animStates.current = sections.map(() => ({ x: 0, y: 0 }));
  }, [sections.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    function animate() {
      dotRefs.current.forEach((dot, idx) => {
        if (!dot) return;
        const rect = dot.getBoundingClientRect();
        const dotCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        const dx = mousePos.current.x - dotCenter.x;
        const dy = mousePos.current.y - dotCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const threshold = 100;
        let target = { x: 0, y: 0 };
        if (distance < threshold) {
          const strength = 1;
          target = { x: dx * strength, y: dy * strength };
        }
        // Interpola la posizione
        animStates.current[idx] = {
          x: lerp(animStates.current[idx]?.x || 0, target.x, 1),
          y: lerp(animStates.current[idx]?.y || 0, target.y, 1),
        };
        dot.style.transform = `translate(${animStates.current[idx].x}px, ${animStates.current[idx].y}px)`;
      });
      animFrame.current = requestAnimationFrame(animate);
    }
    animFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [sections.length]);

  // Rileva il colore di sfondo sotto ogni pallino e aggiorna il contrasto
  useEffect(() => {
    function updateContrast() {
      const newContrast: boolean[] = dotRefs.current.map(dot => {
        if (!dot) return false;
        const rect = dot.getBoundingClientRect();
        // Prende il punto centrale del pallino
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const el = document.elementFromPoint(x, y) as HTMLElement;
        if (!el) return false;
        const bg = window.getComputedStyle(el).backgroundColor;
        // Se lo sfondo è scuro, attiva il contrasto
        return isDarkColor(bg);
      });
      setContrastDots(newContrast);
    }
    updateContrast();
    window.addEventListener('scroll', updateContrast);
    window.addEventListener('resize', updateContrast);
    return () => {
      window.removeEventListener('scroll', updateContrast);
      window.removeEventListener('resize', updateContrast);
    };
  }, [sections.length]);

  const handleClick = (idx: number) => {
    const section = sections[idx];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (sections.length <= 1) return null; // Non mostrare se c'è solo una sezione

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 items-center">
      {sections.map((_, idx) => (
        <button
          key={idx}
          ref={el => { dotRefs.current[idx] = el; }}
          onClick={() => handleClick(idx)}
          onMouseEnter={() => {
            setHoveredDot(idx);
            window.dispatchEvent(new CustomEvent('dot-hover', { detail: { idx } }));
          }}
          onMouseLeave={() => {
            setHoveredDot(null);
            window.dispatchEvent(new CustomEvent('dot-leave', { detail: { idx } }));
          }}
          className={`w-12 h-12 rounded-full border-0 bg-transparent transition-all duration-300 focus:outline-none z-10 flex items-center justify-center cursor-pointer`}
          aria-label={`Vai alla sezione ${idx + 1}`}
        >
          <span className={`block w-4 h-4 rounded-full transition-all duration-200
            mix-blend-difference border-2 border-accent
            ${hoveredDot === idx ? 'shadow-2xl scale-110 bg-violet-500' : 'bg-white'}
            ${activeIndex === idx ? 'scale-125' : ''}
          `}></span>
        </button>
      ))}
    </div>
  );
} 