# Design Document

## Overview

This design outlines a complete overhaul of the Modern Teletext application to transform it from a partially functional prototype into a polished, competition-winning application. The system currently has significant gaps in functionality, particularly in the AI Oracle (500s), Games (600s), and Settings (700s) sections. This redesign will implement full AI integration, comprehensive input handling, working theme customization, and beautiful visual presentation across all page ranges.

The application is built on Firebase App Hosting with Firebase Functions for backend logic. The current architecture uses adapter patterns for different page ranges, React components for the frontend, and Firestore for state management. We will enhance this architecture while maintaining its core structure.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ TeletextScreen│  │ KeyboardHandler│ │ ThemeProvider│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Next.js API Routes)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/page/[pageNumber]/route.ts                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Layer (Firebase Functions)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  AIAdapter   │  │ GamesAdapter │  │SettingsAdapter│      │
│  │  (500-599)   │  │  (600-699)   │  │  (700-799)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data & AI Services                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Firestore  │  │  Vertex AI   │  │  Trivia API  │      │
│  │  (Sessions)  │  │   (Gemini)   │  │  (External)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**Client Layer:**
- TeletextScreen: Renders teletext pages with proper formatting and effects
- KeyboardHandler: Processes all keyboard input with context-aware logic
- ThemeProvider: Manages theme state and applies CSS custom properties
- InputBufferDisplay: Shows user input in real-time
- CRTFrame: Applies visual effects (scanlines, curvature, noise)

**API Layer:**
- Handles HTTP requests from client
- Routes to appropriate adapters based on page number
- Manages request cancellation and timeouts
- Returns formatted teletext pages as JSON

**Backend Layer (Adapters):**
- AIAdapter: Generates AI-powered content for pages 500-599
- GamesAdapter: Provides interactive games for pages 600-699
- SettingsAdapter: Manages theme and settings for pages 700-799
- Each adapter implements ContentAdapter interface

**Data & AI Services:**
- Firestore: Stores conversation history, quiz sessions, user preferences
- Vertex AI (Gemini): Generates AI responses for questions and stories
- External APIs: Trivia questions, random facts

## Components and Interfaces

### Core Interfaces

```typescript
// Teletext page structure
interface TeletextPage {
  id: string;
  title: string;
  rows: string[]; // Exactly 24 rows, each 40 characters
  links: PageLink[];
  meta: PageMetadata;
}

interface PageLink {
  label: string;
  targetPage: string;
  color?: 'red' | 'green' | 'yellow' | 'blue';
}

interface PageMetadata {
  source: string;
  lastUpdated: string;
  inputMode?: 'single' | 'double' | 'triple' | 'text';
  inputOptions?: string[];
  aiContextId?: string;
  aiGenerated?: boolean;
  haunting?: boolean;
  customHints?: string[];
  continuation?: {
    currentPage: string;
    nextPage?: string;
    previousPage?: string;
    totalPages: number;
    currentIndex: number;
  };
}

// Content adapter interface
interface ContentAdapter {
  getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage>;
}

// Theme configuration
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

### Enhanced Input Handler

```typescript
class InputHandler {
  // Context-aware input processing
  handleInput(key: string, currentPage: TeletextPage): InputResult;
  
  // Mode-specific handlers
  handleTextInput(text: string): void;
  handleNumericInput(digit: number): void;
  handleSingleChoice(option: string): void;
  
  // Buffer management
  getInputBuffer(): string;
  clearInputBuffer(): void;
  
  // Validation
  validateInput(input: string, mode: InputMode): boolean;
}
```

### AI Integration Service

```typescript
class AIService {
  // Generate AI responses
  generateResponse(prompt: string, context?: ConversationHistory): Promise<string>;
  
  // Manage conversations
  createConversation(mode: string, params: Record<string, any>): Promise<string>;
  getConversation(contextId: string): Promise<ConversationState | null>;
  updateConversation(contextId: string, userMsg: string, aiMsg: string): Promise<void>;
  
