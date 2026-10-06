'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { BUILD_INFO } from '@/app/config/site';
import { formatRelativeTime } from '@/app/lib/time';

const REFRESH_MS = 60_000;

function subscribeToMinutes(onChange: () => void) {
  const id = setInterval(onChange, REFRESH_MS);
  return () => clearInterval(id);
}

/** Minute-resolution clock; `null` on the server so the label never mismatches during hydration. */
function useMinuteClock(): number | null {
  return useSyncExternalStore(
    subscribeToMinutes,
    () => Math.floor(Date.now() / REFRESH_MS) * REFRESH_MS,
    () => null,
  );
}

export default function ConstructionBanner({ onHeightChange }: { onHeightChange: (height: number) => void }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const now = useMinuteClock();
  const relativeTime = now === null ? '' : formatRelativeTime(BUILD_INFO.time, now);
  const shortSha = BUILD_INFO.commitSha.slice(0, 7);
  const commitMessage = BUILD_INFO.commitMessage || 'sviluppo locale';

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    const observer = new ResizeObserver(() => onHeightChange(banner.offsetHeight));
    observer.observe(banner);
    return () => observer.disconnect();
  }, [onHeightChange]);

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 w-full z-[60] bg-accent text-white text-center py-2 px-3 md:px-4 text-xs md:text-sm font-mono tracking-wide shadow-md flex items-center justify-center gap-2 md:gap-3 flex-wrap"
    >
      <span className="inline-flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
        Portfolio in creazione...
      </span>
      <span className="hidden sm:inline text-white/60">|</span>
      <span className="inline-flex items-center gap-1.5 min-w-0">
        <span className="text-white/70">Ultimo aggiornamento:</span>
        <span className="font-semibold truncate max-w-[160px] sm:max-w-xs" title={commitMessage}>
          {commitMessage}
        </span>
        {shortSha && <span className="text-white/50 hidden sm:inline">({shortSha})</span>}
        {relativeTime && <span className="text-white/70 whitespace-nowrap">· {relativeTime}</span>}
      </span>
    </div>
  );
}
