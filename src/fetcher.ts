import puppeteer from "puppeteer";
import axios from "axios";

export interface FetchOptions {
  useHeadless?: boolean;
  timeout?: number;
  userAgent?: string;
}

/**
 * Fetch HTML content from a URL using Puppeteer (headless browser)
 * This is necessary for pages that use client-side JavaScript rendering
 */
export async function fetchWithBrowser(
  url: string,
  options: FetchOptions = {}
): Promise<string> {
  const {
    timeout = 30000,
    userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  } = options;

  console.error("Launching headless browser...");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set user agent
    await page.setUserAgent(userAgent);

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    console.error(`Navigating to: ${url}`);

    // Navigate to the page
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout,
    });

    // Wait for the related section to be present
    console.error("Waiting for content to load...");
    try {
      await page.waitForSelector("#related", { timeout: 10000 });
      console.error("Related section found!");
    } catch (error) {
      console.error("Warning: #related section not found within timeout");
    }

    // Additional wait to ensure dynamic content is loaded
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get the HTML content
    const html = await page.content();

    console.error("Successfully fetched page with browser");

    return html;
  } finally {
    await browser.close();
  }
}

/**
 * Fetch HTML content from a URL using axios (simple HTTP request)
 * This is faster but won't work for JavaScript-rendered pages
 */
export async function fetchWithAxios(
  url: string,
  options: FetchOptions = {}
): Promise<string> {
  const {
    timeout = 30000,
    userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  } = options;

  console.error(`Fetching URL: ${url}`);

  const response = await axios.get(url, {
    headers: {
      "User-Agent": userAgent,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Cache-Control": "max-age=0",
    },
    timeout,
    maxRedirects: 5,
    validateStatus: (status) => status < 500,
  });

  if (response.status === 403) {
    throw new Error(
      "Access forbidden (403). The website may be blocking automated requests."
    );
  }

  if (response.status !== 200) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }

  console.error("Successfully fetched URL");

  return response.data;
}

/**
 * Smart fetch that tries axios first, then falls back to browser if needed
 */
export async function fetchHTML(
  url: string,
  options: FetchOptions = {}
): Promise<string> {
  const { useHeadless = false } = options;

  // If explicitly requested to use headless browser
  if (useHeadless) {
    return fetchWithBrowser(url, options);
  }

  // Try axios first (faster)
  try {
    const html = await fetchWithAxios(url, options);

    // Check if the HTML contains loading skeletons (indicates client-side rendering)
    if (html.includes("animate-pulse") || html.includes("skeleton")) {
      console.error(
        "\n⚠️  Detected client-side rendering. Retrying with headless browser...\n"
      );
      return fetchWithBrowser(url, options);
    }

    return html;
  } catch (error) {
    console.error(
      `\nAxios fetch failed: ${error instanceof Error ? error.message : error}`
    );
    console.error("Retrying with headless browser...\n");
    return fetchWithBrowser(url, options);
  }
}
