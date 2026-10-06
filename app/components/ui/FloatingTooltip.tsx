export interface TooltipAnchor {
  x: number;
  y: number;
  label: string;
}

const OFFSET_ABOVE = 32;

/** Viewport position centered above `element`. */
export function anchorAbove(element: Element, label: string): TooltipAnchor {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top - OFFSET_ABOVE, label };
}

export default function FloatingTooltip({ anchor }: { anchor: TooltipAnchor | null }) {
  if (!anchor) return null;

  return (
    <div
      role="tooltip"
      className="fixed z-[9999] px-2 py-1 bg-accent text-white text-[10px] rounded-md shadow-lg pointer-events-none animate-fade-in -translate-x-1/2"
      style={{ left: anchor.x, top: anchor.y }}
    >
      {anchor.label}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-accent" />
    </div>
  );
}
