import * as path from "path";
import * as fs from "fs";
import { generateFullScript, VideoScript } from "./script-generator";
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
    // Load or generate script
    const scriptPath = path.join(outputDir, "script.json");
    let script: VideoScript;

    if (fs.existsSync(scriptPath)) {
      console.log("📝 Loading existing script...");
      script = JSON.parse(fs.readFileSync(scriptPath, "utf-8"));
    } else {
      console.log("🤖 Generating new script...");
      script = await generateFullScript({ sourceTitle, categories });
      fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2), "utf-8");
      console.log(`✅ Script saved to ${path.basename(outputDir)}/script.json`);
    }

    // Generate hook audio
    console.log("🎤 Generating hook audio...");
    const hookAudioPath = path.join(publicDir, "hook.mp3");
    await generateAudio({ script: script.hook, outputPath: hookAudioPath });
    audioFiles.hook = "audio/hook.mp3";
    console.log("✅ Hook audio generated");

    // Generate category audio
    for (let i = 0; i < script.categories.length; i++) {
      const category = script.categories[i];
      console.log(`🎤 Generating audio for category: ${category.name}...`);
      const categoryAudioPath = path.join(publicDir, `category-${i}.mp3`);
      await generateAudio({
        script: category.script,
        outputPath: categoryAudioPath,
      });
      audioFiles.categories.push(`audio/category-${i}.mp3`);
      console.log(`✅ Category audio generated: ${category.name}`);
    }

    // Generate overall audio
    console.log("🎤 Generating overall audio...");
    const overallAudioPath = path.join(publicDir, "overall.mp3");
    await generateAudio({
      script: script.overall,
      outputPath: overallAudioPath,
    });
    audioFiles.overall = "audio/overall.mp3";
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
