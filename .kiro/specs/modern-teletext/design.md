# Design Document

## Overview

Modern Teletext (DeadText) is a web application that resurrects the classic teletext broadcast technology with modern capabilities. The system architecture follows a client-server model where a React/Next.js frontend renders authentic 40×24 character grid pages, while a Node.js backend orchestrates content from multiple external APIs through specialized adapter services. The design emphasizes faithful recreation of the teletext user experience while leveraging contemporary technologies for live data integration, AI-powered interactions, and responsive performance.

The application serves content through a magazine-based page numbering system (100-899), where each page is represented as a structured data model containing exactly 40-character rows. Users navigate using three-digit page numbers via keyboard or on-screen remote, with colored Fastext buttons providing quick access to major sections. The system integrates external APIs for news, sports, and market data, while providing unique AI-powered assistance through menu-driven numeric input flows.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Teletext   │  │   Remote     │  │   CRT        │      │
│  │   Screen     │  │   Interface  │  │   Frame      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                │                  │              │
│           └────────────────┴──────────────────┘              │
│                          │                                   │
│                   ┌──────▼──────┐                           │
│                   │ Page Router │                           │
│                   └──────┬──────┘                           │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────┼──────────────────────────────────┐
│                    Backend API                               │
│                   ┌──────▼──────┐                           │
│                   │   Router    │                           │
│                   └──────┬──────┘                           │
│                          │                                   │
│        ┌─────────────────┼─────────────────┐               │
│        │                 │                 │               │
│   ┌────▼────┐      ┌────▼────┐      ┌────▼────┐          │
│   │  News   │      │ Sports  │      │ Markets │          │
│   │ Adapter │      │ Adapter │      │ Adapter │          │
│   └────┬────┘      └────┬────┘      └────┬────┘          │
│        │                 │                 │               │
│   ┌────▼────┐      ┌────▼────┐      ┌────▼────┐          │
│   │   AI    │      │  Games  │      │ Static  │          │
│   │ Adapter │      │ Adapter │      │  Pages  │          │
│   └────┬────┘      └────┬────┘      └─────────┘          │
└─────────┼──────────────────┼──────────────────────────────┘
          │                  │
     ┌────▼────┐        ┌───▼────┐
     │   LLM   │        │ Trivia │
     │   API   │        │  API   │
     └─────────┘        └────────┘
          
External APIs: News, Sports, Finance, Weather
```

### Component Responsibilities

**Frontend Components:**
- **TeletextScreen**: Renders the 40×24 character grid with proper styling and color codes
- **RemoteInterface**: Provides on-screen numeric keypad and control buttons
- **CRTFrame**: Wraps the screen with retro TV styling and optional effects
- **PageRouter**: Manages navigation state and fetches pages from backend

**Backend Components:**
- **API Router**: Maps page number ranges to appropriate adapters
- **Content Adapters**: Transform external API data into teletext page format
- **Cache Layer**: Stores frequently accessed pages to reduce API calls
- **AI Service**: Manages conversation state and LLM interactions

### Technology Stack

**Frontend:**
- Next.js 14 (React framework with SSR support)
- TypeScript for type safety
- CSS Modules for component styling
- React Context for global state (current page, navigation history)
- Firebase SDK for client-side integration

**Backend & Infrastructure:**
- Firebase App Hosting (Next.js deployment)
- Firebase Cloud Functions (serverless API endpoints)
- Firestore (NoSQL database for page cache, user data, conversation state)
- Firebase Storage (static page content, themes, assets)
- TypeScript
- Axios for external API calls

**AI & External APIs:**
- Google Gemini via Vertex AI (AI assistant functionality)
- News: NewsAPI or similar
- Sports: API-Football or ESPN API
- Markets: CoinGecko (crypto), Alpha Vantage (stocks)

## Components and Interfaces

### Frontend Components

#### TeletextScreen Component

```typescript
interface TeletextScreenProps {
  page: TeletextPage;
  loading: boolean;
  theme: ThemeConfig;
}

interface TeletextPage {
  id: string;              // "201"
  title: string;           // Page title
  rows: string[];          // Exactly 24 strings, each max 40 chars
  links: PageLink[];       // Navigation links
  meta?: PageMeta;
}

interface PageLink {
  label: string;           // Display text
  targetPage: string;      // Target page number
  color?: 'red' | 'green' | 'yellow' | 'blue';
  position?: number;       // Row number for inline links
}

