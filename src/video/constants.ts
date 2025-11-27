// Video dimensions for short-form vertical video (9:16 aspect ratio)
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;

// Scene durations (in frames) - Based on video_specs.md
export const SCENE_1_DURATION = 90; // 3 seconds - Hook
export const SCENE_2_DURATION = 120; // 4 seconds - Category 1
export const SCENE_3_DURATION = 120; // 4 seconds - Category 2
export const SCENE_4_DURATION = 120; // 4 seconds - Category 3
export const SCENE_5_DURATION = 120; // 4 seconds - Overall Top Picks
export const SCENE_6_DURATION = 150; // 5 seconds - Closing

// Total video duration (~24 seconds)
export const TOTAL_DURATION =
  SCENE_1_DURATION +
  SCENE_2_DURATION +
  SCENE_3_DURATION +
  SCENE_4_DURATION +
  SCENE_5_DURATION +
  SCENE_6_DURATION;

// Brand Colors - Based on video_specs.md
export const COLORS = {
  background: "#1a1d29", // Dark navy/charcoal
  accent: "#5cb85c", // Vibrant green (GoodWatch logo)
  text: "#ffffff", // White
  textSecondary: "#a0a0a0", // Light gray
  overlay: "rgba(0, 0, 0, 0.6)", // Text readability overlay
};

// Typography - Based on video_specs.md
export const FONTS = {
  mainTitle: {
    fontSize: 48,
    fontWeight: "bold" as const,
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  },
  hookText: {
    fontSize: 32,
    fontWeight: "normal" as const,
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  },
  categoryLabel: {
    fontSize: 28,
    fontWeight: "bold" as const,
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    letterSpacing: "1px",
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: "normal" as const,
    fontFamily: "Helvetica Neue, Arial, sans-serif",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold" as const,
    fontFamily: "Helvetica Neue, Arial, sans-serif",
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "normal" as const,
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    textTransform: "uppercase" as const,
  },
};
