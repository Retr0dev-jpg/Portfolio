'use client';

import { useEffect, useState } from 'react';

/**
 * Index of the last section whose top edge has crossed the middle of the viewport.
 * `ids` must be referentially stable (e.g. a module-level constant).
 */
export function useActiveSection(ids: readonly string[]): number {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const threshold = window.innerHeight / 2;
      let current = 0;
      ids.forEach((id, index) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= threshold) current = index;
      });
      setActiveIndex(current);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [ids]);

  return activeIndex;
}
