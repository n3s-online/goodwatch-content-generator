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

**Scene Order:** Hook (3s) → Category 1 (4s) → Category 2 (4s) → Category 3 (4s) → Overall (4s) → Closing (5s)

**Total Duration:** ~24 seconds

### Scene 1: Hook (3 seconds)

**Purpose:** Immediately establish what content this video is about

**Layout:**

```
┌─────────────────────────┐
│  "If you liked"         │ ← White, 64px, font-weight 700, centered
│                         │   Text shadow for readability
│                         │
│   [MAIN CONTENT IMAGE]  │ ← Full poster/cover (contained, not cropped)
│    (Full Poster)        │   Takes up 60% of screen height
│                         │   75% width, centered
│                         │   Maintains aspect ratio
│                         │   Zooms from 1.0x to 1.08x over 3 seconds
│                         │   Padding (40px top, 20px sides)
│                         │   Stronger shadow/glow effect
│                         │
│      [TITLE]            │ ← White, 96px, font-weight 900, centered
│                         │   Text shadow, subtle pulse at 1.5s
│ "then you need to       │ ← White, 56px, font-weight 600, centered
│      watch..."          │   Text shadow
└─────────────────────────┘
```

**Animation:**

- 0.0s: Full poster image zooms in (1.0x to 1.08x scale) over 3 seconds
- 0.1s: All text fades in quickly from bottom (0.3s duration)
- 1.5s: Title subtle pulse animation (1.0x to 1.02x scale)
- 2.5s: Slight blur/fade begins as transition to Scene 2

**Elements:**

- Main content poster image (full image visible, contained with padding, maintains aspect ratio)
- Title text (truncate at 22 characters if needed)
- Copy layout (top to bottom): "If you liked" → [Image] → [Title] → "then you need to watch..."
- All text elements have text shadows (2px blur, rgba(0,0,0,0.9)) for better readability
- Spacing: 30px margin between sections for better vertical distribution

---

### Scene 2-4: Category-Specific Recommendations (4 seconds each × 3 = 12 seconds)

**Purpose:** Show recommendations based on specific DNA attributes

**Layout:**

```
┌─────────────────────────┐
│                         │
│     [CATEGORY NAME]     │ ← Centered, white, 108px bold
│                         │
│  ┌──────────┬──────────┐│
│  │  MOVIE   │  MOVIE   ││ ← 2 movie posters (full aspect ratio)
│  │   [1]    │   [2]    ││   Each ~450x675px (maintains poster ratio, 10% smaller)
│  │  Title   │  Title   ││   Score badge top-right
│  │   84     │   92     ││   Title below (white, 40px, 2x larger)
│  └──────────┴──────────┘│
│                         │
│  ┌──────────┬──────────┐│
│  │   SHOW   │   SHOW   ││ ← 2 TV show posters (full aspect ratio)
│  │   [1]    │   [2]    ││   Same styling as movies
│  │  Title   │  Title   ││
│  │   88     │   79     ││
│  └──────────┴──────────┘│
│                         │
└─────────────────────────┘
```

**Category Examples:**

- "Tension"
- "Intrigue"
- "Fantasy"
- "Mystery"
- "Dark Mood"
- "Fast-Paced"
- (Use actual categories from the GoodWatch page)

**Animation:**

- 0.0s: Category label fades in
- 0.4s: Movie row slides in from right (no breathing/zoom animation during scene)
- 0.8s: TV show row slides in from right (no breathing/zoom animation during scene)
- 3.5s: Begin fade transition to next category

**Elements:**

- **Category label:** Centered at top, white, 108px bold (3x larger), letter-spacing: 2px
- **Cover images:** Full poster aspect ratio (~450x675px each, 10% smaller), maintains original proportions
- **Score badges:**
  - Position: Top-right corner of each image
  - Style: Circular, 50px diameter, green background `#5cb85c`
  - Text: White, 20px bold, format: "84"
  - Border: 2px solid white
- **Titles:** Below each image, white, 40px (2x larger), font-weight 600, max 1 line (truncate with "...")
- **Spacing:** 20px padding between all elements
- **Note:** No breathing/zoom animation during the scene - only intro slide animation
- **Grid:** 2x2 layout, fills full screen height

---

### Scene 5: Overall Top Picks (4 seconds)

**Purpose:** Show the 4 most universally similar recommendations

**Layout:** Same as Scenes 2-4, but with "Overall" as the category label

**Animation:**

- 0.0s: "Overall" label fades in
- 0.4s: Movie row slides in from right (no breathing/zoom animation during scene)
- 0.8s: TV show row slides in from right (no breathing/zoom animation during scene)

**Elements:** Same structure as category scenes, with "Overall" label (108px bold)

---

### Scene 6: Closing (5 seconds)

**Purpose:** Quick visual closure and brand reinforcement

**Layout:**

```
┌─────────────────────────┐
│                         │
│ "Your Recommendations"  │ ← White, 56px bold, centered
│                         │
│    [3x4 grid of all]    │ ← Mosaic of all 12 recommendations
│    [cover thumbnails]   │    shown (small, 3×4 grid)
│                         │
│                         │
│      GoodWatch logo     │ ← Centered, medium size
│                         │
└─────────────────────────┘
```

**Animation:**

- 0.0s: All recommendation covers scale down and arrange into grid (0.0s to 0.5s)
- 0.2s: "Your Recommendations" title fades in
- 0.5s: GoodWatch logo fades in
- 0.5s-3.5s: Hold on screen (3 seconds)
- 3.5s-5.0s: Fade to black (1.5 seconds)

**Elements:**

- Title text: "Your Recommendations" (white, 56px bold, centered at top)
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

1. Scene 1: Hook with source content
2. Scenes 2-4: Top 3 DNA categories (excluding "Overall"), ordered by relevance/prominence
3. Scene 5: "Overall" category (moved to end for broader appeal)
4. Scene 6: Closing with all recommendations
5. If fewer than 3 additional categories exist, reduce total video length accordingly
6. Do not re-use any movies or shows between scenes, if its been used in a previous scene then choose the next movie/show

---

## Design Details

### Typography

- **Main Title (Scene 1):** 48px bold, white, 2px text shadow for readability
- **Hook Text:** 32px regular, white
- **Category Labels:** 36px bold, white, letter-spacing: 1px, centered
- **Recommendation Titles:** 20px regular, white
- **Scores:** 20px bold, white

### Image Handling

- **Scene 1 Cover Image:**
  - Display full poster/cover (no cropping)
  - Maintain original aspect ratio
  - Contain within available space with padding
  - Apply subtle vignette (darker edges) for depth
  - Ensure minimum quality 720p
- **Recommendation Cover Images (Scenes 2-5):**
  - Display full poster aspect ratio (typically 2:3)
  - Maintain original proportions (no cropping to landscape)
  - Each poster approximately 500x750px
  - Apply subtle vignette for depth
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
