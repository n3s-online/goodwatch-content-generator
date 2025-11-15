import { MediaItem } from '../types';

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
  movies: MediaItem[],
  tvShows: MediaItem[],
  categories: string[]
): {
  overall: { movies: MediaItem[]; tvShows: MediaItem[] };
  categories: Array<{ name: string; movies: MediaItem[]; tvShows: MediaItem[] }>;
} {
  const deduplicator = new ItemDeduplicator();

  // Scene 2: Overall - 2 movies, 2 TV shows
  const overallMovies = deduplicator.getUnusedItems(movies, 2);
  const overallTvShows = deduplicator.getUnusedItems(tvShows, 2);

  // Scenes 3-5: Categories - 2 movies, 2 TV shows each
  const categoryScenes = categories.slice(0, 3).map(categoryName => ({
    name: categoryName,
    movies: deduplicator.getUnusedItems(movies, 2),
    tvShows: deduplicator.getUnusedItems(tvShows, 2),
  }));

  return {
    overall: {
      movies: overallMovies,
      tvShows: overallTvShows,
    },
    categories: categoryScenes,
  };
}

