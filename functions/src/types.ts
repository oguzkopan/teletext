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
  cacheStatus?: 'fresh' | 'cached' | 'stale';
}

export interface PageCacheDocument {
  pageId: string;
  page: TeletextPage;
  source: string;
  cachedAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp;
  accessCount: number;
}

export interface ContentAdapter {
  getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage>;
  getCacheKey(pageId: string): string;
  getCacheDuration(): number;
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
