import puppeteer from "puppeteer";
import axios from "axios";
import * as cheerio from "cheerio";

export interface ShowMetadata {
  title: string;
  year: string;
  posterUrl: string;
}

/**
 * Scrape main show metadata from Goodwatch page
 */
async function scrapeWithBrowser(url: string): Promise<ShowMetadata> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1920, height: 1080 });

    console.log(`Fetching show page: ${url}`);
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait for content to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const html = await page.content();
    return parseShowMetadata(html);
  } finally {
    await browser.close();
  }
}

/**
 * Scrape using axios (faster)
 */
async function scrapeWithAxios(url: string): Promise<ShowMetadata> {
  console.log(`Fetching show page: ${url}`);
  
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    timeout: 30000,
  });

  if (response.status !== 200) {
    throw new Error(`HTTP ${response.status}`);
  }

  return parseShowMetadata(response.data);
}

/**
 * Parse show metadata from HTML
 */
function parseShowMetadata(html: string): ShowMetadata {
  const $ = cheerio.load(html);

  // Extract title - look for h1 or main title element
  let title = $("h1").first().text().trim();
  
  // Extract year - often in parentheses or separate element
  let year = "";
  const yearMatch = html.match(/\((\d{4})\)/);
  if (yearMatch) {
    year = yearMatch[1];
  } else {
    // Try to find year in metadata or other common locations
    const metaYear = $('[class*="year"]').first().text().trim();
    if (metaYear && /^\d{4}$/.test(metaYear)) {
      year = metaYear;
    }
  }

  // Extract poster image
  let posterUrl = "";
  
  // Look for poster image - try various common patterns
  const posterImg = $('img[alt*="Poster"]').first();
  if (posterImg.length) {
    posterUrl = posterImg.attr("src") || "";
  }
  
  // Fallback to og:image meta tag
  if (!posterUrl) {
    posterUrl = $('meta[property="og:image"]').attr("content") || "";
  }

  // Fallback to first large image
  if (!posterUrl) {
    const mainImg = $("img").first();
    posterUrl = mainImg.attr("src") || "";
  }

  if (!title) {
    throw new Error("Could not extract show title from page");
  }

  return {
    title,
    year,
    posterUrl,
  };
}

/**
 * Scrape show metadata, trying axios first then browser
 */
export async function scrapeShowMetadata(url: string): Promise<ShowMetadata> {
  try {
    return await scrapeWithAxios(url);
  } catch (error) {
    console.log("Axios failed, trying with browser...");
    return await scrapeWithBrowser(url);
  }
}

