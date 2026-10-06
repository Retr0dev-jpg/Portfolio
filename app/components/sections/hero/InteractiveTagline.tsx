'use client';

import { useRef, type MouseEvent } from 'react';
import { HERO_TAGLINE } from '@/app/data/hero';

const WORDS = HERO_TAGLINE.split(' ');
const ACTIVATION_RADIUS = 25;
/** `.hover-word.word-active` snaps to the accent color, then fades back over the base transition. */
const ACTIVE_FLASH_MS = 50;

export default function InteractiveTagline() {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleMouseMove = (event: MouseEvent<HTMLParagraphElement>) => {
    wordRefs.current.forEach((word) => {
      if (!word) return;
      const rect = word.getBoundingClientRect();
      const distance = Math.hypot(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
      );
      if (distance < ACTIVATION_RADIUS) {
        word.classList.add('word-active');
        setTimeout(() => word.classList.remove('word-active'), ACTIVE_FLASH_MS);
      }
    });
  };

  return (
    <p className="text-lg text-gray-600" onMouseMove={handleMouseMove}>
      {WORDS.map((word, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className="hover-word"
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}
