/**
 * AI Typing Animation Utility
 * 
 * Provides character-by-character text reveal animation for AI-generated content
 * with blinking cursor, "thinking..." animation, and skip functionality.
 * 
 * Requirements: 24.1, 24.2, 24.3, 24.4, 24.5
 */

export interface TypingAnimationOptions {
  /**
   * Typing speed in characters per second (50-100 recommended)
   * Default: 75
   */
  speed?: number;
  
  /**
   * Whether to show a blinking cursor during typing
   * Default: true
   */
  showCursor?: boolean;
  
  /**
   * Cursor character to display
   * Default: '█'
   */
  cursorChar?: string;
  
  /**
   * Callback when typing completes
   */
  onComplete?: () => void;
  
  /**
   * Callback when typing is skipped
   */
  onSkip?: () => void;
  
  /**
   * Whether to allow skipping by pressing any key
   * Default: true
   */
  allowSkip?: boolean;
}

export interface TypingAnimationState {
  /**
   * Whether the animation is currently running
   */
  isTyping: boolean;
  
  /**
   * Whether the animation is in "thinking" state
   */
  isThinking: boolean;
  
  /**
   * Current revealed text
   */
  revealedText: string;
  
  /**
   * Whether the cursor is visible (for blinking effect)
   */
  cursorVisible: boolean;
  
  /**
   * Progress percentage (0-100)
   */
  progress: number;
}

export class AITypingAnimation {
  private fullText: string = '';
  private currentIndex: number = 0;
  private typingInterval: NodeJS.Timeout | null = null;
  private cursorInterval: NodeJS.Timeout | null = null;
  private keyListener: ((e: KeyboardEvent) => void) | null = null;
  private options: Required<TypingAnimationOptions>;
  private state: TypingAnimationState;
  private stateUpdateCallback: ((state: TypingAnimationState) => void) | null = null;

  constructor(options: TypingAnimationOptions = {}) {
    this.options = {
      speed: options.speed ?? 75,
      showCursor: options.showCursor ?? true,
      cursorChar: options.cursorChar ?? '█',
      onComplete: options.onComplete ?? (() => {}),
      onSkip: options.onSkip ?? (() => {}),
      allowSkip: options.allowSkip ?? true
    };

    this.state = {
      isTyping: false,
      isThinking: false,
      revealedText: '',
      cursorVisible: true,
      progress: 0
    };
  }

  /**
   * Sets a callback to be called whenever the state updates
   */
  onStateUpdate(callback: (state: TypingAnimationState) => void): void {
    this.stateUpdateCallback = callback;
  }

  /**
   * Updates the state and notifies listeners
   */
  private updateState(updates: Partial<TypingAnimationState>): void {
    this.state = { ...this.state, ...updates };
    if (this.stateUpdateCallback) {
      this.stateUpdateCallback(this.state);
    }
  }

  /**
   * Gets the current state
   */
  getState(): TypingAnimationState {
    return { ...this.state };
  }

