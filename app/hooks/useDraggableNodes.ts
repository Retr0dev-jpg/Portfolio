'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type RefObject } from 'react';
import { clamp } from '@/app/lib/math';
import { emitCursorEvent } from '@/app/lib/cursorEvents';

export type Point = { x: number; y: number };

/** Keeps nodes inside the container, as a percentage of its size. */
const EDGE_MARGIN = 5;
export const DRAG_HANDLE_ATTR = 'data-node-draggable';

interface DragState<Id> {
  id: Id;
  offset: Point;
  moved: boolean;
}

/**
 * Mouse-drag for absolutely positioned nodes expressed in % of `containerRef`.
 * A press without movement is reported through `onTap` instead of a drag.
 */
export function useDraggableNodes<Id extends string>(
  containerRef: RefObject<HTMLElement | null>,
  initialPositions: Record<Id, Point>,
  onTap: (id: Id) => void,
) {
  const [positions, setPositions] = useState(initialPositions);
  const [draggingId, setDraggingId] = useState<Id | null>(null);
  const drag = useRef<DragState<Id> | null>(null);
  const positionsRef = useRef(positions);
  const onTapRef = useRef(onTap);

  useEffect(() => {
    positionsRef.current = positions;
    onTapRef.current = onTap;
  });

  const startDrag = useCallback(
    (id: Id, event: ReactMouseEvent<HTMLElement>) => {
      const container = containerRef.current;
      if (!container || !(event.target as HTMLElement).closest(`[${DRAG_HANDLE_ATTR}]`)) return;

      const rect = container.getBoundingClientRect();
      const node = positionsRef.current[id];
      drag.current = {
        id,
        moved: false,
        offset: {
          x: event.clientX - rect.left - (node.x / 100) * rect.width,
          y: event.clientY - rect.top - (node.y / 100) * rect.height,
        },
      };
      setDraggingId(id);
    },
    [containerRef],
  );

  useEffect(() => {
    if (!draggingId) return;

    const handleMove = (event: MouseEvent) => {
      const container = containerRef.current;
      const state = drag.current;
      if (!container || !state) return;

      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left - state.offset.x) / rect.width) * 100;
      const y = ((event.clientY - rect.top - state.offset.y) / rect.height) * 100;
      state.moved = true;
      setPositions((prev) => ({
        ...prev,
        [state.id]: {
          x: clamp(x, EDGE_MARGIN, 100 - EDGE_MARGIN),
          y: clamp(y, EDGE_MARGIN, 100 - EDGE_MARGIN),
        },
      }));
    };

    const handleUp = () => {
      const state = drag.current;
      drag.current = null;
      setDraggingId(null);
      emitCursorEvent('drag-end');
      if (state && !state.moved) onTapRef.current(state.id);
    };

    emitCursorEvent('drag-start');
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [containerRef, draggingId]);

  return { positions, startDrag };
}
