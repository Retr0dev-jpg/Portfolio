'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { normalizeAngle } from '@/app/lib/math';

type Phase = 'atom' | 'explosion' | 'blackhole';
type Point = { x: number; y: number };

const CENTER = 200;
const ORBIT_COLOR = '#4B5563';
/** Caps the per-frame step so a background tab doesn't make electrons jump on resume. */
const MAX_FRAME_DELTA = 0.016;

const NUCLEUS = [
  { x: 192, y: 192, color: '#e53e3e' },
  { x: 212, y: 185, color: '#e53e3e' },
  { x: 200, y: 216, color: '#3b82f6' },
  { x: 224, y: 208, color: '#3b82f6' },
  { x: 208, y: 228, color: '#e53e3e' },
  { x: 176, y: 212, color: '#3b82f6' },
] as const;
const NUCLEON_RADIUS = 16;

const ORBITS = [
  { rx: 150, ry: 50, speed: 0.12, electronSpeed: 0.15, angle: 0, electronAngle: 0 },
  { rx: 200, ry: 70, speed: 0.12, electronSpeed: 0.12, angle: Math.PI / 4, electronAngle: (Math.PI * 2) / 3 },
  { rx: 250, ry: 90, speed: 0.12, electronSpeed: 0.18, angle: Math.PI / 2, electronAngle: (Math.PI * 4) / 3 },
] as const;
const ELECTRON_RADIUS = 10;

const TIMING = {
  explosion: 1200,
  swallowStart: 300,
  swallowStep: 200,
  settle: 500,
} as const;

const toDegrees = (radians: number) => (radians * 180) / Math.PI;
const orbitTransform = (angle: number) => `rotate(${toDegrees(angle)} ${CENTER} ${CENTER})`;

function electronPosition(orbit: (typeof ORBITS)[number], orbitAngle: number, electronAngle: number): Point {
  const x = orbit.rx * Math.cos(electronAngle);
  const y = orbit.ry * Math.sin(electronAngle);
  return {
    x: CENTER + x * Math.cos(orbitAngle) - y * Math.sin(orbitAngle),
    y: CENTER + x * Math.sin(orbitAngle) + y * Math.cos(orbitAngle),
  };
}

function randomExplosionTargets(): (Point & { delay: number })[] {
  return NUCLEUS.map((nucleon) => {
    const angle = Math.atan2(nucleon.y - CENTER, nucleon.x - CENTER);
    const distance = 150 + Math.random() * 50;
    return {
      x: CENTER + Math.cos(angle) * distance,
      y: CENTER + Math.sin(angle) * distance,
      delay: 0.1 + Math.random() * 0.2,
    };
  });
}

function Nucleus({ onClick }: { onClick: () => void }) {
  return (
    <>
      <circle cx={CENTER} cy={CENTER} r="50" fill="transparent" onClick={onClick} />
      {NUCLEUS.map((nucleon, i) => (
        <motion.circle
          key={i}
          cx={nucleon.x}
          cy={nucleon.y}
          r={NUCLEON_RADIUS}
          fill={nucleon.color}
          filter="url(#atomGlow)"
          onClick={onClick}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: [0, Math.sin(i) * 8, -Math.cos(i) * 5, Math.cos(i * 2) * 7, 0],
            y: [0, Math.cos(i) * 6, Math.sin(i * 2) * 8, -Math.sin(i) * 5, 0],
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.6 + i * 0.1 },
            scale: { duration: 0.6, delay: 0.6 + i * 0.1, ease: 'backOut' },
            x: { duration: 3 + (i % 3), repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: i * 0.2 },
            y: { duration: 4 + (i % 2), repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: i * 0.2 },
          }}
        />
      ))}
    </>
  );
}

interface Explosion {
  targets: ReturnType<typeof randomExplosionTargets>;
  orbitAngles: number[];
}

