import * as cheerio from 'cheerio';
import * as fs from 'fs';

export interface MediaItem {
  name: string;
  link: string;
  image: string;
}

export interface RelatedContent {
  movies: MediaItem[];
  tv_shows: MediaItem[];
}

/**
 * Parse the related content from a Goodwatch HTML page
 * @param html - The HTML content to parse
 * @returns An object containing arrays of movies and TV shows
 */
export function parseRelatedContent(html: string): RelatedContent {
  const $ = cheerio.load(html);
  const movies: MediaItem[] = [];
  const tv_shows: MediaItem[] = [];

  // Find the related section
  const relatedSection = $('#related');

  if (relatedSection.length === 0) {
    return { movies, tv_shows };
  }

  // Find all links within the related section
  relatedSection.find('a[href^="/show/"], a[href^="/movie/"]').each((_, element) => {
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

    const mediaItem: MediaItem = {
      name,
      link: `https://goodwatch.app${href}`,
      image
    };

    // Determine if it's a movie or TV show based on the href
    if (href.startsWith('/movie/')) {
      movies.push(mediaItem);
    } else if (href.startsWith('/show/')) {
      tv_shows.push(mediaItem);
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
