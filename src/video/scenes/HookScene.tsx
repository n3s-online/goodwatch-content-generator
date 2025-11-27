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
          padding: "30px 20px 20px 20px",
        }}
      >
        {/* "If you liked" - Top */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 42,
              fontWeight: "600",
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              color: COLORS.text,
            }}
          >
            If you liked
          </span>
        </div>

        {/* Full Poster Image - Center, contained - 66% width */}
        <div
          style={{
            width: "100%",
            height: VIDEO_HEIGHT * 0.82,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 15,
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          <div
            style={{
              width: "66%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Img
              src={sourceImage}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: 12,
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8)",
                transform: `scale(${imageScale})`,
                filter: frame >= 90 ? "blur(2px)" : "none",
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            marginBottom: 15,
            textAlign: "center",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: "bold",
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              color: COLORS.text,
            }}
          >
            {sourceTitle.length > 20
              ? sourceTitle.substring(0, 17) + "..."
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
              fontSize: 42,
              fontWeight: "600",
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              color: COLORS.text,
              textAlign: "center",
              display: "block",
            }}
          >
            then you need to watch...
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

