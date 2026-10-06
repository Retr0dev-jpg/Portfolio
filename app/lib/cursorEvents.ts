/**
 * Typed channel between interactive widgets and the custom cursor,
 * so they don't depend on each other's DOM structure.
 */
type CursorEventMap = {
  'dot-enter': { x: number; y: number };
  'dot-leave': undefined;
  'drag-start': undefined;
  'drag-end': undefined;
};

type CursorEventName = keyof CursorEventMap;
type Listener<K extends CursorEventName> = (detail: CursorEventMap[K]) => void;

const target = typeof window === 'undefined' ? null : new EventTarget();

export function emitCursorEvent<K extends CursorEventName>(
  name: K,
  ...[detail]: CursorEventMap[K] extends undefined ? [] : [CursorEventMap[K]]
) {
  target?.dispatchEvent(new CustomEvent(name, { detail }));
}

export function onCursorEvent<K extends CursorEventName>(name: K, listener: Listener<K>) {
  const handler = (event: Event) => listener((event as CustomEvent<CursorEventMap[K]>).detail);
  target?.addEventListener(name, handler);
  return () => target?.removeEventListener(name, handler);
}
