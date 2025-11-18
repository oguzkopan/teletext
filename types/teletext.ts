// Core Teletext Types

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
