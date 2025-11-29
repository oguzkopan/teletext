# Teletext Page Structure

All pages are now defined in the `lib` directory and served through the page registry system. Firebase Functions are only used for dynamic content (live data, AI responses, etc.).

## Page Registry System

The page registry (`lib/page-registry.ts`) is the central hub for all static pages. It maps page numbers to factory functions that generate page content.

### How It Works

1. **Page Request**: User navigates to a page (e.g., types "202")
2. **API Route**: `/api/page/[pageNumber]/route.ts` receives the request
3. **Registry Lookup**: Checks if page exists in `lib/page-registry.ts`
4. **Page Generation**: If found, calls the factory function to generate the page
5. **Fallback**: If not in registry, forwards to Firebase Functions for dynamic content

## Implemented Pages

### System Pages (1xx)
- **100**: Main Index - Entry point with all categories
- **101**: System Status & Diagnostics

### News Pages (2xx)
- **200**: News Headlines & Breaking News
- **201**: UK News & Local Updates
- **202**: World News & International
- **203**: Local News & Community
- **210-214**: News article detail pages (accessed via single-digit navigation from news pages)

### Sports Pages (3xx)
- **300**: Sport Headlines & Live Scores
- **301-304**: Coming soon (Football, Cricket, Tennis, Live Scores)

### Markets Pages (4xx)
- **400**: Markets Overview & Indices
- **401-404**: Coming soon (Stocks, Crypto, Commodities, Void)
- **420-423**: Coming soon (Weather pages)

### AI Pages (5xx)
- **500**: AI Oracle Index
- **501**: AI Chat Interface

### Games Pages (6xx)
- **600**: Games & Quizzes Hub
- **601**: Quiz of the Day
- **610**: Bamboozle Quiz Game
- **620**: Random Facts & Trivia

### Settings Pages (7xx)
- **700**: Settings & Preferences
- **701**: Theme Customization
- **710**: Coming soon (Keyboard Shortcuts)
- **720**: Coming soon (Animation Settings)

### Developer Tools (8xx)
- **800**: Developer Tools Index
- **801**: Coming soon (API Explorer)
- **810**: Coming soon (Console Logs)
- **820**: Coming soon (API Documentation)

### Help Pages (9xx)
- **999**: Help & Documentation

## Navigation System

### Input Modes

Pages can specify their input mode in metadata:

- **single**: 1-digit input (e.g., menu options 1-9)
  - Used for: News articles, quiz answers, menu selections
  - Example: On page 202, pressing "1" navigates to article 1 (page 202-1)

- **double**: 2-digit input (e.g., sub-pages 10-99)
  - Used for: Sub-sections within a category
  - Example: Page 20 for news sub-categories

- **triple**: 3-digit input (standard page navigation 100-899)
  - Used for: Main page navigation
  - Example: Typing "202" navigates to World News

### Navigation Features

1. **Direct Page Entry**: Type 3-digit page number (e.g., "202")
2. **Single-Digit Options**: On menu pages, press 1-9 for quick navigation
3. **Colored Buttons**: Red/Green/Yellow/Blue for quick links
4. **Arrow Keys**: 
   - Up/Down: Navigate multi-page articles
   - Left: Back to previous page
5. **History**: Maintains navigation history for back/forward

## Adding New Pages

To add a new page:

1. Create a factory function in the appropriate file:
   - `lib/news-pages.ts` for news (2xx)
   - `lib/sports-pages.ts` for sports (3xx)
   - `lib/markets-pages.ts` for markets (4xx)
   - `lib/services-pages.ts` for AI/Games/Settings/Dev (5xx-8xx)
   - `lib/system-pages.ts` for system pages (1xx, 9xx)
   - `lib/additional-pages.ts` for miscellaneous pages

2. Register the page in `lib/page-registry.ts`:
   ```typescript
   pageRegistry.set('XXX', createYourPageFunction);
   ```

3. The page will automatically be available for navigation

## Page Format

All pages follow the full-screen layout format:
- No 40×24 character constraints
- Full viewport width and height
- Responsive text sizing
- Proper color coding with `{color}` tags
- Navigation hints at the bottom
- Colored button indicators (🔴🟢🟡🔵)

## Benefits of This Architecture

1. **Fast Loading**: Static pages load instantly from memory
2. **No Firebase Dependency**: Core navigation works without Firebase
3. **Easy Maintenance**: All pages in one place
4. **Type Safety**: TypeScript ensures page structure consistency
5. **Flexible**: Easy to add new pages or modify existing ones
6. **Testable**: Pages can be unit tested without API calls
