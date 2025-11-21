# Design Document

## Overview

The Teletext UX Redesign transforms the Modern Teletext application from a minimal, functional interface into a rich, animated experience that maximizes screen utilization, provides clear navigation guidance, and creates an immersive thematic atmosphere. This design builds upon the existing 40×24 character grid architecture while introducing comprehensive visual enhancements including theme-specific animations, full-screen layouts, contextual navigation indicators, and an enhanced Halloween/Kiroween mode with spooky effects.

The redesign maintains the authentic teletext aesthetic (colors, fonts, character grid) while modernizing the user experience through strategic use of CSS animations, improved information architecture, and visual feedback systems. Every page will utilize the full screen space, display clear navigation options, and provide animated elements that match the selected theme. The goal is to create an interface where users immediately understand how to navigate and interact, while feeling immersed in a living, breathing retro-futuristic environment.

## Architecture

### Enhanced Component Architecture

The redesign extends the existing architecture with new components and enhanced functionality:

```
┌─────────────────────────────────────────────────────────────┐
│                    Enhanced Frontend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Teletext   │  │  Animation   │  │   Layout     │      │
│  │   Screen     │  │   Engine     │  │   Manager    │      │
│  │  (Enhanced)  │  │   (NEW)      │  │   (NEW)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                │                  │              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Remote     │  │  Navigation  │  │   Theme      │      │
│  │  Interface   │  │  Indicators  │  │   System     │      │
│  │  (Enhanced)  │  │   (NEW)      │  │  (Enhanced)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                │                  │              │
│           └────────────────┴──────────────────┘              │
│                          │                                   │
│                   ┌──────▼──────┐                           │
│                   │ Page Router │                           │
│                   │  (Enhanced) │                           │
│                   └──────┬──────┘                           │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    (Existing Backend)
```

### New Components

**Animation Engine:**
- Manages all CSS and JavaScript animations
- Coordinates theme-specific animation sets
- Handles frame-by-frame ASCII art animations
- Controls transition effects between pages

**Layout Manager:**
- Calculates optimal content distribution across 40×24 grid
- Manages full-screen utilization with minimal padding
- Handles dynamic content reflow for different page types
- Coordinates header, content, and footer positioning

**Navigation Indicators:**
- Displays contextual navigation hints
- Shows breadcrumb trails and page position
- Renders arrow indicators for multi-page content
- Manages visual feedback for user input

### Enhanced Existing Components

**TeletextScreen (Enhanced):**
- Adds animation layer for theme-specific effects
- Implements full-screen layout with optimized spacing
- Adds visual indicators for interactive elements
- Supports animated ASCII art rendering

**RemoteInterface (Enhanced):**
- Adds visual feedback for button presses
- Implements dynamic button labeling based on page context
- Adds glow/highlight effects for available buttons
- Supports animated button state transitions

**ThemeSystem (Enhanced):**
- Expands to support theme-specific animation sets
- Adds transition animations between themes
- Implements Kiroween theme with Halloween effects
- Manages background animations and decorative elements

## Components and Interfaces

### Animation Engine

```typescript
interface AnimationEngine {
  // Theme-specific animation sets
  themeAnimations: Map<string, ThemeAnimationSet>;
  
  // Current active animations
  activeAnimations: Animation[];
  
  // Methods
  playAnimation(name: string, target: HTMLElement): void;
  stopAnimation(animationId: string): void;
  setTheme(themeName: string): void;
  registerAnimation(name: string, config: AnimationConfig): void;
}

interface ThemeAnimationSet {
  pageTransition: AnimationConfig;
  loadingIndicator: AnimationConfig;
  buttonPress: AnimationConfig;
  textEntry: AnimationConfig;
  backgroundEffects: AnimationConfig[];
  decorativeElements: AnimationConfig[];
}

interface AnimationConfig {
  name: string;
  type: 'css' | 'javascript' | 'ascii-frames';
  duration: number;  // milliseconds
  easing?: string;
  frames?: string[];  // For ASCII art animations
  cssClass?: string;
  keyframes?: Keyframe[];
}
```

**Theme Animation Sets:**

