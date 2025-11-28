import React, { useEffect, useState } from "react";
import {
  Audio,
  Sequence,
  staticFile,
  continueRender,
  delayRender,
} from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import {
  SCENE_1_DURATION,
  SCENE_2_DURATION,
  SCENE_3_DURATION,
  SCENE_4_DURATION,
  SCENE_5_DURATION,
  SCENE_6_DURATION,
  VIDEO_FPS,
} from "./constants";
import { HookScene } from "./scenes/HookScene";
import { CategoryRecommendationsScene } from "./scenes/CategoryRecommendationsScene";
import { ClosingScene } from "./scenes/ClosingScene";
import { VideoInputProps } from "./types";
import { selectItemsForScenes } from "./utils/deduplicator";

export const VideoComposition: React.FC<VideoInputProps> = ({
  data,
  sourceTitle,
  sourceImage,
  hookOnly = false,
  audioFiles,
}) => {
  // State for dynamic scene durations based on audio length
  const [sceneDurations, setSceneDurations] = useState({
    scene1: SCENE_1_DURATION,
    scene2: SCENE_2_DURATION,
    scene3: SCENE_3_DURATION,
    scene4: SCENE_4_DURATION,
    scene5: SCENE_5_DURATION,
  });
  const [durationsLoaded, setDurationsLoaded] = useState(false);

  // Calculate durations based on audio files
  useEffect(() => {
    if (!audioFiles) {
      setDurationsLoaded(true);
      return;
    }

    const handle = delayRender();

    const loadDurations = async () => {
      try {
        const durations = { ...sceneDurations };

        // Get hook audio duration
        if (audioFiles.hook) {
          const hookDuration = await getAudioDurationInSeconds(
            staticFile(audioFiles.hook)
          );
          durations.scene1 = Math.max(
            SCENE_1_DURATION,
            Math.ceil(hookDuration * VIDEO_FPS)
          );
        }

        // Get category audio durations
        if (audioFiles.categories) {
          for (let i = 0; i < Math.min(audioFiles.categories.length, 3); i++) {
            const audioDuration = await getAudioDurationInSeconds(
              staticFile(audioFiles.categories[i])
            );
            const sceneKey = `scene${i + 2}` as keyof typeof durations;
            const defaultDuration = [
              SCENE_2_DURATION,
              SCENE_3_DURATION,
              SCENE_4_DURATION,
            ][i];
            durations[sceneKey] = Math.max(
              defaultDuration,
              Math.ceil(audioDuration * VIDEO_FPS)
            );
          }
        }

        // Get overall audio duration
        if (audioFiles.overall) {
          const overallDuration = await getAudioDurationInSeconds(
            staticFile(audioFiles.overall)
          );
          durations.scene5 = Math.max(
            SCENE_5_DURATION,
            Math.ceil(overallDuration * VIDEO_FPS)
          );
        }

        setSceneDurations(durations);
        setDurationsLoaded(true);
        continueRender(handle);
      } catch (error) {
        console.error("Error loading audio durations:", error);
        setDurationsLoaded(true);
        continueRender(handle);
      }
    };

    loadDurations();
  }, [audioFiles]);
  // Get all available categories (excluding "overall")
  const movieCategories = Object.keys(data.movies).filter(
    (cat) => cat.toLowerCase() !== "overall"
  );
  const tvShowCategories = Object.keys(data.tv_shows).filter(
    (cat) => cat.toLowerCase() !== "overall"
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
  // Find the overall category (case-insensitive)
  const overallCategoryKey =
    Object.keys(data.movies).find((cat) => cat.toLowerCase() === "overall") ||
    "overall";
  const overallItems = getItemsForCategory(overallCategoryKey);
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

  // Category labels for each row (4 items per category)
  const categoryLabels = [
    overallCategoryKey, // Row 1
    selectedItems.categories[0]?.name || "",
    selectedItems.categories[1]?.name || "",
    selectedItems.categories[2]?.name || "",
  ];

  // Calculate frame offsets using dynamic durations
  // New order: Hook -> Category 1 -> Category 2 -> Category 3 -> Overall -> Closing
  let currentFrame = 0;
  const scene1Start = currentFrame;
  currentFrame += sceneDurations.scene1;

  const scene2Start = currentFrame;
  currentFrame += sceneDurations.scene2; // Category 1

  const scene3Start = currentFrame;
  currentFrame += sceneDurations.scene3; // Category 2

  const scene4Start = currentFrame;
  currentFrame += sceneDurations.scene4; // Category 3

  const scene5Start = currentFrame;
  currentFrame += sceneDurations.scene5; // Overall

  const scene6Start = currentFrame;

  // If hookOnly is true, only render the hook scene
  if (hookOnly) {
    if (!durationsLoaded) return null;

    return (
      <Sequence from={0} durationInFrames={sceneDurations.scene1}>
        {audioFiles?.hook && <Audio src={staticFile(audioFiles.hook)} />}
        <HookScene
          data={data}
          sourceTitle={sourceTitle}
          sourceImage={sourceImage}
          durationInFrames={sceneDurations.scene1}
        />
      </Sequence>
    );
  }

  if (!durationsLoaded) return null;

  return (
    <>
      {/* Background Music - plays for entire video at 30% volume */}
      <Audio src={staticFile("background-music.mp3")} volume={0.3} loop />

      {/* Scene 1: Hook */}
      <Sequence from={scene1Start} durationInFrames={sceneDurations.scene1}>
        {audioFiles?.hook && <Audio src={staticFile(audioFiles.hook)} />}
        <HookScene
          data={data}
          sourceTitle={sourceTitle}
          sourceImage={sourceImage}
          durationInFrames={sceneDurations.scene1}
        />
      </Sequence>

      {/* Scene 2: Category 1 */}
      {selectedItems.categories[0] && (
        <Sequence from={scene2Start} durationInFrames={sceneDurations.scene2}>
          {audioFiles?.categories?.[0] && (
            <Audio src={staticFile(audioFiles.categories[0])} />
          )}
          <CategoryRecommendationsScene
            categoryName={selectedItems.categories[0].name}
            movies={selectedItems.categories[0].movies}
            tvShows={selectedItems.categories[0].tvShows}
            durationInFrames={sceneDurations.scene2}
          />
        </Sequence>
      )}

      {/* Scene 3: Category 2 */}
      {selectedItems.categories[1] && (
        <Sequence from={scene3Start} durationInFrames={sceneDurations.scene3}>
          {audioFiles?.categories?.[1] && (
            <Audio src={staticFile(audioFiles.categories[1])} />
          )}
          <CategoryRecommendationsScene
            categoryName={selectedItems.categories[1].name}
            movies={selectedItems.categories[1].movies}
            tvShows={selectedItems.categories[1].tvShows}
            durationInFrames={sceneDurations.scene3}
          />
        </Sequence>
      )}

      {/* Scene 4: Category 3 */}
      {selectedItems.categories[2] && (
        <Sequence from={scene4Start} durationInFrames={sceneDurations.scene4}>
          {audioFiles?.categories?.[2] && (
            <Audio src={staticFile(audioFiles.categories[2])} />
          )}
          <CategoryRecommendationsScene
            categoryName={selectedItems.categories[2].name}
            movies={selectedItems.categories[2].movies}
            tvShows={selectedItems.categories[2].tvShows}
            durationInFrames={sceneDurations.scene4}
          />
        </Sequence>
      )}

      {/* Scene 5: Overall Top Picks */}
      <Sequence from={scene5Start} durationInFrames={sceneDurations.scene5}>
        {audioFiles?.overall && <Audio src={staticFile(audioFiles.overall)} />}
        <CategoryRecommendationsScene
          categoryName="overall"
          movies={selectedItems.overall.movies}
          tvShows={selectedItems.overall.tvShows}
          durationInFrames={sceneDurations.scene5}
        />
      </Sequence>

      {/* Scene 6: Closing */}
      <Sequence from={scene6Start} durationInFrames={SCENE_6_DURATION}>
        <ClosingScene allItems={allItems} categoryLabels={categoryLabels} />
      </Sequence>
    </>
  );
};
