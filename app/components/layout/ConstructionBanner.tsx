'use client';
import { useState, useEffect } from 'react';

interface ConstructionBannerProps {
  visible: boolean;
}

export default function ConstructionBanner({ visible }: ConstructionBannerProps) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!visible) return;
    const targetDate = new Date('2026-04-06T21:30:00').getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[60] bg-accent text-white text-center py-2 px-3 md:px-4 text-xs md:text-sm font-mono tracking-wide shadow-md flex items-center justify-center gap-2 md:gap-3 flex-wrap">
      <span className="inline-flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
        Portfolio in creazione...
      </span>
      <span className="hidden sm:inline text-white/60">|</span>
      <span>
        Prossimo aggiornamento:
        <span className="ml-2 font-bold tabular-nums">
          {String(countdown.days).padStart(2, '0')}g{' '}
          {String(countdown.hours).padStart(2, '0')}h{' '}
          {String(countdown.minutes).padStart(2, '0')}m{' '}
          {String(countdown.seconds).padStart(2, '0')}s
        </span>
      </span>
    </div>
  );
}
