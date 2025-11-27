import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../constants";
import { MediaItem, OverallSceneProps } from "../types";

interface GridItemProps {
  item: MediaItem;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay: number;
}

const GridItem: React.FC<GridItemProps> = ({ item, position, delay }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateX = interpolate(frame, [delay, delay + 15], [50, 0], {
    extrapolateRight: "clamp",
  });

  // Layout constants - 2x2 grid with full poster aspect ratio (10% smaller)
  const itemWidth = 450;
  const itemHeight = 675; // Poster aspect ratio (2:3)
  const gap = 20;
  const titleHeight = 80; // Increased for larger titles

  // Center the grid horizontally
  const gridWidth = itemWidth * 2 + gap;
  const startX = (VIDEO_WIDTH - gridWidth) / 2;

  // Center the grid vertically (with space for category label at top)
  const categoryLabelHeight = 100;
  const totalGridHeight = itemHeight * 2 + titleHeight * 2 + gap;
  const startY =
    categoryLabelHeight +
    (VIDEO_HEIGHT - categoryLabelHeight - totalGridHeight) / 2;

  const positions = {
    "top-left": {
      top: startY,
      left: startX,
    },
    "top-right": {
      top: startY,
      left: startX + itemWidth + gap,
    },
    "bottom-left": {
      top: startY + itemHeight + titleHeight + gap,
      left: startX,
    },
    "bottom-right": {
      top: startY + itemHeight + titleHeight + gap,
      left: startX + itemWidth + gap,
    },
  };

  const pos = positions[position];

  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        width: itemWidth,
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: itemHeight,
          marginBottom: 10,
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

        {/* Score Badge - Circular, 50px diameter, top-right */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 50,
            height: 50,
            backgroundColor: COLORS.accent,
            borderRadius: "50%",
            border: "2px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 10px rgba(92, 184, 92, 0.3)",
          }}
        >
          <span
            style={{
              ...FONTS.score,
              color: COLORS.text,
            }}
          >
            {item.goodwatch_score}
          </span>
        </div>
      </div>

      {/* Title - 2x larger */}
      <div
        style={{
          textAlign: "center",
          padding: "0 10px",
          height: titleHeight - 10,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: "600",
            fontFamily: "Helvetica Neue, Arial, sans-serif",
            color: COLORS.text,
            display: "block",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </span>
      </div>
    </div>
  );
};

export const OverallScene: React.FC<OverallSceneProps> = ({ movies, tvShows, durationInFrames = 120 }) => {
  const frame = useCurrentFrame();

  // Category label fades in (0.0s)
  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Combine movies and TV shows (2 of each)
  const displayItems = [
    ...(movies.slice(0, 2) || []),
    ...(tvShows.slice(0, 2) || []),
  ].slice(0, 4);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* Category Label - "Overall" centered at top - 3x larger */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          width: VIDEO_WIDTH,
          textAlign: "center",
          opacity: labelOpacity,
        }}
      >
        <span
          style={{
            fontSize: 108,
            fontWeight: "bold",
            fontFamily: "Helvetica Neue, Arial, sans-serif",
            color: COLORS.text,
            letterSpacing: "2px",
          }}
        >
          Overall
        </span>
      </div>

      {/* Grid Items - Movie row slides in at 0.5s (15 frames), TV row at 1.2s (36 frames) */}
      {displayItems.length >= 1 && (
        <GridItem item={displayItems[0]} position="top-left" delay={15} />
      )}
      {displayItems.length >= 2 && (
        <GridItem item={displayItems[1]} position="top-right" delay={20} />
      )}
      {displayItems.length >= 3 && (
        <GridItem item={displayItems[2]} position="bottom-left" delay={36} />
      )}
      {displayItems.length >= 4 && (
        <GridItem item={displayItems[3]} position="bottom-right" delay={41} />
      )}
    </AbsoluteFill>
  );
};

