import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import {
  COLORS,
  FONTS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  SCENE_1_DURATION,
} from "../constants";
import { SceneProps } from "../types";

// Hook text variations
const HOOK_VARIATIONS = [
  "If you loved",
  "Obsessed with",
  "Finished",
  "Can't get enough of",
];

export const Scene1: React.FC<SceneProps> = ({ sourceTitle, sourceImage }) => {
  const frame = useCurrentFrame();
  const totalFrames = SCENE_1_DURATION;

  // Select a random hook variation (deterministic based on title)
  const hookIndex = sourceTitle.length % HOOK_VARIATIONS.length;
  const hookText = HOOK_VARIATIONS[hookIndex];

  // Image zoom animation: 1.0x to 1.05x over 4 seconds
  const imageScale = interpolate(frame, [0, totalFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Text fade in from bottom at 0.5s (15 frames)
  const textOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textTranslateY = interpolate(frame, [15, 30], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Blur/fade transition at 3.0s (90 frames)
  const fadeOutOpacity = interpolate(frame, [90, totalFrames], [1, 0.7], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* Main Content Cover Image - 60% of screen height */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT * 0.6,
          overflow: "hidden",
        }}
      >
        <Img
          src={sourceImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${imageScale})`,
            filter: frame >= 90 ? "blur(2px)" : "none",
          }}
        />
        {/* Overlay for text readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: COLORS.overlay,
          }}
        />
      </div>

      {/* Text Section - Bottom 40% */}
      <div
        style={{
          position: "absolute",
          top: VIDEO_HEIGHT * 0.6,
          left: 0,
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT * 0.4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
          opacity: fadeOutOpacity,
        }}
      >
        {/* "If you loved" / variation */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              ...FONTS.hookText,
              color: COLORS.text,
            }}
          >
            {hookText}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          <span
            style={{
              ...FONTS.mainTitle,
              color: COLORS.text,
            }}
          >
            {sourceTitle.length > 25
              ? sourceTitle.substring(0, 22) + "..."
              : sourceTitle}
          </span>
        </div>

        {/* "you need to watch..." */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          <span
            style={{
              ...FONTS.hookText,
              color: COLORS.text,
            }}
          >
            you need to watch...
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
