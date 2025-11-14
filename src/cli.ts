#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
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
        // For now, we'll support parsing from local files
        // In a production version, you would fetch the URL here
        console.error('Error: URL fetching not implemented yet. Use --file option to parse local HTML files.');
        console.error('Example: goodwatch-parser <url> --file docs/dom/goodwatch.app_show_66732-stranger-things.html');
        process.exit(1);
      }

      const result = parseRelatedContent(html);
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
