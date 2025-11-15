import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../constants";
import { CategorySceneProps } from "../types";

interface GridItemProps {
  item: { name: string; image: string; goodwatch_score: number };
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay: number;
}

const GridItem: React.FC<GridItemProps> = ({ item, position, delay }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [delay, delay + 20], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Calculate position based on grid location
  const labelColumnWidth = 50; // Width for the label column
  const itemWidth = VIDEO_WIDTH * 0.42; // 42% of width for each item
  const itemHeight = itemWidth * 1.5; // 3:2 aspect ratio for poster
  const gap = 30; // Gap between items
  const horizontalPadding =
    (VIDEO_WIDTH - (itemWidth * 2 + gap + labelColumnWidth)) / 2;
  const titleHeight = 80; // Space for title below image
  const totalItemHeight = itemHeight + titleHeight;

  // Calculate vertical positioning to center the grid
  const topMargin = 180; // Space for category title
  const verticalGap = 40; // Gap between rows

  const positions = {
    "top-left": {
      top: topMargin,
      left: horizontalPadding + labelColumnWidth,
    },
    "top-right": {
      top: topMargin,
      left: horizontalPadding + labelColumnWidth + itemWidth + gap,
    },
    "bottom-left": {
      top: topMargin + totalItemHeight + verticalGap,
      left: horizontalPadding + labelColumnWidth,
    },
    "bottom-right": {
      top: topMargin + totalItemHeight + verticalGap,
      left: horizontalPadding + labelColumnWidth + itemWidth + gap,
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
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Image */}
      <div
        style={{
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
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          padding: "0 10px",
        }}
      >
        <span
          style={{
            ...FONTS.small,
            color: COLORS.text,
            display: "block",
            lineHeight: 1.2,
          }}
        >
          {item.name}
        </span>
      </div>

      {/* Score Badge */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: COLORS.accent,
          borderRadius: 8,
          padding: "6px 12px",
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: COLORS.text,
          }}
        >
          {item.goodwatch_score}
        </span>
      </div>
    </div>
  );
};

export const CategoryScene: React.FC<CategorySceneProps> = ({
  categoryName,
  movies,
  tvShows,
}) => {
  const frame = useCurrentFrame();

  // Title animation
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Label column animation
  const labelOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Combine movies and TV shows (2 of each)
  const items = [...(movies.slice(0, 2) || []), ...(tvShows.slice(0, 2) || [])];

  // Ensure we have exactly 4 items
  const displayItems = items.slice(0, 4);

  // Calculate label column positioning
  const labelColumnWidth = 50;
  const itemWidth = VIDEO_WIDTH * 0.42;
  const itemHeight = itemWidth * 1.5;
  const gap = 30;
  const horizontalPadding =
    (VIDEO_WIDTH - (itemWidth * 2 + gap + labelColumnWidth)) / 2;
  const titleHeight = 80;
  const totalItemHeight = itemHeight + titleHeight;
  const topMargin = 180;
  const verticalGap = 40;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <span
          style={{
            ...FONTS.title,
            color: COLORS.accent,
          }}
        >
          {categoryName}
        </span>
      </div>

      {/* Label Column */}
      <div
        style={{
          position: "absolute",
          left: horizontalPadding,
          top: topMargin,
          width: labelColumnWidth,
          height: totalItemHeight * 2 + verticalGap,
          opacity: labelOpacity,
        }}
      >
        {/* MOVIE Label */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: labelColumnWidth,
            height: totalItemHeight,
            backgroundColor: "rgba(139, 92, 246, 0.15)",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {"MOVIE".split("").map((letter, index) => (
            <span
              key={index}
              style={{
                fontSize: 60,
                fontWeight: "bold",
                color: "#a78bfa",
                lineHeight: 1,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* SHOW Label */}
        <div
          style={{
            position: "absolute",
            top: totalItemHeight + verticalGap,
            left: 0,
            width: labelColumnWidth,
            height: totalItemHeight,
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {"SHOW".split("").map((letter, index) => (
            <span
              key={index}
              style={{
                fontSize: 60,
                fontWeight: "bold",
                color: "#60a5fa",
                lineHeight: 1,
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Grid Items */}
      {displayItems.length >= 1 && (
        <GridItem item={displayItems[0]} position="top-left" delay={10} />
      )}
      {displayItems.length >= 2 && (
        <GridItem item={displayItems[1]} position="top-right" delay={15} />
      )}
      {displayItems.length >= 3 && (
        <GridItem item={displayItems[2]} position="bottom-left" delay={20} />
      )}
      {displayItems.length >= 4 && (
        <GridItem item={displayItems[3]} position="bottom-right" delay={25} />
      )}
    </AbsoluteFill>
  );
};