interface PageMeta {
  source?: string;         // "NewsAPI", "Static", etc.
  lastUpdated?: string;    // ISO timestamp
  aiContextId?: string;    // For AI conversation continuity
  cacheStatus?: 'fresh' | 'cached' | 'stale';
}
```

The TeletextScreen component renders each row as a monospaced line, parsing inline color codes (using control characters or markup) to apply teletext colors. It handles the loading state with a green "loading" animation on the top row.

#### RemoteInterface Component

```typescript
interface RemoteInterfaceProps {
  onDigitPress: (digit: number) => void;
  onNavigate: (direction: 'back' | 'forward' | 'up' | 'down') => void;
  onColorButton: (color: 'red' | 'green' | 'yellow' | 'blue') => void;
  onEnter: () => void;
  currentInput: string;    // Currently entered digits
}
```

The RemoteInterface provides both visual buttons and keyboard event listeners. It maintains the current digit input buffer (up to 3 digits) and triggers navigation when Enter is pressed or after 3 digits are entered.

#### CRTFrame Component

```typescript
interface CRTFrameProps {
  children: React.ReactNode;
  effects: {
    scanlines: boolean;
    curvature: boolean;
    noise: boolean;
    glitch: boolean;       // For "Haunting Mode"
  };
}
```

The CRTFrame applies CSS effects including scanlines (repeating-linear-gradient), screen curvature (border-radius and transform), and optional noise/glitch animations for thematic modes.

### Backend API Endpoints (Firebase Cloud Functions)

#### GET /api/page/:id

Implemented as Firebase Cloud Function (HTTP trigger):

```typescript
export const getPage = onRequest(async (req, res) => {
  const pageId = req.params.id;
  
  // Check Firestore cache first
  const cached = await getCachedPage(pageId);
  if (cached) {
    return res.json({ success: true, page: cached });
  }
  
  // Route to appropriate adapter
  const adapter = routeToAdapter(pageId);
  const page = await adapter.getPage(pageId);
  
  // Cache in Firestore
  await setCachedPage(pageId, page, adapter.getCacheDuration());
  
  return res.json({ success: true, page });
});
```

Response:
```typescript
{
  success: boolean;
  page?: TeletextPage;
  error?: string;
}
```

The router examines the page ID and delegates to the appropriate adapter:
- 100-199: Static pages adapter (reads from Firebase Storage)
- 200-299: News adapter
- 300-399: Sports adapter
- 400-499: Markets adapter
- 500-599: AI adapter (uses Vertex AI)
- 600-699: Games adapter
- 700-799: Settings adapter (returns static config pages)
- 800-899: Dev tools adapter

#### POST /api/ai

Implemented as Firebase Cloud Function with Vertex AI integration:

```typescript
export const processAI = onRequest(async (req, res) => {
  const { mode, parameters } = req.body;
  
  const vertexAI = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: 'us-central1'
  });
  
  const model = vertexAI.getGenerativeModel({ model: 'gemini-pro' });
  
  // Build prompt and generate response
  // Store conversation in Firestore
  // Return formatted pages
});
```

Request:
```typescript
{
  mode: string;            // "qa", "summarize", "story", etc.
  parameters: {
    topic?: string;
    context?: string;
    previousPageId?: string;  // For conversation continuity
  };
}
```

Response:
```typescript
{
  success: boolean;
  pages: TeletextPage[];   // May return multiple pages for long responses
  contextId: string;       // For follow-up requests
}
```

### Content Adapter Interface

All adapters implement a common interface:

```typescript
interface ContentAdapter {
  getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage>;
  getCacheKey(pageId: string): string;
  getCacheDuration(): number;  // Seconds
}
```

#### News Adapter

The News Adapter fetches headlines from NewsAPI and formats them into teletext rows:

```typescript
class NewsAdapter implements ContentAdapter {
  async getPage(pageId: string): Promise<TeletextPage> {
    // Page 200: News index
    // Page 201: Top headlines
    // Page 202-219: Category-specific news
  }
}
```

Formatting logic:
1. Fetch top 6-8 headlines
2. Truncate each headline to 38 characters (leaving 2 for numbering)
3. Create rows like: "1. Headline text here truncated..."
4. Add footer with colored navigation links

#### Sports Adapter

Formats live scores and league tables:

```typescript
class SportsAdapter implements ContentAdapter {
  async getPage(pageId: string): Promise<TeletextPage> {
    // Page 300: Sports index
    // Page 301: Live scores
    // Page 302: League tables
  }
}
```

Formatting for scores:
```
LIVE SCORES                    301
────────────────────────────────────
MAN UTD  2 - 1  CHELSEA        FT
ARSENAL  1 - 1  LIVERPOOL      87'
```

#### AI Adapter

Manages menu-driven AI interactions:

```typescript
class AIAdapter implements ContentAdapter {
  private conversations: Map<string, ConversationState>;
  
