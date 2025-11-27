#!/usr/bin/env node

import "dotenv/config";
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import inquirer from "inquirer";
import { parseAPIResponse } from "./parser";
import {
  fetchFromAPI,
  extractIdFromInput,
  extractSlugFromLink,
  MediaType,
  ShowData,
} from "./api-client";
import { createVideo } from "./video-cli";
import { scrapeShowMetadata } from "./show-scraper";

const program = new Command();

program
  .name("goodwatch-content-generator")
  .description(
    "Parse related shows and movies from Goodwatch pages and create videos"
  )
  .version("1.0.0");

program
  .command("scrape")
  .description("Fetch related content from Goodwatch API")
  .action(async () => {
    try {
      console.log("\n🔍 Goodwatch API Fetcher\n");

      // Prompt for media type
      const mediaTypeAnswer = await inquirer.prompt([
        {
          type: "list",
          name: "mediaType",
          message: "Select media type:",
          choices: [
            { name: "TV Show", value: "show" },
            { name: "Movie", value: "movie" },
          ],
        },
      ]);
      const mediaType = mediaTypeAnswer.mediaType as MediaType;

      // Prompt for ID or URL
      const inputAnswer = await inquirer.prompt([
        {
          type: "input",
          name: "input",
          message: `Enter Goodwatch ${
            mediaType === "show" ? "show" : "movie"
          } ID or URL:`,
          validate: (input: string) => {
            if (!input.trim()) {
              return "Input is required";
            }
            try {
              extractIdFromInput(input);
              return true;
            } catch (error) {
              return error instanceof Error ? error.message : "Invalid input";
            }
          },
        },
      ]);

      const { id, mediaType: detectedType } = extractIdFromInput(
        inputAnswer.input
      );

      // If media type was detected from URL, use it; otherwise use the selected one
      const finalMediaType = detectedType || mediaType;

      console.log(`\n⏳ Fetching related content from API...\n`);

      // Fetch related content from API
      const relatedContent = await fetchFromAPI({
        mediaType: finalMediaType,
        id,
      });

      // Construct show URL for scraping metadata
      const showUrl = `https://goodwatch.app/${finalMediaType}/${id}`;

      console.log(`\n🔍 Scraping show metadata from ${showUrl}...\n`);

      // Scrape main show metadata
      const metadata = await scrapeShowMetadata(showUrl);

      // Transform to internal format
      const result = parseAPIResponse(relatedContent);

      // Check if results are empty
      const hasMovies = Object.keys(result.movies).length > 0;
      const hasShows = Object.keys(result.tv_shows).length > 0;

      if (!hasMovies && !hasShows) {
        console.error("\n⚠️  WARNING: No related content found!");
        console.error(
          `The API returned no recommendations for ${finalMediaType} ID: ${id}`
        );
        process.exit(1);
      }

      // Create slug from title
      const slug = metadata.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const idSlug = `${id}-${slug}`;

      // Combine metadata and related content
      const showData: ShowData = {
        metadata: {
          title: metadata.title,
          year: metadata.year,
          posterUrl: metadata.posterUrl,
        },
        relatedContent,
      };

      // Create show-specific directory
      const showDir = path.join(process.cwd(), "output", idSlug);
      if (!fs.existsSync(showDir)) {
        fs.mkdirSync(showDir, { recursive: true });
      }

      // Save combined data
      const outputFileName = `${idSlug}.json`;
      const outputPath = path.join(showDir, outputFileName);
      fs.writeFileSync(outputPath, JSON.stringify(showData, null, 2), "utf-8");
      console.log(`✅ Data saved to: output/${idSlug}/${outputFileName}\n`);

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
      console.log(`   Title: ${metadata.title}`);
      console.log(`   Year: ${metadata.year || "N/A"}`);
      console.log(`   Related Movies: ${movieCount}`);
      console.log(`   Related TV Shows: ${showCount}`);
      console.log(`   Categories: ${Object.keys(result.movies).length}\n`);
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command("create-video")
  .description("Create a short-form video from an output file")
  .option("--hook-only", "Only render the hook scene for faster iteration")
  .action(async (options: { hookOnly?: boolean }) => {
    try {
      await createVideo({ hookOnly: options.hookOnly || false });
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
