/**
 * Loading Text Rotation for Modern Teletext
 * 
 * Manages rotating loading messages that change every 2 seconds during loading states.
 * Provides theme-appropriate loading messages for different themes.
 * 
 * Requirements: 14.5
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface LoadingTextConfig {
  messages: string[];
  rotationInterval: number; // milliseconds
  theme?: string;
}

export interface LoadingTextState {
  currentIndex: number;
  currentMessage: string;
  intervalId: NodeJS.Timeout | null;
  startTime: number;
}

// ============================================================================
// Theme-Specific Loading Messages
// ============================================================================

const CEEFAX_MESSAGES = [
  'LOADING...',
  'FETCHING DATA...',
  'ALMOST THERE...',
  'PLEASE WAIT...',
  'RETRIEVING PAGE...'
];

const HAUNTING_MESSAGES = [
  'SUMMONING...',
  'AWAKENING SPIRITS...',
  'CONJURING DATA...',
  'ENTERING THE VOID...',
  'CHANNELING...',
  'MANIFESTING...'
];

const HIGH_CONTRAST_MESSAGES = [
  'LOADING...',
  'FETCHING...',
  'PROCESSING...',
  'PLEASE WAIT...'
];

const ORF_MESSAGES = [
  'LADEN...',
  'DATEN ABRUFEN...',
  'BITTE WARTEN...',
  'VERARBEITUNG...',
  'FAST FERTIG...'
];

const DEFAULT_MESSAGES = [
  'LOADING...',
  'FETCHING DATA...',
  'ALMOST THERE...',
  'PLEASE WAIT...'
];

// ============================================================================
// Loading Text Rotation Class
// ============================================================================

export class LoadingTextRotation {
  private state: LoadingTextState;
  private config: LoadingTextConfig;
  private onUpdate?: (message: string) => void;

  constructor(config?: Partial<LoadingTextConfig>, onUpdate?: (message: string) => void) {
    this.config = {
      messages: this.getThemeMessages(config?.theme || 'ceefax'),
      rotationInterval: config?.rotationInterval || 2000,
      theme: config?.theme || 'ceefax'
    };

    this.state = {
      currentIndex: 0,
      currentMessage: this.config.messages[0],
      intervalId: null,
      startTime: Date.now()
    };

    this.onUpdate = onUpdate;
  }

  /**
   * Get theme-appropriate loading messages
   */
  private getThemeMessages(theme: string): string[] {
    switch (theme.toLowerCase()) {
      case 'haunting':
      case 'kiroween':
        return HAUNTING_MESSAGES;
      case 'high-contrast':
        return HIGH_CONTRAST_MESSAGES;
      case 'orf':
        return ORF_MESSAGES;
      case 'ceefax':
      default:
        return CEEFAX_MESSAGES;
    }
  }

  /**
   * Start rotating loading messages
   */
  start(): void {
    // Clear any existing interval
    this.stop();

    // Reset state
    this.state.currentIndex = 0;
    this.state.currentMessage = this.config.messages[0];
    this.state.startTime = Date.now();

    // Notify initial message
    if (this.onUpdate) {
      this.onUpdate(this.state.currentMessage);
    }

    // Set up rotation interval
    this.state.intervalId = setInterval(() => {
      this.rotate();
    }, this.config.rotationInterval);
  }

  /**
   * Stop rotating loading messages
   */
  stop(): void {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
    }
  }

  /**
   * Rotate to the next message
   */
  private rotate(): void {
    this.state.currentIndex = (this.state.currentIndex + 1) % this.config.messages.length;
    this.state.currentMessage = this.config.messages[this.state.currentIndex];

    if (this.onUpdate) {
      this.onUpdate(this.state.currentMessage);
    }
  }

  /**
   * Get the current loading message
   */
  getCurrentMessage(): string {
    return this.state.currentMessage;
  }

  /**
   * Get the elapsed time since loading started
   */
  getElapsedTime(): number {
    return Date.now() - this.state.startTime;
  }

  /**
   * Check if loading has been active for more than 2 seconds
   */
  hasRotated(): boolean {
    return this.getElapsedTime() >= this.config.rotationInterval;
  }

  /**
   * Update the theme and reload messages
   */
  setTheme(theme: string): void {
    this.config.theme = theme;
    this.config.messages = this.getThemeMessages(theme);
    
    // Reset to first message of new theme
    this.state.currentIndex = 0;
    this.state.currentMessage = this.config.messages[0];
    
    if (this.onUpdate) {
      this.onUpdate(this.state.currentMessage);
    }
  }

  /**
   * Set custom loading messages
   */
  setMessages(messages: string[]): void {
    if (messages.length === 0) {
      console.warn('Cannot set empty messages array');
      return;
    }

    this.config.messages = messages;
    this.state.currentIndex = 0;
    this.state.currentMessage = messages[0];

    if (this.onUpdate) {
      this.onUpdate(this.state.currentMessage);
    }
  }

  /**
   * Set rotation interval
   */
  setRotationInterval(interval: number): void {
    if (interval < 100) {
      console.warn('Rotation interval too short, using minimum of 100ms');
      interval = 100;
    }

    this.config.rotationInterval = interval;

    // Restart with new interval if currently running
    if (this.state.intervalId) {
      this.start();
    }
  }

  /**
   * Get all available messages for current theme
   */
  getMessages(): string[] {
    return [...this.config.messages];
  }

  /**
   * Get the current rotation index
   */
  getCurrentIndex(): number {
    return this.state.currentIndex;
  }

  /**
   * Check if rotation is active
   */
  isActive(): boolean {
    return this.state.intervalId !== null;
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Get loading messages for a specific theme
 */
export function getLoadingMessages(theme: string): string[] {
  switch (theme.toLowerCase()) {
    case 'haunting':
    case 'kiroween':
      return [...HAUNTING_MESSAGES];
    case 'high-contrast':
      return [...HIGH_CONTRAST_MESSAGES];
    case 'orf':
      return [...ORF_MESSAGES];
    case 'ceefax':
      return [...CEEFAX_MESSAGES];
    default:
      return [...DEFAULT_MESSAGES];
  }
}

/**
 * Create a loading text rotation instance
 */
export function createLoadingTextRotation(
  theme?: string,
  onUpdate?: (message: string) => void
): LoadingTextRotation {
  return new LoadingTextRotation({ theme }, onUpdate);
}