  async getPage(pageId: string): Promise<TeletextPage> {
    // Page 500: AI index (service selection)
    // Page 510-519: Q&A flows
    // Page 520-529: Conversation history
  }
}
  
  async processAIRequest(request: AIRequest): Promise<TeletextPage[]> {
    // Build prompt from menu selections
    // Call LLM API
    // Split response into 24-row pages
    // Return array of pages
  }
}
```

The AI adapter maintains conversation state in memory (or Redis for production) keyed by session ID. Each conversation turn generates new page IDs sequentially.

## Data Models

### TeletextPage Model

The core data structure representing a single page:

```typescript
interface TeletextPage {
  id: string;
  title: string;
  rows: string[];          // Length must be exactly 24
  links: PageLink[];
  meta?: PageMeta;
}
```

Validation rules:
- `id` must be 3 digits (100-899)
- `rows` array must contain exactly 24 elements
- Each row must be ≤ 40 characters
- If a row is < 40 characters, it's padded with spaces for consistent rendering

### Page Link Model

```typescript
interface PageLink {
  label: string;
  targetPage: string;
  color?: 'red' | 'green' | 'yellow' | 'blue';
  position?: number;
}
```

Links can be:
- **Fastext links**: Colored buttons in footer (no position specified)
- **Inline links**: Embedded in specific rows (position specified)

### Theme Configuration

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

Predefined themes:
- **Classic Ceefax**: Yellow on blue background, standard teletext colors
- **High Contrast**: White on black, enhanced readability
- **Haunting Mode**: Green on black with glitch effects and horror palette

### AI Conversation State

```typescript
interface ConversationState {
  contextId: string;
  mode: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
    pageId: string;
  }>;
  parameters: Record<string, any>;
  createdAt: Date;
  lastAccessedAt: Date;
}
```

### Firestore Data Models

**Collections Structure:**

```typescript
// Collection: pages_cache
interface PageCacheDocument {
  pageId: string;           // Document ID
  page: TeletextPage;       // Full page data
  source: string;           // Adapter name
  cachedAt: Timestamp;
  expiresAt: Timestamp;
  accessCount: number;
}

// Collection: conversations
interface ConversationDocument {
  contextId: string;        // Document ID
  userId?: string;          // Optional user ID
  state: ConversationState;
  createdAt: Timestamp;
  lastAccessedAt: Timestamp;
  expiresAt: Timestamp;     // Auto-delete after 24 hours
}

// Collection: user_preferences
interface UserPreferencesDocument {
  userId: string;           // Document ID
  theme: string;
  favoritePages: string[];
  settings: {
    scanlines: boolean;
    curvature: boolean;
    noise: boolean;
  };
  updatedAt: Timestamp;
}

