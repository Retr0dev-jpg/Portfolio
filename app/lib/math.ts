export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const TAU = Math.PI * 2;

/** Normalizes an angle to [0, 2π). */
export const normalizeAngle = (angle: number) => {
  const normalized = angle % TAU;
  return normalized < 0 ? normalized + TAU : normalized;
};

/** Shortest signed difference between two angles, in (-π, π]. Inputs may be unbounded. */
export const angleDelta = (from: number, to: number) => {
  const diff = normalizeAngle(to - from);
  return diff > Math.PI ? diff - TAU : diff;
};