  /**
   * Starts the "thinking..." animation while waiting for AI response
   * Requirements: 24.3, 24.5
   */
  startThinking(): void {
    this.stop(); // Stop any existing animation
    
    this.updateState({
      isThinking: true,
      isTyping: false,
      revealedText: 'Thinking',
      cursorVisible: true,
      progress: 0
    });

    // Animate dots: "Thinking" -> "Thinking." -> "Thinking.." -> "Thinking..."
    let dotCount = 0;
    this.typingInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      const dots = '.'.repeat(dotCount);
      this.updateState({
        revealedText: `Thinking${dots}`
      });
    }, 500);

    // Start cursor blinking
    if (this.options.showCursor) {
      this.startCursorBlink();
    }
  }

  /**
   * Stops the "thinking..." animation
   */
  stopThinking(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }
    
    this.updateState({
      isThinking: false
    });
  }

  /**
   * Starts the typing animation for the given text
   * Requirements: 24.1, 24.2, 24.4
   * 
   * @param text - The full text to reveal character-by-character
   */
  start(text: string): void {
    this.stop(); // Stop any existing animation
    this.stopThinking();
    
    this.fullText = text;
    this.currentIndex = 0;
    
    // Handle empty text
    if (text.length === 0) {
      this.updateState({
        isTyping: false,
        isThinking: false,
        revealedText: '',
        cursorVisible: true,
        progress: 100
      });
      this.options.onComplete();
      return;
    }
    
    this.updateState({
      isTyping: true,
      isThinking: false,
      revealedText: '',
      cursorVisible: true,
      progress: 0
    });

    // Calculate delay between characters based on speed (chars per second)
    const delayMs = 1000 / this.options.speed;

    // Start typing animation
    this.typingInterval = setInterval(() => {
      if (this.currentIndex < this.fullText.length) {
        this.currentIndex++;
        const revealed = this.fullText.substring(0, this.currentIndex);
        const progress = Math.round((this.currentIndex / this.fullText.length) * 100);
        
        this.updateState({
          revealedText: revealed,
          progress
        });
      } else {
        // Typing complete
        this.complete();
      }
    }, delayMs);

    // Start cursor blinking
    if (this.options.showCursor) {
      this.startCursorBlink();
    }

    // Set up skip listener
    // Requirement 24.3: Allow users to skip typing animation by pressing any key
    if (this.options.allowSkip) {
      this.setupSkipListener();
    }
  }

  /**
   * Starts the cursor blinking animation
   */
  private startCursorBlink(): void {
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
    }

    // Set initial cursor state
    this.updateState({
      cursorVisible: true
    });

    this.cursorInterval = setInterval(() => {
      this.updateState({
        cursorVisible: !this.state.cursorVisible
      });
    }, 500); // Blink every 500ms
  }

  /**
   * Sets up keyboard listener to allow skipping the animation
   * Requirement 24.3
   */
  private setupSkipListener(): void {
    this.removeSkipListener(); // Remove any existing listener

    this.keyListener = (e: KeyboardEvent) => {
      // Skip on any key press
      this.skip();
    };

    window.addEventListener('keydown', this.keyListener);
  }

  /**
   * Removes the skip keyboard listener
   */
  private removeSkipListener(): void {
    if (this.keyListener) {
      window.removeEventListener('keydown', this.keyListener);
      this.keyListener = null;
    }
  }

  /**
   * Skips the typing animation and reveals all text immediately
   * Requirement 24.3
   */
  skip(): void {
    if (!this.state.isTyping) return;

    this.stop();
    
    this.updateState({
      isTyping: false,
      revealedText: this.fullText,
      progress: 100
    });

    this.options.onSkip();
    this.options.onComplete();
  }

  /**
   * Completes the typing animation
   * Requirement 24.4: Display navigation options after typing completes
   */
  private complete(): void {
    this.stop();
    
    this.updateState({
      isTyping: false,
      progress: 100
    });

    this.options.onComplete();
  }

  /**
   * Stops the typing animation and cleans up
   */
  stop(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }

    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
      this.cursorInterval = null;
    }

    this.removeSkipListener();
    
    // Update state to reflect stopped animation
    this.updateState({
      isTyping: false
    });
  }

  /**
   * Gets the display text with cursor if applicable
   */
  getDisplayText(): string {
    const text = this.state.revealedText;
    
    if ((this.state.isTyping || this.state.isThinking) && 
        this.options.showCursor && 
        this.state.cursorVisible) {
      return text + this.options.cursorChar;
    }
    
    return text;
  }

  /**
   * Cleans up all resources
   */
  destroy(): void {
    this.stop();
    this.stopThinking();
    this.stateUpdateCallback = null;
  }
}

/**
 * Hook-like function to create and manage a typing animation instance
 * Useful for React components
 */
export function createTypingAnimation(
  options: TypingAnimationOptions = {}
): AITypingAnimation {
  return new AITypingAnimation(options);
}
