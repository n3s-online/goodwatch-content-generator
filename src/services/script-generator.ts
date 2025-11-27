import { generateText } from "ai";
import { getEnvConfig, GEMINI_TEMPERATURE } from "../config/env";
import { getScriptCachePath, loadScriptCache, saveScriptCache } from "./cache";

const config = getEnvConfig();

export async function generateHookScript(sourceTitle: string): Promise<string> {
  // Check cache first
  const cachePath = getScriptCachePath(sourceTitle, "hook");
  const cached = loadScriptCache(cachePath);
  if (cached) {
    console.log("  ✓ Using cached hook script");
    return cached.script;
  }

  const prompt = `Generate a short, engaging audio hook script (3-4 seconds when spoken) for a video recommendation about "${sourceTitle}".

Use a similar style to these examples:
- "Just finished ${sourceTitle} and need your next obsession? We've got you covered."
- "You loved ${sourceTitle}. Now discover shows and movies that match that exact energy."
- "Obsessed with ${sourceTitle}? We found your next binge. Here's what to watch."

Generate ONE script in the same style, keeping it concise and engaging. Only return the script text, nothing else.`;

  try {
    // Set AI_GATEWAY_API_KEY for Vercel AI Gateway (as per restaurant-passport-content pattern)
    process.env.AI_GATEWAY_API_KEY = config.VERCEL_AI_GATEWAY_API_KEY;

    const result = await generateText({
      model: "google/gemini-2.5-flash-lite" as any,
      prompt,
      temperature: GEMINI_TEMPERATURE,
    });

    const script = result.text.trim();

    // Save to cache
    saveScriptCache(cachePath, script, {
      sourceTitle,
      type: "hook",
    });

    return script;
  } catch (error) {
    throw new Error(
      `Failed to generate hook script: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function generateCategoryScript(
  categoryName: string
): Promise<string> {
  // Check cache first
  const cachePath = getScriptCachePath(categoryName, "category");
  const cached = loadScriptCache(cachePath);
  if (cached) {
    console.log(`  ✓ Using cached category script for ${categoryName}`);
    return cached.script;
  }

  const prompt = `Generate a short, engaging audio script (3-4 seconds when spoken) for a video category section about "${categoryName}".

Use a similar style to these examples:
- "Mystery" -> "For that same mystery vibe, check out these picks."
- "Intrigue" -> "Love the intrigue? These recs deliver that same energy."
- "Dark" -> "Craving that dark mood? These will hit the spot."

Generate ONE script in the same style for the "${categoryName}" category. Keep it concise and engaging. Only return the script text, nothing else.`;

  try {
    // Set AI_GATEWAY_API_KEY for Vercel AI Gateway (as per restaurant-passport-content pattern)
    process.env.AI_GATEWAY_API_KEY = config.VERCEL_AI_GATEWAY_API_KEY;

    const result = await generateText({
      model: "google/gemini-2.5-flash-lite" as any,
      prompt,
      temperature: GEMINI_TEMPERATURE,
    });

    const script = result.text.trim();

    // Save to cache
    saveScriptCache(cachePath, script, {
      categoryName,
      type: "category",
    });

    return script;
  } catch (error) {
    throw new Error(
      `Failed to generate category script: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function generateOverallScript(
  sourceTitle: string
): Promise<string> {
  // Check cache first
  const cachePath = getScriptCachePath(sourceTitle, "overall");
  const cached = loadScriptCache(cachePath);
  if (cached) {
    console.log("  ✓ Using cached overall script");
    return cached.script;
  }

  const prompt = `Generate a short, engaging audio script (3-4 seconds when spoken) for an overall recommendations section.

Use this template: "These are our top picks for ${sourceTitle}"

Generate ONE script in a similar style. Keep it concise and engaging. Only return the script text, nothing else.`;

  try {
    // Set AI_GATEWAY_API_KEY for Vercel AI Gateway (as per restaurant-passport-content pattern)
    process.env.AI_GATEWAY_API_KEY = config.VERCEL_AI_GATEWAY_API_KEY;

    const result = await generateText({
      model: "google/gemini-2.5-flash-lite" as any,
      prompt,
      temperature: GEMINI_TEMPERATURE,
    });

    const script = result.text.trim();

    // Save to cache
    saveScriptCache(cachePath, script, {
      sourceTitle,
      type: "overall",
    });

    return script;
  } catch (error) {
    throw new Error(
      `Failed to generate overall script: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
