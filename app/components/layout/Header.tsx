'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SITE } from '@/app/config/site';
import { HEADER_NAV, SECTION_ORDER, type SectionId } from '@/app/data/navigation';
import { useActiveSection } from '@/app/hooks/useActiveSection';
import { scrollToSection } from '@/app/lib/scroll';
import MobileMenu from './MobileMenu';

const SCROLLED_THRESHOLD = 50;
const HAMBURGER_COLOR = { open: '#fff', closed: '#374151' } as const;

function useIsScrolled(threshold: number) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);

  return scrolled;
}

export default function Header({ offsetTop = 0 }: { offsetTop?: number }) {
  const scrolled = useIsScrolled(SCROLLED_THRESHOLD);
  const activeId: SectionId = SECTION_ORDER[useActiveSection(SECTION_ORDER)];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-sm backdrop-blur-sm py-4' : 'bg-transparent py-4 md:py-6'}`}
        style={{ top: offsetTop }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <a href="#" data-cursor="hollow" className="text-2xl font-mono font-bold text-accent">
              {SITE.brand}
            </a>
          </motion.div>

          <nav className="hidden md:block" aria-label="Principale">
            <ul className="flex gap-8">
              {HEADER_NAV.map((item, index) => {
                const isActive = activeId === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <a
                      href={`#${item.id}`}
                      data-cursor="nav"
                      aria-current={isActive ? 'true' : undefined}
                      className={`nav-link relative font-medium text-sm transition-colors ${isActive ? 'text-accent' : 'text-gray-700 hover:text-accent'}`}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToSection(item.id);
                      }}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent"
                          layoutId="activeSection"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-1.5 z-[60]"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={menuOpen}
          >
            <motion.span
              className="block w-6 h-0.5 origin-center"
              animate={menuOpen ? { rotate: 45, y: 4, backgroundColor: HAMBURGER_COLOR.open } : { rotate: 0, y: 0, backgroundColor: HAMBURGER_COLOR.closed }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="block w-6 h-0.5 origin-center"
              style={{ backgroundColor: HAMBURGER_COLOR.closed }}
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="block w-6 h-0.5 origin-center"
              animate={menuOpen ? { rotate: -45, y: -4, backgroundColor: HAMBURGER_COLOR.open } : { rotate: 0, y: 0, backgroundColor: HAMBURGER_COLOR.closed }}
              transition={{ duration: 0.25 }}
            />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} activeId={activeId} onClose={() => setMenuOpen(false)} />
    </>
  );
}
