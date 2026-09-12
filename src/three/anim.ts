// Shared, mutable per-frame animation state (avoids React re-renders inside the render loop)
export const anim = {
  warp: 0, // 0..1 warp field intensity (smoothed)
  cutaway: 0, // 0..1 hull transparency (smoothed)
  spin: 1, // ring spin multiplier (smoothed)
  ringAngleA: 0,
  ringAngleB: 0,
  time: 0,
};