// Collection: analytics
interface AnalyticsDocument {
  date: string;             // Document ID (YYYY-MM-DD)
  pageViews: Record<string, number>;
  totalRequests: number;
  errorCount: number;
  avgLoadTime: number;
}
```

## Cor
rectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Page dimension invariant
*For any* teletext page generated by the system, the page must contain exactly 24 rows and each row must be at most 40 characters in length.
**Validates: Requirements 2.1, 2.2, 11.5**

### Property 2: Valid page navigation
*For any* valid three-digit page number (100-899), requesting that page should return a valid TeletextPage object within the timeout period.
**Validates: Requirements 1.1**

### Property 3: Invalid input handling
*For any* invalid page number (outside 100-899 range, non-numeric, or malformed), the system should return an error response and not navigate away from the current page.
**Validates: Requirements 1.2, 13.1**

### Property 4: Navigation history consistency
*For any* sequence of page navigations, pressing the BACK button should return to the previously viewed page, maintaining a correct history stack.
**Validates: Requirements 1.4**

### Property 5: Text wrapping correctness
*For any* text content exceeding 40 characters, the wrapping function should split the text at word boundaries when possible, and each resulting line should be at most 40 characters.
**Validates: Requirements 14.1**

### Property 6: Color code support
*For any* page containing color codes, the rendering system should correctly parse and apply the seven standard teletext colors (red, green, yellow, blue, magenta, cyan, white) plus black.
**Validates: Requirements 2.4**

### Property 7: Magazine routing correctness
*For any* page number, the router should direct the request to the correct adapter based on the page number range (1xx→System, 2xx→News, 3xx→Sports, etc.).
**Validates: Requirements 3.2, 11.1**

### Property 8: Fastext navigation
*For any* colored button press (red, green, yellow, blue), the system should navigate to the corresponding magazine index page as defined in the current page's links.
**Validates: Requirements 3.4**

### Property 9: Content pagination
*For any* content that exceeds 24 rows, the system should split it across multiple pages with proper navigation links to continuation pages.
**Validates: Requirements 4.3, 7.4, 10.4**

### Property 10: API failure graceful degradation
*For any* content adapter, when the external API request fails, the adapter should return a properly formatted error page in teletext format rather than throwing an exception.
**Validates: Requirements 4.5, 11.3**

### Property 11: Data formatting constraints
*For any* sports scores or market data, the formatting function should truncate or abbreviate content to fit within 40-character rows while maintaining readability.
**Validates: Requirements 5.4, 6.4**

### Property 12: AI menu numeric-only constraint
*For any* AI service menu page, all user interaction options should be represented as numeric choices (0-9) with no free-text input required.
**Validates: Requirements 7.2**

### Property 13: AI response formatting
*For any* AI-generated response, the system should format it as one or more valid TeletextPage objects, each respecting the 40×24 constraint.
**Validates: Requirements 7.3**

### Property 14: Conversation context preservation
*For any* multi-turn AI conversation within a session, follow-up requests should include the previous conversation history in the context.
**Validates: Requirements 7.5**

### Property 15: Quiz answer validation
*For any* quiz question with multiple-choice answers, selecting an answer should navigate to a result page that correctly indicates whether the answer was right or wrong.
**Validates: Requirements 8.3**

### Property 16: Quiz score calculation
*For any* completed quiz, the score summary should accurately reflect the number of correct answers out of total questions.
**Validates: Requirements 8.4**

### Property 17: Branching navigation consistency
*For any* quiz with branching logic, different answer selections should lead to different page sequences as defined in the quiz configuration.
**Validates: Requirements 8.5**

### Property 18: Theme application consistency
*For any* theme selection, the color palette should be applied consistently across all subsequently rendered pages.
**Validates: Requirements 9.2**

### Property 19: JSON formatting constraint
*For any* page's JSON representation, the formatted output should respect the 40-character width limit when displayed on page 801.
**Validates: Requirements 10.3**

### Property 20: Metadata completeness
*For any* page generated by an adapter, the page metadata should include the source adapter name, last updated timestamp, and cache status.
**Validates: Requirements 10.5**

### Property 21: Adapter transformation correctness
*For any* content adapter receiving external API data, the transformation to TeletextPage format should preserve the essential information while conforming to the page model constraints.
**Validates: Requirements 11.2**

### Property 22: Cache behavior
*For any* page request, if a cached version exists and is not expired, the system should return the cached version without making a new API call.
**Validates: Requirements 11.4**

### Property 23: Input buffer display
*For any* sequence of digit key presses (up to 3 digits), the system should display the current input buffer to the user before navigation occurs.
**Validates: Requirements 12.5**

### Property 24: Input method equivalence
*For any* remote control action, performing it via keyboard or on-screen button click should produce identical system behavior.
**Validates: Requirements 12.4**

### Property 25: Offline cache fallback
*For any* page request when network connectivity is unavailable, if a cached version exists, the system should serve it with a "Cached" indicator.
**Validates: Requirements 13.4**

### Property 26: Tabular data alignment
*For any* tabular data (scores, prices, tables), the column alignment should use spaces to create visually aligned columns within the 40-character constraint.
**Validates: Requirements 14.3**

### Property 27: HTML sanitization
*For any* HTML content from external sources, the parsing function should strip all HTML tags and return clean plain text.
**Validates: Requirements 14.4**

### Property 28: Whitespace preservation
*For any* content with multiple consecutive spaces, the system should preserve the spacing to maintain intended layout formatting.
**Validates: Requirements 14.5**

### Property 29: Preload behavior
*For any* application startup, the system should preload page 100 (index) and other frequently accessed pages into the cache.
**Validates: Requirements 15.4**

### Property 30: Request cancellation
*For any* sequence of rapid page navigation requests, the system should cancel pending requests and only complete the most recent request.
**Validates: Requirements 15.5**

### Property 31: Full-width content display
*For any* page content, the text should utilize the full 40-character width with proper centering or justification.
**Validates: Requirements 34.2, 34.3**

### Property 32: Multi-page navigation consistency
*For any* multi-page content sequence, pressing down arrow should navigate to the next page and up arrow to the previous page in the sequence.
**Validates: Requirements 35.2, 35.3**

### Property 33: Theme persistence
*For any* theme selection, the chosen theme should be saved to Firestore and restored on next application load.
**Validates: Requirements 37.4, 37.5**

### Property 34: Environment variable validation
*For any* required environment variable, if it is missing, the system should display a specific error message identifying the variable name.
**Validates: Requirements 38.1, 38.2**

## Enhanced Halloween Theme Design

### Haunting Mode Visual Effects

The enhanced Haunting Mode for Kiroween includes:

**Color Palette:**
```typescript
interface HauntingTheme {
  background: '#000000';      // Pure black
  primary: '#00ff00';         // Matrix green
  accent1: '#ff6600';         // Halloween orange
  accent2: '#9933ff';         // Purple
  warning: '#ff0000';         // Blood red
  ghost: '#cccccc';           // Ghostly white
}
```

**Visual Effects:**
- **Glitch Animation**: Random horizontal line displacement every 3-5 seconds
- **Chromatic Aberration**: RGB channel separation on text
- **Flicker**: Subtle brightness variation (90-100%) at 0.5Hz
- **Screen Shake**: Occasional 2px tremor on spooky pages
- **Particle Effects**: Floating ghost/bat sprites in background (CSS animations)

**Decorative Elements:**
- ASCII art pumpkins in page headers
- Bat symbols (🦇) as bullet points
- Ghost emoji (👻) for navigation hints
- Skull symbols (💀) for warnings

### Full-Screen Layout System

**Layout Strategy:**
```typescript
interface LayoutConfig {
  contentWidth: 40;           // Characters
  alignment: 'left' | 'center' | 'justify';
  padding: {
    left: number;
    right: number;
  };
}
```

**Text Justification Algorithm:**
1. For titles: Center text with equal padding on both sides
2. For body content: Left-align with full 40-character width
3. For tables: Distribute columns evenly across 40 characters
4. For navigation: Right-align page numbers, left-align labels

**Example Layouts:**
```
Centered Title:
"        MODERN TELETEXT P100        "

