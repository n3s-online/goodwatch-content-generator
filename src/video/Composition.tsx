import React from "react";
import { Sequence } from "remotion";
import {
  SCENE_1_DURATION,
  SCENE_2_DURATION,
  SCENE_3_DURATION,
  SCENE_4_DURATION,
  SCENE_5_DURATION,
  SCENE_6_DURATION,
} from "./constants";
import { HookScene } from "./scenes/HookScene";
import { OverallScene } from "./scenes/OverallScene";
import { CategoryRecommendationsScene } from "./scenes/CategoryRecommendationsScene";
import { ClosingScene } from "./scenes/ClosingScene";
import { VideoInputProps } from "./types";
import { selectItemsForScenes } from "./utils/deduplicator";

export const VideoComposition: React.FC<VideoInputProps> = ({
  data,
  sourceTitle,
  sourceImage,
}) => {
  // Get all available categories (excluding "Overall")
  const movieCategories = Object.keys(data.movies).filter(
    (cat) => cat !== "Overall"
  );
  const tvShowCategories = Object.keys(data.tv_shows).filter(
    (cat) => cat !== "Overall"
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

  // Prepare category data for deduplication
  const overallItems = getItemsForCategory("Overall");
  const categoryData = selectedCategories.map((categoryName) => ({
    name: categoryName,
    ...getItemsForCategory(categoryName),
  }));

  // Select items ensuring no duplicates
  const selectedItems = selectItemsForScenes(
    overallItems.movies,
    overallItems.tvShows,
    categoryData
  );

  // Collect all items for Scene 6
  const allItems = [
    ...selectedItems.overall.movies,
    ...selectedItems.overall.tvShows,
    ...selectedItems.categories.flatMap((cat) => [
      ...cat.movies,
      ...cat.tvShows,
    ]),
  ];

  // Calculate frame offsets
  // New order: Hook -> Category 1 -> Category 2 -> Category 3 -> Overall -> Closing
  let currentFrame = 0;
  const scene1Start = currentFrame;
  currentFrame += SCENE_1_DURATION;

  const scene2Start = currentFrame;
  currentFrame += SCENE_2_DURATION; // Category 1 - 4s

  const scene3Start = currentFrame;
  currentFrame += SCENE_3_DURATION; // Category 2 - 4s

  const scene4Start = currentFrame;
  currentFrame += SCENE_4_DURATION; // Category 3 - 4s

  const scene5Start = currentFrame;
  currentFrame += SCENE_5_DURATION; // Overall - 4s

  const scene6Start = currentFrame;

  return (
    <>
      {/* Scene 1: Hook */}
      <Sequence from={scene1Start} durationInFrames={SCENE_1_DURATION}>
        <HookScene
          data={data}
          sourceTitle={sourceTitle}
          sourceImage={sourceImage}
        />
      </Sequence>

      {/* Scene 2: Category 1 */}
      {selectedItems.categories[0] && (
        <Sequence from={scene2Start} durationInFrames={SCENE_2_DURATION}>
          <CategoryRecommendationsScene
            categoryName={selectedItems.categories[0].name}
            movies={selectedItems.categories[0].movies}
            tvShows={selectedItems.categories[0].tvShows}
          />
        </Sequence>
      )}

      {/* Scene 3: Category 2 */}
      {selectedItems.categories[1] && (
        <Sequence from={scene3Start} durationInFrames={SCENE_3_DURATION}>
          <CategoryRecommendationsScene
            categoryName={selectedItems.categories[1].name}
            movies={selectedItems.categories[1].movies}
            tvShows={selectedItems.categories[1].tvShows}
          />
        </Sequence>
      )}

      {/* Scene 4: Category 3 */}
      {selectedItems.categories[2] && (
        <Sequence from={scene4Start} durationInFrames={SCENE_4_DURATION}>
          <CategoryRecommendationsScene
            categoryName={selectedItems.categories[2].name}
            movies={selectedItems.categories[2].movies}
            tvShows={selectedItems.categories[2].tvShows}
          />
        </Sequence>
      )}

      {/* Scene 5: Overall Top Picks */}
      <Sequence from={scene5Start} durationInFrames={SCENE_5_DURATION}>
        <OverallScene
          movies={selectedItems.overall.movies}
          tvShows={selectedItems.overall.tvShows}
        />
      </Sequence>

      {/* Scene 6: Closing */}
      <Sequence from={scene6Start} durationInFrames={SCENE_6_DURATION}>
        <ClosingScene allItems={allItems} />
      </Sequence>
    </>
  );
};
