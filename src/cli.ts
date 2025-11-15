#!/usr/bin/env node

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import inquirer from "inquirer";
import { parseRelatedContent } from "./parser";
import { fetchHTML } from "./fetcher";
import { createVideo } from "./video-cli";

/**
 * Extract the ID and slug from a Goodwatch URL
 * e.g., "https://goodwatch.app/movie/1412450-stranger-things" -> "1412450-stranger-things"
 */
function extractIdSlugFromUrl(url: string): string | null {
  const match = url.match(/\/(movie|show)\/([^/?#]+)/);
  return match ? match[2] : null;
}

const program = new Command();

program
  .name("goodwatch-content-generator")
  .description(
    "Parse related shows and movies from Goodwatch pages and create videos"
  )
  .version("1.0.0");

program
  .command("scrape")
  .description("Scrape related content from a Goodwatch URL")
  .option(
    "-f, --file <path>",
    "Parse from local HTML file instead of fetching URL"
  )
  .option(
    "-b, --browser",
    "Force use of headless browser (slower but handles JavaScript-rendered pages)"
  )
  .action(async (options: { file?: string; browser?: boolean }) => {
    try {
      console.log("\n🔍 Goodwatch Content Scraper\n");

      let url = "";
      let html: string;

      if (options.file) {
        // Parse from local file
        if (!fs.existsSync(options.file)) {
          console.error(`Error: File not found: ${options.file}`);
          process.exit(1);
        }
        html = fs.readFileSync(options.file, "utf-8");
        // For file mode, we still need a URL for naming
        const answer = await inquirer.prompt([
          {
            type: "input",
            name: "url",
            message: "Enter the Goodwatch URL (for naming the output file):",
            validate: (input: string) => {
              if (!input.trim()) {
                return "URL is required";
              }
              if (!input.includes("goodwatch.app")) {
                return "Please enter a valid Goodwatch URL";
              }
              return true;
            },
          },
        ]);
        url = answer.url;
      } else {
        // Interactive URL input
        const answer = await inquirer.prompt([
          {
            type: "input",
            name: "url",
            message: "Enter the Goodwatch URL to scrape:",
            validate: (input: string) => {
              if (!input.trim()) {
                return "URL is required";
              }
              if (
                !input.startsWith("http://") &&
                !input.startsWith("https://")
              ) {
                return "URL must start with http:// or https://";
              }
              if (!input.includes("goodwatch.app")) {
                return "Please enter a valid Goodwatch URL";
              }
              return true;
            },
          },
        ]);
        url = answer.url;

        try {
          console.log("\n⏳ Fetching content...\n");
          html = await fetchHTML(url, {
            useHeadless: options.browser,
            timeout: 30000,
          });
        } catch (error) {
          console.error(
            `Error: ${error instanceof Error ? error.message : error}`
          );
          console.error(
            "\nTip: Try using the --browser flag to use a headless browser, or save the HTML with your browser and use the --file option."
          );
          process.exit(1);
        }
      }

      console.log("📝 Parsing content...\n");
      const result = parseRelatedContent(html);

      // Check if results are completely empty
      const hasMovies = Object.keys(result.movies).length > 0;
      const hasShows = Object.keys(result.tv_shows).length > 0;

      if (!hasMovies && !hasShows) {
        console.error("\n⚠️  WARNING: Results are completely empty!");
        console.error("This could mean:");
        console.error('  1. The URL does not have a "Related" section');
        console.error("  2. The page structure has changed");
        console.error(
          "  3. The website is blocking or returning different content"
        );
        console.error(
          "  4. The URL is incorrect (e.g., using /movie/ instead of /show/)"
        );
        console.error(
          "\nTip: Try saving the HTML with your browser and using the --file option to parse it locally."
        );
      }

      // Create output directory if it doesn't exist
      const outputDir = path.join(process.cwd(), "output");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Save output to file in output/ directory
      const idSlug = extractIdSlugFromUrl(url);
      if (idSlug) {
        const outputFileName = `${idSlug}.output.json`;
        const outputPath = path.join(outputDir, outputFileName);
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
        console.log(`✅ Output saved to: output/${outputFileName}\n`);
      }

      // Print summary
      const movieCount = Object.values(result.movies).reduce(
        (sum, items) => sum + items.length,
        0
      );
      const showCount = Object.values(result.tv_shows).reduce(
        (sum, items) => sum + items.length,
        0
      );
      console.log(`📊 Summary:`);
      console.log(`   Movies: ${movieCount}`);
      console.log(`   TV Shows: ${showCount}`);
      console.log(`   Categories: ${Object.keys(result.movies).length}\n`);
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command("create-video")
  .description("Create a short-form video from an output file")
  .action(async () => {
    try {
      await createVideo();
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