Full-width content:
"Welcome to the spooky teletext world"

Table layout:
"TEAM          PLD  W  D  L  PTS     "
"Man United     38 25  8  5   83     "
```

### Multi-Page Navigation System

**Page Continuation Model:**
```typescript
interface PageContinuation {
  currentPage: string;        // "201"
  nextPage?: string;          // "202"
  previousPage?: string;      // "200"
  totalPages: number;         // 3
  currentIndex: number;       // 1 (0-indexed)
}
```

**Navigation Indicators:**
- Bottom of page: "▼ MORE - Press ↓ or 202"
- Top of continuation: "▲ BACK - Press ↑ or 201"
- Page counter: "Page 2/3" in header

**Arrow Key Handling:**
```typescript
function handleArrowKey(direction: 'up' | 'down', currentPage: TeletextPage) {
  if (direction === 'down' && currentPage.meta?.nextPage) {
    navigateToPage(currentPage.meta.nextPage);
  } else if (direction === 'up' && currentPage.meta?.previousPage) {
    navigateToPage(currentPage.meta.previousPage);
  }
}
```

### Interactive Theme Selection

**Theme Selection Flow:**
1. User navigates to page 700
2. Page displays numbered options (1-4)
3. User presses number key (1, 2, 3, or 4)
4. System immediately applies theme without page reload
5. Confirmation message appears: "Theme applied: [name]"
6. Theme saved to Firestore user_preferences

**Implementation:**
```typescript
function handleThemeSelection(themeNumber: number) {
  const themes = {
    1: 'ceefax',
    2: 'orf',
    3: 'high-contrast',
    4: 'haunting'
  };
  
  const selectedTheme = themes[themeNumber];
  applyTheme(selectedTheme);
  saveThemePreference(selectedTheme);
  showConfirmation(`Theme applied: ${selectedTheme}`);
}
```

### Environment Variable Validation

**Validation on Startup:**
```typescript
const requiredEnvVars = {
  NEWS_API_KEY: 'NewsAPI key for headlines',
  SPORTS_API_KEY: 'Sports API key for scores',
  CRYPTO_API_KEY: 'CoinGecko API key',
  GOOGLE_CLOUD_PROJECT: 'Firebase project ID',
  VERTEX_AI_LOCATION: 'Vertex AI region'
};

function validateEnvironment() {
  const missing = [];
  for (const [key, description] of Object.entries(requiredEnvVars)) {
    if (!process.env[key]) {
      missing.push({ key, description });
    }
  }
  
  if (missing.length > 0) {
    logMissingEnvVars(missing);
    return false;
  }
  return true;
}
```

**Error Page Format:**
```
API KEY NOT CONFIGURED         210
════════════════════════════════════
⚠ NEWS_API_KEY is not set.

TO FIX THIS:
1. Get a free API key from:
   https://newsapi.org/
2. Add to .env.local:
   NEWS_API_KEY=your_key_here
