'use client';

import { useLenis } from '@/app/hooks/useLenis';
import { useIsTouchDevice } from '@/app/hooks/useIsTouchDevice';
import CustomCursor from './CustomCursor';

/** Smooth scrolling everywhere; the custom cursor only on fine-pointer devices. */
export default function PointerEffects() {
  const lenisRef = useLenis();
  const isTouch = useIsTouchDevice();

  return isTouch ? null : <CustomCursor lenisRef={lenisRef} />;
}
