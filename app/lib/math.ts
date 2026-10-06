export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const TAU = Math.PI * 2;

/** Normalizes an angle to [0, 2π). */
export const normalizeAngle = (angle: number) => {
  const normalized = angle % TAU;
  return normalized < 0 ? normalized + TAU : normalized;
};

/** Shortest signed difference between two angles, in (-π, π]. */
export const angleDelta = (from: number, to: number) => {
  let diff = to - from;
  if (diff > Math.PI) diff -= TAU;
  else if (diff < -Math.PI) diff += TAU;
  return diff;
};
