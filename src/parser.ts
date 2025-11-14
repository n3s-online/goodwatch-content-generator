import * as cheerio from 'cheerio';
import * as fs from 'fs';

export interface MediaItem {
  name: string;
  link: string;
  image: string;
}

export interface CategoryContent {
  [category: string]: MediaItem[];
}

export interface RelatedContent {
  movies: CategoryContent;
  tv_shows: CategoryContent;
}

/**
 * Extract media items from a swiper container
 */
function extractMediaItems($: cheerio.CheerioAPI, container: cheerio.Cheerio<any>): MediaItem[] {
  const items: MediaItem[] = [];

  container.find('a[href^="/show/"], a[href^="/movie/"]').each((_, element) => {
    const $link = $(element);
    const href = $link.attr('href');

    if (!href) return;

    // Extract the poster image (not the GoodWatch logo)
    const posterImg = $link.find('img[alt^="Poster for"]');
    const image = posterImg.attr('src') || '';

    // Extract the title from the span
    const titleSpan = $link.find('span.text-sm.font-bold.text-white');
    const name = titleSpan.text().trim();

    if (!name || !image) return;

    items.push({
      name,
      link: `https://goodwatch.app${href}`,
      image
    });
  });

  return items;
}

/**
 * Parse the related content from a Goodwatch HTML page
 * @param html - The HTML content to parse
 * @returns An object containing movies and TV shows organized by filter categories
 */
export function parseRelatedContent(html: string): RelatedContent {
  const $ = cheerio.load(html);
  const movies: CategoryContent = {};
  const tv_shows: CategoryContent = {};

  // Find the related section
  const relatedSection = $('#related');

  if (relatedSection.length === 0) {
    return { movies, tv_shows };
  }

  // Extract filter categories from buttons
  const categories: string[] = [];
  relatedSection.find('button[type="button"] h3 span').each((_, element) => {
    const text = $(element).text().trim();
    // Skip emoji spans (aria-hidden="true")
    if (text && !$(element).attr('aria-hidden')) {
      categories.push(text);
    }
  });

  // For each category, find its content section
  relatedSection.find('div[aria-hidden]').each((index, sectionElement) => {
    const $section = $(sectionElement);

    // Extract category name from the section header
    const categoryHeader = $section.find('p span.font-bold').first().text().trim();
    const categoryName = categoryHeader.replace(':', '').trim();

    if (!categoryName) return;

    // Find the Shows section
    const showsHeading = $section.find('h3').filter((_, el) => $(el).text().trim() === 'Shows');
    if (showsHeading.length > 0) {
      const showsContainer = showsHeading.parent().find('.swiper').first();
      const shows = extractMediaItems($, showsContainer);
      if (shows.length > 0) {
        tv_shows[categoryName] = shows;
      }
    }

    // Find the Movies section
    const moviesHeading = $section.find('h3').filter((_, el) => $(el).text().trim() === 'Movies');
    if (moviesHeading.length > 0) {
      const moviesContainer = moviesHeading.parent().find('.swiper').first();
      const movieItems = extractMediaItems($, moviesContainer);
      if (movieItems.length > 0) {
        movies[categoryName] = movieItems;
      }
    }
  });

  return { movies, tv_shows };
}

/**
 * Parse related content from a local HTML file
 * @param filePath - Path to the HTML file
 * @returns An object containing arrays of movies and TV shows
 */
export function parseRelatedContentFromFile(filePath: string): RelatedContent {
  const html = fs.readFileSync(filePath, 'utf-8');
  return parseRelatedContent(html);
}
