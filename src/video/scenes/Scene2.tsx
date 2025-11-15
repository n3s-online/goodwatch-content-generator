import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../constants";
import { MediaItem } from "../types";

interface Scene2Props {
  movies: MediaItem[];
  tvShows: MediaItem[];
  sourceImage?: string; // Mini thumbnail
}

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

  // Breathing animation (1.0x to 1.02x, 2s loop)
  const breathingScale = interpolate(
    frame % 60,
    [0, 30, 60],
    [1.0, 1.02, 1.0],
    {
      extrapolateRight: "clamp",
    }
  );

  // Layout constants - 2x2 grid with 480x270px items
  const itemWidth = 480;
  const itemHeight = 270;
  const gap = 20;
  const titleHeight = 60;

  // Center the grid horizontally
  const gridWidth = itemWidth * 2 + gap;
  const startX = (VIDEO_WIDTH - gridWidth) / 2;
  const startY = 250; // Below category label and mini thumbnail

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
        transform: `translateX(${translateX}px) scale(${breathingScale})`,
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

      {/* Title - max 1 line, truncate with "..." */}
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
            ...FONTS.recommendationTitle,
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

export const Scene2: React.FC<Scene2Props> = ({
  movies,
  tvShows,
  sourceImage,
}) => {
  const frame = useCurrentFrame();

  // Category label animation - slides in from left at 0.0s
  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const labelTranslateX = interpolate(frame, [0, 15], [-50, 0], {
    extrapolateRight: "clamp",
  });

  // Mini thumbnail animation - scales in from top-left at 0.3s (9 frames)
  const thumbnailOpacity = interpolate(frame, [9, 24], [0, 1], {
    extrapolateRight: "clamp",
  });
  const thumbnailScale = interpolate(frame, [9, 24], [0.5, 1], {
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
      {/* Mini main content thumbnail - 100x150px, top-left corner */}
      {sourceImage && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            width: 100,
            height: 150,
            opacity: thumbnailOpacity,
            transform: `scale(${thumbnailScale})`,
          }}
        >
          <Img
            src={sourceImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 8,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
            }}
          />
        </div>
      )}

      {/* Category Label "Overall" - next to mini thumbnail */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 140,
          opacity: labelOpacity,
          transform: `translateX(${labelTranslateX}px)`,
        }}
      >
        <span
          style={{
            ...FONTS.categoryLabel,
            color: COLORS.text,
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
