import { APIResponse, APIMediaItem } from "./api-client";

export interface MediaItem {
  name: string;
  link: string;
  image: string;
  goodwatch_score: number;
}

export interface CategoryContent {
  [category: string]: MediaItem[];
}

export interface RelatedContent {
  movies: CategoryContent;
  tv_shows: CategoryContent;
}

/**
 * Transform a single API media item to our internal format
 */
function transformMediaItem(apiItem: APIMediaItem): MediaItem {
  return {
    name: apiItem.title,
    link: apiItem.link,
    image: apiItem.poster_path,
    goodwatch_score: apiItem.goodwatch_score,
  };
}

/**
 * Parse API response and transform to internal RelatedContent format
 * @param apiData - The raw API response
 * @returns An object containing movies and TV shows organized by categories
 */
export function parseAPIResponse(apiData: APIResponse): RelatedContent {
  const movies: CategoryContent = {};
  const tv_shows: CategoryContent = {};

  // Iterate through each category in the API response
  for (const [category, categoryData] of Object.entries(apiData)) {
    // Transform movies
    if (categoryData.movies && categoryData.movies.length > 0) {
      movies[category] = categoryData.movies.map(transformMediaItem);
    }

    // Transform shows
    if (categoryData.shows && categoryData.shows.length > 0) {
      tv_shows[category] = categoryData.shows.map(transformMediaItem);
    }
  }

  return { movies, tv_shows };
}