```typescript
const CEEFAX_ANIMATIONS: ThemeAnimationSet = {
  pageTransition: {
    name: 'horizontal-wipe',
    type: 'css',
    duration: 300,
    cssClass: 'ceefax-wipe'
  },
  loadingIndicator: {
    name: 'rotating-line',
    type: 'ascii-frames',
    duration: 1000,
    frames: ['|', '/', '─', '\\']
  },
  buttonPress: {
    name: 'flash',
    type: 'css',
    duration: 150,
    cssClass: 'button-flash'
  },
  textEntry: {
    name: 'blink-cursor',
    type: 'css',
    duration: 500,
    cssClass: 'cursor-blink'
  },
  backgroundEffects: [
    {
      name: 'scanlines',
      type: 'css',
      duration: 0,  // Continuous
      cssClass: 'scanlines-overlay'
    }
  ],
  decorativeElements: []
};

const HAUNTING_ANIMATIONS: ThemeAnimationSet = {
  pageTransition: {
    name: 'glitch-transition',
    type: 'javascript',
    duration: 400,
    keyframes: [
      { transform: 'translateX(0)', filter: 'none' },
      { transform: 'translateX(-5px)', filter: 'hue-rotate(90deg)' },
      { transform: 'translateX(5px)', filter: 'hue-rotate(-90deg)' },
      { transform: 'translateX(0)', filter: 'none' }
    ]
  },
  loadingIndicator: {
    name: 'pulsing-skull',
    type: 'ascii-frames',
    duration: 800,
    frames: ['💀', '👻', '💀', '🎃']
  },
  buttonPress: {
    name: 'horror-flash',
    type: 'css',
    duration: 200,
    cssClass: 'horror-flash'
  },
  textEntry: {
    name: 'glitch-cursor',
    type: 'css',
    duration: 300,
    cssClass: 'glitch-cursor'
  },
  backgroundEffects: [
    {
      name: 'floating-ghosts',
      type: 'css',
      duration: 10000,
      cssClass: 'ghost-float'
    },
    {
      name: 'screen-flicker',
      type: 'css',
      duration: 5000,
      cssClass: 'screen-flicker'
    },
    {
      name: 'chromatic-aberration',
      type: 'css',
      duration: 0,
      cssClass: 'chromatic-aberration'
    }
  ],
  decorativeElements: [
    {
      name: 'jack-o-lantern',
      type: 'ascii-frames',
      duration: 1000,
      frames: [
        '🎃',
        '🎃',  // Flickering effect
        '🎃'
      ]
    },
    {
      name: 'floating-bat',
      type: 'css',
      duration: 8000,
      cssClass: 'bat-float'
    }
  ]
};
```

### Layout Manager

```typescript
interface LayoutManager {
  calculateLayout(page: TeletextPage, options: LayoutOptions): LayoutResult;
  optimizeSpacing(content: string[], maxRows: number): string[];
  centerText(text: string, width: number): string;
  justifyText(text: string, width: number): string;
  createHeader(title: string, metadata: HeaderMetadata): string[];
  createFooter(navigation: NavigationOptions): string[];
}

interface LayoutOptions {
  fullScreen: boolean;  // Use all 24 rows
  headerRows: number;   // Rows reserved for header (default: 2)
  footerRows: number;   // Rows reserved for footer (default: 2)
  contentAlignment: 'left' | 'center' | 'justify';
  showBreadcrumbs: boolean;
  showPageIndicator: boolean;
}

interface LayoutResult {
  header: string[];     // Formatted header rows
  content: string[];    // Formatted content rows
  footer: string[];     // Formatted footer rows
  totalRows: number;    // Should equal 24
}

interface HeaderMetadata {
  pageNumber: string;
  title: string;
  timestamp?: string;
  cacheStatus?: 'LIVE' | 'CACHED';
  breadcrumbs?: string[];
  pagePosition?: { current: number; total: number };
  contentType?: 'NEWS' | 'SPORT' | 'MARKETS' | 'AI' | 'GAMES';
}

interface NavigationOptions {
  backToIndex: boolean;
  coloredButtons?: { color: string; label: string; page: string }[];
  arrowNavigation?: { up?: string; down?: string };
  customHints?: string[];
}
```

