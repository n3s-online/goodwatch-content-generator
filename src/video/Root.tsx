import React from "react";
import { Composition } from "remotion";
import { VideoComposition } from "./Composition";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "./constants";
import { VideoInputProps } from "./types";

export const RemotionRoot: React.FC = () => {
  const defaultProps: VideoInputProps = {
    data: {
      movies: {},
      tv_shows: {},
    },
    sourceTitle: "Loading...",
    sourceImage: "",
    hookOnly: false,
    audioFiles: undefined,
  };

  // Use a large max duration - actual duration is calculated in renderer based on audio
  const maxDuration = 60 * VIDEO_FPS; // 60 seconds max

  return (
    <>
      <Composition
        id="GoodwatchVideo"
        component={VideoComposition as any}
        durationInFrames={maxDuration}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultProps}
      />
    </>
  );
};