3. Restart the dev server

See .env.example for reference.

Press 100 for INDEX
```

## Error Handling

### Error Categories

**Navigation Errors:**
- Invalid page numbers (out of range, non-numeric)
- Non-existent pages (valid number but no content defined)
- Navigation history errors (back button on first page)

Error response: Display error page in teletext format with error code and message, maintain current page state.

**API Errors:**
- External API unavailable (network error, timeout)
- API rate limiting
- Invalid API response format
- Authentication failures

Error response: Return cached content if available with "Cached" indicator, otherwise display service unavailable page in teletext format.

**Content Formatting Errors:**
- Content that cannot be formatted within constraints
- Invalid character encoding
- Malformed data structures

Error response: Log error, attempt best-effort formatting with truncation, display warning indicator on page.

**AI Service Errors:**
- LLM API failures
- Context length exceeded
- Invalid conversation state

Error response: Display error message in teletext format, offer option to retry or return to AI index.

### Error Page Format

All error pages follow the standard teletext format:

```
ERROR                          XXX
────────────────────────────────────
ERROR CODE: [CODE]

[ERROR MESSAGE]

[HELPFUL INFORMATION]

Press 100 for index
Press 000 to retry
```

### Logging Strategy

- All errors logged with timestamp, page ID, error type, and stack trace
- API errors include request/response details
- User navigation errors logged at INFO level
- System errors logged at ERROR level
- Performance metrics logged for page load times

## Testing Strategy

### Unit Testing

**Framework:** Jest with TypeScript support

**Core Logic Tests:**
- Text wrapping and truncation functions
- Page number validation and routing logic
- Color code parsing
- Input buffer management
- Navigation history stack operations
- Theme application logic
- Cache key generation and expiration

**Component Tests:**
- TeletextScreen rendering with various page configurations
- RemoteInterface input handling
- CRTFrame effect application
- PageRouter navigation logic

**Adapter Tests:**
- Each adapter's transformation logic with mock API responses
- Error handling for API failures
- Cache behavior for each adapter
- Edge cases (empty content, malformed data)

**Example Unit Tests:**
```typescript
describe('Text Wrapping', () => {
  it('should wrap long text at word boundaries', () => {
    const input = 'This is a very long sentence that exceeds forty characters';
    const result = wrapText(input, 40);
    expect(result.every(line => line.length <= 40)).toBe(true);
  });
  
  it('should hard-wrap words longer than 40 characters', () => {
    const input = 'Supercalifragilisticexpialidocious';
    const result = wrapText(input, 40);
    expect(result[0].length).toBe(40);
  });
});
```

### Property-Based Testing

**Framework:** fast-check (JavaScript/TypeScript property-based testing library)

**Configuration:** Each property test should run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Test Tagging:** Each property-based test must include a comment explicitly referencing the correctness property from this design document using the format: `// Feature: modern-teletext, Property X: [property text]`

**Property Test Examples:**

