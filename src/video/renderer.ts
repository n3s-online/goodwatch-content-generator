import { bundle } from "@remotion/bundler";
import {
  renderMedia,
  selectComposition,
  getVideoMetadata,
} from "@remotion/renderer";
import * as path from "path";
import * as fs from "fs";
import { RelatedContent } from "./types";
import {
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  SCENE_1_DURATION,
  SCENE_2_DURATION,
  SCENE_3_DURATION,
  SCENE_4_DURATION,
  SCENE_5_DURATION,
  SCENE_6_DURATION,
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

  // Extract categories for audio generation (excluding "overall")
  const movieCategories = Object.keys(data.movies).filter(
    (cat) => cat.toLowerCase() !== "overall"
  );
  const tvShowCategories = Object.keys(data.tv_shows).filter(
    (cat) => cat.toLowerCase() !== "overall"
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

  // Calculate total duration based on audio files using getVideoMetadata
  let totalDuration = composition.durationInFrames;

  if (hookOnly) {
    // For hook-only mode, calculate duration based on hook audio
    if (audioFiles?.hook) {
      try {
        const metadata = await getVideoMetadata(
          path.join(process.cwd(), "public", audioFiles.hook)
        );
        if (metadata.durationInSeconds !== null) {
          const hookFrames = Math.ceil(metadata.durationInSeconds * VIDEO_FPS);
          totalDuration = Math.max(SCENE_1_DURATION, hookFrames);
        } else {
          totalDuration = SCENE_1_DURATION;
        }
      } catch (error) {
        console.warn("Could not get hook audio duration, using default");
        totalDuration = SCENE_1_DURATION;
      }
    } else {
      totalDuration = SCENE_1_DURATION;
    }
  } else if (audioFiles) {
    // Calculate total duration for full video
    let calculatedDuration = 0;

    // Scene 1: Hook
    if (audioFiles.hook) {
      try {
        const metadata = await getVideoMetadata(
          path.join(process.cwd(), "public", audioFiles.hook)
        );
        if (metadata.durationInSeconds !== null) {
          const hookFrames = Math.ceil(metadata.durationInSeconds * VIDEO_FPS);
          calculatedDuration += Math.max(SCENE_1_DURATION, hookFrames);
        } else {
          calculatedDuration += SCENE_1_DURATION;
        }
      } catch (error) {
        console.warn("Could not get hook audio duration, using default");
        calculatedDuration += SCENE_1_DURATION;
      }
    } else {
      calculatedDuration += SCENE_1_DURATION;
    }

    // Scenes 2-4: Categories
    const defaultCategoryDurations = [
      SCENE_2_DURATION,
      SCENE_3_DURATION,
      SCENE_4_DURATION,
    ];
    if (audioFiles.categories) {
      for (let i = 0; i < Math.min(audioFiles.categories.length, 3); i++) {
        try {
          const metadata = await getVideoMetadata(
            path.join(process.cwd(), "public", audioFiles.categories[i])
          );
          if (metadata.durationInSeconds !== null) {
            const categoryFrames = Math.ceil(
              metadata.durationInSeconds * VIDEO_FPS
            );
            calculatedDuration += Math.max(
              defaultCategoryDurations[i],
              categoryFrames
            );
          } else {
            calculatedDuration += defaultCategoryDurations[i];
          }
        } catch (error) {
          console.warn(
            `Could not get category ${i} audio duration, using default`
          );
          calculatedDuration += defaultCategoryDurations[i];
        }
      }
    }

    // Scene 5: Overall
    if (audioFiles.overall) {
      try {
        const metadata = await getVideoMetadata(
          path.join(process.cwd(), "public", audioFiles.overall)
        );
        if (metadata.durationInSeconds !== null) {
          const overallFrames = Math.ceil(
            metadata.durationInSeconds * VIDEO_FPS
          );
          calculatedDuration += Math.max(SCENE_5_DURATION, overallFrames);
        } else {
          calculatedDuration += SCENE_5_DURATION;
        }
      } catch (error) {
        console.warn("Could not get overall audio duration, using default");
        calculatedDuration += SCENE_5_DURATION;
      }
    } else {
      calculatedDuration += SCENE_5_DURATION;
    }

    // Scene 6: Closing
    calculatedDuration += SCENE_6_DURATION;

    totalDuration = calculatedDuration;
  }

  composition.durationInFrames = totalDuration;

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
