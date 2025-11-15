import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS, VIDEO_HEIGHT, VIDEO_WIDTH } from '../constants';
import { SceneProps } from '../types';

export const Scene1: React.FC<SceneProps> = ({ sourceTitle, sourceImage }) => {
  const frame = useCurrentFrame();

  // Fade in animation
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Scale animation for image
  const scale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
      }}
    >
      {/* Text: "If you like" */}
      <div
        style={{
          position: 'absolute',
          top: VIDEO_HEIGHT * 0.15,
          width: '100%',
          textAlign: 'center',
          opacity,
        }}
      >
        <span
          style={{
            ...FONTS.title,
            color: COLORS.text,
          }}
        >
          If you like
        </span>
      </div>

      {/* Show/Movie Image */}
      <div
        style={{
          position: 'absolute',
          top: VIDEO_HEIGHT * 0.3,
          width: VIDEO_WIDTH * 0.6,
          height: VIDEO_HEIGHT * 0.35,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={sourceImage}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          }}
        />
      </div>

      {/* Show/Movie Title */}
      <div
        style={{
          position: 'absolute',
          top: VIDEO_HEIGHT * 0.7,
          width: '100%',
          textAlign: 'center',
          padding: '0 40px',
          opacity,
        }}
      >
        <span
          style={{
            ...FONTS.subtitle,
            color: COLORS.text,
          }}
        >
          {sourceTitle}
        </span>
      </div>

      {/* Text: "then you'll like" */}
      <div
        style={{
          position: 'absolute',
          top: VIDEO_HEIGHT * 0.82,
          width: '100%',
          textAlign: 'center',
          opacity,
        }}
      >
        <span
          style={{
            ...FONTS.title,
            color: COLORS.accent,
          }}
        >
          then you'll like
        </span>
      </div>
    </AbsoluteFill>
  );
};