  // Format for teletext
  formatForTeletext(response: string, maxWidth: number): string[];
  paginateContent(lines: string[], linesPerPage: number): TeletextPage[];
}
```

### Theme Management System

```typescript
class ThemeManager {
  // Theme operations
  setTheme(themeKey: string): Promise<void>;
  getCurrentTheme(): ThemeConfig;
  getAllThemes(): Record<string, ThemeConfig>;
  
  // Persistence
  saveThemePreference(userId: string, themeKey: string): Promise<void>;
  loadThemePreference(userId: string): Promise<string>;
  
  // CSS management
  applyCSSVariables(theme: ThemeConfig): void;
  applyEffects(effects: ThemeEffects): void;
}
```

## Data Models

### Conversation State (Firestore)

```typescript
interface ConversationState {
  contextId: string;
  mode: 'qa' | 'spooky_story' | 'chat';
  history: Array<{
    role: 'user' | 'model';
    content: string;
    pageId: string;
    timestamp: Timestamp;
  }>;
  parameters: Record<string, any>;
  createdAt: Timestamp;
  lastAccessedAt: Timestamp;
  expiresAt: Timestamp; // 24 hours from creation
}
```

### Quiz Session (Firestore)

```typescript
interface QuizSession {
  sessionId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: boolean[];
  score: number;
  createdAt: Timestamp;
  expiresAt: Timestamp; // 1 hour from creation
}

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  category: string;
  difficulty: string;
}
```

### User Preferences (Firestore)

```typescript
interface UserPreferences {
  userId: string;
  theme: string; // Theme key
  favoritePages: string[];
  settings: {
    scanlines: boolean;
    curvature: boolean;
    noise: boolean;
    animationsEnabled: boolean;
    animationIntensity: number; // 0-100
  };
  effects: {
    scanlinesIntensity: number; // 0-100
    curvature: number; // 0-10
    noiseLevel: number; // 0-100
  };
  updatedAt: Timestamp;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: AI Response Generation

*For any* valid user question or prompt, when submitted to the AI service, the system should return a non-empty response formatted for teletext display within a reasonable timeout period
**Validates: Requirements 1.3, 1.4**

### Property 2: Input Mode Validation

*For any* page with a defined input mode, when a user enters input, the system should only accept characters that match the input mode constraints (numeric-only for page navigation, alphanumeric for text entry, single-digit for choices)
**Validates: Requirements 4.3, 4.4, 4.5, 9.2, 9.3, 9.4, 9.5**

### Property 3: Theme Application Consistency

*For any* theme selection, when applied, all page elements across the entire application should reflect the theme's colors and effects consistently
**Validates: Requirements 3.3, 3.4, 8.3, 8.4**

### Property 4: Input Buffer Display

*For any* interactive page, when a user types characters, the input buffer should display all entered characters in sequence until submission or clearing
**Validates: Requirements 4.2, 4.6**

### Property 5: Page Navigation Bounds

*For any* page number input, the system should accept values in the range 100-999 and reject values outside this range with appropriate error messages
**Validates: Requirements 6.1, 6.3, 6.4**

### Property 6: AI Context Preservation

*For any* conversation with multiple exchanges, the AI service should maintain conversation history and use it to provide contextually relevant responses
**Validates: Requirements 7.1, 7.2, 7.3**

### Property 7: Quiz Answer Validation

*For any* quiz question with multiple choice answers, when a user selects an answer, the system should correctly validate it against the correct answer and update the score accordingly
**Validates: Requirements 2.3, 2.5**

### Property 8: Theme Persistence

*For any* theme change, the system should persist the preference to storage and restore it on subsequent sessions
**Validates: Requirements 3.6, 8.6**

### Property 9: Error Recovery

*For any* error condition (network failure, AI timeout, invalid input), the system should display a user-friendly error message in teletext style and provide navigation options to recover
**Validates: Requirements 1.7, 2.7, 10.1, 10.2, 10.5**

### Property 10: Visual Effect Application

*For any* page rendering, when visual effects are enabled in the current theme, the system should apply scanlines, curvature, noise, and glitch effects consistently according to theme configuration
**Validates: Requirements 5.1, 5.5, 5.6, 5.7**

### Property 11: Input Context Switching

*For any* page navigation, when moving from one page to another with a different input mode, the system should clear the input buffer and switch to the appropriate input mode
**Validates: Requirements 9.1, 9.6**

### Property 12: AI Content Pagination

*For any* AI-generated response that exceeds page capacity, the system should automatically paginate the content across multiple pages with proper navigation links
**Validates: Requirements 7.4**

### Property 13: Session Expiration Handling

*For any* quiz or conversation session, when the expiration time is reached, the system should gracefully handle the expired session and prompt the user to start a new one
**Validates: Requirements 10.3, 10.6**

### Property 14: Character Input Acceptance

*For any* text input page, the system should accept all alphanumeric characters, spaces, and common punctuation marks
**Validates: Requirements 4.1, 4.2, 4.5**

### Property 15: Navigation Hint Accuracy

*For any* page with navigation links, the displayed navigation hints should accurately reflect the available navigation options and their corresponding actions
**Validates: Requirements 6.6**

## Error Handling

### Error Categories

1. **Network Errors**
   - AI service unavailable
   - External API failures
   - Firestore connection issues
   - Timeout errors

2. **Input Validation Errors**
   - Invalid page numbers
   - Invalid input for current mode
   - Empty required fields
   - Out-of-range values

3. **Session Errors**
   - Expired sessions
   - Invalid session IDs
   - Missing conversation context

4. **Content Errors**
   - Failed to generate AI response
   - Failed to fetch quiz questions
   - Failed to load page content

### Error Handling Strategy

**Graceful Degradation:**
- Display cached content when network is unavailable
- Use fallback quiz questions when API fails
- Show placeholder pages for unimplemented features

**User-Friendly Messages:**
- All errors displayed in authentic teletext style
- Clear explanation of what went wrong
- Actionable next steps (retry, go back, go to index)

**Automatic Recovery:**
- Retry failed AI requests with exponential backoff
- Cancel pending requests when navigating away
- Clean up expired sessions automatically

**Error Page Template:**
```
ERROR                        P???
════════════════════════════════════
[ERROR TYPE]

[Clear explanation of the error]

[What caused it]

[What the user can do]

Press [X] to [action]
Press 100 for main index

[NAVIGATION LINKS]
```

## Testing Strategy

### Unit Testing

**Input Handler Tests:**
- Test each input mode (single, double, triple, text)
- Test input validation for each mode
- Test buffer management (add, remove, clear)
- Test mode switching between pages

**Theme Manager Tests:**
- Test theme application
- Test CSS variable updates
- Test persistence to Firestore
- Test theme loading on startup

**AI Service Tests:**
- Test response generation (mocked)
- Test conversation management
- Test content formatting
- Test pagination logic

**Adapter Tests:**
- Test page generation for each adapter
- Test parameter handling
- Test error scenarios
- Test session management

### Property-Based Testing

We will use **fast-check** for JavaScript/TypeScript property-based testing. Each property test will run a minimum of 100 iterations.

**Property Test 1: Input Mode Validation**
```typescript
// Feature: teletext-complete-overhaul, Property 2: Input Mode Validation
// Validates: Requirements 4.3, 4.4, 4.5, 9.2, 9.3, 9.4, 9.5
fc.assert(
  fc.property(
    fc.oneof(
      fc.constant('single'),
      fc.constant('double'),
      fc.constant('triple'),
      fc.constant('text')
    ),
    fc.string(),
    (mode, input) => {
      const handler = new InputHandler(mode);
      const isValid = handler.validateInput(input);
      
      // Verify validation matches mode constraints
      if (mode === 'single') {
        return isValid === /^[0-9]$/.test(input);
      } else if (mode === 'double') {
        return isValid === /^[0-9]{1,2}$/.test(input);
      } else if (mode === 'triple') {
        return isValid === /^[0-9]{1,3}$/.test(input);
      } else {
        return isValid === input.length > 0;
      }
    }
  ),
  { numRuns: 100 }
);
```

**Property Test 2: Theme Application Consistency**
```typescript
// Feature: teletext-complete-overhaul, Property 3: Theme Application Consistency
// Validates: Requirements 3.3, 3.4, 8.3, 8.4
fc.assert(
  fc.property(
    fc.constantFrom('ceefax', 'orf', 'highcontrast', 'haunting'),
    async (themeKey) => {
      const themeManager = new ThemeManager();
      await themeManager.setTheme(themeKey);
      
      const appliedTheme = themeManager.getCurrentTheme();
      const expectedTheme = themes[themeKey];
      
      // Verify all colors match
      return (
        appliedTheme.colors.background === expectedTheme.colors.background &&
        appliedTheme.colors.text === expectedTheme.colors.text &&
        appliedTheme.effects.scanlines === expectedTheme.effects.scanlines
      );
    }
  ),
  { numRuns: 100 }
);
```

**Property Test 3: Page Navigation Bounds**
```typescript
// Feature: teletext-complete-overhaul, Property 5: Page Navigation Bounds
// Validates: Requirements 6.1, 6.3, 6.4
fc.assert(
  fc.property(
    fc.integer(),
    (pageNumber) => {
      const router = new NavigationRouter();
      
      if (pageNumber >= 100 && pageNumber <= 999) {
        // Should accept valid page numbers
        return router.isValidPageNumber(pageNumber) === true;
      } else {
        // Should reject invalid page numbers
        return router.isValidPageNumber(pageNumber) === false;
      }
    }
  ),
  { numRuns: 100 }
);
```

**Property Test 4: AI Content Pagination**
```typescript
// Feature: teletext-complete-overhaul, Property 12: AI Content Pagination
// Validates: Requirements 7.4
fc.assert(
  fc.property(
    fc.string({ minLength: 1, maxLength: 5000 }),
    (content) => {
      const aiService = new AIService();
      const pages = aiService.paginateContent(content, 40, 18);
      
      // Verify all pages have correct structure
      return pages.every(page => 
        page.rows.length === 24 &&
        page.rows.every(row => row.length === 40) &&
        (pages.length === 1 || page.meta.continuation !== undefined)
      );
    }
  ),
  { numRuns: 100 }
);
```

**Property Test 5: Input Buffer Display**
```typescript
// Feature: teletext-complete-overhaul, Property 4: Input Buffer Display
// Validates: Requirements 4.2, 4.6
fc.assert(
  fc.property(
    fc.array(fc.integer({ min: 0, max: 9 }), { maxLength: 3 }),
    (digits) => {
      const handler = new InputHandler('triple');
      
      // Add each digit
      digits.forEach(d => handler.handleDigitInput(d));
      
      const buffer = handler.getInputBuffer();
      const expected = digits.join('');
      
      // Buffer should match entered digits
      return buffer === expected;
    }
  ),
  { numRuns: 100 }
);
```

### Integration Testing

**End-to-End Flows:**
- Complete AI Oracle question flow (500 → 510 → 511 → response)
- Complete quiz flow (600 → 601 → questions → results)
- Theme selection and application (700 → select → verify across pages)
- Page navigation with different input modes

**Cross-Component Testing:**
- Input handler + navigation router
- Theme manager + CSS application
- AI service + adapter + page rendering

### Manual Testing Checklist

- [ ] All 500s pages accept input and generate AI responses
- [ ] All 600s pages display AI-generated quiz questions
- [ ] All 700s pages allow theme selection and apply changes
- [ ] Input works for all character types (letters, numbers, symbols)
- [ ] Themes apply consistently across all pages
- [ ] Visual effects (scanlines, curvature, noise) work correctly
- [ ] Error pages display properly for all error scenarios
- [ ] Navigation works for all page ranges (100-999)
- [ ] Edge cases handled (invalid pages, expired sessions, network errors)

## Implementation Notes

### AI Integration

**Vertex AI (Gemini) Configuration:**
- Model: gemini-1.5-flash (fast responses, good for interactive use)
- Temperature: 0.7 (balanced creativity and consistency)
- Max tokens: 1000 (sufficient for teletext pages)
- Timeout: 10 seconds (reasonable for user experience)

**Prompt Engineering:**
- Include teletext formatting instructions in system prompt
- Specify character width (40) and avoid special formatting
- Request clear, concise responses suitable for screen display
- For stories: request paragraph breaks and proper pacing

**Context Management:**
- Store last 10 conversation turns in Firestore
- Include conversation history in AI requests for continuity
- Expire conversations after 24 hours
- Clean up expired conversations automatically

### Input Handling

**Mode Detection:**
- Single-digit: Pages with inputOptions array (e.g., menu selections)
- Double-digit: Subpage navigation (e.g., 100-199)
- Triple-digit: Main page navigation (e.g., 100-999)
- Text: Pages with inputMode='text' (e.g., AI questions)

**Buffer Management:**
- Clear buffer on successful navigation
- Clear buffer on mode change
- Show buffer only for multi-digit modes
- Auto-submit when buffer is full (double/triple modes)

**Validation:**
- Validate against inputOptions for single-digit mode
- Validate numeric range for double/triple modes
- Validate non-empty for text mode
- Show error feedback for invalid input

### Theme System

**CSS Custom Properties:**
```css
:root {
  --teletext-bg: #0000AA;
  --teletext-text: #FFFF00;
  --teletext-red: #FF0000;
  --teletext-green: #00FF00;
  --teletext-yellow: #FFFF00;
  --teletext-blue: #0000FF;
  --teletext-magenta: #FF00FF;
  --teletext-cyan: #00FFFF;
  --teletext-white: #FFFFFF;
  
  --scanlines-intensity: 0.5;
  --curvature: 5px;
  --noise-level: 0.1;
}
```

**Theme Application Flow:**
1. User selects theme on page 700
2. ThemeProvider updates state
3. CSS custom properties updated via JavaScript
4. Theme preference saved to Firestore
5. Confirmation message displayed
6. All components re-render with new theme

**Effect Implementation:**
- Scanlines: CSS pseudo-element with repeating gradient
- Curvature: CSS border-radius on screen container
- Noise: Animated SVG filter
- Glitch: CSS animation with transform and opacity

### Performance Considerations

**Caching:**
- Cache AI responses for 5 minutes
- Cache quiz questions for session duration
- Cache theme preferences in localStorage
- Cache page content for back navigation

**Request Optimization:**
- Cancel pending AI requests on navigation
- Debounce input handling (100ms)
- Lazy load adapters
- Preload next page in quiz flow

**Rendering Optimization:**
- Memoize theme CSS variables
- Use React.memo for static components
- Virtualize long conversation histories
- Optimize CRT effect rendering

### Deployment Configuration

**Environment Variables:**
```
GOOGLE_CLOUD_PROJECT=<project-id>
VERTEX_LOCATION=us-central1
API_NINJAS_KEY=<api-key>
NEXT_PUBLIC_FIREBASE_CONFIG=<config-json>
```

**Firebase Functions Configuration:**
- Runtime: Node.js 20
- Memory: 512MB (AI adapter), 256MB (others)
- Timeout: 60s (AI adapter), 30s (others)
- Concurrency: 80

**Firestore Indexes:**
- conversations: (lastAccessedAt, DESC)
- quiz_sessions: (expiresAt, ASC)
- user_preferences: (userId, ASC)

**Security Rules:**
- Allow read/write to own user preferences
- Allow read/write to own sessions
- Allow read to public content
- Deny all other access
