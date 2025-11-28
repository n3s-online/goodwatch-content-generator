import { generateObject, jsonSchema } from "ai";
import { getEnvConfig, GEMINI_TEMPERATURE } from "../config/env";

const config = getEnvConfig();

export interface PlatformMetadata {
  title: string;
  description: string;
}

export interface VideoMetadata {
  tiktok: PlatformMetadata;
  youtube: PlatformMetadata;
  instagram: PlatformMetadata;
}

const metadataSchema = jsonSchema<VideoMetadata>({
  type: "object",
  properties: {
    tiktok: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description:
            "Concise, engaging title with trending keywords (max 40 chars)",
        },
        description: {
          type: "string",
          description:
            "Brief description with key context and 3-5 hashtags at the end (max 150 chars total including hashtags)",
        },
      },
      required: ["title", "description"],
    },
    youtube: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description:
            "SEO-optimized title with primary keyword early (max 60 chars)",
        },
        description: {
          type: "string",
          description:
            "Detailed description with keywords in first 2-3 lines, CTA, and 3-5 hashtags at the end (max 300 chars total including hashtags)",
        },
      },
      required: ["title", "description"],
    },
    instagram: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Engaging, descriptive title (max 50 chars)",
        },
        description: {
          type: "string",
          description:
            "Compelling caption with emojis, context, and 3-5 hashtags at the end (max 200 chars total including hashtags)",
        },
      },
      required: ["title", "description"],
    },
  },
  required: ["tiktok", "youtube", "instagram"],
});

export async function generateVideoMetadata({
  sourceTitle,
  categories,
  recommendations,
}: {
  sourceTitle: string;
  categories: string[];
  recommendations: string[];
}): Promise<VideoMetadata> {
  const categoriesText = categories.join(", ");
  const topRecs = recommendations.slice(0, 5).join(", ");

  const prompt = `Generate SEO-optimized video titles and descriptions for a short-form video about TV/movie recommendations similar to "${sourceTitle}".

VIDEO CONTENT DETAILS:
- Categories covered: ${categoriesText}
- Total recommendations shown: ${recommendations.length} (both movies and TV shows)
- Some featured titles: ${topRecs}

PLATFORM-SPECIFIC REQUIREMENTS:

TIKTOK:
- Title: Max 40 chars, concise, trending language, relatable
- Description: Max 150 chars total (including hashtags at end), brief context
- Hashtags: 3-5 at END of description with # symbol (e.g., "#Interstellar #MovieRecs #SciFi")
- Focus: Discovery, entertainment, "if you liked X"

YOUTUBE (Shorts):
- Title: Max 60 chars, primary keywords EARLY, be accurate about content
- Description: Max 300 chars total (including hashtags at end), keywords in first 2 lines, add CTA
- Hashtags: 3-5 at END of description with # symbol (must include "#Shorts")
- Focus: Search optimization, value proposition, accuracy

INSTAGRAM (Reels):
- Title: Max 50 chars, engaging and descriptive
- Description: Max 200 chars total (including hashtags at end), compelling caption with 1-2 emojis
- Hashtags: 3-5 at END of description with # symbol
- Focus: Engagement, visual appeal, community

FEW-SHOT EXAMPLES FOR YOUTUBE:

Example 1 (for Interstellar with categories: family_dynamics, music_composition, cinematography):
Title: "Interstellar Fans: Try Arrival, Dune, Contact & More"
Description: "Looking for movies and shows like Interstellar? We organized recommendations by what made it great: emotional family stories, epic scores, breathtaking visuals. Includes Arrival, Dune Part Two, Contact & many more. Like & subscribe! #Interstellar #SciFi #MovieRecommendations #Shorts"

Example 2 (for Interstellar with same categories):
Title: "Emotional Sci-Fi: Movies & Shows Like Interstellar"
Description: "Interstellar hit different because of its heart, visuals & music. We curated recommendations across all 3 themes—from Contact to Dark Matter. Perfect for fans seeking that same emotional depth. Subscribe! #Interstellar #SciFi #EmotionalMovies #Shorts"

CRITICAL RULES:
- Stay WITHIN character limits (including hashtags)
- Put hashtags at the END of description with # symbol
- Be ACCURATE: don't say "5 movies" when showing ${recommendations.length} movies & shows
- Mention actual titles from the recommendations when relevant
- Include primary keywords EARLY in titles
- Reference the specific categories/themes shown
- Avoid generic clickbait - be specific and accurate
- For YouTube, ALWAYS include #Shorts hashtag`;

  try {
    process.env.AI_GATEWAY_API_KEY = config.VERCEL_AI_GATEWAY_API_KEY;

    const result = await generateObject({
      model: "google/gemini-2.5-flash-lite" as any,
      schema: metadataSchema,
      prompt,
      temperature: GEMINI_TEMPERATURE,
    });

    return result.object;
  } catch (error) {
    throw new Error(
      `Failed to generate metadata: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
