# Navigation Guide - Modern Teletext

## How Navigation Works Now

All pages are now served from the `lib` directory through the page registry system. Navigation works seamlessly with both single-digit and multi-digit input.

## Navigation Methods

### 1. Three-Digit Page Numbers (Standard Navigation)

Type any 3-digit page number to navigate:
- `100` - Main Index
- `200` - News Headlines
- `202` - World News
- `300` - Sports
- `400` - Markets
- `500` - AI Oracle
- `600` - Games
- `700` - Settings
- `800` - Developer Tools
- `999` - Help

**How it works:**
1. Type the first digit (e.g., `2`)
2. Type the second digit (e.g., `0`)
3. Type the third digit (e.g., `2`)
4. Page automatically loads when you complete the 3rd digit

### 2. Single-Digit Options (Quick Navigation)

On menu pages (like news pages), press a single digit to navigate to that option:

**Example on Page 202 (World News):**
- Press `1` → Navigate to first article (page 202-1)
- Press `2` → Navigate to second article (page 202-2)
- Press `3` → Navigate to third article (page 202-3)

**How it works:**
- The page detects it's in "single-digit mode"
- When you press a digit, it immediately navigates
- No need to press Enter or complete 3 digits

### 3. Colored Buttons (Fastext Navigation)

Use the colored buttons for quick links shown at the bottom of each page:
- **Red Button** (🔴) - Usually "INDEX" or main category
- **Green Button** (🟢) - Related page or sub-category
- **Yellow Button** (🟡) - Alternative page or option
- **Blue Button** (🔵) - Additional page or help

### 4. Arrow Keys

- **Left Arrow** - Go back to previous page
- **Up Arrow** - Previous page in multi-page articles
- **Down Arrow** - Next page in multi-page articles

## Available Pages

### Fully Implemented Pages

These pages are complete and ready to use:

- **100** - Main Index (entry point)
- **101** - System Status
- **200** - News Headlines
- **201** - UK News
- **202** - World News ✨ (Try pressing 1-5 for articles!)
- **203** - Local News
- **300** - Sports Index
- **400** - Markets Index
- **500** - AI Oracle Index
- **600** - Games Index
- **620** - Random Facts & Trivia
- **700** - Settings Index
- **701** - Theme Customization
- **800** - Developer Tools Index
- **999** - Help & Documentation

### Coming Soon Pages

These pages show "Coming Soon" placeholders:

- **210-214** - News article details
- **301-304** - Sports sub-pages
- **401-404** - Markets sub-pages
- **420-423** - Weather pages
- **501** - AI Chat Interface
- **601** - Quiz of the Day
- **610** - Bamboozle Quiz
- **710** - Keyboard Shortcuts
- **720** - Animation Settings
- **801** - API Explorer
- **810** - Console Logs
- **820** - API Documentation

## Troubleshooting

### "Page not loading"
- Make sure you're typing a valid 3-digit number (100-899)
- Check that the page exists in the registry
- Try navigating to page 100 (main index) first

### "Single-digit navigation not working"
- Make sure you're on a page that supports single-digit input
- Look for numbered options (1, 2, 3, etc.) on the page
- The page must be in "single-digit mode" (check page metadata)

### "Navigation is slow"
- First load may take a moment
- Subsequent navigation should be instant (pages are cached)
- Check your internet connection for dynamic content

## Technical Details

### Input Modes

Pages can specify their input mode:

1. **Single-digit mode** (`inputMode: 'single'`)
   - Accepts 1 digit (0-9)
   - Navigates immediately on digit press
   - Used for: Menu options, quiz answers, article selection

2. **Double-digit mode** (`inputMode: 'double'`)
   - Accepts 2 digits (00-99)
   - Auto-navigates when 2nd digit is entered
   - Used for: Sub-categories

3. **Triple-digit mode** (`inputMode: 'triple'`) - DEFAULT
   - Accepts 3 digits (100-899)
   - Auto-navigates when 3rd digit is entered
   - Used for: Standard page navigation

### Page Registry

All pages are registered in `lib/page-registry.ts`. To add a new page:

1. Create a factory function in the appropriate file
2. Register it in the page registry
3. The page is immediately available for navigation

### No Firebase Dependency

Core navigation works entirely from the `lib` directory without Firebase. Firebase Functions are only used for:
- Live data (sports scores, market prices)
- AI-generated content
- Dynamic content that changes frequently

## Quick Start

1. **Start at the index**: Navigate to page `100`
2. **Explore categories**: Use colored buttons or type page numbers
3. **Try single-digit navigation**: Go to page `202` and press `1`
4. **Use back button**: Press left arrow to go back
5. **Get help**: Navigate to page `999` for full documentation