**Layout Calculation Example:**

```typescript
function calculateLayout(
  page: TeletextPage, 
  options: LayoutOptions
): LayoutResult {
  const header = createHeader(page.title, {
    pageNumber: page.id,
    title: page.title,
    timestamp: page.meta?.lastUpdated,
    cacheStatus: page.meta?.cacheStatus === 'cached' ? 'CACHED' : 'LIVE',
    breadcrumbs: getBreadcrumbs(),
    pagePosition: page.meta?.continuation,
    contentType: getContentType(page.id)
  });
  
  const footer = createFooter({
    backToIndex: true,
    coloredButtons: page.links.filter(l => l.color),
    arrowNavigation: {
      up: page.meta?.continuation?.previousPage,
      down: page.meta?.continuation?.nextPage
    },
    customHints: getContextualHints(page)
  });
  
  const availableRows = 24 - header.length - footer.length;
  const content = optimizeSpacing(page.rows, availableRows);
  
  return {
    header,
    content,
    footer,
    totalRows: header.length + content.length + footer.length
  };
}
```

### Navigation Indicators Component

```typescript
interface NavigationIndicators {
  renderBreadcrumbs(history: string[]): string;
  renderPagePosition(current: number, total: number): string;
  renderArrowIndicators(up: boolean, down: boolean): string[];
  renderInputBuffer(digits: string): string;
  renderContextualHelp(pageType: string): string[];
}

// Breadcrumb rendering
function renderBreadcrumbs(history: string[]): string {
  if (history.length === 0) return 'INDEX';
  if (history.length <= 3) {
    return history.join(' > ');
  }
  // Show last 3 with ellipsis
  return `... > ${history.slice(-3).join(' > ')}`;
}

// Page position indicator
function renderPagePosition(current: number, total: number): string {
  return `Page ${current}/${total}`;
}

// Arrow indicators for multi-page content
function renderArrowIndicators(up: boolean, down: boolean): string[] {
  const indicators: string[] = [];
  
  if (up) {
    indicators.push('▲ Press ↑ for previous');
  }
  
  if (down) {
    indicators.push('▼ Press ↓ for more');
  } else if (!up) {
    indicators.push('END OF CONTENT');
  }
  
  return indicators;
}

// Contextual help based on page type
function renderContextualHelp(pageType: string): string[] {
  const helpMap: Record<string, string[]> = {
    'index': ['Enter page number or use colored buttons'],
    'content': ['100=INDEX  ↑↓=SCROLL  BACK=PREVIOUS'],
    'ai-menu': ['Enter number to select option'],
    'quiz': ['Enter 1-4 to answer'],
    'settings': ['Enter number to change setting']
  };
  
  return helpMap[pageType] || ['Press 100 for INDEX'];
}
```

### Enhanced Theme System

```typescript
interface EnhancedThemeConfig extends ThemeConfig {
  animations: ThemeAnimationSet;
  decorativeElements: DecorativeElement[];
  transitionStyle: TransitionStyle;
  backgroundEffects: BackgroundEffect[];
}

interface DecorativeElement {
  type: 'ascii-art' | 'emoji' | 'symbol';
  content: string | string[];  // String or animation frames
  position: 'header' | 'footer' | 'corner' | 'floating';
  animation?: AnimationConfig;
}

interface TransitionStyle {
  type: 'fade' | 'wipe' | 'glitch' | 'slide';
  duration: number;
  easing: string;
}

interface BackgroundEffect {
  name: string;
  cssClass: string;
  intensity: number;  // 0-100
  zIndex: number;
}
```

**Kiroween Theme Configuration:**

