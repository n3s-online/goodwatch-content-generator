import React from "react";
import { Composition } from "remotion";
import { VideoComposition } from "./Composition";
import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_FPS,
  TOTAL_DURATION,
} from "./constants";
import { VideoInputProps } from "./types";

export const RemotionRoot: React.FC = () => {
  const defaultProps: VideoInputProps = {
    data: {
      movies: {},
      tv_shows: {},
    },
    sourceTitle: "Loading...",
    sourceImage: "",
  };

  return (
    <>
      <Composition
        id="GoodwatchVideo"
        component={VideoComposition as any}
        durationInFrames={TOTAL_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultProps}
      />
    </>
  );
};
