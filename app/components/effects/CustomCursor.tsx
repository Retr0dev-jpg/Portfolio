'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import type Lenis from 'lenis';
import { angleDelta, lerp } from '@/app/lib/math';
import { onCursorEvent } from '@/app/lib/cursorEvents';

type Mode = 'default' | 'hollow' | 'nav' | 'dot' | 'drag';
type Point = { x: number; y: number };

const FINE_POINTER_CLASS = 'has-fine-pointer';
const EASE = 'cubic-bezier(0.22,1,0.36,1)';
const MIDDLE_BUTTON = 1;

const FOLLOW_RATE = 0.13;
const DOT_FOLLOW_RATE = 0.18;
/** Extra px around `[data-cursor]` targets that still counts as hovering. */
const HIT_MARGIN = 16;

const GLOW_SIZE = 150;
const GLOW_OPACITY = '0.2';

const ORBIT_RADIUS = 26;
const ORBIT_TURN_RATE = 0.15;
const ORBIT_MIN_SPEED = 0.5;
const ARROW_SIZE = 30;
const AUTO_SCROLL_SPEED = 5;

const BRACKET_CHAR_WIDTH = 9;
const BRACKET_GAP = 10;
const BRACKET_GLYPH_WIDTH = 10;
const DOT_RING_SIZE = 72;

const moveTransition = (seconds: number) => `left ${seconds}s ${EASE}, top ${seconds}s ${EASE}`;

const CURSOR_LOOK: Record<Mode, { size: number; hollow: boolean; border: string; visible: boolean; transition: string }> = {
  default: { size: 20, hollow: false, border: '2px', visible: true, transition: `${moveTransition(0.3)}, opacity 0.2s, width 0.3s, height 0.3s` },
  nav: { size: 20, hollow: false, border: '2px', visible: false, transition: `${moveTransition(0.3)}, opacity 0.2s, width 0.3s, height 0.3s` },
  hollow: { size: 28, hollow: true, border: '2px', visible: true, transition: `${moveTransition(0.3)}, opacity 0.2s, width 0.3s, height 0.3s` },
  dot: { size: 10, hollow: false, border: '2px', visible: false, transition: `${moveTransition(0.2)}, width 0.2s, height 0.2s, opacity 0.2s` },
  drag: { size: 32, hollow: true, border: '2.5px', visible: true, transition: `${moveTransition(0.15)}, opacity 0.15s, width 0.2s, height 0.2s` },
};

const HIDDEN_AT = { left: '-9999px', top: '-9999px', opacity: 0 } as const;
const BRACKET_CLASS = 'fixed pointer-events-none z-[999] text-accent font-mono text-2xl font-bold';
const BRACKET_STYLE = { ...HIDDEN_AT, transition: `${moveTransition(0.3)}, opacity 0.2s` };

interface PointerState {
  mouse: Point;
  prevMouse: Point;
  glow: Point;
  cursor: Point;
  bracket: Point;
  orbitAngle: number;
  visible: boolean;
  middlePressed: boolean;
  dragging: boolean;
  dotTarget: Point | null;
  hover: { mode: 'nav' | 'hollow'; textLength: number } | null;
  appliedMode: Mode | null;
}

function findHoverTarget(mouse: Point): PointerState['hover'] {
  let hover: PointerState['hover'] = null;
  document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
    const rect = el.getBoundingClientRect();
    const inside =
      mouse.x >= rect.left - HIT_MARGIN &&
      mouse.x <= rect.right + HIT_MARGIN &&
      mouse.y >= rect.top - HIT_MARGIN &&
      mouse.y <= rect.bottom + HIT_MARGIN;
    if (!inside) return;
    // Hollow targets win over nav links when both match.
    if (el.dataset.cursor === 'hollow') hover = { mode: 'hollow', textLength: 0 };
    else if (!hover) hover = { mode: 'nav', textLength: el.textContent?.length ?? 0 };
  });
  return hover;
}

function resolveMode(state: PointerState): Mode {
  if (state.dragging) return 'drag';
  if (state.hover) return state.hover.mode;
  if (state.dotTarget) return 'dot';
  return 'default';
}

