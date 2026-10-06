'use client';

import { useEffect } from 'react';
import { SITE } from '@/app/config/site';

const STYLES = [
  'color: #7C3AED',
  'font-size: 16px',
  'font-weight: bold',
  'text-shadow: 2px 2px 0px rgba(124, 58, 237, 0.3)',
].join(';');

const MESSAGE = `
╔══════════════════════════════════════════════════════════════╗
║                    🕵️ Ciao, Curioso! 👋                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Vedo che ti piace sbirciare sotto il cofano!                ║
║  Rispetto la tua curiosità da sviluppatore                   ║
║                                                              ║
║  Trovi un bug o altro? Apri una issue su GitHub:             ║
║  ${SITE.socials.github.url.replace('https://', '').padEnd(60)}║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`;

export function useConsoleGreeting() {
  useEffect(() => {
    console.log(`%c${MESSAGE}`, STYLES);
  }, []);
}
