import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { COLORS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../constants";
import { MediaItem, ClosingSceneProps } from "../types";
import { formatCategoryLabel } from "../utils/formatCategory";

export const ClosingScene: React.FC<ClosingSceneProps> = ({
  allItems,
  categoryLabels,
}) => {
  const frame = useCurrentFrame();

  // Scene is now 5 seconds (150 frames)
  // All recommendation covers scale down and arrange into grid (0.0s to 0.5s)
  const gridOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const gridScale = interpolate(frame, [0, 15], [1.2, 1], {
    extrapolateRight: "clamp",
  });

  // Title text fades in at 0.2s (6 frames)
  const titleOpacity = interpolate(frame, [6, 21], [0, 1], {
    extrapolateRight: "clamp",
  });

  // GoodWatch logo fades in at 0.5s (15 frames)
  const logoOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Hold for 3 seconds, then fade to black at 3.5s (105 frames) over 1.5s
  const fadeToBlack = interpolate(frame, [105, 150], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Grid layout: 4 columns × 4 rows (16 items)
  const columns = 4;
  const rows = 4;
  const itemWidth = 180;
  const itemHeight = 270;
  const gap = 15;
  const labelHeight = 40; // Height for category labels

  // Center the grid
  const gridWidth = columns * itemWidth + (columns - 1) * gap;
  const gridHeight = rows * (itemHeight + labelHeight) + (rows - 1) * gap;
  const startX = (VIDEO_WIDTH - gridWidth) / 2;
  const startY = (VIDEO_HEIGHT - gridHeight) / 2 - 20; // Offset up for title

  // Show all 16 items
  const displayItems = allItems.slice(0, 16);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* Title Text - "Your Recommendations" */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          width: VIDEO_WIDTH,
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <span
          style={{
            fontSize: 56,
            fontWeight: "bold",
            fontFamily: "Helvetica Neue, Arial, sans-serif",
            color: COLORS.text,
            letterSpacing: "1px",
          }}
        >
          Your Recommendations
        </span>
      </div>

      {/* Grid of all 16 recommendations */}
      <div
        style={{
          position: "absolute",
          top: startY,
          left: startX,
          width: gridWidth,
          height: gridHeight,
          opacity: gridOpacity,
          transform: `scale(${gridScale})`,
        }}
      >
        {/* Category labels for each row */}
        {categoryLabels.map((label, rowIndex) => {
          const y = rowIndex * (itemHeight + labelHeight + gap);
          return (
            <div
              key={`label-${rowIndex}`}
              style={{
                position: "absolute",
                left: 0,
                top: y,
                width: gridWidth,
                height: labelHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  fontFamily: "Helvetica Neue, Arial, sans-serif",
                  color: COLORS.accent,
                  letterSpacing: "1px",
                }}
              >
                {formatCategoryLabel(label)}
              </span>
            </div>
          );
        })}

        {/* Recommendation items */}
        {displayItems.map((item, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);
          const x = col * (itemWidth + gap);
          const y = row * (itemHeight + labelHeight + gap) + labelHeight;

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: itemWidth,
                height: itemHeight,
              }}
            >
              <Img
                src={item.image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
                }}
              />
              {/* Score Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  width: 35,
                  height: 35,
                  backgroundColor: COLORS.accent,
                  borderRadius: "50%",
                  border: "1px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 8px rgba(92, 184, 92, 0.3)",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    fontFamily: "Helvetica Neue, Arial, sans-serif",
                    color: COLORS.text,
                  }}
                >
                  {item.goodwatch_score}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* GoodWatch Logo */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 0,
          width: VIDEO_WIDTH,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: logoOpacity,
        }}
      >
        {/* Simple GoodWatch logo representation - green circle with white G */}
        <div
          style={{
            width: 120,
            height: 120,
            backgroundColor: COLORS.accent,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 20px rgba(92, 184, 92, 0.5)",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: COLORS.text,
              fontFamily: "Helvetica Neue, Arial, sans-serif",
            }}
          >
            G
          </span>
        </div>
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
          backgroundColor: "black",
          opacity: fadeToBlack,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

