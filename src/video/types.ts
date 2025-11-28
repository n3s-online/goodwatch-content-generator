// Re-export API types for convenience
export type {
  APIResponse,
  APIMediaItem,
  APICategoryData,
  MediaType,
  ShowData,
} from "../api-client";

export interface StreamingProvider {
  id: number;
  name: string;
  logo: string;
  countries: string[];
}

export interface MediaItem {
  name: string;
  year: string;
  link: string;
  image: string;
  goodwatch_score: number;
  streaming_availability?: StreamingProvider[];
}

export interface CategoryContent {
  [category: string]: MediaItem[];
}

export interface RelatedContent {
  movies: CategoryContent;
  tv_shows: CategoryContent;
}

export interface VideoInputProps {
  data: RelatedContent;
  sourceTitle: string;
  sourceImage: string;
  hookOnly?: boolean;
  categoryOnly?: boolean;
  audioFiles?: {
    hook?: string;
    categories?: string[];
    overall?: string;
  };
}

export interface SceneProps {
  data: RelatedContent;
  sourceTitle: string;
  sourceImage: string;
  durationInFrames?: number;
}

export interface CategoryRecommendationsSceneProps {
  categoryName: string;
  movies: MediaItem[];
  tvShows: MediaItem[];
  durationInFrames?: number;
}

export interface ClosingSceneProps {
  allItems: MediaItem[];
  categoryLabels: string[];
}

export interface GridItemProps {
  item: MediaItem;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}
