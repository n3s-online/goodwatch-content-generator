# Goodwatch Content Generator

A Node.js TypeScript CLI tool that parses related TV shows and movies from Goodwatch pages.

## Features

- Parse related content from Goodwatch show/movie pages
- Extract structured data including name, link, and image
- Supports both TV shows and movies
- TypeScript-based for type safety
- Command-line interface for easy usage

## Installation

```bash
npm install
```

## Usage

### Run the parser with a local HTML file:

```bash
npm start -- <url> --file <path-to-html-file>
```

Example:
```bash
npm start -- https://goodwatch.app/show/66732-stranger-things --file docs/dom/goodwatch.app_show_66732-stranger-things.html
```

### Run tests:

```bash
npm test
```

### Build the project:

```bash
npm run build
```

## Output Format

The tool outputs JSON in the following format:

```json
{
  "movies": [
    {
      "name": "Movie Title (Year)",
      "link": "https://goodwatch.app/movie/id-slug",
      "image": "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/..."
    }
  ],
  "tv_shows": [
    {
      "name": "Show Title (Year)",
      "link": "https://goodwatch.app/show/id-slug",
      "image": "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/..."
    }
  ]
}
```

## Project Structure

```
.
├── src/
│   ├── cli.ts        # CLI entry point
│   ├── parser.ts     # HTML parsing logic
│   └── test.ts       # Test suite
├── dist/             # Compiled JavaScript (generated)
├── docs/
│   └── dom/          # Sample HTML files for testing
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

1. The tool uses Cheerio to parse HTML content
2. It finds the `#related` section in the Goodwatch page
3. Extracts all links to shows (`/show/`) and movies (`/movie/`)
4. For each item, it collects:
   - Name (from the title span)
   - Link (from the href attribute, converted to full URL)
   - Image (from the poster image src)

## Dependencies

- **cheerio**: Fast, flexible HTML parsing
- **commander**: Command-line interface framework
- **typescript**: Type safety and modern JavaScript features
- **ts-node**: TypeScript execution for development

## Development

The project uses TypeScript with strict mode enabled. All source files are in the `src/` directory and compiled output goes to `dist/`.

## License

ISC
