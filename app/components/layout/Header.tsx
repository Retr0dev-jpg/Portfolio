'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Works', href: '#works' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Header({ bannerHeight = 0 }: { bannerHeight?: number }) {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const smoothScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => smoothScrollTo(href.substring(1)), 100);
  };

  return (
    <>
      <header className={`fixed left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-sm backdrop-blur-sm py-4' : 'bg-transparent py-4 md:py-6'
      }`} style={{ top: `${bannerHeight}px` }}>
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a href="#" className="logo-link text-2xl font-mono font-bold text-accent">Retr0_</a>
          </motion.div>
          
          {/* Desktop nav */}
          <nav className="hidden md:block">
            <ul className="flex gap-8">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <a
                    href={item.href}
                    className={`nav-link relative font-medium text-sm transition-colors ${
                      activeSection === item.href.substring(1) ? 'text-accent' : 'text-gray-700 hover:text-accent'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo(item.href.substring(1));
                    }}
                  >
                    {item.name}
                    {activeSection === item.href.substring(1) && (
                      <motion.span
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent"
                        layoutId="activeSection"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-1.5 z-[60]"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
          >
            <motion.span
              className="block w-6 h-0.5 bg-current origin-center"
              animate={mobileMenuOpen
                ? { rotate: 45, y: 4, backgroundColor: '#fff' }
                : { rotate: 0, y: 0, backgroundColor: scrolled ? '#374151' : '#374151' }
              }
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-current origin-center"
              animate={mobileMenuOpen
                ? { opacity: 0 }
                : { opacity: 1 }
              }
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-current origin-center"
              animate={mobileMenuOpen
                ? { rotate: -45, y: -4, backgroundColor: '#fff' }
                : { rotate: 0, y: 0, backgroundColor: scrolled ? '#374151' : '#374151' }
              }
              transition={{ duration: 0.25 }}
            />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen overlay menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-accent flex flex-col items-center justify-center"
            initial={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2rem) 2rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav>
              <ul className="flex flex-col items-center gap-8">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.35, delay: 0.15 + index * 0.07 }}
                  >
                    <a
                      href={item.href}
                      className={`text-3xl font-semibold transition-colors ${
                        activeSection === item.href.substring(1) ? 'text-white' : 'text-white/70 hover:text-white'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                    >
                      {item.name}
                      {activeSection === item.href.substring(1) && (
                        <span className="block h-0.5 bg-white mt-1 rounded-full" />
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.p
              className="absolute bottom-10 text-white/40 text-sm font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Retr0_
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