export default function HeroShape({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ellipseRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const electronRefs = useRef<(SVGCircleElement | null)[]>([]);
  const angles = useRef({
    orbit: ORBITS.map((o) => o.angle),
    electron: ORBITS.map((o) => o.electronAngle),
  });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [phase, setPhase] = useState<Phase>('atom');
  const [isAnimating, setIsAnimating] = useState(false);
  const [particlesConsumed, setParticlesConsumed] = useState(0);
  const [explosion, setExplosion] = useState<Explosion | null>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Orbits are driven imperatively and only while the shape is on screen.
  useEffect(() => {
    if (phase !== 'atom' || !containerRef.current) return;

    let frame = 0;
    let lastTime = 0;

    const tick = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, MAX_FRAME_DELTA);
      lastTime = time;
      const { orbit, electron } = angles.current;

      ORBITS.forEach((config, i) => {
        orbit[i] = normalizeAngle(orbit[i] + config.speed * delta);
        electron[i] = normalizeAngle(electron[i] + config.electronSpeed * delta);
        const position = electronPosition(config, orbit[i], electron[i]);
        ellipseRefs.current[i]?.setAttribute('transform', orbitTransform(orbit[i]));
        electronRefs.current[i]?.setAttribute('cx', String(position.x));
        electronRefs.current[i]?.setAttribute('cy', String(position.y));
      });

      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting) {
        stop();
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [phase]);

  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const handleClick = () => {
    if (isAnimating) return;

    if (phase === 'blackhole') {
      setPhase('atom');
      setParticlesConsumed(0);
      return;
    }

    setExplosion({ targets: randomExplosionTargets(), orbitAngles: [...angles.current.orbit] });
    setIsAnimating(true);
    setPhase('explosion');
    setParticlesConsumed(0);

    schedule(() => {
      setPhase('blackhole');
      NUCLEUS.forEach((_, i) => {
        schedule(() => setParticlesConsumed((count) => count + 1), TIMING.swallowStart + i * TIMING.swallowStep);
      });
      schedule(
        () => setIsAnimating(false),
        TIMING.swallowStart + NUCLEUS.length * TIMING.swallowStep + TIMING.settle,
      );
    }, TIMING.explosion);
  };

  const growth = (base: number, step: number) => (particlesConsumed === 0 ? 0 : base + particlesConsumed * step);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{ transform: 'translateX(-80px)' }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="-100 -100 600 600"
        style={{ position: 'absolute', pointerEvents: isAnimating ? 'none' : 'auto' }}
      >
        <defs>
          <filter id="atomGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="blackHoleGlow" x="-200%" y="-200%" width="500%" height="500%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#000000" floodOpacity="0.6" result="shadow" />
            <feComposite in="SourceGraphic" in2="shadow" operator="over" />
          </filter>
          <radialGradient id="blackHoleGradient" cx="45%" cy="45%" r="70%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#000000" stopOpacity="1" />
            <stop offset="20%" stopColor="#0a0a0a" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#1a1a1a" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#2a2a2a" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#404040" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {phase === 'atom' && (
          <motion.g
            key="atom"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ transformBox: 'view-box', transformOrigin: '50% 50%' }}
          >
            {ORBITS.map((orbit, i) => {
              const electron = electronPosition(orbit, orbit.angle, orbit.electronAngle);
              return (
                <g key={i}>
                  <ellipse
                    ref={(el) => {
                      ellipseRefs.current[i] = el;
                    }}
                    cx={CENTER}
                    cy={CENTER}
                    rx={orbit.rx}
                    ry={orbit.ry}
                    fill="none"
                    stroke={ORBIT_COLOR}
                    strokeWidth={2}
                    strokeOpacity={0.5}
                    transform={orbitTransform(orbit.angle)}
                  />
                  <circle
                    ref={(el) => {
                      electronRefs.current[i] = el;
                    }}
                    r={ELECTRON_RADIUS}
                    fill={ORBIT_COLOR}
                    opacity="0.9"
                    cx={electron.x}
                    cy={electron.y}
                  />
                  {/* Drawn inside the innermost orbit so the outer orbits pass over it. */}
                  {i === 0 && <Nucleus onClick={handleClick} />}
                </g>
              );
            })}
          </motion.g>
        )}

        {phase === 'explosion' && explosion && (
          <g key="explosion">
            {ORBITS.map((orbit, i) => (
              <motion.ellipse
                key={i}
                cx={CENTER}
                cy={CENTER}
                rx={orbit.rx}
                ry={orbit.ry}
                fill="none"
                stroke={ORBIT_COLOR}
                strokeWidth={2}
                strokeOpacity={0.5}
                transform={orbitTransform(explosion.orbitAngles[i])}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0, strokeWidth: 0 }}
                transition={{ duration: 0.4 }}
              />
            ))}
            {NUCLEUS.map((nucleon, i) => (
              <motion.circle
                key={i}
                cx={nucleon.x}
                cy={nucleon.y}
                r={NUCLEON_RADIUS}
                fill={nucleon.color}
                filter="url(#atomGlow)"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  x: explosion.targets[i].x - nucleon.x,
                  y: explosion.targets[i].y - nucleon.y,
                  opacity: 0.8,
                  scale: 1.2,
                }}
                transition={{ duration: 1.0, delay: explosion.targets[i].delay, ease: 'easeOut' }}
              />
            ))}
          </g>
        )}

        {phase === 'blackhole' && explosion && (
          <g key="blackhole">
            <circle cx={CENTER} cy={CENTER} r="100" fill="transparent" onClick={handleClick} />
            <motion.circle
              cx={CENTER}
              cy={CENTER}
              r="30"
              fill="#000000"
              filter="url(#blackHoleGlow)"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ scale: 0 }}
              animate={{ scale: growth(0.5, 0.6), transition: { duration: 0.3, ease: 'easeOut' } }}
            />
            <motion.ellipse
              cx={CENTER}
              cy={CENTER}
              rx="80"
              ry="40"
              fill="url(#blackHoleGradient)"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: growth(0.8, 0.4),
                opacity: particlesConsumed === 0 ? 0 : Math.min(0.4, 0.1 + particlesConsumed * 0.05),
                rotate: 360,
                transition: {
                  duration: 0.3,
                  ease: 'easeOut',
                  rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
                },
              }}
            />
            <motion.ellipse
              cx={CENTER}
              cy={CENTER}
              rx="60"
              ry="80"
              fill="url(#blackHoleGradient)"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: growth(0.6, 0.3),
                opacity: particlesConsumed === 0 ? 0 : Math.min(0.3, 0.05 + particlesConsumed * 0.04),
                rotate: -360,
                transition: {
                  duration: 0.3,
                  ease: 'easeOut',
                  rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
                },
              }}
            />
            {NUCLEUS.map((nucleon, i) => (
              <motion.circle
                key={i}
                cx={explosion.targets[i].x}
                cy={explosion.targets[i].y}
                r={NUCLEON_RADIUS}
                fill={nucleon.color}
                filter="url(#atomGlow)"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ opacity: 0.8, scale: 1.2 }}
                animate={{
                  x: CENTER - explosion.targets[i].x,
                  y: CENTER - explosion.targets[i].y,
                  opacity: 0,
                  scale: 0.1,
                }}
                transition={{ duration: 1.0 + i * 0.2, delay: 0.3 + i * 0.1, ease: [0.5, 0.05, 0.5, 0.95] }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
