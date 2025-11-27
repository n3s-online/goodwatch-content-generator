import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const CACHE_DIR = path.join(process.cwd(), "cache");
const AUDIO_CACHE_DIR = path.join(CACHE_DIR, "audio");

// Ensure cache directory exists
if (!fs.existsSync(AUDIO_CACHE_DIR)) {
  fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
}

function generateCacheKey(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").substring(0, 16);
}

export function getAudioCachePath(script: string): string {
  const key = generateCacheKey(script);
  return path.join(AUDIO_CACHE_DIR, `${key}.mp3`);
}

export function loadAudioCache(audioPath: string): string | null {
  if (!fs.existsSync(audioPath)) {
    return null;
  }
  return audioPath;
}

