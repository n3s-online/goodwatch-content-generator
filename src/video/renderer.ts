import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import * as path from 'path';
import * as fs from 'fs';
import { RelatedContent } from './types';
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from './constants';

export interface RenderOptions {
  outputPath: string;
  data: RelatedContent;
  sourceTitle: string;
  sourceImage: string;
}

/**
 * Render a video from the provided data
 */
export async function renderVideo(options: RenderOptions): Promise<void> {
  const { outputPath, data, sourceTitle, sourceImage } = options;

  console.log('📦 Bundling Remotion project...');

  // Bundle the Remotion project
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, 'index.tsx'),
    webpackOverride: (config) => config,
  });

  console.log('✅ Bundle created');
  console.log('🎬 Selecting composition...');

  // Select the composition
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'GoodwatchVideo',
    inputProps: {
      data,
      sourceTitle,
      sourceImage,
    },
  });

  console.log('✅ Composition selected');
  console.log('🎥 Rendering video...');
  console.log(`   Output: ${outputPath}`);
  console.log(`   Duration: ${composition.durationInFrames} frames (${(composition.durationInFrames / VIDEO_FPS).toFixed(1)}s)`);
  console.log(`   Resolution: ${VIDEO_WIDTH}x${VIDEO_HEIGHT}`);
  console.log(`   FPS: ${VIDEO_FPS}`);

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Render the video
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {
      data,
      sourceTitle,
      sourceImage,
    },
    onProgress: ({ progress, renderedFrames, encodedFrames }) => {
      const percentage = (progress * 100).toFixed(1);
      process.stdout.write(
        `\r   Progress: ${percentage}% (${renderedFrames}/${composition.durationInFrames} frames rendered, ${encodedFrames} encoded)`
      );
    },
  });

  console.log('\n✅ Video rendered successfully!');
  console.log(`📹 Output: ${outputPath}`);
}

