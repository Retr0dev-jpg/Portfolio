'use client';

import dynamic from 'next/dynamic';

const MouseEffect = dynamic(() => import('./MouseEffect'), { ssr: false });
const ParticlesBackground = dynamic(() => import('./ParticlesBackground'), { ssr: false });

export default function LazyEffects() {
  return (
    <>
      <MouseEffect />
      <ParticlesBackground />
    </>
  );
}
