#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { parseRelatedContent } from './parser';

const program = new Command();

program
  .name('goodwatch-parser')
  .description('Parse related shows and movies from Goodwatch pages')
  .version('1.0.0');

program
  .argument('<url>', 'Goodwatch URL (e.g., https://goodwatch.app/show/66732-stranger-things)')
  .option('-f, --file <path>', 'Parse from local HTML file instead of fetching URL')
  .action(async (url: string, options: { file?: string }) => {
    try {
      let html: string;

      if (options.file) {
        // Parse from local file
        if (!fs.existsSync(options.file)) {
          console.error(`Error: File not found: ${options.file}`);
          process.exit(1);
        }
        html = fs.readFileSync(options.file, 'utf-8');
      } else {
        // Fetch URL
        // Validate URL format
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          console.error('Error: URL must start with http:// or https://');
          process.exit(1);
        }

        // Optional: Validate it's a Goodwatch URL
        if (!url.includes('goodwatch.app')) {
          console.error('Warning: URL does not appear to be from goodwatch.app');
        }

        console.error(`Fetching URL: ${url}`);

        try {
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
              'Accept-Encoding': 'gzip, deflate, br',
              'DNT': '1',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'none',
              'Sec-Fetch-User': '?1',
              'Cache-Control': 'max-age=0'
            },
            timeout: 30000, // 30 second timeout
            maxRedirects: 5,
            validateStatus: (status) => status < 500 // Accept any status code less than 500
          });

          if (response.status === 403) {
            console.error('Error: Access forbidden (403). The website may be blocking automated requests.');
            console.error('Try using the --file option to parse a locally saved HTML file instead.');
            process.exit(1);
          }

          if (response.status !== 200) {
            console.error(`Error: HTTP ${response.status} - ${response.statusText}`);
            process.exit(1);
          }

          html = response.data;
          console.error('Successfully fetched URL');
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              console.error(`Error: HTTP ${error.response.status} - ${error.response.statusText}`);
            } else if (error.request) {
              console.error('Error: No response received from server');
            } else {
              console.error(`Error: ${error.message}`);
            }
          } else {
            console.error(`Error: ${error instanceof Error ? error.message : error}`);
          }
          process.exit(1);
        }
      }

      const result = parseRelatedContent(html);

      // Check if results are completely empty
      const hasMovies = Object.keys(result.movies).length > 0;
      const hasShows = Object.keys(result.tv_shows).length > 0;

      if (!hasMovies && !hasShows) {
        console.error('\n⚠️  WARNING: Results are completely empty!');
        console.error('This could mean:');
        console.error('  1. The URL does not have a "Related" section');
        console.error('  2. The page structure has changed');
        console.error('  3. The website is blocking or returning different content');
        console.error('  4. The URL is incorrect (e.g., using /movie/ instead of /show/)');
        console.error('\nTip: Try saving the HTML with your browser and using the --file option to parse it locally.');
      }

      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