```typescript
import fc from 'fast-check';

describe('Property Tests', () => {
  it('Property 1: Page dimension invariant', () => {
    // Feature: modern-teletext, Property 1: Page dimension invariant
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer({ min: 100, max: 899 }).map(n => n.toString()),
          title: fc.string(),
          content: fc.array(fc.string())
        }),
        async (pageData) => {
          const adapter = new MockAdapter(pageData);
          const page = await adapter.getPage(pageData.id);
          
          expect(page.rows).toHaveLength(24);
          expect(page.rows.every(row => row.length <= 40)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 2: Valid page navigation', () => {
    // Feature: modern-teletext, Property 2: Valid page navigation
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 899 }),
        async (pageNumber) => {
          const startTime = Date.now();
          const page = await fetchPage(pageNumber.toString());
          const endTime = Date.now();
          
          expect(page).toBeDefined();
          expect(page.id).toBe(pageNumber.toString());
          expect(endTime - startTime).toBeLessThan(500);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 5: Text wrapping correctness', () => {
    // Feature: modern-teletext, Property 5: Text wrapping correctness
    fc.assert(
      fc.property(
        fc.string({ minLength: 41, maxLength: 500 }),
        (longText) => {
          const wrapped = wrapText(longText, 40);
          
          // All lines should be <= 40 chars
          expect(wrapped.every(line => line.length <= 40)).toBe(true);
          
          // Joined text should preserve content (minus whitespace changes)
          const rejoined = wrapped.join(' ').replace(/\s+/g, ' ');
          const original = longText.replace(/\s+/g, ' ');
          expect(rejoined).toBe(original);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 7: Magazine routing correctness', () => {
    // Feature: modern-teletext, Property 7: Magazine routing correctness
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 899 }),
        (pageNumber) => {
          const adapter = routeToAdapter(pageNumber.toString());
          const expectedMagazine = Math.floor(pageNumber / 100);
          
          const adapterMap = {
            1: 'StaticAdapter',
            2: 'NewsAdapter',
            3: 'SportsAdapter',
            4: 'MarketsAdapter',
            5: 'AIAdapter',
            6: 'GamesAdapter',
            7: 'SettingsAdapter',
            8: 'DevAdapter'
          };
          
          expect(adapter.constructor.name).toBe(adapterMap[expectedMagazine]);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Smart Generators:**

For AI conversation testing:
```typescript
const conversationStateArb = fc.record({
  contextId: fc.uuid(),
  mode: fc.constantFrom('qa', 'summarize', 'story', 'coding'),
  history: fc.array(
    fc.record({
      role: fc.constantFrom('user', 'assistant'),
      content: fc.string({ minLength: 1, maxLength: 500 }),
      pageId: fc.integer({ min: 500, max: 599 }).map(n => n.toString())
    }),
    { minLength: 1, maxLength: 10 }
  ),
  parameters: fc.dictionary(fc.string(), fc.string())
});
```

For page data:
```typescript
const teletextPageArb = fc.record({
  id: fc.integer({ min: 100, max: 899 }).map(n => n.toString()),
  title: fc.string({ maxLength: 40 }),
  rows: fc.array(fc.string({ maxLength: 40 }), { minLength: 24, maxLength: 24 }),
  links: fc.array(
    fc.record({
      label: fc.string({ maxLength: 20 }),
      targetPage: fc.integer({ min: 100, max: 899 }).map(n => n.toString()),
      color: fc.option(fc.constantFrom('red', 'green', 'yellow', 'blue'))
    })
  )
});
```

### Integration Testing

**Test Scenarios:**
- End-to-end navigation flows (index → news → back → sports)
- API integration with real external services (using test endpoints)
- Cache behavior across multiple requests
- Theme switching during active session
- AI conversation flows with multiple turns
- Error recovery scenarios

**Tools:**
- Playwright or Cypress for browser automation
- Mock Service Worker (MSW) for API mocking
- Test containers for isolated test environments

### Testing Implementation Order

1. **Implement core functionality first**, then write tests
2. **Unit tests** for utility functions (wrapping, parsing, formatting)
3. **Property tests** for data transformation and validation logic
4. **Component tests** for React components
5. **Integration tests** for full user flows
6. **Manual testing** for visual effects and performance

This implementation-first approach allows us to validate the design through working code, then ensure correctness through comprehensive testing.

## Performance Considerations

### Caching Strategy

**Multi-level cache:**
1. **Browser cache**: Static pages (100, 700-799) cached indefinitely
2. **Firestore cache**: Dynamic pages cached with TTL:
   - News: 5 minutes
   - Sports: 2 minutes (1 minute during live events)
   - Markets: 1 minute
   - AI responses: Session duration (stored in conversations collection)
3. **Service Worker**: Offline fallback for all previously viewed pages

**Firestore Cache Implementation:**
```typescript
async function getCachedPage(pageId: string): Promise<TeletextPage | null> {
  const cacheRef = firestore.collection('pages_cache').doc(pageId);
  const doc = await cacheRef.get();
  
  if (!doc.exists) return null;
  
  const data = doc.data() as PageCacheDocument;
  if (data.expiresAt.toDate() < new Date()) {
    // Cache expired, delete and return null
    await cacheRef.delete();
    return null;
  }
  
  // Update access count
  await cacheRef.update({ accessCount: FieldValue.increment(1) });
  
  return data.page;
}