```typescript
const KIROWEEN_THEME: EnhancedThemeConfig = {
  name: 'Kiroween',
  colors: {
    background: '#000000',
    text: '#00ff00',
    red: '#ff0000',
    green: '#00ff00',
    yellow: '#ffaa00',
    blue: '#6600ff',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    white: '#ffffff'
  },
  effects: {
    scanlines: true,
    curvature: true,
    noise: true,
    glitch: true
  },
  animations: HAUNTING_ANIMATIONS,
  decorativeElements: [
    {
      type: 'emoji',
      content: ['🎃', '🎃', '🎃'],  // Flickering pumpkin
      position: 'corner',
      animation: {
        name: 'flicker',
        type: 'ascii-frames',
        duration: 1000,
        frames: ['🎃', '🎃', '🎃']
      }
    },
    {
      type: 'emoji',
      content: '👻',
      position: 'floating',
      animation: {
        name: 'float-across',
        type: 'css',
        duration: 10000,
        cssClass: 'ghost-float'
      }
    },
    {
      type: 'emoji',
      content: '🦇',
      position: 'floating',
      animation: {
        name: 'bat-fly',
        type: 'css',
        duration: 8000,
        cssClass: 'bat-float'
      }
    },
    {
      type: 'ascii-art',
      content: [
        '  /\\_/\\  ',
        ' ( o.o ) ',
        '  > ^ <  '
      ],
      position: 'header',
      animation: {
        name: 'blink',
        type: 'ascii-frames',
        duration: 2000,
        frames: [
          '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',
          '  /\\_/\\  \n ( -.o ) \n  > ^ <  ',
          '  /\\_/\\  \n ( o.- ) \n  > ^ <  '
        ]
      }
    }
  ],
  transitionStyle: {
    type: 'glitch',
    duration: 400,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  backgroundEffects: [
    {
      name: 'chromatic-aberration',
      cssClass: 'chromatic-aberration',
      intensity: 30,
      zIndex: 1
    },
    {
      name: 'screen-flicker',
      cssClass: 'screen-flicker',
      intensity: 20,
      zIndex: 2
    },
    {
      name: 'fog-overlay',
      cssClass: 'fog-overlay',
      intensity: 15,
      zIndex: 0
    }
  ]
};
```

## Data Models

### Enhanced Page Model

```typescript
interface EnhancedTeletextPage extends TeletextPage {
  layout: LayoutMetadata;
  animations: PageAnimations;
  interactiveElements: InteractiveElement[];
}

interface LayoutMetadata {
  fullScreen: boolean;
  headerRows: number;
  footerRows: number;
  contentRows: number;
  alignment: 'left' | 'center' | 'justify';
}

interface PageAnimations {
  entryAnimation?: AnimationConfig;
  exitAnimation?: AnimationConfig;
  idleAnimations?: AnimationConfig[];
  loadingAnimation?: AnimationConfig;
}

interface InteractiveElement {
  type: 'button' | 'link' | 'input' | 'selection';
  row: number;
  column: number;
  width: number;
  label: string;
  action: string;  // Page number or command
  highlightStyle: string;
}
```

### Navigation State

```typescript
interface NavigationState {
  currentPage: string;
  history: string[];
  inputBuffer: string;
  breadcrumbs: string[];
  availableActions: NavigationAction[];
}

interface NavigationAction {
  type: 'page' | 'back' | 'forward' | 'scroll' | 'color-button';
  label: string;
  key?: string;  // Keyboard shortcut
  color?: string;  // For colored buttons
  target?: string;  // Target page or direction
}
```

### Animation State

