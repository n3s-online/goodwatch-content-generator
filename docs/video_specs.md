# GoodWatch Programmatic Video Specifications

## "If You Liked X" Recommendation Videos

### Overview

Generate short-form vertical videos (20-30 seconds) showcasing content recommendations from GoodWatch.app using the platform's DNA-based recommendation system.

---

## Technical Specifications

### Video Format

- **Aspect Ratio:** 9:16 (vertical)
- **Resolution:** 1080x1920 pixels
- **Duration:** 25-28 seconds (target)
- **Frame Rate:** 30fps
- **Format:** MP4 (H.264 codec)
- **Audio:** Optional background music (cinematic/ambient, low volume)

### Brand Colors

- **Background:** `#1a1d29` (dark navy/charcoal)
- **Accent/Score Color:** `#5cb85c` (vibrant green - matches GoodWatch logo)
- **Primary Text:** `#ffffff` (white)
- **Secondary Text:** `#a0a0a0` (light gray)
- **Overlay/Gradient:** `rgba(0, 0, 0, 0.6)` for text readability over images

---

## Scene Breakdown & Timing

**Scene Order:** Hook → Category 1 → Category 2 → Category 3 → Overall → Closing

### Scene 1: Hook (4 seconds)

**Purpose:** Immediately establish what content this video is about

**Layout:**

```
┌─────────────────────────┐
│                         │
│  "If you liked"         │ ← White, 32px, centered
│                         │
│   [MAIN CONTENT IMAGE]  │ ← Full poster/cover (contained, not cropped)
│    (Full Poster)        │   Centered with padding, maintains aspect ratio
│                         │   Zooms from 1.0x to 1.05x over 4 seconds
│                         │
│      [TITLE]            │ ← White, 48px bold, centered
│                         │
│ "then you need to       │ ← White, 32px, centered
│      watch..."          │
│                         │
└─────────────────────────┘
```

**Animation:**

- 0.0s: Full poster image zooms in slightly (1.0x to 1.05x scale) over 4 seconds
- 0.5s: Text fades in from bottom
- 3.0s: Slight blur/fade begins as transition to Scene 2

**Elements:**

- Main content poster image (full image visible, contained with padding, maintains aspect ratio)
- Title text (max 2 lines, truncate if needed)
- Copy layout (top to bottom): "If you liked" → [Image] → [Title] → "then you need to watch..."

---

### Scene 2: Overall Top Picks (7 seconds)

**Purpose:** Show the 4 most universally similar recommendations

**Layout:**

```
┌─────────────────────────┐
│ ┌─────────┐             │ ← Mini main content thumbnail
│ │ [MAIN] │  "Overall"   │    (100x150px, top-left corner)
│ └─────────┘             │    + Category label (white, 28px)
│                         │
│  ┌────────┬────────┐    │
│  │ MOVIE  │ MOVIE  │    │ ← 2 movie covers
│  │  [1]   │  [2]   │    │   (480x270px each)
│  │ Title  │ Title  │    │   Score badge top-right
│  │  84    │  92    │    │   Title below (white, 20px)
│  └────────┴────────┘    │
│                         │
│  ┌────────┬────────┐    │
│  │  SHOW  │  SHOW  │    │ ← 2 TV show covers
│  │  [1]   │  [2]   │    │   (same styling as movies)
│  │ Title  │ Title  │    │
│  │  88    │  79    │    │
│  └────────┴────────┘    │
└─────────────────────────┘
```

**Animation:**

- 0.0s: Category label "Overall" slides in from left
- 0.3s: Main content thumbnail scales in from top-left
- 0.5s: Movie row slides in from right
- 1.2s: TV show row slides in from right
- All elements have subtle "breathing" scale animation (1.0x to 1.02x, 2s loop)

**Elements:**

- **Mini main content thumbnail:** 100x150px, top-left with 20px padding
- **Category label:** "Overall" in white, 28px, positioned next to mini thumbnail
- **Row labels:** "MOVIES" and "TV SHOWS" on the left edge (rotated 90°, gray, 16px, uppercase)
- **Cover images:** 480x270px each (landscape crop of poster)
- **Score badges:**
  - Position: Top-right corner of each image
  - Style: Circular, 50px diameter, green background `#5cb85c`
  - Text: White, 20px bold, format: "84"
  - Border: 2px solid white
- **Titles:** Below each image, white, 20px, max 1 line (truncate with "...")
- **Spacing:** 20px padding between all elements

---

### Scene 3-5: Category-Specific Recommendations (4 seconds each × 3 = 12 seconds)

**Purpose:** Show recommendations based on specific DNA attributes

**Layout:** Same as Scene 2, but with different category labels

**Category Examples:**