async function setCachedPage(
  pageId: string, 
  page: TeletextPage, 
  ttlSeconds: number
): Promise<void> {
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(now.toMillis() + ttlSeconds * 1000);
  
  await firestore.collection('pages_cache').doc(pageId).set({
    pageId,
    page,
    source: page.meta?.source || 'unknown',
    cachedAt: now,
    expiresAt,
    accessCount: 0
  });
}
```

### Optimization Techniques

**Frontend:**
- Virtual scrolling for long page lists (if implementing page browser)
- Debounced keyboard input (100ms) to prevent excessive re-renders
- Memoized page rendering to avoid unnecessary recalculations
- CSS-only effects (scanlines, CRT) to minimize JavaScript overhead

**Backend:**
- Connection pooling for external API requests
- Request deduplication (multiple requests for same page return same promise)
- Batch API requests where possible
- Gzip compression for API responses

**Bundle Size:**
- Code splitting by magazine (lazy load adapters)
- Tree shaking to remove unused code
- Minification and compression
- Target bundle size: < 200KB initial load

### Performance Targets

- **Initial page load**: < 2 seconds
- **Cached page navigation**: < 100ms
- **Uncached page navigation**: < 500ms
- **Theme switching**: < 50ms
- **Input responsiveness**: < 16ms (60fps)

## Security Considerations

### Input Validation

- Sanitize all user input (page numbers, AI prompts)
- Validate page numbers against allowed range (100-899)
- Escape special characters in content from external APIs
- Prevent XSS through proper React escaping

### API Security

- Store API keys in environment variables, never in client code
- Implement rate limiting on backend endpoints
- Use CORS to restrict API access to known origins
- Validate and sanitize all external API responses

### Content Security

- Content Security Policy (CSP) headers to prevent XSS
- Sanitize HTML content from news APIs
- Limit AI response length to prevent abuse
- Implement request throttling for AI endpoints

## Deployment Architecture

### Firebase App Hosting Deployment

- **Platform**: Firebase App Hosting (Next.js optimized)
- **CDN**: Firebase CDN with automatic edge caching
- **Environment**: Production, staging, development
- **Deployment**: `firebase deploy --only hosting`

### Firebase Cloud Functions

- **Runtime**: Node.js 20
- **Region**: us-central1 (or multi-region for production)
- **Scaling**: Automatic scaling based on request volume
- **Deployment**: `firebase deploy --only functions`

### Firestore Configuration

- **Mode**: Native mode
- **Location**: us-central1 (same as Cloud Functions)
- **Indexes**: Composite indexes for conversation queries
- **Security Rules**: Strict rules for user data access

### Firebase Storage

- **Buckets**: 
  - `static-pages`: Static teletext pages (100, 700-799)
  - `themes`: Theme configuration files
  - `assets`: Images, fonts, other static assets
- **Security Rules**: Public read, admin write

### Environment Variables (Firebase Config)

```bash
# .env.local (for local development)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Cloud Functions environment (set via Firebase CLI)
firebase functions:config:set \
  apis.news_key="xxx" \
  apis.sports_key="xxx" \
  apis.crypto_key="xxx" \
  vertex.project_id="xxx" \
  vertex.location="us-central1" \
  cache.ttl_news="300" \
  cache.ttl_sports="120" \
  cache.ttl_markets="60" \
  ai.max_response_length="2000"
```

### Firebase Project Structure

```
firebase.json          # Firebase configuration
firestore.rules        # Firestore security rules
firestore.indexes.json # Firestore indexes
storage.rules          # Storage security rules
functions/
  src/
    index.ts          # Cloud Functions entry point
    adapters/         # Content adapters
    utils/            # Shared utilities
  package.json
public/               # Static assets
.firebaserc           # Firebase project aliases
```

## Future Enhancements

### Phase 2 Features

- User accounts and personalized page favorites
- Custom page creation (user-generated content)
- Real-time collaborative pages
- Mobile app with native keyboard
- Voice navigation ("Alexa, go to page 201")

### Phase 3 Features

- Teletext-as-a-Service API for third parties
- Plugin system for custom adapters
- Multi-language support
- Accessibility improvements (screen reader optimization)
- Analytics dashboard for page popularity

### Technical Debt Considerations

- Implement Firebase Authentication for user accounts
- Add comprehensive monitoring with Firebase Performance Monitoring
- Improve error tracking with Firebase Crashlytics
- Add automated performance testing in CI/CD
- Implement Firebase Remote Config for feature flags
- Set up Firebase App Check for security

## Appendix: Teletext Technical Reference

### Character Set

Standard teletext uses a 7-bit character set with control codes for colors and graphics. For web implementation, we use:
- Standard ASCII for text (0x20-0x7E)
- Control codes for colors (mapped to CSS classes)
- Box-drawing characters for graphics (Unicode box-drawing range)

### Color Codes

```
0: Black
1: Red
2: Green
3: Yellow
4: Blue
5: Magenta
6: Cyan
7: White
```

### Page Number Format

- 3 digits: 100-899
- First digit: Magazine number (1-8)
- Remaining digits: Page within magazine (00-99)
- Special pages: 100 (index), 666 (Easter egg), 800+ (dev tools)

### Historical Context

Teletext was developed in the UK in the 1970s as a way to broadcast text information over television signals. BBC's Ceefax (launched 1974) and ITV's ORACLE were the primary services. The technology was widely used across Europe until the digital television transition in the 2000s. The last teletext service (Ceefax) shut down in 2012.

This project resurrects that technology for the web era, maintaining the aesthetic and interaction model while adding modern capabilities.
