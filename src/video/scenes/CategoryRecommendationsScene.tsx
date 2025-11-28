import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";
import { COLORS, FONTS, VIDEO_WIDTH, VIDEO_HEIGHT } from "../constants";
import {
  CategoryRecommendationsSceneProps,
  MediaItem,
  StreamingProvider,
} from "../types";
import { formatCategoryLabel } from "../utils/formatCategory";

// Platform mapping - maps provider names to logo filenames
const PLATFORM_MAP: Record<string, string> = {
  "Apple TV": "apple-tv.avif",
  "Amazon Prime Video": "prime-video.avif",
  Netflix: "netflix.avif",
  Crunchyroll: "crunchyroll.avif",
  "Disney Plus": "disney-plus.avif",
  Hulu: "hulu.avif",
  "Paramount Plus": "paramount-plus.avif",
  Max: "max.avif",
  "YouTube Premium": "youtube.avif",
  Peacock: "peacock.avif",
  Fubo: "fubo.avif",
};

// Country mapping - maps country codes to flag image filenames
const COUNTRY_FLAGS: Record<string, string> = {
  US: "us.png",
  CN: "cn.png",
  MX: "mx.png",
};

interface StreamingRowProps {
  countryCode: string;
  platforms: string[];
}

const StreamingRow: React.FC<StreamingRowProps> = ({
  countryCode,
  platforms,
}) => {
  const flagFile = COUNTRY_FLAGS[countryCode];
  if (!flagFile) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 4,
      }}
    >
      <Img
        src={staticFile(`flags/${flagFile}`)}
        style={{
          width: 50,
          height: 50,
          objectFit: "contain",
          opacity: 0.8,
        }}
      />
      {platforms.map((logoFile, idx) => (
        <Img
          key={idx}
          src={staticFile(`logos/${logoFile}`)}
          style={{
            width: 50,
            height: 50,
            objectFit: "contain",
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

interface StreamingOverlayProps {
  availability?: StreamingProvider[];
}

const StreamingOverlay: React.FC<StreamingOverlayProps> = ({
  availability,
}) => {
  if (!availability || availability.length === 0) return null;

  // Organize platforms by country
  const platformsByCountry: Record<string, string[]> = {};

  availability.forEach((provider) => {
    const platformLogo = PLATFORM_MAP[provider.name];
    if (!platformLogo) return; // Skip unsupported platforms

    provider.countries.forEach((country) => {
      if (COUNTRY_FLAGS[country]) {
        if (!platformsByCountry[country]) {
          platformsByCountry[country] = [];
        }
        if (!platformsByCountry[country].includes(platformLogo)) {
          platformsByCountry[country].push(platformLogo);
        }
      }
    });
  });

  // Get rows for supported countries in priority order
  const rows = ["US", "CN", "MX"]
    .filter((country) => platformsByCountry[country])
    .map((country) => ({
      countryCode: country,
      platforms: platformsByCountry[country].sort(),
    }))
    .slice(0, 3);

  if (rows.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 23,
        left: 23,
        display: "flex",
        flexDirection: "column",
        gap: 9,
      }}
    >
      {rows.map((row) => (
        <StreamingRow
          key={row.countryCode}
          countryCode={row.countryCode}
          platforms={row.platforms}
        />
      ))}
    </div>
  );
};

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

        {/* Score Badge - Circular, 80px diameter (60% larger), top-right */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 80,
            height: 80,
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
              fontSize: 32,
              fontWeight: "bold",
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              color: COLORS.text,
            }}
          >
            {item.goodwatch_score}
          </span>
        </div>

        {/* Streaming Availability Overlay - bottom-left */}
        <StreamingOverlay availability={item.streaming_availability} />
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

export const CategoryRecommendationsScene: React.FC<
  CategoryRecommendationsSceneProps
> = ({ categoryName, movies, tvShows, durationInFrames = 120 }) => {
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

  // Begin fade transition 0.5s before end (15 frames before end)
  const fadeOutStart = Math.max(0, durationInFrames - 15);
  const fadeOutOpacity = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0.7],
    {
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        opacity: fadeOutOpacity,
      }}
    >
      {/* Category Label - centered at top - 3x larger */}
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
          {formatCategoryLabel(categoryName)}
        </span>
      </div>

      {/* Grid Items - Movie row at 0.4s (12 frames), TV row at 0.8s (24 frames) */}
      {displayItems.length >= 1 && (
        <GridItem item={displayItems[0]} position="top-left" delay={12} />
      )}
      {displayItems.length >= 2 && (
        <GridItem item={displayItems[1]} position="top-right" delay={17} />
      )}
      {displayItems.length >= 3 && (
        <GridItem item={displayItems[2]} position="bottom-left" delay={24} />
      )}
      {displayItems.length >= 4 && (
        <GridItem item={displayItems[3]} position="bottom-right" delay={29} />
      )}
    </AbsoluteFill>
  );
};
