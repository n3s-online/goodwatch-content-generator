import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import * as path from "path";
import * as fs from "fs";
import { RelatedContent } from "./types";
import {
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  SCENE_1_DURATION,
} from "./constants";
import { generateAllAudio } from "../services/audio-orchestrator";

export interface RenderOptions {
  outputPath: string;
  data: RelatedContent;
  sourceTitle: string;
  sourceImage: string;
  hookOnly?: boolean;
}

/**
 * Render a video from the provided data
 */
export async function renderVideo(options: RenderOptions): Promise<void> {
  const {
    outputPath,
    data,
    sourceTitle,
    sourceImage,
    hookOnly = false,
  } = options;

  // Extract categories for audio generation
  const movieCategories = Object.keys(data.movies).filter(
    (cat) => cat !== "Overall"
  );
  const tvShowCategories = Object.keys(data.tv_shows).filter(
    (cat) => cat !== "Overall"
  );
  const availableCategories = movieCategories.filter((cat) =>
    tvShowCategories.includes(cat)
  );
  const selectedCategories = availableCategories.slice(0, 3);

  // Generate audio files before bundling
  let audioFiles;
  if (!hookOnly) {
    console.log("🎤 Generating audio files...");
    const outputDir = path.dirname(outputPath);
    audioFiles = await generateAllAudio({
      sourceTitle,
      categories: selectedCategories,
      outputDir,
    });
    console.log("✅ Audio files generated");
  }

  console.log("📦 Bundling Remotion project...");

  // Bundle the Remotion project
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, "index.tsx"),
    webpackOverride: (config) => config,
  });

  console.log("✅ Bundle created");
  console.log("🎬 Selecting composition...");

  // Select the composition
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "GoodwatchVideo",
    inputProps: {
      data,
      sourceTitle,
      sourceImage,
      hookOnly,
      audioFiles,
    },
  });

  console.log("✅ Composition selected");

  // Override duration if hookOnly is true
  if (hookOnly) {
    composition.durationInFrames = SCENE_1_DURATION;
  }

  console.log("🎥 Rendering video...");
  console.log(`   Output: ${outputPath}`);
  console.log(
    `   Duration: ${composition.durationInFrames} frames (${(
      composition.durationInFrames / VIDEO_FPS
    ).toFixed(1)}s)`
  );
  console.log(`   Resolution: ${VIDEO_WIDTH}x${VIDEO_HEIGHT}`);
  console.log(`   FPS: ${VIDEO_FPS}`);
  if (hookOnly) {
    console.log(`   Mode: Hook scene only (faster iteration)`);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Render the video
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: {
      data,
      sourceTitle,
      sourceImage,
      hookOnly,
      audioFiles,
    },
    onProgress: ({ progress, renderedFrames, encodedFrames }) => {
      const percentage = (progress * 100).toFixed(1);
      process.stdout.write(
        `\r   Progress: ${percentage}% (${renderedFrames}/${composition.durationInFrames} frames rendered, ${encodedFrames} encoded)`
      );
    },
  });

  console.log("\n✅ Video rendered successfully!");
  console.log(`📹 Output: ${outputPath}`);
}
