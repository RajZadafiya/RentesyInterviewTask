import { Easing } from 'react-native-reanimated';

export const SpringConfigs = {
  // Snappy for taps and micro-interactions
  snappy: {
    damping: 18,
    stiffness: 240,
    mass: 0.8,
  },
  // Bouncy entrance for message bubbles
  bubbleEntrance: {
    damping: 14,
    stiffness: 160,
    mass: 0.9,
  },
  // Fluid organic for voice orb and breathing animations
  organic: {
    damping: 24,
    stiffness: 90,
    mass: 1.2,
  },
  // Quick responsive feedback
  quick: {
    damping: 16,
    stiffness: 300,
    mass: 0.6,
  },
};

export const Timings = {
  fast: 200,
  normal: 350,
  slow: 600,
  pulseCycle: 2400,
  orbBreathCycle: 3200,
};

export const Easings = {
  easeInOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
  easeOutQuart: Easing.bezier(0.25, 1, 0.5, 1),
  easeInQuart: Easing.bezier(0.5, 0, 0.75, 0),
  subtleOvershoot: Easing.bezier(0.34, 1.3, 0.64, 1),
};

