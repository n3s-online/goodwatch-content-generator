import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import {
  COLORS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  SCENE_1_DURATION,
} from "../constants";
import { SceneProps } from "../types";

export const HookScene: React.FC<SceneProps> = ({ sourceTitle, sourceImage }) => {
  const frame = useCurrentFrame();
  const totalFrames = SCENE_1_DURATION;

  // Image zoom animation: 1.0x to 1.08x over 3 seconds
  const imageScale = interpolate(frame, [0, totalFrames], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  // Text fade in quickly at 0.1s (3 frames) with 0.3s duration (9 frames)
  const textOpacity = interpolate(frame, [3, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textTranslateY = interpolate(frame, [3, 12], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Title subtle pulse at 1.5s (45 frames)
  const titlePulse = interpolate(
    frame,
    [45, 50, 55, 60],
    [1.0, 1.02, 1.0, 1.02],
    {
      extrapolateRight: "clamp",
    }
  );

  // Fade transition at 2.5s (75 frames)
  const fadeOutOpacity = interpolate(frame, [75, totalFrames], [1, 0.7], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        opacity: fadeOutOpacity,
      }}
    >
      {/* Full Layout Container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "150px 20px 20px 20px",
        }}
      >
        {/* "If you liked" - Lower position to avoid app UI */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            marginBottom: 30,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: "700",
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              color: COLORS.text,
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
            }}
          >
            If you liked
          </span>
        </div>

        {/* Full Poster Image - Center, contained - ~1.3x larger (100% width, 85% height) */}
        <div
          style={{
            width: "100%",
            height: VIDEO_HEIGHT * 0.65,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            overflow: "visible",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "85%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Img
              src={sourceImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 16,
                transform: `scale(${imageScale})`,
                transformOrigin: "center center",
                filter: frame >= 75 ? "blur(2px)" : "none",
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px) scale(${titlePulse})`,
            marginBottom: 20,
            textAlign: "center",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: "900",
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              color: COLORS.text,
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
            }}
          >
            {sourceTitle.length > 22
              ? sourceTitle.substring(0, 22) + "..."
              : sourceTitle}
          </span>
        </div>

        {/* "then you need to watch..." - Bottom */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: "600",
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              color: COLORS.text,
              textAlign: "center",
              display: "block",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
            }}
          >
            then you need to watch...
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

