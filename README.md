# Modern Teletext (DeadText)

> Resurrecting the classic teletext broadcast technology with modern capabilities

A nostalgic web application that faithfully recreates the 40×24 character grid interface and three-digit page navigation of 1970s-era teletext services (like BBC Ceefax and ORACLE), enhanced with contemporary features including live API integrations, AI-powered assistance, interactive games, and authentic CRT visual effects.

## ✨ Features

### Core Features
- **Authentic Teletext Experience**: 40×24 character grid with monospaced font and classic color palette
- **Three-Digit Navigation**: Navigate using page numbers (100-899) via keyboard or on-screen remote
- **Live Content Integration**: Real-time news, sports scores, market data, and weather
- **AI Oracle**: Conversational AI assistant powered by Google Gemini, accessible through menu-driven numeric input
- **Interactive Games**: Quiz games, branching story adventures, and random facts
- **CRT Visual Effects**: Scanlines, screen curvature, noise, and glitch effects for authentic retro feel
- **Multiple Themes**: Classic Ceefax, ORF, High Contrast, and Haunting Mode
- **Offline Support**: Service worker caching for previously viewed pages
- **Easter Eggs**: Hidden horror-themed pages (404, 666) with AI-generated content
- **Performance Optimized**: Page preloading, request cancellation, and lazy-loaded adapters

### UX Redesign Features (New!)
- **Full-Screen Layout**: 90%+ screen utilization with optimized spacing and minimal padding
- **Theme-Specific Animations**: Unique animations for each theme (glitch, wipe, fade, slide)
- **Enhanced Navigation**: Breadcrumb trails, page position indicators, arrow indicators, contextual help
- **Visual Feedback**: Input buffer display, button press animations, loading indicators, success/error feedback
- **Content Type Indicators**: Visual icons for NEWS (📰), SPORT (⚽), MARKETS (📈), AI (🤖), GAMES (🎮)
- **Animated Content**: Weather icons, sports live indicators, market trends, AI typing animation
- **Kiroween Theme**: Halloween decorations (🎃👻🦇), glitch effects, floating sprites, chromatic aberration
- **Accessibility Features**: Reduced motion support, animation controls, keyboard navigation, screen reader optimization
- **Interactive Elements**: Visual highlighting with brackets, colors, and backgrounds for all clickable items

See [UX_REDESIGN_OVERVIEW.md](./UX_REDESIGN_OVERVIEW.md) for complete details.

## 📖 Table of Contents