```typescript
interface AnimationState {
  currentTheme: string;
  activeAnimations: Map<string, Animation>;
  backgroundEffects: BackgroundEffect[];
  decorativeElements: DecorativeElement[];
  transitionInProgress: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Full screen utilization
*For any* page rendered by the system, at least 90% of the 40×24 character grid (864 of 960 characters) should contain non-whitespace content.
**Validates: Requirements 1.1**

### Property 2: Minimal padding
*For any* page layout, empty rows at top/bottom and empty columns at left/right should not exceed 10% of the total grid dimensions.
**Validates: Requirements 1.2**

### Property 3: Header and footer positioning
*For any* page with navigation, the header should occupy row 0-1 and the footer should occupy rows 22-23.
**Validates: Requirements 1.4**

### Property 4: Page number alignment consistency
*For any* list of navigation options with page numbers, all page numbers should be left-aligned in the same column regardless of digit count (1, 2, or 3 digits).
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 5: Content overflow indicators
*For any* content that exceeds 24 rows, the system should display a downward arrow (▼) indicator and navigation instruction in the bottom-right area.
**Validates: Requirements 3.1, 3.3**

### Property 6: Continuation page indicators
*For any* continuation page (not the first page of multi-page content), the system should display an upward arrow (▲) indicator in the top-right area.
**Validates: Requirements 3.2**

### Property 7: Page position display
*For any* multi-page content, the header should display the current page position in the format "Page X/Y" where X is current and Y is total.
**Validates: Requirements 3.5**

### Property 8: Navigation shortcuts with icons
*For any* page with navigation options, shortcuts should be displayed with visual icons or symbols (e.g., "►", "🔴", "↑").
**Validates: Requirements 4.3**

### Property 9: Magazine section color coding
*For any* index page displaying magazine sections, different sections should use different colors or visual separators.
**Validates: Requirements 4.4**

### Property 10: Theme-specific animations
*For any* two different themes, the animation configurations should differ in at least one animation type (transition, loading, or background effects).
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 11: Animation presence
*For any* page rendered in the system, at least one animated element should be present (cursor, indicator, or decorative element).
**Validates: Requirements 6.1**

### Property 12: Theme-specific decorations
*For any* page when Haunting Mode is active, at least one Halloween-themed decorative element (pumpkin, ghost, bat, skull) should be present.
**Validates: Requirements 6.2, 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 13: Loading animation theme matching
*For any* loading state, the loading animation should match the currently active theme's animation set.
**Validates: Requirements 6.3, 14.1**

### Property 14: Navigation hints presence
*For any* page, the footer should contain at least one navigation hint or instruction.
**Validates: Requirements 8.1, 11.1**

### Property 15: Colored button indicators
*For any* page with colored button navigation, the footer should display colored indicators with labels for each available button.
**Validates: Requirements 8.2**

### Property 16: Arrow navigation indicators
*For any* page with arrow key navigation enabled, arrow symbols with descriptions should be displayed in the footer.
**Validates: Requirements 8.3**

### Property 17: Context-sensitive help
*For any* two pages of different types (index, content, AI, quiz, settings), the navigation hints should differ to reflect the page-specific actions.
**Validates: Requirements 11.2, 11.3, 11.4, 11.5**

### Property 18: CSS animation usage
*For any* background effect or decorative animation, the implementation should use CSS animations or transitions rather than JavaScript-based animation loops.
**Validates: Requirements 12.3**

### Property 19: Content type indicators
*For any* page belonging to a specific content type (NEWS, SPORT, MARKETS, AI, GAMES), the header should display a visual indicator or icon for that type.
**Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**

### Property 20: Loading text rotation
*For any* loading state lasting longer than 2 seconds, the loading text should change at least once during the loading period.
**Validates: Requirements 14.5**

### Property 21: Input visual feedback
*For any* user input action (key press, button click, arrow press), visual feedback should appear within 50 milliseconds.
**Validates: Requirements 15.1, 15.2, 15.3, 15.4**

### Property 22: Breadcrumb presence
*For any* page except page 100, a breadcrumb trail should be displayed in the header showing navigation history.
**Validates: Requirements 16.1**

### Property 23: Breadcrumb truncation
*For any* navigation history exceeding 3 pages, the breadcrumb should display "..." followed by the last 3 pages.
**Validates: Requirements 16.2**

### Property 24: Timestamp display
*For any* page displaying time-sensitive content (news, sports, markets), a timestamp or "last updated" indicator should be present in the header.
**Validates: Requirements 18.1, 18.2, 18.3, 18.5**

### Property 25: Progress indicators
*For any* multi-step process (AI flow, quiz), a progress indicator showing current step and total steps should be displayed.
**Validates: Requirements 19.1, 19.2, 19.3**

### Property 26: Weather icon animations
*For any* weather page, weather condition icons should be animated (e.g., falling rain, moving clouds).
**Validates: Requirements 20.2**

### Property 27: Live sports indicators
*For any* sports page displaying live matches, a "LIVE" indicator with animation should be present for ongoing games.
**Validates: Requirements 22.1**

### Property 28: Market trend indicators
*For any* market data page, price changes should be displayed with trend arrows (▲ for up, ▼ for down, ► for stable).
**Validates: Requirements 23.1**

### Property 29: AI typing animation
*For any* AI-generated response, text should be revealed character-by-character with a typing animation effect.
**Validates: Requirements 24.1, 24.2**

### Property 30: Interactive element highlighting
*For any* interactive element (button, link, selection), visual highlighting should be applied using brackets, color, or background.
**Validates: Requirements 25.1, 25.2, 25.3**

### Property 31: Remote button highlighting
*For any* page with colored button navigation, the corresponding buttons on the on-screen remote should be highlighted or glowing.
**Validates: Requirements 26.2**

### Property 32: Theme transition timing
*For any* theme switch, the transition animation should complete within 500-1000 milliseconds.
**Validates: Requirements 27.1, 27.2**

### Property 33: Action success feedback
*For any* successful user action (save, submit, complete), a success message with visual indicator (✓) should be displayed for 2-3 seconds.
**Validates: Requirements 28.1, 28.2, 28.3**

## Error Handling

### Animation Errors

**Animation Failure:**
- If CSS animation fails to load, fall back to static display
- If JavaScript animation throws error, log and continue without animation
- Never block page rendering due to animation errors

**Performance Degradation:**
- If frame rate drops below 30fps, automatically reduce animation complexity
- Provide user setting to disable animations entirely
- Monitor performance and adjust animation intensity dynamically

### Layout Errors

**Content Overflow:**
- If content cannot fit in available space, truncate with "..." indicator
- If layout calculation fails, fall back to simple top-to-bottom layout
- Log layout errors for debugging but display content regardless

**Invalid Dimensions:**
- If page dimensions are invalid, enforce 40×24 constraint
- If row count doesn't equal 24, pad with empty rows or truncate
- Validate all layout calculations before rendering

### Theme Errors

**Missing Theme Assets:**
- If theme configuration is missing, fall back to Classic Ceefax theme
- If animation set is incomplete, use default animations
- If decorative elements fail to load, continue without them

**Theme Switching Errors:**
- If theme switch fails, revert to previous theme
- Display error message to user if theme cannot be applied
- Save theme preference only after successful application

## Testing Strategy

### Unit Testing

**Layout Manager Tests:**
- Test full-screen utilization calculation
- Test header/footer positioning
- Test content alignment (left, center, justify)
- Test breadcrumb rendering with various history lengths
- Test page position indicator formatting

**Animation Engine Tests:**
- Test animation registration and retrieval
- Test theme animation set loading
- Test animation timing and duration
- Test CSS class application
- Test frame-by-frame ASCII animation

**Navigation Indicators Tests:**
- Test arrow indicator rendering
- Test contextual help generation
- Test input buffer display
- Test colored button indicator formatting

### Property-Based Testing

**Framework:** fast-check (JavaScript/TypeScript property-based testing library)

**Configuration:** Each property test should run a minimum of 100 iterations.

**Test Tagging:** Each property-based test must include a comment: `// Feature: teletext-ux-redesign, Property X: [property text]`

