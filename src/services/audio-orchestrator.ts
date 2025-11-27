import * as path from "path";
import * as fs from "fs";
import {
  generateHookScript,
  generateCategoryScript,
  generateOverallScript,
} from "./script-generator";
import { generateAudio } from "./audio-generator";

export interface AudioFiles {
  hook?: string;
  categories: string[];
  overall?: string;
}

export async function generateAllAudio({
  sourceTitle,
  categories,
  outputDir,
}: {
  sourceTitle: string;
  categories: string[];
  outputDir: string;
}): Promise<AudioFiles> {
  // Create public/audio directory for Remotion
  const publicDir = path.join(process.cwd(), "public", "audio");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const audioFiles: AudioFiles = {
    categories: [],
  };

  try {
    // Generate hook script and audio
    console.log("🎤 Generating hook audio...");
    const hookScript = await generateHookScript(sourceTitle);
    const hookAudioPath = path.join(publicDir, "hook.mp3");
    await generateAudio({ script: hookScript, outputPath: hookAudioPath });
    audioFiles.hook = "audio/hook.mp3"; // Relative path for staticFile
    console.log("✅ Hook audio generated");

    // Generate category scripts and audio
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      console.log(`🎤 Generating audio for category: ${category}...`);
      const categoryScript = await generateCategoryScript(category);
      const categoryAudioPath = path.join(publicDir, `category-${i}.mp3`);
      await generateAudio({
        script: categoryScript,
        outputPath: categoryAudioPath,
      });
      audioFiles.categories.push(`audio/category-${i}.mp3`); // Relative path for staticFile
      console.log(`✅ Category audio generated: ${category}`);
    }

    // Generate overall script and audio
    console.log("🎤 Generating overall audio...");
    const overallScript = await generateOverallScript(sourceTitle);
    const overallAudioPath = path.join(publicDir, "overall.mp3");
    await generateAudio({
      script: overallScript,
      outputPath: overallAudioPath,
    });
    audioFiles.overall = "audio/overall.mp3"; // Relative path for staticFile
    console.log("✅ Overall audio generated");

    return audioFiles;
  } catch (error) {
    // Clean up on error
    if (fs.existsSync(publicDir)) {
      fs.rmSync(publicDir, { recursive: true, force: true });
    }
    throw error;
  }
}