export default function CustomCursor({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const glowRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const leftBracketRef = useRef<HTMLDivElement>(null);
  const rightBracketRef = useRef<HTMLDivElement>(null);
  const [isOverDot, setIsOverDot] = useState(false);
  const ringX = useSpring(0, { stiffness: 400, damping: 30 });
  const ringY = useSpring(0, { stiffness: 400, damping: 30 });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(FINE_POINTER_CLASS);

    const state: PointerState = {
      mouse: { x: 0, y: 0 },
      prevMouse: { x: 0, y: 0 },
      glow: { x: 0, y: 0 },
      cursor: { x: 0, y: 0 },
      bracket: { x: 0, y: 0 },
      orbitAngle: 0,
      visible: false,
      middlePressed: false,
      dragging: false,
      dotTarget: null,
      hover: null,
      appliedMode: null,
    };

    const refreshHover = () => {
      state.hover = findHoverTarget(state.mouse);
    };

    const handleMouseMove = (event: MouseEvent) => {
      state.mouse = { x: event.clientX, y: event.clientY };
      state.visible = true;
      refreshHover();
    };
    const handleMouseLeave = () => {
      state.visible = false;
      state.middlePressed = false;
    };
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== MIDDLE_BUTTON) return;
      event.preventDefault();
      state.middlePressed = true;
    };
    const handleMouseUp = (event: MouseEvent) => {
      if (event.button !== MIDDLE_BUTTON) return;
      event.preventDefault();
      state.middlePressed = false;
    };
    const blockContextMenu = (event: MouseEvent) => event.preventDefault();

    const unsubscribe = [
      onCursorEvent('dot-enter', (target) => {
        state.dotTarget = target;
        setIsOverDot(true);
      }),
      onCursorEvent('dot-leave', () => {
        state.dotTarget = null;
        setIsOverDot(false);
      }),
      onCursorEvent('drag-start', () => {
        state.dragging = true;
      }),
      onCursorEvent('drag-end', () => {
        state.dragging = false;
      }),
    ];

    const updateOrbit = () => {
      if (!state.middlePressed) {
        state.orbitAngle = 0;
        return;
      }
      const dx = state.mouse.x - state.prevMouse.x;
      const dy = state.mouse.y - state.prevMouse.y;
      if (Math.hypot(dx, dy) > ORBIT_MIN_SPEED) {
        state.orbitAngle += angleDelta(state.orbitAngle, Math.atan2(dy, dx)) * ORBIT_TURN_RATE;
      }
    };

    const autoScroll = () => {
      if (!state.middlePressed || !state.visible) return;
      const dx = Math.cos(state.orbitAngle) * AUTO_SCROLL_SPEED;
      const dy = Math.sin(state.orbitAngle) * AUTO_SCROLL_SPEED;
      lenisRef.current?.scrollTo(window.scrollY + dy, { duration: 0.1, immediate: false });
      if (Math.abs(dx) > 0.1) window.scrollBy(dx, 0);
    };

    const render = () => {
      const { glow, cursor, visible } = state;

      const glowEl = glowRef.current;
      if (glowEl) {
        glowEl.style.left = `${glow.x - GLOW_SIZE / 2}px`;
        glowEl.style.top = `${glow.y - GLOW_SIZE / 2}px`;
        glowEl.style.opacity = visible ? GLOW_OPACITY : '0';
      }

      const mode = resolveMode(state);
      const look = CURSOR_LOOK[mode];
      const cursorEl = cursorRef.current;
      if (cursorEl) {
        if (state.appliedMode !== mode) {
          state.appliedMode = mode;
          cursorEl.style.width = `${look.size}px`;
          cursorEl.style.height = `${look.size}px`;
          cursorEl.style.backgroundColor = look.hollow ? 'transparent' : 'white';
          cursorEl.style.borderWidth = look.border;
          cursorEl.style.mixBlendMode = look.hollow ? 'normal' : 'difference';
          cursorEl.style.transition = look.transition;
        }
        cursorEl.style.left = `${cursor.x - look.size / 2}px`;
        cursorEl.style.top = `${cursor.y - look.size / 2}px`;
        cursorEl.style.opacity = visible && look.visible ? '1' : '0';
      }

      const arrowEl = arrowRef.current;
      if (arrowEl) {
        const arrowX = cursor.x + Math.cos(state.orbitAngle) * ORBIT_RADIUS;
        const arrowY = cursor.y + Math.sin(state.orbitAngle) * ORBIT_RADIUS;
        if (state.middlePressed) {
          arrowEl.style.left = `${arrowX - ARROW_SIZE / 2}px`;
          arrowEl.style.top = `${arrowY - ARROW_SIZE / 2}px`;
        }
        arrowEl.style.opacity = visible && state.middlePressed ? '1' : '0';
        // The arrow glyph points up, the orbit angle is measured from the x axis.
        arrowEl.style.transform = `rotate(${(state.orbitAngle * 180) / Math.PI + 90}deg)`;
      }

      const left = leftBracketRef.current;
      const right = rightBracketRef.current;
      if (left && right) {
        const showBrackets = mode === 'nav' && visible;
        if (showBrackets && state.hover) {
          const halfText = (state.hover.textLength * BRACKET_CHAR_WIDTH) / 2;
          left.style.left = `${cursor.x - halfText - BRACKET_GAP}px`;
          right.style.left = `${cursor.x + halfText + BRACKET_GAP - BRACKET_GLYPH_WIDTH}px`;
          left.style.top = right.style.top = `${cursor.y - 10}px`;
        }
        left.style.opacity = right.style.opacity = showBrackets ? '1' : '0';
      }

      ringX.set(state.bracket.x - DOT_RING_SIZE / 2);
      ringY.set(state.bracket.y - DOT_RING_SIZE / 2);
    };

    let frame = 0;
    const tick = () => {
      const { mouse, dotTarget } = state;
      state.glow = { x: lerp(state.glow.x, mouse.x, FOLLOW_RATE), y: lerp(state.glow.y, mouse.y, FOLLOW_RATE) };

      const target = dotTarget ?? mouse;
      const rate = dotTarget ? DOT_FOLLOW_RATE : FOLLOW_RATE;
      state.cursor = { x: lerp(state.cursor.x, target.x, rate), y: lerp(state.cursor.y, target.y, rate) };
      state.bracket = dotTarget
        ? { x: lerp(state.bracket.x, mouse.x, FOLLOW_RATE), y: lerp(state.bracket.y, mouse.y, FOLLOW_RATE) }
        : mouse;

      updateOrbit();
      state.prevMouse = mouse;
      autoScroll();
      render();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', refreshHover, { passive: true });
    root.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe.forEach((off) => off());
      root.classList.remove(FINE_POINTER_CLASS);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', refreshHover);
      root.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [lenisRef, ringX, ringY]);

  return (
    <>
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-[999] rounded-full bg-accent blur-xl"
        style={{
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          ...HIDDEN_AT,
          transition: `${moveTransition(0.35)}, opacity 0.2s`,
        }}
      />
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[999] rounded-full bg-white border-2 border-accent mix-blend-difference"
        style={{ width: 20, height: 20, ...HIDDEN_AT }}
      />
      <div
        ref={arrowRef}
        className="fixed pointer-events-none z-[999] mix-blend-difference"
        style={{
          width: ARROW_SIZE,
          height: ARROW_SIZE,
          ...HIDDEN_AT,
          transition: 'left 0.2s ease-out, top 0.2s ease-out, opacity 0.15s, transform 0.15s ease-out',
        }}
      >
        <svg width={ARROW_SIZE} height={ARROW_SIZE} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 150 30 C 180 60, 240 110, 220 160 C 190 135, 110 135, 80 160 C 60 110, 120 60, 150 30 Z"
            fill="white"
            stroke="#7C3AED"
            strokeWidth="10"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div ref={leftBracketRef} className={BRACKET_CLASS} style={BRACKET_STYLE}>
        [
      </div>
      <div ref={rightBracketRef} className={BRACKET_CLASS} style={BRACKET_STYLE}>
        ]
      </div>
      <AnimatePresence>
        {isOverDot && (
          <motion.div
            className="fixed left-0 top-0 pointer-events-none z-[1000] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ width: DOT_RING_SIZE, height: DOT_RING_SIZE, x: ringX, y: ringY }}
          >
            {['(', ')'].map((glyph, i) => (
              <span
                key={glyph}
                className={`absolute ${i === 0 ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 text-accent text-4xl font-bold scale-130 mix-blend-difference`}
                style={{ WebkitTextStroke: '0.3px white' }}
              >
                {glyph}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