**Example Property Tests:**

```typescript
import fc from 'fast-check';

describe('UX Redesign Property Tests', () => {
  it('Property 1: Full screen utilization', () => {
    // Feature: teletext-ux-redesign, Property 1: Full screen utilization
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ maxLength: 40 }),
          content: fc.array(fc.string({ maxLength: 40 }), { minLength: 1, maxLength: 50 })
        }),
        (pageData) => {
          const layout = layoutManager.calculateLayout({
            id: '200',
            title: pageData.title,
            rows: pageData.content,
            links: []
          }, { fullScreen: true });
          
          const totalChars = layout.header.concat(layout.content, layout.footer)
            .join('')
            .replace(/\s/g, '').length;
          
          expect(totalChars).toBeGreaterThanOrEqual(864); // 90% of 960
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 4: Page number alignment consistency', () => {
    // Feature: teletext-ux-redesign, Property 4: Page number alignment consistency
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            page: fc.integer({ min: 1, max: 899 }),
            label: fc.string({ maxLength: 30 })
          }),
          { minLength: 3, maxLength: 10 }
        ),
        (navOptions) => {
          const formatted = navOptions.map(opt => 
            formatNavigationOption(opt.page, opt.label)
          );
          
          // All page numbers should start at the same column
          const pageNumPositions = formatted.map(line => 
            line.search(/\d/)
          );
          
          const allSame = pageNumPositions.every(pos => pos === pageNumPositions[0]);
          expect(allSame).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 10: Theme-specific animations', () => {
    // Feature: teletext-ux-redesign, Property 10: Theme-specific animations
    fc.assert(
      fc.property(
        fc.constantFrom('ceefax', 'haunting', 'high-contrast', 'orf'),
        fc.constantFrom('ceefax', 'haunting', 'high-contrast', 'orf'),
        (theme1, theme2) => {
          fc.pre(theme1 !== theme2); // Only test different themes
          
          const animations1 = getThemeAnimations(theme1);
          const animations2 = getThemeAnimations(theme2);
          
          // At least one animation should differ
          const transitionDiffers = animations1.pageTransition.name !== animations2.pageTransition.name;
          const loadingDiffers = animations1.loadingIndicator.name !== animations2.loadingIndicator.name;
          const backgroundDiffers = animations1.backgroundEffects.length !== animations2.backgroundEffects.length;
          
          expect(transitionDiffers || loadingDiffers || backgroundDiffers).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 17: Context-sensitive help', () => {
    // Feature: teletext-ux-redesign, Property 17: Context-sensitive help
    fc.assert(
      fc.property(
        fc.constantFrom('index', 'content', 'ai-menu', 'quiz', 'settings'),
        fc.constantFrom('index', 'content', 'ai-menu', 'quiz', 'settings'),
        (pageType1, pageType2) => {
          fc.pre(pageType1 !== pageType2); // Only test different page types
          
          const help1 = renderContextualHelp(pageType1);
          const help2 = renderContextualHelp(pageType2);
          
          // Help text should differ for different page types
          expect(help1.join('')).not.toBe(help2.join(''));
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 23: Breadcrumb truncation', () => {
    // Feature: teletext-ux-redesign, Property 23: Breadcrumb truncation
    fc.assert(
      fc.property(
        fc.array(
          fc.integer({ min: 100, max: 899 }).map(n => n.toString()),
          { minLength: 4, maxLength: 20 }
        ),
        (history) => {
          const breadcrumb = renderBreadcrumbs(history);
          
          if (history.length > 3) {
            // Should contain "..."
            expect(breadcrumb).toContain('...');
            
            // Should contain last 3 pages
            const last3 = history.slice(-3).join(' > ');
            expect(breadcrumb).toContain(last3);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Full Page Rendering:**
- Test complete page rendering with all enhancements
- Verify layout, animations, and indicators work together
- Test theme switching during active session
- Test navigation between pages with different layouts

**Animation Performance:**
- Measure frame rate during animations
- Test multiple simultaneous animations
- Verify animations don't block user input
- Test animation cleanup on page navigation

**User Interaction Flows:**
- Test complete navigation flows with visual feedback
- Test input buffer display and clearing
- Test breadcrumb updates during navigation
- Test theme switching with transition animations

## Implementation Guidelines

### CSS Architecture

**Animation Classes:**
```css
/* Ceefax theme animations */
.ceefax-wipe {
  animation: horizontal-wipe 300ms ease-in-out;
}

