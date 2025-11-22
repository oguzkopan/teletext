// Shared types for Cloud Functions
// Re-export types from the main types file for use in functions

export interface TeletextPage {
  id: string;
  title: string;
  rows: string[];
  links: PageLink[];
  meta?: PageMeta;
}

export interface PageLink {
  label: string;
  targetPage: string;
  color?: 'red' | 'green' | 'yellow' | 'blue';
  position?: number;
}

export interface PageMeta {
  source?: string;
  lastUpdated?: string;
  aiContextId?: string;
  haunting?: boolean;      // Enable maximum glitch effects for horror pages
  aiGenerated?: boolean;   // Indicates AI-generated content
  fallback?: boolean;      // Indicates this is a fallback page (emulator offline)
  emulatorOffline?: boolean; // Indicates emulator connection failed
  error?: string;          // Error type (e.g., 'missing_api_key', 'service_unavailable')
  effectsData?: {
    scanlinesIntensity?: number;
    curvature?: number;
    noiseLevel?: number;
  };
  animationSettings?: {
    animationsEnabled?: boolean;
    animationIntensity?: number;
    transitionsEnabled?: boolean;
    decorationsEnabled?: boolean;
    backgroundEffectsEnabled?: boolean;
  };
  settingsPage?: boolean;
  favoritePages?: string[];
  continuation?: {         // Multi-page navigation metadata
    currentPage: string;
    nextPage?: string;
    previousPage?: string;
    totalPages: number;
    currentIndex: number;
  };
  themeSelectionPage?: boolean; // Flag to enable special keyboard handling for theme selection
  inputMode?: 'single' | 'double' | 'triple'; // Expected input length: 1, 2, or 3 digits
  inputOptions?: string[];  // Valid single-digit options (e.g., ['1', '2', '3', '4', '5'])
  customHints?: string[];   // Custom navigation hints to display in footer
  progress?: {             // Progress indicator metadata for multi-step processes
    current: number;
    total: number;
    label?: string;
    percentage?: number;
  };
  completed?: boolean;     // Indicates a process has been completed
  finalScore?: {           // Final score for completed quizzes/games
    correct: number;
    total: number;
    percentage: number;
  };
  hasLiveMatches?: boolean; // Indicates if there are live sports matches
  animationClasses?: {      // CSS classes for animations
    liveIndicator?: string;
    scoreFlash?: string;
    fullTime?: string;
  };
  animatedLogo?: boolean;   // Enable animated logo on page
  logoAnimation?: string;   // Animation type for logo (e.g., 'logo-reveal', 'logo-pulse')
  scrollingCredits?: boolean; // Enable scrolling credits animation
  creditsAnimation?: string; // Animation type for credits (e.g., 'scrolling-credits')
  kiroBadge?: boolean;      // Enable Kiro badge animation
  kiroBadgeAnimation?: string; // Animation type for Kiro badge (e.g., 'kiro-badge-pulse')
  keyboardVisualization?: boolean; // Enable keyboard shortcut visualization
  highlightedKeys?: string[];  // Keys to highlight on keyboard visualization page
  maxVisualEffects?: boolean;  // Apply maximum visual effects regardless of user settings
  specialPageAnimation?: {     // Special page animation configuration
    type: 'ascii-frames' | 'css' | 'javascript';
    name: string;
    targetRows: number[];
    frames: string[];
    duration: number;
    loop: boolean;
  };
  specialPageAnimations?: Array<{ // Multiple special page animations
    type: 'ascii-frames' | 'css' | 'javascript';
    name: string;
    targetRows: number[];
    frames: string[];
    duration: number;
    loop: boolean;
  }>;
  halloweenTheme?: boolean; // Enable Halloween theme decorations and styling
  fullScreenLayout?: boolean; // Use full-screen layout (90%+ screen utilization)
  storyTheme?: string; // Theme ID for story-based content
  contentType?: string; // Content type identifier (e.g., 'SPORT', 'NEWS', 'MARKETS')
  themeName?: string; // Theme name for story-based content
  liveIndicator?: boolean; // Show live indicator for sports/events
  classicTeletextStyle?: boolean; // Use classic teletext styling
}

export interface ContentAdapter {
  getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage>;
}

export interface PageResponse {
  success: boolean;
  page?: TeletextPage;
  error?: string;
}

export interface AIRequest {
  mode: string;
  parameters: {
    topic?: string;
    context?: string;
    previousPageId?: string;
  };
}

export interface AIResponse {
  success: boolean;
  pages?: TeletextPage[];
  contextId?: string;
  error?: string;
}

export interface ThemeConfig {
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
