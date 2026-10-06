'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { StackId } from '@/app/data/skills';
import { SECTION_ID } from '@/app/data/navigation';
import { scrollToSection } from '@/app/lib/scroll';

export type HighlightState = 'active' | 'fading';
type HighlightMap = Partial<Record<StackId, HighlightState>>;

const TIMING = {
  fadeOut: 500,
  /** Lets the smooth scroll to the skills section settle first. */
  startDelay: 700,
  stagger: 100,
  duration: 5000,
} as const;

const HighlightStateContext = createContext<HighlightMap>({});
const HighlightActionContext = createContext<(stack: readonly StackId[]) => void>(() => {});

function updateEntry(map: HighlightMap, id: StackId, next: HighlightState | null, onlyIf?: HighlightState) {
  if (onlyIf && map[id] !== onlyIf) return map;
  const copy = { ...map };
  if (next) copy[id] = next;
  else delete copy[id];
  return copy;
}

export function StackHighlightProvider({ children }: { children: ReactNode }) {
  const [highlights, setHighlights] = useState<HighlightMap>({});
  const highlightsRef = useRef(highlights);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    highlightsRef.current = highlights;
  }, [highlights]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const highlightStack = useCallback(
    (stack: readonly StackId[]) => {
      timers.current.forEach(clearTimeout);
      timers.current = [];

      const previouslyActive = (Object.keys(highlightsRef.current) as StackId[]).filter(
        (id) => highlightsRef.current[id] === 'active',
      );
      setHighlights(Object.fromEntries(previouslyActive.map((id) => [id, 'fading'])));
      previouslyActive.forEach((id) =>
        schedule(() => setHighlights((m) => updateEntry(m, id, null, 'fading')), TIMING.fadeOut),
      );

      scrollToSection(SECTION_ID.skills);

      schedule(() => {
        stack.forEach((id, index) => {
          schedule(() => {
            setHighlights((m) => updateEntry(m, id, 'active'));
            schedule(() => setHighlights((m) => updateEntry(m, id, null, 'active')), TIMING.duration);
          }, index * TIMING.stagger);
        });
      }, TIMING.startDelay);
    },
    [schedule],
  );

  return (
    <HighlightActionContext.Provider value={highlightStack}>
      <HighlightStateContext.Provider value={highlights}>{children}</HighlightStateContext.Provider>
    </HighlightActionContext.Provider>
  );
}

export const useStackHighlights = () => useContext(HighlightStateContext);
export const useHighlightStack = () => useContext(HighlightActionContext);
