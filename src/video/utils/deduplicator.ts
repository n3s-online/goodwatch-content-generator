import { MediaItem } from "../types";

/**
 * Tracks used items and provides methods to get non-duplicate items
 */
export class ItemDeduplicator {
  private usedItems: Set<string>;

  constructor() {
    this.usedItems = new Set();
  }

  /**
   * Mark an item as used
   */
  markUsed(item: MediaItem): void {
    this.usedItems.add(item.link);
  }

  /**
   * Check if an item has been used
   */
  isUsed(item: MediaItem): boolean {
    return this.usedItems.has(item.link);
  }

  /**
   * Get the first N items from an array that haven't been used yet
   */
  getUnusedItems(items: MediaItem[], count: number): MediaItem[] {
    const unused: MediaItem[] = [];

    for (const item of items) {
      if (!this.isUsed(item) && unused.length < count) {
        unused.push(item);
        this.markUsed(item);
      }
    }

    return unused;
  }

  /**
   * Reset the deduplicator
   */
  reset(): void {
    this.usedItems.clear();
  }
}

/**
 * Select items for video scenes ensuring no duplicates
 */
export function selectItemsForScenes(
  overallMovies: MediaItem[],
  overallTvShows: MediaItem[],
  categoryData: Array<{
    name: string;
    movies: MediaItem[];
    tvShows: MediaItem[];
  }>
): {
  overall: { movies: MediaItem[]; tvShows: MediaItem[] };
  categories: Array<{
    name: string;
    movies: MediaItem[];
    tvShows: MediaItem[];
  }>;
} {
  const deduplicator = new ItemDeduplicator();

  // Scene 2: Overall - 2 movies, 2 TV shows
  const selectedOverallMovies = deduplicator.getUnusedItems(overallMovies, 2);
  const selectedOverallTvShows = deduplicator.getUnusedItems(overallTvShows, 2);

  // Scenes 3-5: Categories - 2 movies, 2 TV shows each
  // Use category-specific items, but ensure no duplicates across all scenes
  const categoryScenes = categoryData.slice(0, 3).map((category) => ({
    name: category.name,
    movies: deduplicator.getUnusedItems(category.movies, 2),
    tvShows: deduplicator.getUnusedItems(category.tvShows, 2),
  }));

  return {
    overall: {
      movies: selectedOverallMovies,
      tvShows: selectedOverallTvShows,
    },
    categories: categoryScenes,
  };
}
