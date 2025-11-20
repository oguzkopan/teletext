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
  favoritePages?: string[];
  continuation?: {         // Multi-page navigation metadata
    currentPage: string;
    nextPage?: string;
    previousPage?: string;
    totalPages: number;
    currentIndex: number;
  };
  themeSelectionPage?: boolean; // Flag to enable special keyboard handling for theme selection
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
