'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { ROTATING_WORD_GROUPS } from '@/app/data/hero';

const ROTATE_EVERY_MS = 2000;
/** Half of the `.word-flip.flipping` animation: the word is swapped while it's edge-on. */
const FLIP_HALF_MS = 300;

export default function RotatingWords() {
  const [indices, setIndices] = useState(() => ROTATING_WORD_GROUPS.map(() => 0));
  const [flipping, setFlipping] = useState(() => ROTATING_WORD_GROUPS.map(() => false));
  const paused = useRef(ROTATING_WORD_GROUPS.map(() => false));
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  }, []);

  const setFlip = (group: number, value: boolean) =>
    setFlipping((prev) => prev.map((v, i) => (i === group ? value : v)));

  const rotate = useCallback(
    (group: number) => {
      setFlip(group, true);
      schedule(() => {
        setIndices((prev) =>
          prev.map((wordIndex, i) => (i === group ? (wordIndex + 1) % ROTATING_WORD_GROUPS[i].length : wordIndex)),
        );
        schedule(() => setFlip(group, false), FLIP_HALF_MS);
      }, FLIP_HALF_MS);
    },
    [schedule],
  );

  useEffect(() => {
    const pending = timers.current;
    const interval = setInterval(() => {
      const available = ROTATING_WORD_GROUPS.map((_, i) => i).filter((i) => !paused.current[i]);
      if (!available.length) return;
      rotate(available[Math.floor(Math.random() * available.length)]);
    }, ROTATE_EVERY_MS);

    return () => {
      clearInterval(interval);
      pending.forEach(clearTimeout);
    };
  }, [rotate]);

  return (
    <>
      {ROTATING_WORD_GROUPS.map((words, group) => (
        <Fragment key={group}>
          {group > 0 && ', '}
          <span
            className="clickable-word"
            data-cursor="hollow"
            onClick={() => rotate(group)}
            onMouseEnter={() => (paused.current[group] = true)}
            onMouseLeave={() => (paused.current[group] = false)}
          >
            <span className={`word-flip ${flipping[group] ? 'flipping' : ''}`}>{words[indices[group]]}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}