- "Tension"
- "Intrigue"
- "Fantasy"
- "Mystery"
- "Dark Mood"
- "Fast-Paced"
- (Use actual categories from the GoodWatch page)

**Animation:**

- 0.0s: Previous scene fades out slightly (opacity 1.0 to 0.3)
- 0.2s: New category label cross-fades in
- 0.4s: Movie row cross-fades in with slide from right
- 0.8s: TV show row cross-fades in with slide from right
- 3.5s: Begin fade transition to next category

**Elements:** Same structure as Scene 2, only category label changes

---

### Scene 6: Closing (2 seconds)

**Purpose:** Quick visual closure and brand reinforcement

**Layout:**

```
┌─────────────────────────┐
│                         │
│                         │
│    [4x4 grid of all]    │ ← Mosaic of all 12 recommendations
│    [cover thumbnails]   │    shown (small, 3×4 grid)
│                         │
│                         │
│      GoodWatch logo     │ ← Centered, medium size
│                         │
└─────────────────────────┘
```

**Animation:**

- 0.0s: All recommendation covers scale down and arrange into grid
- 0.5s: GoodWatch logo fades in
- 1.5s: Fade to black

**Elements:**

- 12 mini cover thumbnails (from all scenes) in 3 columns × 4 rows
- GoodWatch logo (green circle with white G)

---

## Copy Guidelines

### Scene 1 Hook Variations

Choose randomly from:

- "If you loved **[Title]**"
- "Obsessed with **[Title]**?"
- "Finished **[Title]**?"
- "Can't get enough of **[Title]**?"

### Category Label Copy

Use exact category names from GoodWatch DNA system:

- Display as-is from the "Related" section tabs
- Capitalize first letter
- Examples: "Tension", "Mystery", "Dark Mood", "Fast-Paced"

### Title Handling

- **Max length:** 25 characters
- **Truncation:** Use "..." if longer
- **Font:** Sans-serif (Helvetica Neue, Arial, or similar)
- **Weight:** Bold for main title, Regular for recommendations

---

### Scene Selection Logic

1. Always use "Overall" category for Scene 2
2. For Scenes 3-5, select the top 3 DNA categories (excluding "Overall")
3. Categories should be ordered by relevance/prominence on the GoodWatch page
4. If fewer than 3 additional categories exist, reduce total video length accordingly
5. Do not re-use any movies or shows between scenes, if its been used in a previous scene then choose the next movie/show

---

## Design Details

### Typography

- **Main Title (Scene 1):** 48px bold, white, 2px text shadow for readability
- **Hook Text:** 32px regular, white
- **Category Labels:** 28px bold, white, letter-spacing: 1px
- **Recommendation Titles:** 20px regular, white
- **Scores:** 20px bold, white
- **Row Labels:** 16px uppercase, gray `#a0a0a0`, rotated -90deg

### Image Handling

- **Cover Images:**
  - Crop to 16:9 landscape format (centered crop)
  - Apply subtle vignette (darker edges) for depth
  - Ensure minimum quality 720p
  - Fallback: Use solid color with title text if image unavailable
- **Score Badges:**
  - Position: Top-right corner, 10px from edges
  - Circle diameter: 50px
  - Background: `#5cb85c` with 90% opacity
  - Border: 2px solid white
  - Icon: GoodWatch "G" logo

### Animations & Transitions

**Timing Function:** ease-in-out for all animations

**Scene Transitions:**

- Cross-fade: 0.3s
- Slide animations: 0.5s
- Scale animations: 0.4s

**Element Animations:**

- Fade in: 0.3s
- Slide in: 0.4s
- "Breathing" scale: 2s loop (1.0x to 1.02x)

**Engagement Optimizations:**

- Keep main content visible throughout via mini thumbnail
- Stagger element appearances (not all at once)
- Continuous subtle motion to hold attention
- Quick cuts between categories (4s each) for pacing

---

## Visual Effects

### Overlays & Shadows

- **Text shadows:** 2px blur, `rgba(0, 0, 0, 0.8)`
- **Image shadows:** 4px blur, `rgba(0, 0, 0, 0.6)`, offset 2px down
- **Vignette:** Radial gradient from center, `rgba(0, 0, 0, 0)` to `rgba(0, 0, 0, 0.4)`

### Background

- Base color: `#1a1d29`
- Subtle noise texture (5% opacity) for texture
- Optional: Blurred version of main content cover as background (10% opacity)

### Polish Elements

- **Corner accents:** Thin green lines (`#5cb85c`) in top-left and bottom-right corners (2px width, 60px length)
- **Scene dividers:** Horizontal green line (2px, 50% width, centered) during category transitions
- **Glow effects:** Subtle green glow on score badges (box-shadow: `0 0 10px rgba(92, 184, 92, 0.3)`)