- [Features](#-features)
- [Page Directory](#-page-directory)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Technology Stack](#-technology-stack)
- [API Documentation](#-api-documentation)
- [Firestore Data Models](#-firestore-data-models)
- [Development](#-development)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Kiro Usage](#-kiro-usage)
- [License](#-license)

## 📺 Page Directory

### System Pages (100-199)
- **100**: Main Index - Magazine listings and navigation
- **101**: How It Works - Explanation of teletext concept
- **120**: Emergency Bulletins - Breaking alerts and emergency information
- **199**: About/Credits - Project information and source code
- **404**: Error Page - Animated glitch effects with horror ASCII art
- **999**: Help - Navigation instructions and keyboard shortcuts

### News (200-299)
- **200**: News Index - Category selection
- **201**: Top Headlines - Latest breaking news
- **202-203**: World/Local News
- **210-219**: Topic-specific news (tech, business, entertainment, science)

### Sports (300-399)
- **300**: Sports Index
- **301**: Live Scores - Real-time match updates
- **302**: League Tables - Team rankings
- **310**: Team Watchlist Configuration
- **311-315**: Dedicated team pages

### Markets (400-499)
- **400**: Markets Summary
- **401**: Cryptocurrency Prices - Real-time crypto data with % changes
- **402**: Stock Market Data
- **410**: Foreign Exchange Rates - 10 major currency pairs
- **420-449**: Weather forecasts for major cities

### AI Oracle (500-599)
- **500**: AI Index - Service selection menu
- **505**: Spooky Story Generator - AI-generated horror stories
- **510-519**: Q&A flows with topic selection
- **520-529**: Conversation History - View and manage past AI interactions

### Games (600-699)
- **600**: Games Index
- **601**: Quiz of the Day - Daily trivia challenge
- **610**: Bamboozle Game - Branching quiz adventure
- **620**: Random Facts - Interesting facts from various topics

### Settings (700-799)
- **700**: Theme Selection - Ceefax, ORF, High Contrast, Haunting Mode
- **701**: CRT Effects Controls - Scanlines, curvature, noise adjustments
- **710**: Custom Shortcuts Configuration
- **720**: Keyboard Shortcuts Reference

### Developer Tools (800-899)
- **800**: API Explorer Index
- **801**: Raw JSON - Current page data
- **802**: API Documentation - Endpoint reference
- **803**: Example Requests/Responses

### Easter Eggs
- **666**: Horror Page - AI-generated spooky content with disturbing visuals

## 🎮 Navigation Guide

### Input Methods

**3-Digit Page Numbers** (Required for all page navigation)
- Enter any page from 100-899
- Example: Type `2` `0` `1` to navigate to page 201
- Auto-navigates after 3rd digit or press Enter

**Arrow Keys**
- **↑ UP**: Previous page in multi-page sequence (when "▲ BACK" indicator shown)
- **↓ DOWN**: Next page in multi-page sequence (when "▼ MORE" indicator shown)
- **← LEFT**: Back in history
- **→ RIGHT**: Forward in history

**Color Buttons** (Fastext Navigation)
- **R** (Red): First link (usually INDEX or BACK)
- **G** (Green): Second link (usually category or action)
- **Y** (Yellow): Third link (usually navigation)
- **B** (Blue): Fourth link (usually BACK or HOME)

**Other Keys**
- **Enter**: Confirm 3-digit page input
- **F1-F10**: Quick access to favorite pages (configurable)

### Multi-Page Articles

Long articles are automatically split into multiple pages. Look for these indicators:

- **▼ MORE**: Press Arrow DOWN to see next page
- **▲ BACK**: Press Arrow UP to return to previous page
- **Page X/Y**: Shows current page number and total pages

### Important Changes (v2.0)

⚠️ **Single-digit navigation has been removed**
- Previously: Pressing `1` on news page would navigate to article 1
- Now: All navigation requires 3-digit input (e.g., `201`)
- Quiz answers now use color buttons (R/G/Y/B) instead of numbers

For detailed navigation instructions, see [NAVIGATION_GUIDE.md](NAVIGATION_GUIDE.md)

## 📁 Project Structure

```
.
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Home page with boot sequence
│   └── globals.css              # Global styles and CRT effects
├── components/                   # React components
│   ├── BootSequence.tsx         # CRT warm-up animation
│   ├── TeletextScreen.tsx       # 40×24 character grid renderer
│   ├── RemoteInterface.tsx      # On-screen numeric keypad
│   ├── CRTFrame.tsx             # Retro TV styling with effects
│   ├── PageRouter.tsx           # Navigation state management
│   ├── PerformanceDebug.tsx     # Performance monitoring overlay
│   └── __tests__/               # Component tests
├── lib/                          # Utility functions and Firebase config
│   ├── firebase-client.ts       # Firebase client SDK
│   ├── firebase-admin.ts        # Firebase Admin SDK
│   ├── teletext-utils.ts        # Text wrapping, formatting utilities
│   ├── lazy-adapters.ts         # Code splitting for adapters
│   ├── performance-monitor.ts   # Performance tracking
│   ├── performance-traces.ts    # Custom performance traces
│   └── __tests__/               # Utility tests
├── hooks/                        # Custom React hooks
│   ├── usePageRouter.ts         # Page navigation logic
│   ├── useOfflineSupport.ts     # Offline detection and caching
│   ├── usePagePreload.ts        # Page preloading
│   ├── useDebouncedInput.ts     # Input debouncing
│   ├── useRequestCancellation.ts # Request cancellation
│   └── __tests__/               # Hook tests
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts             # Cloud Functions entry point
│   │   ├── types.ts             # Shared type definitions
│   │   ├── adapters/            # Content adapters
│   │   │   ├── StaticAdapter.ts # Static pages (100-199)
│   │   │   ├── NewsAdapter.ts   # News API integration (200-299)
│   │   │   ├── SportsAdapter.ts # Sports API integration (300-399)
│   │   │   ├── MarketsAdapter.ts # Market data (400-499)
│   │   │   ├── AIAdapter.ts     # Vertex AI integration (500-599)
│   │   │   ├── GamesAdapter.ts  # Interactive games (600-699)
│   │   │   ├── SettingsAdapter.ts # Settings pages (700-799)
│   │   │   ├── DevAdapter.ts    # Developer tools (800-899)
│   │   │   └── WeatherAdapter.ts # Weather data (420-449)
│   │   └── utils/               # Utility functions
│   │       ├── cache.ts         # Firestore caching
│   │       ├── router.ts        # Page routing logic
│   │       ├── logger.ts        # Structured logging
│   │       ├── errors.ts        # Error handling
│   │       └── html-sanitizer.ts # HTML content sanitization
│   ├── lib/                     # Compiled JavaScript output
│   ├── package.json
│   └── tsconfig.json
├── types/                        # TypeScript type definitions
│   ├── teletext.ts              # Core teletext types
│   └── __tests__/               # Type tests
├── hooks/                        # Custom React hooks
├── public/                       # Static assets
│   └── sw.js                    # Service worker for offline support
├── scripts/                      # Deployment and configuration scripts
│   ├── deploy-production.sh     # Production deployment script
│   └── configure-functions-env.sh # Environment configuration
├── .kiro/                        # Kiro AI assistant configuration
│   └── specs/                   # Feature specifications
│       └── modern-teletext/     # This project's spec
│           ├── requirements.md  # EARS-compliant requirements
│           ├── design.md        # Architecture and design
│           └── tasks.md         # Implementation task list
├── firebase.json                 # Firebase configuration
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore indexes
├── storage.rules                # Storage security rules
├── jest.config.js               # Jest configuration
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── .env.example                 # Environment variables template
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Blaze (pay-as-you-go) plan for Cloud Functions
- API keys for external services (optional for basic functionality)

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd modern-teletext

# Install root dependencies
npm install

# Install Cloud Functions dependencies
cd functions && npm install && cd ..
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable the following services:
   - **Firestore Database** (Native mode)
   - **Cloud Storage**
   - **Cloud Functions** (requires Blaze plan)
   - **Firebase App Hosting** (optional, for deployment)
   - **Vertex AI API** (for AI features)

3. Get your Firebase configuration:
   - Go to Project Settings → General
   - Scroll to "Your apps" and add a web app
   - Copy the Firebase configuration object

4. Set up environment variables:
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Edit .env.local with your Firebase credentials
   nano .env.local
   ```

5. Update Firebase project reference:
   ```bash
   # Update .firebaserc with your project ID
   firebase use --add
   ```

### 3. Configure External API Keys

#### Required API Keys

**NEWS_API_KEY** (Required for news pages 200-299)
- Get a free API key from [NewsAPI.org](https://newsapi.org/)
- Add to `.env.local`: `NEWS_API_KEY=your_key_here`
- Without this key, news pages will show an error message with setup instructions

#### Optional API Keys

These keys enable additional features but are not required:

**SPORTS_API_KEY** (Optional for sports pages 300-399)
- Get from [API-Football](https://www.api-football.com/)
- Add to `.env.local`: `SPORTS_API_KEY=your_key_here`
- Sports pages will show demo data without this key

**ALPHA_VANTAGE_API_KEY** (Optional for stock market data)
- Get from [Alpha Vantage](https://www.alphavantage.co/)
- Add to `.env.local`: `ALPHA_VANTAGE_API_KEY=your_key_here`
- Stock market data will be limited without this key

**OPENWEATHER_API_KEY** (Optional for weather pages 420-449)
- Get from [OpenWeatherMap](https://openweathermap.org/api)
- Add to `.env.local`: `OPENWEATHER_API_KEY=your_key_here`
- Weather pages will show demo data without this key

#### Environment Variable Validation

The application validates environment variables on startup:

```bash
# Start the dev server - it will check for missing variables
npm run dev

# You'll see output like:
# ✅ Environment variables validated successfully
# ⚠️  Optional API keys not configured:
#    - NEWS_API_KEY not set - News pages (200-299) will have limited functionality
```

If required variables are missing, you'll see clear error messages with setup instructions.

#### Firebase Functions Configuration (Production)

For production deployment, configure API keys in Firebase:

```bash
# News API (https://newsapi.org)
firebase functions:config:set news.api_key="YOUR_NEWS_API_KEY"

# Sports API (https://www.api-football.com)
firebase functions:config:set sports.api_key="YOUR_SPORTS_API_KEY"

# Alpha Vantage for stocks (https://www.alphavantage.co)
firebase functions:config:set markets.alpha_vantage_key="YOUR_KEY"

# OpenWeatherMap (https://openweathermap.org/api)
firebase functions:config:set weather.api_key="YOUR_WEATHER_API_KEY"

# Vertex AI configuration (automatic from Firebase)
firebase functions:config:set vertex.project_id="YOUR_PROJECT_ID"
firebase functions:config:set vertex.location="us-central1"
```

Or use the interactive configuration script:
```bash
npm run configure:functions
```

### 4. Deploy Firestore Rules and Indexes

```bash
# Deploy security rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5. Run Development Server

**Good news: No Firebase emulators needed!**

The app now works in two modes:

**Development Mode (Local):**
```bash
# Just start the Next.js dev server
npm run dev
```

In development, the app calls adapters directly - no emulators needed! This makes development much faster and simpler.

**Production Mode:**
The app automatically uses deployed Firebase Cloud Functions (already deployed at `https://us-central1-teletext-eacd0.cloudfunctions.net/`).

Then open http://localhost:3000 in your browser.

**Optional: Firebase Emulators (for testing Firestore/Storage)**

If you want to test Firestore caching or Storage features:
```bash
# Terminal 1: Start emulators (optional)
npm run emulators:start

# Terminal 2: Start dev server
npm run dev
```

### 6. Deploy to Production

**🎉 Already Deployed!**

The app is deployed with automatic GitHub integration:

- **Live URL**: https://teletextwebapp--teletext-eacd0.us-central1.hosted.app
- **Auto-Deploy**: Enabled on `main` branch
- **Cloud Functions**: https://us-central1-teletext-eacd0.cloudfunctions.net/

**Automatic Deployment:**
Just push to GitHub and your app will automatically deploy!

```bash
git add .
git commit -m "Your changes"
git push origin main
# Firebase App Hosting will automatically build and deploy!
```

**Manual Deployment (if needed):**
```bash
# Deploy functions only
firebase deploy --only functions

# Trigger app hosting deployment
firebase apphosting:rollouts:create teletextwebapp
```

See [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) for full deployment details.

## 🔑 Environment Variables

### Client-Side Variables (.env.local)

```bash
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Functions URL (for production)
NEXT_PUBLIC_FUNCTIONS_URL=https://us-central1-your_project.cloudfunctions.net
```

### Server-Side Variables (Firebase Functions Config)

```bash
# News API
news.api_key=your_news_api_key

# Sports API
sports.api_key=your_sports_api_key

# Markets APIs
markets.alpha_vantage_key=your_alpha_vantage_key
markets.coingecko_key=optional_coingecko_key

# Weather API
weather.api_key=your_openweather_key

# Vertex AI (auto-configured from Firebase)
vertex.project_id=your_project_id
vertex.location=us-central1
```

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library

### Backend
- **Runtime**: Node.js 18
- **Functions**: Firebase Cloud Functions (2nd gen)
- **Language**: TypeScript
- **HTTP Framework**: Express.js (via Firebase Functions)

### Database & Storage
- **Database**: Firestore (NoSQL document database)
- **Storage**: Firebase Cloud Storage
- **Caching**: Multi-level (Browser, Firestore, Service Worker)

### AI & External APIs
- **AI**: Google Gemini Pro via Vertex AI
- **News**: NewsAPI
- **Sports**: API-Football
- **Markets**: CoinGecko (crypto), Alpha Vantage (stocks)
- **Weather**: OpenWeatherMap
- **Trivia**: Open Trivia Database

### DevOps & Monitoring
- **Hosting**: Firebase App Hosting
- **CI/CD**: Firebase CLI
- **Monitoring**: Firebase Performance Monitoring
- **Analytics**: Firebase Analytics
- **Logging**: Cloud Logging

## 📡 API Documentation

### Cloud Functions Endpoints

All endpoints are deployed at: `https://us-central1-{project-id}.cloudfunctions.net`

#### GET /api/page/:id

Retrieves a teletext page by ID with automatic Firestore caching.

**Parameters:**
- `id` (path): Three-digit page number (100-899)

**Response:**
```json
{
  "success": true,
  "page": {
    "id": "201",
    "title": "Top Headlines",
    "rows": [
      "TOP HEADLINES                    201",
      "────────────────────────────────────",
      "1. Breaking news headline here...",
      "   Source: BBC News",
      "",
      "2. Another important story...",
      "   Source: Reuters",
      "",
      "More stories on page 202",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "RED:Index GREEN:World YELLOW:Tech"
    ],
    "links": [
      {
        "label": "Index",
        "targetPage": "200",
        "color": "red"
      },
      {
        "label": "World",
        "targetPage": "202",
        "color": "green"
      }
    ],
    "meta": {
      "source": "NewsAdapter",
      "lastUpdated": "2024-01-15T10:30:00.000Z",
      "cacheStatus": "fresh"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid page number: 999. Must be between 100-899.",
  "code": "INVALID_PAGE"
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid page number
- `404`: Page not found
- `500`: Internal server error
- `502`: External API failure

**Caching:**
- Static pages (1xx): 1 year
- News (2xx): 5 minutes
- Sports (3xx): 2 minutes (1 minute during live events)
- Markets (4xx): 1 minute
- Weather (420-449): 30 minutes
- AI responses (5xx): Session duration
- Games (6xx): No cache
- Settings (7xx): 1 hour
- Dev tools (8xx): No cache

#### POST /api/ai

Processes AI requests and returns formatted teletext pages.

**Request Body:**
```json
{
  "mode": "qa",
  "parameters": {
    "topic": "technology",
    "region": "global",
    "previousPageId": "510"
  }
}
```

**Response:**
```json
{
  "success": true,
  "pages": [
    {
      "id": "511",
      "title": "AI Response",
      "rows": ["..."],
      "links": [
        {
          "label": "Next",
          "targetPage": "512",
          "color": "green"
        }
      ],
      "meta": {
        "source": "AIAdapter",
        "aiContextId": "conv-uuid-here",
        "lastUpdated": "2024-01-15T10:30:00.000Z"
      }
    }
  ],
  "contextId": "conv-uuid-here"
}
```

**Modes:**
- `qa`: Question & Answer flow
- `story`: Spooky story generation
- `summarize`: Content summarization
- `conversation`: Continue existing conversation

**Rate Limiting:**
- 100 requests per minute per IP
- 1000 requests per hour per user

### Content Adapter Interface

All adapters implement this interface:

```typescript
interface ContentAdapter {
  getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage>;
  getCacheKey(pageId: string): string;
  getCacheDuration(): number; // Seconds
}
```

### Page Routing Logic

Pages are routed to adapters based on magazine number:

| Range | Adapter | Description | Cache TTL |
|-------|---------|-------------|-----------|
| 100-199 | StaticAdapter | System pages | 1 year |
| 200-299 | NewsAdapter | News content | 5 minutes |
| 300-399 | SportsAdapter | Sports scores | 2 minutes |
| 400-419 | MarketsAdapter | Market data | 1 minute |
| 420-449 | WeatherAdapter | Weather forecasts | 30 minutes |
| 500-599 | AIAdapter | AI interactions | Session |
| 600-699 | GamesAdapter | Interactive games | No cache |
| 700-799 | SettingsAdapter | Settings pages | 1 hour |
| 800-899 | DevAdapter | Developer tools | No cache |

## 🗄 Firestore Data Models

### Collections

#### pages_cache

Stores cached teletext pages with TTL.

```typescript
interface PageCacheDocument {
  pageId: string;           // Document ID (e.g., "201")
  page: TeletextPage;       // Full page data
  source: string;           // Adapter name (e.g., "NewsAdapter")
  cachedAt: Timestamp;      // When cached
  expiresAt: Timestamp;     // When to expire
  accessCount: number;      // Number of times accessed
}
```

**Indexes:**
- `expiresAt` (ascending) - for TTL cleanup
- `source, cachedAt` (composite) - for analytics

**Security Rules:**
- Read: Public
- Write: Cloud Functions only

#### conversations

Stores AI conversation state and history.

```typescript
interface ConversationDocument {
  contextId: string;        // Document ID (UUID)
  userId?: string;          // Optional user ID
  mode: string;             // "qa", "story", etc.
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
    pageId: string;
    timestamp: Timestamp;
  }>;
  parameters: Record<string, any>;
  createdAt: Timestamp;
  lastAccessedAt: Timestamp;
  expiresAt: Timestamp;     // Auto-delete after 24 hours
}
```

**Indexes:**
- `userId, lastAccessedAt` (composite) - for user history
- `expiresAt` (ascending) - for TTL cleanup

**Security Rules:**
- Read: Owner only (or public if no userId)
- Write: Owner only
- Delete: Owner only

#### user_preferences

Stores user customization settings.

```typescript
interface UserPreferencesDocument {
  userId: string;           // Document ID
  theme: string;            // "ceefax", "orf", "high-contrast", "haunting"
  favoritePages: string[];  // Up to 10 favorite page IDs
  settings: {
    scanlines: boolean;
    scanlinesIntensity: number;  // 0-100
    curvature: boolean;
    curvatureAmount: number;     // 0-10
    noise: boolean;
    noiseLevel: number;          // 0-100
  };
  teamWatchlist: string[];  // Up to 5 team IDs
  updatedAt: Timestamp;
}
```

**Security Rules:**
- Read: Owner only
- Write: Owner only

#### analytics

Stores daily analytics data.

```typescript
interface AnalyticsDocument {
  date: string;             // Document ID (YYYY-MM-DD)
  pageViews: Record<string, number>;  // pageId -> count
  totalRequests: number;
  errorCount: number;
  avgLoadTime: number;      // milliseconds
  topPages: Array<{
    pageId: string;
    views: number;
  }>;
  apiCalls: Record<string, number>;  // adapter -> count
}
```

**Security Rules:**
- Read: Admin only
- Write: Cloud Functions only

### Data Types

#### TeletextPage

Core page data structure:

```typescript
interface TeletextPage {
  id: string;              // Three-digit page number
  title: string;           // Page title (max 40 chars)
  rows: string[];          // Exactly 24 strings, each ≤40 chars
  links: PageLink[];       // Navigation links
  meta?: PageMeta;         // Optional metadata
}
```

#### PageLink

Navigation link structure:

```typescript
interface PageLink {
  label: string;           // Display text
  targetPage: string;      // Target page number
  color?: 'red' | 'green' | 'yellow' | 'blue';  // Fastext color
  position?: number;       // Row number for inline links
}
```

#### PageMeta

Page metadata:

```typescript
interface PageMeta {
  source?: string;         // Adapter name
  lastUpdated?: string;    // ISO timestamp
  aiContextId?: string;    // For AI conversation continuity
  cacheStatus?: 'fresh' | 'cached' | 'stale';
}
```

#### ThemeConfig

Theme configuration:

```typescript
interface ThemeConfig {
  name: string;
  colors: {
    background: string;
    text: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
  };
  effects: {
    scanlines: boolean;
    curvature: boolean;
    noise: boolean;
    glitch: boolean;
  };
}
```

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev                    # Start Next.js dev server (http://localhost:3000)
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint
npm run lint:fix               # Fix ESLint errors

# Testing
npm test                       # Run all tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Generate coverage report
npm run test:firestore         # Run Firestore rules tests

# Firebase
npm run emulators:start        # Start Firebase emulators
npm run configure:functions    # Configure function environment variables

# Cloud Functions (from functions/ directory)
cd functions
npm run build                  # Compile TypeScript
npm run serve                  # Run functions locally
npm run deploy                 # Deploy to Firebase
npm run logs                   # View function logs
npm test                       # Run function tests
```

### Development Workflow

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Make changes to components or pages**
   - Components are in `components/`
   - Pages are in `app/`
   - Utilities are in `lib/`

3. **Test your changes:**
   ```bash
   npm test
   ```

4. **For Cloud Functions development:**
   ```bash
   cd functions
   npm run build
   npm run serve  # Test locally with emulator
   ```

5. **Deploy when ready:**
   ```bash
   npm run deploy
   ```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Automatic formatting on save (recommended)
- **Naming Conventions**:
  - Components: PascalCase (e.g., `TeletextScreen.tsx`)
  - Utilities: camelCase (e.g., `wrapText()`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_PAGE_NUMBER`)
  - Types/Interfaces: PascalCase (e.g., `TeletextPage`)

### Project Conventions

- **40×24 Grid**: All pages must render exactly 24 rows of 40 characters
- **Page Numbers**: Valid range is 100-899
- **Color Codes**: Use standard teletext colors (red, green, yellow, blue, magenta, cyan, white, black)
- **Caching**: Implement appropriate TTL for each content type
- **Error Handling**: Always return teletext-formatted error pages
- **Accessibility**: Maintain keyboard navigation support

### Adding a New Adapter

1. Create adapter file in `functions/src/adapters/`:
   ```typescript
   import { ContentAdapter } from '../types';
   
   export class MyAdapter implements ContentAdapter {
     async getPage(pageId: string): Promise<TeletextPage> {
       // Implementation
     }
     
     getCacheKey(pageId: string): string {
       return `my_adapter_${pageId}`;
     }
     
     getCacheDuration(): number {
       return 300; // 5 minutes
     }
   }
   ```

2. Register in router (`functions/src/utils/router.ts`):
   ```typescript
   if (pageNumber >= 900 && pageNumber <= 999) {
     return new MyAdapter();
   }
   ```

3. Add tests in `functions/src/adapters/__tests__/MyAdapter.test.ts`

4. Document in README and create usage guide in `functions/`

## Deployment

### Quick Deploy

```bash
# Deploy everything to production
npm run deploy
```

### Partial Deployments

```bash
# Deploy only hosting
npm run deploy:hosting

# Deploy only functions
npm run deploy:functions

# Deploy only Firestore rules
npm run deploy:firestore

# Deploy only Storage rules
npm run deploy:storage
```

### Configure Function Environment Variables

```bash
# Interactive configuration
npm run configure:functions

# Or manually
firebase functions:config:set \
  news.api_key="YOUR_KEY" \
  sports.api_key="YOUR_KEY" \
  markets.alpha_vantage_key="YOUR_KEY" \
  weather.api_key="YOUR_KEY"
```

### Production URLs

- **Website**: https://teletext-eacd0.web.app/
- **Cloud Functions**: https://us-central1-teletext-eacd0.cloudfunctions.net/
- **Firebase Console**: https://console.firebase.google.com/project/teletext-eacd0

### Deployment Documentation

For detailed deployment instructions, see:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[DEPLOYMENT_QUICK_REFERENCE.md](./DEPLOYMENT_QUICK_REFERENCE.md)** - Quick command reference
- **[MONITORING.md](./MONITORING.md)** - Monitoring and alerting guide

## Monitoring

### View Logs

```bash
# View all function logs
firebase functions:log

# View specific function
firebase functions:log --only getPage

# Real-time logs
firebase functions:log --follow
```

### Performance Monitoring

Access Firebase Console → Performance to view:
- Page load times
- API response times
- Custom traces
- Network requests

### Analytics

Access Firebase Console → Analytics to view:
- User engagement
- Page views
- Session duration
- User retention

## 🧪 Testing

### Test Structure

```
├── components/__tests__/          # Component tests
├── lib/__tests__/                 # Utility function tests
├── hooks/__tests__/               # Custom hook tests
├── types/__tests__/               # Type validation tests
├── functions/src/__tests__/       # Integration tests
└── functions/src/adapters/__tests__/  # Adapter tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- TeletextScreen.test.tsx

# Run Firestore security rules tests
npm run test:firestore
```

### Test Coverage

Current coverage targets:
- **Utilities**: 90%+ coverage
- **Components**: 80%+ coverage
- **Adapters**: 85%+ coverage
- **Overall**: 85%+ coverage

### Writing Tests

**Component Test Example:**
```typescript
import { render, screen } from '@testing-library/react';
import { TeletextScreen } from '../TeletextScreen';

describe('TeletextScreen', () => {
  it('renders exactly 24 rows', () => {
    const page = createMockPage();
    render(<TeletextScreen page={page} loading={false} />);
    const rows = screen.getAllByTestId('teletext-row');
    expect(rows).toHaveLength(24);
  });
});
```

**Utility Test Example:**
```typescript
import { wrapText } from '../teletext-utils';

describe('wrapText', () => {
  it('wraps long text at word boundaries', () => {
    const input = 'This is a very long sentence that exceeds forty characters';
    const result = wrapText(input, 40);
    expect(result.every(line => line.length <= 40)).toBe(true);
  });
});
```

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Write or update tests
5. Ensure all tests pass: `npm test`
6. Commit with descriptive message: `git commit -m "Add feature: description"`
7. Push to your fork: `git push origin feature/my-feature`
8. Open a Pull Request

### Contribution Guidelines

#### Code Quality
- Write TypeScript with strict type checking
- Follow existing code style and conventions
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Avoid magic numbers and strings

#### Testing
- Write tests for new features
- Maintain or improve test coverage
- Test edge cases and error conditions
- Use descriptive test names

#### Documentation
- Update README if adding features
- Add JSDoc comments to functions
- Create usage guides for new adapters
- Update API documentation

#### Commit Messages
Follow conventional commits format:
- `feat: Add new feature`
- `fix: Fix bug description`
- `docs: Update documentation`
- `test: Add tests`
- `refactor: Refactor code`
- `style: Format code`
- `chore: Update dependencies`

#### Pull Request Process
1. Update documentation
2. Add tests for new functionality
3. Ensure CI passes
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

### Areas for Contribution

- **New Adapters**: Add support for new content sources
- **Themes**: Create new color palettes and visual themes
- **Games**: Implement new interactive games
- **Performance**: Optimize loading and rendering
- **Accessibility**: Improve keyboard navigation and screen reader support
- **Documentation**: Improve guides and examples
- **Tests**: Increase test coverage
- **Bug Fixes**: Fix reported issues

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## 🎮 Kiro Usage

This project was built using [Kiro](https://kiro.ai), an AI-powered development assistant. The development process leveraged several Kiro features:

### Specs (Specification-Driven Development)

The project follows a structured spec-driven approach with three key documents:

1. **Requirements** (`.kiro/specs/modern-teletext/requirements.md`)
   - EARS-compliant requirements with acceptance criteria
   - 30 user stories covering all features
   - Glossary of system terms

2. **Design** (`.kiro/specs/modern-teletext/design.md`)
   - Architecture diagrams and component interfaces
   - Data models and API specifications
   - 30 correctness properties for property-based testing
   - Testing strategy with unit and property tests

3. **Tasks** (`.kiro/specs/modern-teletext/tasks.md`)
   - 30 implementation tasks with sub-tasks
   - Each task references specific requirements
   - Optional testing tasks marked with `*`
   - Checkpoint tasks for validation

### Using Specs in Kiro

To work with specs in Kiro:

```bash
# View the spec documents
open .kiro/specs/modern-teletext/

# Execute a task
# Open tasks.md in Kiro and click "Start task" next to any task

# Update requirements
# Edit requirements.md and ask Kiro to regenerate design/tasks

# Add new features
# Add requirements and ask Kiro to update design and tasks
```

### Hooks

Kiro hooks can automate workflows. Example hooks for this project:

- **On Save**: Run tests when saving adapter files
- **On Commit**: Validate that all tests pass
- **On Deploy**: Run full test suite and build

### Steering

Steering files provide context to Kiro. This project uses:

- **Always included**: Project conventions, coding standards
- **Conditional**: Adapter-specific guidelines when editing adapters
- **Manual**: Deployment procedures, API documentation

### MCP (Model Context Protocol)

Kiro can integrate with external tools via MCP:

- **Firebase MCP**: Direct Firebase console access
- **API Testing MCP**: Test external API integrations
- **Documentation MCP**: Generate API docs from code

### Benefits of Kiro Development

- **Structured Approach**: Specs ensure comprehensive planning
- **Correctness Properties**: Property-based testing catches edge cases
- **Incremental Development**: Task-by-task implementation
- **Documentation**: Auto-generated from specs
- **Testing**: Built-in testing strategy from design phase

## 📚 Additional Documentation

### Core Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[PAGE_DIRECTORY.md](./PAGE_DIRECTORY.md)** - All pages and their purposes
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[KIRO_USAGE_GUIDE.md](./KIRO_USAGE_GUIDE.md)** - How this project uses Kiro

### UX Redesign Documentation

- **[UX_REDESIGN_OVERVIEW.md](./UX_REDESIGN_OVERVIEW.md)** - Complete UX redesign overview
- **[UX_REDESIGN_VISUAL_GUIDE.md](./UX_REDESIGN_VISUAL_GUIDE.md)** - Visual examples with ASCII art
- **[LAYOUT_MANAGER_API.md](./LAYOUT_MANAGER_API.md)** - Layout Manager API reference
- **[ANIMATION_ENGINE_API.md](./ANIMATION_ENGINE_API.md)** - Animation Engine API reference
- **[THEME_CONFIGURATION.md](./THEME_CONFIGURATION.md)** - Theme configuration guide
- **[ADDING_ANIMATIONS.md](./ADDING_ANIMATIONS.md)** - Guide for adding new animations
- **[ACCESSIBILITY_FEATURES.md](./ACCESSIBILITY_FEATURES.md)** - Accessibility features and settings

### Setup & Deployment

- **[SETUP.md](./SETUP.md)** - Initial setup verification
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[DEPLOYMENT_QUICK_REFERENCE.md](./DEPLOYMENT_QUICK_REFERENCE.md)** - Quick command reference
- **[MONITORING.md](./MONITORING.md)** - Monitoring and alerting guide

### Database & Storage

- **[FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md)** - Firestore configuration
- **[FIRESTORE_QUICK_REFERENCE.md](./FIRESTORE_QUICK_REFERENCE.md)** - Firestore queries

### Performance & Features

- **[PERFORMANCE_OPTIMIZATIONS.md](./PERFORMANCE_OPTIMIZATIONS.md)** - Performance guide
- **[OFFLINE_SUPPORT.md](./OFFLINE_SUPPORT.md)** - Offline functionality
- **[HTML_SANITIZATION.md](./HTML_SANITIZATION.md)** - Content sanitization

### Cloud Functions

- **[functions/README.md](./functions/README.md)** - Cloud Functions documentation
- **[functions/IMPLEMENTATION.md](./functions/IMPLEMENTATION.md)** - Implementation details

### Adapter Documentation

- **[functions/NEWS_API_SETUP.md](./functions/NEWS_API_SETUP.md)** - News adapter setup
- **[functions/SPORTS_API_SETUP.md](./functions/SPORTS_API_SETUP.md)** - Sports adapter setup
- **[functions/MARKETS_API_SETUP.md](./functions/MARKETS_API_SETUP.md)** - Markets adapter setup
- **[functions/WEATHER_API_SETUP.md](./functions/WEATHER_API_SETUP.md)** - Weather adapter setup
- **[functions/AI_ADAPTER_SETUP.md](./functions/AI_ADAPTER_SETUP.md)** - AI adapter setup
- **[functions/GAMES_ADAPTER_SETUP.md](./functions/GAMES_ADAPTER_SETUP.md)** - Games adapter setup
- **[functions/SETTINGS_ADAPTER_SETUP.md](./functions/SETTINGS_ADAPTER_SETUP.md)** - Settings adapter setup
- **[functions/DEV_ADAPTER_SETUP.md](./functions/DEV_ADAPTER_SETUP.md)** - Dev tools adapter setup

### Feature Documentation

- **[functions/QA_FLOW_USAGE.md](./functions/QA_FLOW_USAGE.md)** - AI Q&A flow
- **[functions/SPOOKY_STORY_USAGE.md](./functions/SPOOKY_STORY_USAGE.md)** - Horror story generator
- **[functions/CONVERSATION_HISTORY_USAGE.md](./functions/CONVERSATION_HISTORY_USAGE.md)** - Conversation history
- **[functions/BAMBOOZLE_GAME_USAGE.md](./functions/BAMBOOZLE_GAME_USAGE.md)** - Bamboozle game
- **[functions/RANDOM_FACTS_USAGE.md](./functions/RANDOM_FACTS_USAGE.md)** - Random facts feature
- **[functions/CRT_EFFECTS_USAGE.md](./functions/CRT_EFFECTS_USAGE.md)** - CRT visual effects
- **[functions/EASTER_EGGS.md](./functions/EASTER_EGGS.md)** - Easter eggs documentation

### Specifications

- **[.kiro/specs/modern-teletext/requirements.md](./.kiro/specs/modern-teletext/requirements.md)** - EARS requirements
- **[.kiro/specs/modern-teletext/design.md](./.kiro/specs/modern-teletext/design.md)** - System design
- **[.kiro/specs/modern-teletext/tasks.md](./.kiro/specs/modern-teletext/tasks.md)** - Implementation tasks

## 🐛 Troubleshooting

### Common Issues

**Functions not updating:**
```bash
cd functions
rm -rf lib/
npm run build
firebase deploy --only functions --force
```

**Hosting not updating:**
```bash
rm -rf .next/ out/
npm run build
firebase deploy --only hosting
```

**Environment variables not working:**
```bash
firebase functions:config:get
firebase deploy --only functions
```

**Firestore permission denied:**
```bash
firebase deploy --only firestore:rules
# Wait 1-2 minutes for rules to propagate
```

**Build errors:**
```bash
# Clear all caches
rm -rf .next/ node_modules/ functions/node_modules/ functions/lib/
npm install
cd functions && npm install && cd ..
npm run build
```

**Emulator issues:**
```bash
# Kill all Firebase processes
pkill -f firebase
# Restart emulators
firebase emulators:start
```

For more troubleshooting tips, see [DEPLOYMENT_QUICK_REFERENCE.md](./DEPLOYMENT_QUICK_REFERENCE.md)

## 📄 License

Private project - All rights reserved

## 🙏 Acknowledgments

- Inspired by BBC Ceefax, ORACLE, and other classic teletext services
- Built with [Kiro](https://kiro.ai) AI development assistant
- Powered by Firebase and Google Cloud
- Uses various open-source libraries and APIs

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review the spec documents in `.kiro/specs/modern-teletext/`

---

**Built with ❤️ and nostalgia for the golden age of teletext**
