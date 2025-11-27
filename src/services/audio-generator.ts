import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { getEnvConfig } from "../config/env";
import { getAudioCachePath, loadAudioCache } from "./cache";

const config = getEnvConfig();

// Default voice ID - can be overridden via env
const DEFAULT_VOICE_ID = "NYC9WEgkq1u4jiqBseQ9"; // User-specified voice

export async function generateAudio({
  script,
  outputPath,
}: {
  script: string;
  outputPath: string;
}): Promise<string> {
  // Check cache first
  const cachePath = getAudioCachePath(script);
  const cachedAudio = loadAudioCache(cachePath);
  if (cachedAudio) {
    // Copy cached audio to output path
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.copyFileSync(cachedAudio, outputPath);
    return outputPath;
  }

  const voiceId = config.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

  try {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate audio using Eleven Labs API
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: script,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": config.ELEVENLABS_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const audioBuffer = Buffer.from(response.data);

    // Save to cache
    fs.writeFileSync(cachePath, audioBuffer);

    // Write audio to output path
    fs.writeFileSync(outputPath, audioBuffer);

    return outputPath;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(
        `Failed to generate audio: Unauthorized (401). Please check that ELEVENLABS_API_KEY is set correctly in your .env file and is valid.`
      );
    }
    throw new Error(
      `Failed to generate audio: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
