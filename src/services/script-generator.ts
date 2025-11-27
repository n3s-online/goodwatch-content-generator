import { generateObject, jsonSchema } from "ai";
import { getEnvConfig, GEMINI_TEMPERATURE } from "../config/env";

const config = getEnvConfig();

export interface VideoScript {
  hook: string;
  categories: Array<{
    name: string;
    script: string;
  }>;
  overall: string;
}

const videoScriptSchema = jsonSchema<VideoScript>({
  type: "object",
  properties: {
    hook: {
      type: "string",
      description: "Opening hook (3-4 seconds when spoken)",
    },
    categories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Category name",
          },
          script: {
            type: "string",
            description: "Category intro script (3-4 seconds when spoken)",
          },
        },
        required: ["name", "script"],
      },
    },
    overall: {
      type: "string",
      description: "Overall recommendations intro (3-4 seconds when spoken)",
    },
  },
  required: ["hook", "categories", "overall"],
});

export async function generateFullScript({
  sourceTitle,
  categories,
}: {
  sourceTitle: string;
  categories: string[];
}): Promise<VideoScript> {
  const prompt = `Generate a complete, cohesive audio script for a video recommending content similar to "${sourceTitle}".

CRITICAL: Each script must be 7-12 words. Keep it concise and punchy.

The script needs three parts:

1. HOOK (7-12 words): An engaging opening
Examples (all 7-12 words):
- "Loved ${sourceTitle}? Your next obsession is here."
- "Just finished ${sourceTitle}? We found your next binge."
- "Into ${sourceTitle}? These picks deliver that same energy."

2. CATEGORY INTROS (7-12 words each): For these ${
    categories.length
  } categories: ${categories.join(", ")}
Each category needs a unique intro. AVOID repetition - use different phrases for each.
Examples (all 7-12 words):
- "Mystery" -> "Craving that same mystery vibe? Here you go."
- "Intrigue" -> "Love the intrigue? These deliver big time."
- "Dark" -> "Into that dark mood? These will hit hard."
- "Tension" -> "Want more tension? Check out these picks."
- "Sci-Fi" -> "For that sci-fi feel, these are perfect."

3. OVERALL (7-12 words): Final intro for overall recommendations
Examples (all 7-12 words):
- "Here are our top picks for ${sourceTitle} fans."
- "Our absolute best recommendations for you."

IMPORTANT: 
- Each script MUST be 7-12 words
- Make each unique - vary the language
- Keep it conversational and punchy`;

  try {
    process.env.AI_GATEWAY_API_KEY = config.VERCEL_AI_GATEWAY_API_KEY;

    const result = await generateObject({
      model: "google/gemini-2.5-flash-lite" as any,
      schema: videoScriptSchema,
      prompt,
      temperature: GEMINI_TEMPERATURE,
    });

    return result.object;
  } catch (error) {
    throw new Error(
      `Failed to generate script: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
