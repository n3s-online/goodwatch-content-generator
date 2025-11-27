import axios from "axios";

const API_BASE_URL = "https://goodwatch.app/api";

export type MediaType = "show" | "movie";

export interface APIMediaItem {
  title: string;
  release_year: string;
  link: string;
  poster_path: string;
  goodwatch_score: number;
  streaming_availability: Array<{
    id: number;
    name: string;
    logo: string;
    countries: string[];
  }>;
}

export interface APICategoryData {
  movies: APIMediaItem[];
  shows: APIMediaItem[];
}

export interface APIResponse {
  [category: string]: APICategoryData;
}

export interface ShowData {
  metadata: {
    title: string;
    year: string;
    posterUrl: string;
  };
  relatedContent: APIResponse;
}

/**
 * Extract ID and media type from various input formats:
 * - Full URL: "https://goodwatch.app/show/66732-stranger-things"
 * - Just ID: "66732"
 * - ID with slug: "66732-stranger-things"
 */
export function extractIdFromInput(input: string): {
  id: string;
  mediaType?: MediaType;
} {
  const trimmed = input.trim();

  // Check if it's a URL
  const urlMatch = trimmed.match(/goodwatch\.app\/(show|movie)\/(\d+)/);
  if (urlMatch) {
    return {
      id: urlMatch[2],
      mediaType: urlMatch[1] as MediaType,
    };
  }

  // Check if it's just an ID or ID-slug format
  const idMatch = trimmed.match(/^(\d+)/);
  if (idMatch) {
    return {
      id: idMatch[1],
    };
  }

  throw new Error(
    `Invalid input format. Expected a Goodwatch URL, ID, or ID-slug. Got: ${input}`
  );
}

/**
 * Extract slug from a Goodwatch link
 * e.g., "https://goodwatch.app/show/66732-stranger-things" -> "stranger-things"
 */
export function extractSlugFromLink(link: string): string {
  const match = link.match(/\/(show|movie)\/\d+-(.+)$/);
  return match ? match[2] : "";
}

/**
 * Fetch related content from the Goodwatch API
 */
export async function fetchFromAPI({
  mediaType,
  id,
}: {
  mediaType: MediaType;
  id: string;
}): Promise<APIResponse> {
  const url = `${API_BASE_URL}/related-by-category?mediaType=${mediaType}&id=${id}`;

  try {
    console.log(`Fetching from API: ${url}`);
    const response = await axios.get<APIResponse>(url);

    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `API error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error(
          "Network error: Could not reach Goodwatch API. Please check your internet connection."
        );
      }
    }
    throw error;
  }
}

