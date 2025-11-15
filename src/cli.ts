#!/usr/bin/env node

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { parseRelatedContent } from "./parser";
import { fetchHTML } from "./fetcher";

const program = new Command();

program
  .name("goodwatch-parser")
  .description("Parse related shows and movies from Goodwatch pages")
  .version("1.0.0");

program
  .argument(
    "<url>",
    "Goodwatch URL (e.g., https://goodwatch.app/show/66732-stranger-things)"
  )
  .option(
    "-f, --file <path>",
    "Parse from local HTML file instead of fetching URL"
  )
  .option(
    "-b, --browser",
    "Force use of headless browser (slower but handles JavaScript-rendered pages)"
  )
  .action(
    async (url: string, options: { file?: string; browser?: boolean }) => {
      try {
        let html: string;

        if (options.file) {
          // Parse from local file
          if (!fs.existsSync(options.file)) {
            console.error(`Error: File not found: ${options.file}`);
            process.exit(1);
          }
          html = fs.readFileSync(options.file, "utf-8");
        } else {
          // Fetch URL
          // Validate URL format
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            console.error("Error: URL must start with http:// or https://");
            process.exit(1);
          }

          // Optional: Validate it's a Goodwatch URL
          if (!url.includes("goodwatch.app")) {
            console.error(
              "Warning: URL does not appear to be from goodwatch.app"
            );
          }

          try {
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

        console.log(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
        process.exit(1);
      }
    }
  );

program.parse();