@keyframes horizontal-wipe {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}

/* Haunting theme animations */
.glitch-transition {
  animation: glitch-effect 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes glitch-effect {
  0%, 100% { transform: translateX(0); filter: none; }
  25% { transform: translateX(-5px); filter: hue-rotate(90deg); }
  50% { transform: translateX(5px); filter: hue-rotate(-90deg); }
  75% { transform: translateX(-3px); filter: hue-rotate(45deg); }
}

.ghost-float {
  animation: float-across 10s linear infinite;
}

@keyframes float-across {
  from { transform: translateX(-100px) translateY(0); }
  50% { transform: translateX(50vw) translateY(-20px); }
  to { transform: translateX(calc(100vw + 100px)) translateY(0); }
}

.chromatic-aberration {
  position: relative;
}

.chromatic-aberration::before,
.chromatic-aberration::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.chromatic-aberration::before {
  color: #ff0000;
  transform: translateX(-2px);
  opacity: 0.5;
}

.chromatic-aberration::after {
  color: #00ffff;
  transform: translateX(2px);
  opacity: 0.5;
}
```

### Component Implementation Order

1. **Layout Manager** - Foundation for all visual enhancements
2. **Navigation Indicators** - Essential for usability
3. **Animation Engine** - Core animation infrastructure
4. **Theme System Enhancements** - Expand existing theme system
5. **Decorative Elements** - Add visual polish
6. **Interactive Feedback** - Enhance user experience
7. **Special Page Animations** - Final touches

### Performance Optimization

**Animation Performance:**
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (causes reflow)
- Use `will-change` sparingly for critical animations
- Implement animation frame throttling for complex effects

**Layout Performance:**
- Cache layout calculations for repeated renders
- Use memoization for expensive formatting operations
- Implement virtual scrolling for long content lists
- Debounce layout recalculations on window resize

**Bundle Size:**
- Code-split animation sets by theme
- Lazy-load decorative elements
- Use CSS animations over JavaScript where possible
- Minimize animation asset sizes

## Deployment Considerations

### Feature Flags

Implement feature flags for gradual rollout:
- `ENABLE_FULL_SCREEN_LAYOUT` - Enable new layout system
- `ENABLE_ANIMATIONS` - Enable animation engine
- `ENABLE_KIROWEEN_THEME` - Enable Halloween theme
- `ENABLE_BREADCRUMBS` - Enable breadcrumb navigation
- `ENABLE_DECORATIVE_ELEMENTS` - Enable decorative animations

### A/B Testing

Test new UX enhancements with user groups:
- Group A: Original minimal interface
- Group B: Full-screen layout only
- Group C: Full-screen + animations
- Group D: Complete redesign with all features

Measure:
- User engagement (pages viewed per session)
- Navigation efficiency (time to find content)
- User satisfaction (feedback surveys)
- Performance metrics (load time, frame rate)

### Rollback Strategy

If issues arise:
1. Disable feature flags to revert to original interface
2. Keep original components alongside new components
3. Implement gradual migration path
4. Monitor error rates and user feedback

## Accessibility Considerations

### Animation Accessibility

- Respect `prefers-reduced-motion` media query
- Provide setting to disable all animations
- Ensure animations don't cause seizures (no rapid flashing)
- Maintain functionality without animations

### Visual Accessibility

- Ensure sufficient color contrast for all themes
- Provide high-contrast theme option
- Support screen reader navigation
- Ensure keyboard navigation works without visual cues

### Cognitive Accessibility

- Keep animations subtle and purposeful
- Avoid overwhelming users with too many moving elements
- Provide clear, consistent navigation patterns
- Allow users to control animation intensity

## Future Enhancements

### Phase 2 Features

- Custom theme creator with animation builder
- User-configurable decorative elements
- Advanced animation effects (particle systems, 3D transforms)
- Gesture-based navigation for touch devices
- Voice-controlled navigation with visual feedback

### Phase 3 Features

- Multiplayer features with synchronized animations
- Real-time collaborative page editing
- Animation marketplace for community-created effects
- VR/AR teletext experience
- AI-generated dynamic animations based on content

## Appendix: Animation Reference

### Standard Animation Durations

- **Micro-interactions**: 100-200ms (button press, highlight)
- **Transitions**: 200-400ms (page navigation, theme switch)
- **Decorative**: 500-1000ms (loading indicators, idle animations)
- **Ambient**: 5-10s (background effects, floating elements)

### Easing Functions

- **Ease-in-out**: Smooth start and end (default for most animations)
- **Ease-out**: Quick start, slow end (good for entrances)
- **Ease-in**: Slow start, quick end (good for exits)
- **Linear**: Constant speed (good for continuous loops)
- **Cubic-bezier**: Custom curves for specific effects

### Animation Best Practices

1. **Purpose**: Every animation should have a clear purpose (feedback, guidance, delight)
2. **Performance**: Prioritize 60fps, degrade gracefully if needed
3. **Accessibility**: Always provide non-animated alternatives
4. **Consistency**: Use consistent timing and easing within a theme
5. **Subtlety**: Animations should enhance, not distract from content
