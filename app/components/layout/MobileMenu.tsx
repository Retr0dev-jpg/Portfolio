'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE } from '@/app/config/site';
import { HEADER_NAV, type SectionId } from '@/app/data/navigation';
import { scrollToSection } from '@/app/lib/scroll';

/** Body scroll stays locked until the overlay starts closing; scrolling earlier would be ignored. */
const SCROLL_AFTER_CLOSE_MS = 100;
const REVEAL_ORIGIN = 'at calc(100% - 2rem) 2rem';

interface MobileMenuProps {
  open: boolean;
  activeId: SectionId;
  onClose: () => void;
}

export default function MobileMenu({ open, activeId, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const navigate = (id: SectionId) => {
    onClose();
    setTimeout(() => scrollToSection(id), SCROLL_AFTER_CLOSE_MS);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[55] bg-accent flex flex-col items-center justify-center"
          initial={{ clipPath: `circle(0% ${REVEAL_ORIGIN})` }}
          animate={{ clipPath: `circle(150% ${REVEAL_ORIGIN})` }}
          exit={{ clipPath: `circle(0% ${REVEAL_ORIGIN})` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav aria-label="Menu mobile">
            <ul className="flex flex-col items-center gap-8">
              {HEADER_NAV.map((item, index) => {
                const isActive = activeId === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.35, delay: 0.15 + index * 0.07 }}
                  >
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`text-3xl font-semibold transition-colors ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}`}
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(item.id);
                      }}
                    >
                      {item.label}
                      {isActive && <span className="block h-0.5 bg-white mt-1 rounded-full" />}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
          <motion.p
            className="absolute bottom-10 text-white/40 text-sm font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {SITE.brand}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
