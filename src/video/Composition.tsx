import React from 'react';
import { Sequence } from 'remotion';
import {
  SCENE_1_DURATION,
  SCENE_2_DURATION,
  SCENE_3_DURATION,
  SCENE_4_DURATION,
  SCENE_5_DURATION,
} from './constants';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { CategoryScene } from './scenes/CategoryScene';
import { VideoInputProps } from './types';
import { selectItemsForScenes } from './utils/deduplicator';

export const VideoComposition: React.FC<VideoInputProps> = ({
  data,
  sourceTitle,
  sourceImage,
}) => {
  // Get all available categories (excluding "Overall")
  const movieCategories = Object.keys(data.movies).filter(
    (cat) => cat !== 'Overall'
  );
  const tvShowCategories = Object.keys(data.tv_shows).filter(
    (cat) => cat !== 'Overall'
  );

  // Use the first common category, or fall back to any available categories
  const availableCategories = movieCategories.filter((cat) =>
    tvShowCategories.includes(cat)
  );

  // If we don't have enough common categories, use what we have
  const selectedCategories = availableCategories.slice(0, 3);

  // If we still don't have 3 categories, pad with any available
  while (selectedCategories.length < 3 && movieCategories.length > 0) {
    const nextCat = movieCategories.find(
      (cat) => !selectedCategories.includes(cat)
    );
    if (nextCat) {
      selectedCategories.push(nextCat);
    } else {
      break;
    }
  }

  // Get movies and TV shows for each category
  const getItemsForCategory = (categoryName: string) => {
    return {
      movies: data.movies[categoryName] || [],
      tvShows: data.tv_shows[categoryName] || [],
    };
  };

  // Select items ensuring no duplicates
  const overallItems = getItemsForCategory('Overall');
  const selectedItems = selectItemsForScenes(
    overallItems.movies,
    overallItems.tvShows,
    selectedCategories
  );

  // Calculate frame offsets
  let currentFrame = 0;
  const scene1Start = currentFrame;
  currentFrame += SCENE_1_DURATION;

  const scene2Start = currentFrame;
  currentFrame += SCENE_2_DURATION;

  const scene3Start = currentFrame;
  currentFrame += SCENE_3_DURATION;

  const scene4Start = currentFrame;
  currentFrame += SCENE_4_DURATION;

  const scene5Start = currentFrame;

  return (
    <>
      {/* Scene 1: "If you like X then you'll like" */}
      <Sequence from={scene1Start} durationInFrames={SCENE_1_DURATION}>
        <Scene1
          data={data}
          sourceTitle={sourceTitle}
          sourceImage={sourceImage}
        />
      </Sequence>

      {/* Scene 2: Overall */}
      <Sequence from={scene2Start} durationInFrames={SCENE_2_DURATION}>
        <Scene2
          movies={selectedItems.overall.movies}
          tvShows={selectedItems.overall.tvShows}
        />
      </Sequence>

      {/* Scene 3: Category 1 */}
      {selectedItems.categories[0] && (
        <Sequence from={scene3Start} durationInFrames={SCENE_3_DURATION}>
          <CategoryScene
            categoryName={selectedItems.categories[0].name}
            movies={selectedItems.categories[0].movies}
            tvShows={selectedItems.categories[0].tvShows}
          />
        </Sequence>
      )}

      {/* Scene 4: Category 2 */}
      {selectedItems.categories[1] && (
        <Sequence from={scene4Start} durationInFrames={SCENE_4_DURATION}>
          <CategoryScene
            categoryName={selectedItems.categories[1].name}
            movies={selectedItems.categories[1].movies}
            tvShows={selectedItems.categories[1].tvShows}
          />
        </Sequence>
      )}

      {/* Scene 5: Category 3 */}
      {selectedItems.categories[2] && (
        <Sequence from={scene5Start} durationInFrames={SCENE_5_DURATION}>
          <CategoryScene
            categoryName={selectedItems.categories[2].name}
            movies={selectedItems.categories[2].movies}
            tvShows={selectedItems.categories[2].tvShows}
          />
        </Sequence>
      )}
    </>
  );
};

