import * as fs from "fs";
import * as path from "path";
import inquirer from "inquirer";
import { renderVideo } from "./video/renderer";
import { RelatedContent } from "./video/types";

/**
 * Get all .output.json files in the current directory
 */
function getOutputFiles(): string[] {
  const files = fs.readdirSync(process.cwd());
  return files.filter((file) => file.endsWith(".output.json"));
}

/**
 * Interactive file selection using inquirer
 */
async function selectOutputFile(): Promise<string> {
  const files = getOutputFiles();

  if (files.length === 0) {
    throw new Error(
      "No .output.json files found in the current directory. Please run the parser first."
    );
  }

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "file",
      message: "Select an output file to create a video from:",
      choices: files,
      pageSize: 10,
    },
  ]);

  return answer.file;
}

/**
 * Extract source information from the filename
 * The filename format is: [id]-[slug].output.json
 * Example: 1412450-stranger-things.output.json -> "Stranger Things"
 */
function extractSourceInfo(
  data: RelatedContent,
  filename: string
): { title: string; image: string } {
  // Extract title from filename
  const titleFromFilename = filename
    .replace(".output.json", "")
    .replace(/^\d+-/, "") // Remove leading ID and dash
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // For the image, we'll use a well-known poster URL for Stranger Things
  // In a production scenario, you would fetch this from the Goodwatch API
  // or store it when parsing the original page
  let sourceImage = "";

  // Hardcoded image for Stranger Things as an example
  // TODO: Fetch this from the Goodwatch API or store during parsing
  if (filename.includes("stranger-things")) {
    sourceImage =
      "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/49WJfeN0moxb9IPfGn8AIqMGskD.jpg";
  } else {
    // Fallback: try to find an image from the data (use first available)
    const overallTvShows = data.tv_shows["Overall"];
    const overallMovies = data.movies["Overall"];

    if (overallTvShows && overallTvShows.length > 0) {
      sourceImage = overallTvShows[0].image;
    } else if (overallMovies && overallMovies.length > 0) {
      sourceImage = overallMovies[0].image;
    }
  }

  return {
    title: titleFromFilename,
    image: sourceImage,
  };
}

/**
 * Main function to create a video
 */
export async function createVideo(): Promise<void> {
  try {
    console.log("\n🎬 Goodwatch Video Creator\n");

    // Select output file
    const selectedFile = await selectOutputFile();

    // Read the data
    const filePath = path.join(process.cwd(), selectedFile);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data: RelatedContent = JSON.parse(fileContent);

    // Extract source info
    const { title, image } = extractSourceInfo(data, selectedFile);

    console.log(`📺 Source: ${title}`);
    if (!image) {
      console.log(
        "⚠️  Warning: No source image found. The video may not display correctly."
      );
    }

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate output filename
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const outputFilename = `${selectedFile.replace(
      ".output.json",
      ""
    )}-${timestamp}.mp4`;
    const outputPath = path.join(outputDir, outputFilename);

    console.log("\n🎥 Starting video render...\n");

    // Render the video
    await renderVideo({
      outputPath,
      data,
      sourceTitle: title,
      sourceImage: image,
    });

    console.log("\n🎉 Done!\n");
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}
