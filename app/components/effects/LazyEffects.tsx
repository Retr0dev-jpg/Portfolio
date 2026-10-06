'use client';

import dynamic from 'next/dynamic';

const PointerEffects = dynamic(() => import('./PointerEffects'), { ssr: false });
const ParticlesBackground = dynamic(() => import('./ParticlesBackground'), { ssr: false });

export default function LazyEffects() {
  return (
    <>
      <PointerEffects />
      <ParticlesBackground />
    </>
  );
}
