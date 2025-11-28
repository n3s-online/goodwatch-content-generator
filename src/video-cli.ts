import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import inquirer from "inquirer";
import { renderVideo } from "./video/renderer";
import { RelatedContent, MediaType, ShowData } from "./video/types";
import { getEnvConfig } from "./config/env";
import {
  fetchFromAPI,
  extractIdFromInput,
  extractSlugFromLink,
} from "./api-client";
import { parseAPIResponse } from "./parser";
import { scrapeShowMetadata } from "./show-scraper";
import { generateVideoMetadata } from "./services/metadata-generator";
import { selectItemsForScenes } from "./video/utils/deduplicator";

/**
 * Get all show directories in the output directory
 * Returns array of directory names (e.g., ["66732-stranger-things", "157336-away"])
 */
function getIngestedShows(): string[] {
  const outputDir = path.join(process.cwd(), "output");

  if (!fs.existsSync(outputDir)) {
    return [];
  }

  const entries = fs.readdirSync(outputDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/**
 * Interactive show selection using inquirer
 */
async function selectIngestedShow(): Promise<string> {
  const shows = getIngestedShows();

  if (shows.length === 0) {
    return "";
  }

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "show",
      message: "Select a show to create a video from:",
      choices: shows.map((showDir) => ({
        name: showDir.replace(/^\d+-/, "").replace(/-/g, " "),
        value: showDir,
      })),
      pageSize: 10,
    },
  ]);

  return answer.show;
}

/**
 * Extract source information from show data
 */
function extractSourceInfo(showData: ShowData): {
  title: string;
  image: string;
} {
  return {
    title: showData.metadata.title,
    image: showData.metadata.posterUrl,
  };
}

/**
 * Main function to create a video
 */
