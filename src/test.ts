import * as path from 'path';
import { parseRelatedContentFromFile, RelatedContent, MediaItem } from './parser';

function testParser() {
  console.log('Running parser test...\n');

  const testFile = path.join(__dirname, '..', 'docs', 'dom', 'goodwatch.app_show_66732-stranger-things.html');

  try {
    const result: RelatedContent = parseRelatedContentFromFile(testFile);

    console.log('Test Results:');
    console.log('=============\n');

    // Count categories and items
    const tvShowCategories = Object.keys(result.tv_shows);
    const movieCategories = Object.keys(result.movies);

    console.log(`Found ${tvShowCategories.length} TV show categories`);
    console.log(`Found ${movieCategories.length} movie categories\n`);

    console.log('TV Show Categories:', tvShowCategories.join(', '));
    console.log('Movie Categories:', movieCategories.join(', '), '\n');

    // Display sample from each category
    for (const category of tvShowCategories.slice(0, 2)) {
      const shows = result.tv_shows[category];
      console.log(`\n${category} - TV Shows (${shows.length} total, showing first 2):`);
      shows.slice(0, 2).forEach((show, idx) => {
        console.log(`  ${idx + 1}. ${show.name}`);
        console.log(`     Link: ${show.link}`);
        console.log(`     Image: ${show.image.substring(0, 60)}...`);
        console.log(`     GoodWatch Score: ${show.goodwatch_score}`);
      });
    }

    for (const category of movieCategories.slice(0, 2)) {
      const movies = result.movies[category];
      console.log(`\n${category} - Movies (${movies.length} total, showing first 2):`);
      movies.slice(0, 2).forEach((movie, idx) => {
        console.log(`  ${idx + 1}. ${movie.name}`);
        console.log(`     Link: ${movie.link}`);
        console.log(`     Image: ${movie.image.substring(0, 60)}...`);
        console.log(`     GoodWatch Score: ${movie.goodwatch_score}`);
      });
    }

    console.log('\n\nFull JSON Output (truncated):');
    console.log('============================');

    // Show a truncated version
    const truncated = {
      movies: {} as any,
      tv_shows: {} as any
    };

    for (const category of movieCategories.slice(0, 2)) {
      truncated.movies[category] = result.movies[category].slice(0, 2);
    }
    for (const category of tvShowCategories.slice(0, 2)) {
      truncated.tv_shows[category] = result.tv_shows[category].slice(0, 2);
    }

    console.log(JSON.stringify(truncated, null, 2));

    // Validate the results
    if (tvShowCategories.length === 0 && movieCategories.length === 0) {
      console.error('\n❌ TEST FAILED: No categories found!');
      process.exit(1);
    }

    // Check if all items have required fields
    const allItems: MediaItem[] = [];
    for (const category of tvShowCategories) {
      allItems.push(...result.tv_shows[category]);
    }
    for (const category of movieCategories) {
      allItems.push(...result.movies[category]);
    }

    const invalidItems = allItems.filter(item =>
      !item.name || !item.link || !item.image || typeof item.goodwatch_score !== 'number'
    );

    if (invalidItems.length > 0) {
      console.error(`\n❌ TEST FAILED: Found ${invalidItems.length} items with missing fields!`);
      console.error(invalidItems.slice(0, 5));
      process.exit(1);
    }

    // Check for items with score of 0 (might indicate parsing issues)
    const itemsWithZeroScore = allItems.filter(item => item.goodwatch_score === 0);
    if (itemsWithZeroScore.length > 0) {
      console.warn(`\n⚠️  WARNING: Found ${itemsWithZeroScore.length} items with score 0`);
      console.warn('Sample items:', itemsWithZeroScore.slice(0, 3).map(i => i.name));
    }

    // Calculate score statistics
    const scores = allItems.map(item => item.goodwatch_score);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    console.log(`\n✅ TEST PASSED: All ${allItems.length} items have required fields (name, link, image, goodwatch_score)`);
    console.log(`✅ Found ${tvShowCategories.length} TV show categories and ${movieCategories.length} movie categories`);
    console.log(`📊 Score Statistics: Min=${minScore}, Max=${maxScore}, Avg=${avgScore.toFixed(1)}`);
    process.exit(0);

  } catch (error) {
    console.error('❌ TEST FAILED:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

testParser();
