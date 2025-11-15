// Video dimensions for short-form vertical video (9:16 aspect ratio)
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;

// Scene durations (in frames)
export const SCENE_1_DURATION = 90; // 3 seconds
export const SCENE_2_DURATION = 150; // 5 seconds
export const SCENE_3_DURATION = 150; // 5 seconds
export const SCENE_4_DURATION = 150; // 5 seconds
export const SCENE_5_DURATION = 150; // 5 seconds

// Total video duration
export const TOTAL_DURATION =
  SCENE_1_DURATION +
  SCENE_2_DURATION +
  SCENE_3_DURATION +
  SCENE_4_DURATION +
  SCENE_5_DURATION;

// Colors
export const COLORS = {
  background: '#0a0a0a',
  text: '#ffffff',
  accent: '#3b82f6',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

// Typography
export const FONTS = {
  title: {
    fontSize: 72,
    fontWeight: 'bold' as const,
    fontFamily: 'Arial, sans-serif',
  },
  subtitle: {
    fontSize: 48,
    fontWeight: '600' as const,
    fontFamily: 'Arial, sans-serif',
  },
  body: {
    fontSize: 36,
    fontWeight: 'normal' as const,
    fontFamily: 'Arial, sans-serif',
  },
  small: {
    fontSize: 28,
    fontWeight: 'normal' as const,
    fontFamily: 'Arial, sans-serif',
  },
};

