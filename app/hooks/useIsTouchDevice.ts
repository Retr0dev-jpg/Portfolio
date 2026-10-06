import { useSyncExternalStore } from 'react';

let touchDetected = false;

const detectTouch = () =>
  touchDetected || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

function subscribe(onChange: () => void) {
  // Hybrid devices report a fine pointer until the first real touch.
  const handleTouch = () => {
    touchDetected = true;
    onChange();
  };
  window.addEventListener('touchstart', handleTouch, { once: true, passive: true });
  return () => window.removeEventListener('touchstart', handleTouch);
}

export function useIsTouchDevice() {
  return useSyncExternalStore(subscribe, detectTouch, () => false);
}
