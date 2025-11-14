import * as path from 'path';
import { parseRelatedContentFromFile, RelatedContent } from './parser';

function testParser() {
  console.log('Running parser test...\n');

  const testFile = path.join(__dirname, '..', 'docs', 'dom', 'goodwatch.app_show_66732-stranger-things.html');

  try {
    const result: RelatedContent = parseRelatedContentFromFile(testFile);

    console.log('Test Results:');
    console.log('=============\n');

    console.log(`Found ${result.tv_shows.length} TV shows`);
    console.log(`Found ${result.movies.length} movies\n`);

    console.log('TV Shows (first 3):');
    result.tv_shows.slice(0, 3).forEach((show, idx) => {
      console.log(`${idx + 1}. ${show.name}`);
      console.log(`   Link: ${show.link}`);
      console.log(`   Image: ${show.image.substring(0, 60)}...\n`);
    });

    console.log('Movies (first 3):');
    result.movies.slice(0, 3).forEach((movie, idx) => {
      console.log(`${idx + 1}. ${movie.name}`);
      console.log(`   Link: ${movie.link}`);
      console.log(`   Image: ${movie.image.substring(0, 60)}...\n`);
    });

    console.log('\nFull JSON Output:');
    console.log('=================');
    console.log(JSON.stringify(result, null, 2));

    // Validate the results
    if (result.tv_shows.length === 0 && result.movies.length === 0) {
      console.error('\n❌ TEST FAILED: No content found!');
      process.exit(1);
    }

    // Check if all items have required fields
    const allItems = [...result.tv_shows, ...result.movies];
    const invalidItems = allItems.filter(item => !item.name || !item.link || !item.image);

    if (invalidItems.length > 0) {
      console.error(`\n❌ TEST FAILED: Found ${invalidItems.length} items with missing fields!`);
      console.error(invalidItems);
      process.exit(1);
    }

    console.log('\n✅ TEST PASSED: All items have required fields (name, link, image)');
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
