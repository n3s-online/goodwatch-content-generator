# Goodwatch Content Generator

A Node.js TypeScript CLI tool that parses related TV shows and movies from Goodwatch pages, organized by filter categories.

## Features

- Parse related content from Goodwatch show/movie pages
- Extract structured data including name, link, and image
- Organize content by filter categories (Overall, Intrigue, Tension, Mystery, etc.)
- Supports both TV shows and movies
- TypeScript-based for type safety
- Command-line interface for easy usage

## Installation

This project uses pnpm as the package manager.

```bash
pnpm install
```

## Usage

### Run the parser with a local HTML file:

```bash
pnpm start -- <url> --file <path-to-html-file>
```

Example:
```bash
pnpm start -- https://goodwatch.app/show/66732-stranger-things --file docs/dom/goodwatch.app_show_66732-stranger-things.html
```

### Run tests:

```bash
pnpm test
```

### Build the project:

```bash
pnpm run build
```

## Output Format

The tool outputs JSON organized by filter categories. Each category contains arrays of movies and TV shows:

```json
{
  "movies": {
    "Overall": [
      {
        "name": "Movie Title (Year)",
        "link": "https://goodwatch.app/movie/id-slug",
        "image": "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/...",
        "goodwatch_score": 84
      }
    ],
    "Intrigue": [
      {
        "name": "Another Movie (Year)",
        "link": "https://goodwatch.app/movie/id-slug",
        "image": "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/...",
        "goodwatch_score": 91
      }
    ]
  },
  "tv_shows": {
    "Overall": [
      {
        "name": "Show Title (Year)",
        "link": "https://goodwatch.app/show/id-slug",
        "image": "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/...",
        "goodwatch_score": 81
      }
    ],
    "Intrigue": [
      {
        "name": "Another Show (Year)",
        "link": "https://goodwatch.app/show/id-slug",
        "image": "https://www.themoviedb.org/t/p/w300_and_h450_bestv2/...",
        "goodwatch_score": 82
      }
    ]
  }
}
```

### Data Fields

Each media item includes the following fields:

- **name**: Title and year of the show/movie (e.g., "The Mandalorian (2019)")
- **link**: Full URL to the Goodwatch page
- **image**: URL to the poster image from TMDB
- **goodwatch_score**: Numerical rating from Goodwatch (typically 0-100)

### Filter Categories

The parser extracts content organized by the following Goodwatch filter categories:

- **Overall**: Similar vibe
- **Intrigue**: Curiosity and investigative pull
- **Tension**: Edge-of-your-seat suspense and pressure
- **Mystery**: Whodunnits and unraveling secrets
- **Uncanny**: Eerie, unsettling strangeness
- **Psychological**: Inner worlds and mind games
- **Fantasy**: Mythic worlds and magical systems
- **World Immersion**: Depth and sensory richness of setting
- **Adrenaline**: High-energy, pulse-pounding intensity

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
