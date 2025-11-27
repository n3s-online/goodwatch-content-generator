import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const CACHE_DIR = path.join(process.cwd(), "cache");
const SCRIPTS_CACHE_DIR = path.join(CACHE_DIR, "scripts");
const AUDIO_CACHE_DIR = path.join(CACHE_DIR, "audio");

// Ensure cache directories exist
if (!fs.existsSync(SCRIPTS_CACHE_DIR)) {
  fs.mkdirSync(SCRIPTS_CACHE_DIR, { recursive: true });
}
if (!fs.existsSync(AUDIO_CACHE_DIR)) {
  fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
}

export interface ScriptCache {
  script: string;
  sourceTitle?: string;
  categoryName?: string;
  type: "hook" | "category" | "overall";
  createdAt: string;
}

function generateCacheKey(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").substring(0, 16);
}

export function getScriptCachePath(input: string, type: "hook" | "category" | "overall"): string {
  const key = generateCacheKey(`${type}-${input}`);
  return path.join(SCRIPTS_CACHE_DIR, `${key}.json`);
}

export function getAudioCachePath(script: string): string {
  const key = generateCacheKey(script);
  return path.join(AUDIO_CACHE_DIR, `${key}.mp3`);
}

export function loadScriptCache(cachePath: string): ScriptCache | null {
  if (!fs.existsSync(cachePath)) {
    return null;
  }
  try {
    const content = fs.readFileSync(cachePath, "utf-8");
    return JSON.parse(content) as ScriptCache;
  } catch {
    return null;
  }
}

export function saveScriptCache(
  cachePath: string,
  script: string,
  metadata: { sourceTitle?: string; categoryName?: string; type: "hook" | "category" | "overall" }
): void {
  const cacheData: ScriptCache = {
    script,
    ...metadata,
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2), "utf-8");
}

export function loadAudioCache(audioPath: string): string | null {
  if (!fs.existsSync(audioPath)) {
    return null;
  }
  return audioPath;
}

