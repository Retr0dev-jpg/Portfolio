'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface ConstructionBannerProps {
  visible: boolean;
  onHeightChange?: (height: number) => void;
}

function useRelativeTime(isoDate: string) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const compute = () => {
      const diff = Date.now() - new Date(isoDate).getTime();
      const mins  = Math.floor(diff / 60_000);
      const hours = Math.floor(diff / 3_600_000);
      const days  = Math.floor(diff / 86_400_000);
      if (mins < 1)       return 'appena ora';
      if (mins < 60)      return `${mins} min fa`;
      if (hours < 24)     return `${hours}h fa`;
      if (days === 1)     return 'ieri';
      if (days < 30)      return `${days} giorni fa`;
      const months = Math.floor(days / 30);
      if (months < 12)    return `${months} mes${months === 1 ? 'e' : 'i'} fa`;
      return `${Math.floor(months / 12)} ann${Math.floor(months / 12) === 1 ? 'o' : 'i'} fa`;
    };
    setLabel(compute());
    const id = setInterval(() => setLabel(compute()), 60_000);
    return () => clearInterval(id);
  }, [isoDate]);

  return label;
}

const BUILD_TIME  = process.env.NEXT_PUBLIC_BUILD_TIME  ?? '';
const COMMIT_MSG  = process.env.NEXT_PUBLIC_GIT_COMMIT_MSG ?? '';
const COMMIT_SHA  = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? '';

export default function ConstructionBanner({ visible, onHeightChange }: ConstructionBannerProps) {
  const bannerRef  = useRef<HTMLDivElement>(null);
  const relTime    = useRelativeTime(BUILD_TIME);

  const reportHeight = useCallback(() => {
    if (bannerRef.current && onHeightChange) {
      onHeightChange(bannerRef.current.offsetHeight);
    }
  }, [onHeightChange]);

  useEffect(() => {
    if (!visible || !bannerRef.current) return;
    const ro = new ResizeObserver(reportHeight);
    ro.observe(bannerRef.current);
    reportHeight();
    return () => ro.disconnect();
  }, [visible, reportHeight]);

  if (!visible) return null;

  const shortSha   = COMMIT_SHA ? COMMIT_SHA.slice(0, 7) : null;
  const commitMsg  = COMMIT_MSG || 'sviluppo locale';

  return (
    <div ref={bannerRef} className="fixed top-0 left-0 w-full z-[60] bg-accent text-white text-center py-2 px-3 md:px-4 text-xs md:text-sm font-mono tracking-wide shadow-md flex items-center justify-center gap-2 md:gap-3 flex-wrap">
      <span className="inline-flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
        Portfolio in creazione...
      </span>
      <span className="hidden sm:inline text-white/60">|</span>
      <span className="inline-flex items-center gap-1.5 min-w-0">
        <span className="text-white/70">Ultimo aggiornamento:</span>
        <span className="font-semibold truncate max-w-[160px] sm:max-w-xs" title={commitMsg}>
          {commitMsg}
        </span>
        {shortSha && (
          <span className="text-white/50 hidden sm:inline">({shortSha})</span>
        )}
        {relTime && (
          <span className="text-white/70 whitespace-nowrap">· {relTime}</span>
        )}
      </span>
    </div>
  );
}
