'use client';

import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; size: number; speedX: number; speedY: number };

const COLOR = '#7C3AED';
const MOBILE_BREAKPOINT = 768;
const LINK_DISTANCE = 100;
const PARTICLE_ALPHA = 0.25;
const LINK_ALPHA = 0.1;

function particleCount(width: number) {
  return width < MOBILE_BREAKPOINT
    ? Math.min(Math.floor(width * 0.015), 30)
    : Math.min(Math.floor(width * 0.03), 100);
}

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: particleCount(width) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.2,
    speedY: (Math.random() - 0.5) * 0.2,
  }));
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let particles: Particle[] = [];
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = createParticles(canvas.width, canvas.height);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = COLOR;
      ctx.strokeStyle = COLOR;
      ctx.lineWidth = 0.5;

      particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size + 1.5, 0, Math.PI * 2);
        ctx.globalAlpha = PARTICLE_ALPHA;
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x > canvas.width || particle.x < 0) particle.speedX = -particle.speedX;
        if (particle.y > canvas.height || particle.y < 0) particle.speedY = -particle.speedY;

        for (let j = index + 1; j < particles.length; j++) {
          const other = particles[j];
          const distance = Math.hypot(other.x - particle.x, other.y - particle.y);
          if (distance >= LINK_DISTANCE) continue;

          ctx.beginPath();
          ctx.globalAlpha = LINK_ALPHA * (1 - distance / LINK_DISTANCE);
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-50 z-0" />;
}
