import { spring, interpolate } from 'remotion';

export const entranceSpring = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 120, mass: 0.8 } });

export const gentleSpring = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 80, mass: 1 } });

export const exitSpring = (frame: number, fps: number, delay = 0) =>
  1 - spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150, mass: 0.6 } });

export const morphSpring = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 100, mass: 1 } });

export const focusSpring = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 25, stiffness: 60, mass: 1.2 } });

export const loop = (frame: number, cycleDuration: number) =>
  (frame % cycleDuration) / cycleDuration;

export const pulse = (frame: number, cycleDuration: number, min = 0.6, max = 1) => {
  const t = loop(frame, cycleDuration);
  return interpolate(t, [0, 0.5, 1], [min, max, min]);
};