export async function createVideo({
  hookOnly = false,
}: { hookOnly?: boolean } = {}): Promise<void> {
  try {
    console.log("\n🎬 Goodwatch Video Creator\n");

    // Validate environment variables
    try {
      getEnvConfig();
      console.log("✅ Environment variables validated\n");
    } catch (error) {
      console.error("\n❌ Environment validation failed:");
      console.error(error instanceof Error ? error.message : error);
      console.error("\nPlease set the required environment variables:");
      console.error("  - ELEVENLABS_API_KEY (required)");
      console.error("  - VERCEL_AI_GATEWAY_API_KEY (required)");
      console.error(
        "  - VERCEL_AI_GATEWAY_URL (optional, defaults to https://ai-gateway.vercel.sh/v1)"
      );
      console.error("  - ELEVENLABS_VOICE_ID (optional)");
      process.exit(1);
    }

    const ingestedShows = getIngestedShows();
    let selectedShow = "";
    let showData: ShowData;

    // Prompt: use existing or fetch new
    if (ingestedShows.length > 0) {
      const sourceChoice = await inquirer.prompt([
        {
          type: "list",
          name: "choice",
          message: "Create video from:",
          choices: [
            { name: "Existing show", value: "existing" },
            { name: "New show (fetch from API)", value: "new" },
          ],
        },
      ]);

      if (sourceChoice.choice === "existing") {
        selectedShow = await selectIngestedShow();
      }
    }

    // If no show selected (either no existing shows or chose "new"), fetch from API
    if (!selectedShow) {
      console.log("\n📡 Fetch from Goodwatch API\n");

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

      // Create slug from title
      const slug = metadata.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      selectedShow = `${id}-${slug}`;

      // Combine metadata and related content
      showData = {
        metadata: {
          title: metadata.title,
          year: metadata.year,
          posterUrl: metadata.posterUrl,
        },
        relatedContent,
      };

      // Create show-specific directory
      const showDir = path.join(process.cwd(), "output", selectedShow);
      if (!fs.existsSync(showDir)) {
        fs.mkdirSync(showDir, { recursive: true });
      }

      // Save the combined data
      const dataFileName = `${selectedShow}.json`;
      const dataFilePath = path.join(showDir, dataFileName);
      fs.writeFileSync(
        dataFilePath,
        JSON.stringify(showData, null, 2),
        "utf-8"
      );
      console.log(`✅ Data saved to: output/${selectedShow}/${dataFileName}\n`);
    } else {
      // Load existing show data
      const showDir = path.join(process.cwd(), "output", selectedShow);
      const dataFilePath = path.join(showDir, `${selectedShow}.json`);

      if (!fs.existsSync(dataFilePath)) {
        throw new Error(
          `Data file not found: ${selectedShow}/${selectedShow}.json. It may have been deleted.`
        );
      }
      const fileContent = fs.readFileSync(dataFilePath, "utf-8");
      showData = JSON.parse(fileContent);
    }

    // Transform API data to internal format
    const data: RelatedContent = parseAPIResponse(showData.relatedContent);

    // Extract source info from metadata
    const { title, image } = extractSourceInfo(showData);

    console.log(`📺 Source: ${title}`);
    if (!image) {
      console.log(
        "⚠️  Warning: No source image found. The video may not display correctly."
      );
    }

    // Generate output filename with timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const outputFilename = `${selectedShow}-${timestamp}.mp4`;

    // Save to show-specific directory
    const showDir = path.join(process.cwd(), "output", selectedShow);
    const outputPath = path.join(showDir, outputFilename);

    console.log("\n🎥 Starting video render...\n");

    // Render the video
    await renderVideo({
      outputPath,
      data,
      sourceTitle: title,
      sourceImage: image,
      hookOnly,
    });

    // Generate social media metadata if it doesn't exist
    const metadataPath = path.join(showDir, "metadata.json");
    if (!fs.existsSync(metadataPath)) {
      console.log("\n📝 Generating social media metadata...\n");
      try {
        // Use the SAME logic as the video to select items
        const movieCategories = Object.keys(data.movies).filter(
          (cat) => cat.toLowerCase() !== "overall"
        );
        const tvShowCategories = Object.keys(data.tv_shows).filter(
          (cat) => cat.toLowerCase() !== "overall"
        );

        const availableCategories = movieCategories.filter((cat) =>
          tvShowCategories.includes(cat)
        );
        const selectedCategories = availableCategories.slice(0, 3);

        // Find overall category
        const overallCategoryKey =
          Object.keys(data.movies).find(
            (cat) => cat.toLowerCase() === "overall"
          ) || "overall";

        // Get items for each category (same as video composition)
        const getItemsForCategory = (categoryName: string) => {
          return {
            movies: data.movies[categoryName] || [],
            tvShows: data.tv_shows[categoryName] || [],
          };
        };

        const overallItems = getItemsForCategory(overallCategoryKey);
        const categoryData = selectedCategories.map((categoryName) => ({
          name: categoryName,
          ...getItemsForCategory(categoryName),
        }));

        // Use the same deduplication logic as the video
        const selectedItems = selectItemsForScenes(
          overallItems.movies,
          overallItems.tvShows,
          categoryData
        );

        // Extract all 16 item names shown in video
        const recommendations: string[] = [
          // Overall scene: 4 items
          ...selectedItems.overall.movies.map((item) => item.name),
          ...selectedItems.overall.tvShows.map((item) => item.name),
          // Category scenes: 12 items (4 per category)
          ...selectedItems.categories.flatMap((cat) => [
            ...cat.movies.map((item) => item.name),
            ...cat.tvShows.map((item) => item.name),
          ]),
        ];

        const metadata = await generateVideoMetadata({
          sourceTitle: title,
          categories: selectedCategories,
          recommendations,
        });

        fs.writeFileSync(
          metadataPath,
          JSON.stringify(metadata, null, 2),
          "utf-8"
        );
        console.log(
          `✅ Metadata saved to: output/${selectedShow}/metadata.json\n`
        );
      } catch (error) {
        console.warn(
          "⚠️  Failed to generate metadata:",
          error instanceof Error ? error.message : error
        );
      }
    } else {
      console.log("\n📝 Metadata already exists, skipping generation.\n");
    }

    console.log("\n🎉 Done!\n");
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}
