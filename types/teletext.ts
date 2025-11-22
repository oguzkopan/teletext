// Core Teletext Types

/**
 * Creates an offline error page when content is unavailable
 * Requirement: 13.4
 */
export function createOfflinePage(pageId: string): TeletextPage {
  const rows = Array(24).fill('').map((_, i) => {
    if (i === 0) return `OFFLINE                         ${pageId}`.padEnd(40);
    if (i === 1) return '════════════════════════════════════════';
    if (i === 3) return 'NO NETWORK CONNECTION'.padEnd(40);
    if (i === 5) return 'This page is not available offline.'.padEnd(40);
    if (i === 7) return 'The page has not been cached or the'.padEnd(40);
    if (i === 8) return 'cache has expired.'.padEnd(40);
    if (i === 10) return 'Please check your connection and'.padEnd(40);
    if (i === 11) return 'try again.'.padEnd(40);
    if (i === 20) return 'Press 100 to return to index'.padEnd(40);
    return ''.padEnd(40);
  });

  return {
    id: pageId,
    title: 'OFFLINE',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' }
    ],
    meta: {
      source: 'System',
      cacheStatus: 'stale'
    }
  };
}

export interface TeletextPage {
  id: string;              // "201"
  title: string;           // Page title
  rows: string[];          // Exactly 24 strings, each max 40 chars
  links: PageLink[];       // Navigation links
  meta?: PageMeta;
}

export interface PageLink {
  label: string;           // Display text
  targetPage: string;      // Target page number
  color?: 'red' | 'green' | 'yellow' | 'blue';
  position?: number;       // Row number for inline links
}

export interface PageMeta {
  source?: string;         // "NewsAPI", "Static", etc.
  lastUpdated?: string;    // ISO timestamp
  aiContextId?: string;    // For AI conversation continuity
  cacheStatus?: 'fresh' | 'cached' | 'stale';
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
  settingsPage?: boolean; // Flag to enable settings page keyboard handling
  favoritePages?: string[]; // For keyboard shortcuts config page
  themeSelectionPage?: boolean; // Flag to enable theme selection keyboard handling
  continuation?: PageContinuation; // Multi-page navigation metadata
  inputMode?: 'single' | 'double' | 'triple'; // Expected input length: 1, 2, or 3 digits
  inputOptions?: string[];  // Valid single-digit options (e.g., ['1', '2', '3', '4', '5'])
  animatedLogo?: boolean;   // Enable animated logo on page
  logoAnimation?: string;   // Animation type for logo (e.g., 'logo-reveal', 'logo-pulse')
  scrollingCredits?: boolean; // Enable scrolling credits animation
  creditsAnimation?: string; // Animation type for credits (e.g., 'scrolling-credits')
  kiroBadge?: boolean;      // Enable Kiro badge animation
  kiroBadgeAnimation?: string; // Animation type for Kiro badge (e.g., 'kiro-badge-pulse')
  halloweenTheme?: boolean; // Enable Halloween theme decorations and styling
  fullScreenLayout?: boolean; // Use full-screen layout (90%+ screen utilization)
  maxVisualEffects?: boolean; // Apply maximum visual effects regardless of user settings
  specialPageAnimation?: {
    type: string;
    name: string;
    targetRows: number[];
    frames: string[];
    duration: number;
    loop: boolean;
  };
  specialPageAnimations?: Array<{
    type: string;
    name: string;
    targetRows: number[];
    frames: string[];
    duration: number;
    loop: boolean;
  }>;
  keyboardVisualization?: boolean; // Enable special keyboard visualization
  highlightedKeys?: string[]; // Keys to highlight in keyboard shortcuts page
}

export interface PageContinuation {
  currentPage: string;      // Current page ID (e.g., "201")
  nextPage?: string;        // Next page in sequence (e.g., "202")
  previousPage?: string;    // Previous page in sequence (e.g., "200")
  totalPages: number;       // Total pages in sequence
  currentIndex: number;     // Current page index (0-based)
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

export interface ConversationState {
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

// Firestore Document Types

export interface PageCacheDocument {
  pageId: string;
  page: TeletextPage;
  source: string;
  cachedAt: Date;
  expiresAt: Date;
  accessCount: number;
}

export interface ConversationDocument {
  contextId: string;
  userId?: string;
  state: ConversationState;
  createdAt: Date;
  lastAccessedAt: Date;
  expiresAt: Date;
}

export interface UserPreferencesDocument {
  userId: string;
  theme: string;
  favoritePages: string[];
  settings: {
    scanlines: boolean;
    curvature: boolean;
    noise: boolean;
  };
  effects: {
    scanlinesIntensity: number;  // 0-100
    curvature: number;            // 0-10 (px)
    noiseLevel: number;           // 0-100
  };
  animationSettings?: {
    animationsEnabled: boolean;
    animationIntensity: number;  // 0-100
    transitionsEnabled: boolean;
    decorationsEnabled: boolean;
    backgroundEffectsEnabled: boolean;
  };
  updatedAt: Date;
}

export interface AnalyticsDocument {
  date: string;
  pageViews: Record<string, number>;
  totalRequests: number;
  errorCount: number;
  avgLoadTime: number;
}

// Content Adapter Interface

export interface ContentAdapter {
  getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage>;
  getCacheKey(pageId: string): string;
  getCacheDuration(): number;  // Seconds
}

// API Response Types

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
