import * as path from 'path';
import * as fs from 'fs';
import { parseRelatedContent, parseRelatedContentFromFile, RelatedContent } from './parser';

/**
 * Test suite for the parser
 */

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const tests: TestResult[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    tests.push({ name, passed: true, message: 'PASSED' });
    console.log(`✅ ${name}`);
  } catch (error) {
    tests.push({
      name,
      passed: false,
      message: error instanceof Error ? error.message : String(error)
    });
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error instanceof Error ? error.message : error}`);
  }
}

function assertEquals(actual: any, expected: any, message?: string) {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${expected}, got ${actual}`
    );
  }
}

function assertGreaterThan(actual: number, expected: number, message?: string) {
  if (actual <= expected) {
    throw new Error(
      message || `Expected ${actual} to be greater than ${expected}`
    );
  }
}

function assertNotEmpty(obj: any, message?: string) {
  if (typeof obj === 'object' && Object.keys(obj).length === 0) {
    throw new Error(message || 'Expected object to not be empty');
  }
}

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || 'Expected condition to be true');
  }
}

console.log('Running parser tests...\n');

// Test 1: Parse from sample file
test('Parse sample HTML file successfully', () => {
  const testFile = path.join(__dirname, '..', 'docs', 'dom', 'goodwatch.app_show_66732-stranger-things.html');
  assertTrue(fs.existsSync(testFile), 'Sample HTML file should exist');

  const result = parseRelatedContentFromFile(testFile);
  assertTrue(result !== null && result !== undefined, 'Result should not be null or undefined');
});

// Test 2: Results should not be completely empty
test('Results should contain content (not completely empty)', () => {
  const testFile = path.join(__dirname, '..', 'docs', 'dom', 'goodwatch.app_show_66732-stranger-things.html');
  const result = parseRelatedContentFromFile(testFile);

  const hasMovies = Object.keys(result.movies).length > 0;
  const hasShows = Object.keys(result.tv_shows).length > 0;

  assertTrue(
    hasMovies || hasShows,
    `Results should have at least movies or TV shows. Got movies: ${Object.keys(result.movies).length}, tv_shows: ${Object.keys(result.tv_shows).length}`
  );
});

// Test 3: TV shows should not be empty
test('TV shows should not be empty', () => {
  const testFile = path.join(__dirname, '..', 'docs', 'dom', 'goodwatch.app_show_66732-stranger-things.html');
  const result = parseRelatedContentFromFile(testFile);

  assertGreaterThan(
    Object.keys(result.tv_shows).length,
    0,
    'Should have at least one TV show category'
  );
});

// Test 4: Movies should not be empty
test('Movies should not be empty', () => {
  const testFile = path.join(__dirname, '..', 'docs', 'dom', 'goodwatch.app_show_66732-stranger-things.html');
  const result = parseRelatedContentFromFile(testFile);

  assertGreaterThan(
    Object.keys(result.movies).length,
    0,
    'Should have at least one movie category'
  );
});

// Test 5: Each category should have items
test('Each category should have at least one item', () => {
  const testFile = path.join(__dirname, '..', 'docs', 'dom', 'goodwatch.app_show_66732-stranger-things.html');
  const result = parseRelatedContentFromFile(testFile);

  for (const [category, items] of Object.entries(result.movies)) {
    assertGreaterThan(
      items.length,
      0,
      `Movie category "${category}" should have at least one item`
    );
  }

  for (const [category, items] of Object.entries(result.tv_shows)) {
    assertGreaterThan(
      items.length,
      0,
      `TV show category "${category}" should have at least one item`
    );
  }
});

// Test 6: Media items should have required fields
test('Media items should have all required fields', () => {
  const testFile = path.join(__dirname, '..', 'docs', 'dom', 'goodwatch.app_show_66732-stranger-things.html');
  const result = parseRelatedContentFromFile(testFile);

  const allItems = [
    ...Object.values(result.movies).flat(),
    ...Object.values(result.tv_shows).flat()
  ];

  assertTrue(allItems.length > 0, 'Should have at least one media item');

  for (const item of allItems) {
    assertTrue(!!item.name, `Item should have a name. Got: ${JSON.stringify(item)}`);
    assertTrue(!!item.link, `Item should have a link. Got: ${JSON.stringify(item)}`);
    assertTrue(!!item.image, `Item should have an image. Got: ${JSON.stringify(item)}`);
    assertTrue(
      typeof item.goodwatch_score === 'number',
      `Item should have a goodwatch_score (number). Got: ${typeof item.goodwatch_score}`
    );
  }
});

// Test 7: Empty HTML should return empty results
test('Empty HTML should return empty results', () => {
  const result = parseRelatedContent('');
  assertEquals(Object.keys(result.movies).length, 0, 'Empty HTML should return no movies');
  assertEquals(Object.keys(result.tv_shows).length, 0, 'Empty HTML should return no TV shows');
});

// Test 8: HTML without #related section should return empty results
test('HTML without #related section should return empty results', () => {
  const html = '<html><body><h1>Test</h1></body></html>';
  const result = parseRelatedContent(html);
  assertEquals(Object.keys(result.movies).length, 0, 'Should return no movies');
  assertEquals(Object.keys(result.tv_shows).length, 0, 'Should return no TV shows');
});

// Test 9: Validate helper function to check if results are empty
test('Helper function to detect completely empty results', () => {
  function isCompletelyEmpty(result: RelatedContent): boolean {
    return Object.keys(result.movies).length === 0 && Object.keys(result.tv_shows).length === 0;
  }

  const emptyResult: RelatedContent = { movies: {}, tv_shows: {} };
  assertTrue(isCompletelyEmpty(emptyResult), 'Empty result should be detected as empty');

  const testFile = path.join(__dirname, '..', 'docs', 'dom', 'goodwatch.app_show_66732-stranger-things.html');
  const validResult = parseRelatedContentFromFile(testFile);
  assertTrue(!isCompletelyEmpty(validResult), 'Valid result should not be detected as empty');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('Test Summary');
console.log('='.repeat(50));

const passed = tests.filter(t => t.passed).length;
const failed = tests.filter(t => !t.passed).length;
const total = tests.length;

console.log(`Total: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  console.log('\nFailed tests:');
  tests.filter(t => !t.passed).forEach(t => {
    console.log(`  - ${t.name}: ${t.message}`);
  });
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  process.exit(0);
}
