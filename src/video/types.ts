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

export interface VideoInputProps {
  data: RelatedContent;
  sourceTitle: string;
  sourceImage: string;
}

export interface SceneProps {
  data: RelatedContent;
  sourceTitle: string;
  sourceImage: string;
}

export interface CategorySceneProps {
  categoryName: string;
  movies: MediaItem[];
  tvShows: MediaItem[];
}

export interface GridItemProps {
  item: MediaItem;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

