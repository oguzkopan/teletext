/**
 * React Hook for AI Typing Animation
 * 
 * Provides a React-friendly interface for the AI typing animation utility.
 * Manages lifecycle and state updates automatically.
 * 
 * Requirements: 24.1, 24.2, 24.3, 24.4, 24.5
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  AITypingAnimation, 
  TypingAnimationOptions, 
  TypingAnimationState 
} from '@/lib/ai-typing-animation';

export interface UseAITypingAnimationOptions extends TypingAnimationOptions {
  /**
   * Whether to automatically start typing when text is provided
   * Default: true
   */
  autoStart?: boolean;
}

export interface UseAITypingAnimationReturn {
  /**
   * Current animation state
   */
  state: TypingAnimationState;
  
  /**
   * Display text with cursor (if applicable)
   */
  displayText: string;
  
  /**
   * Start typing animation with the given text
   */
  startTyping: (text: string) => void;
  
  /**
   * Start "thinking..." animation
   */
  startThinking: () => void;
  
  /**
   * Stop thinking animation
   */
  stopThinking: () => void;
  
  /**
   * Skip the current typing animation
   */
  skip: () => void;
  
  /**
   * Stop the animation
   */
  stop: () => void;
  
  /**
   * Whether the animation is currently active
   */
  isActive: boolean;
}

/**
 * React hook for AI typing animation
 * 
 * @example
 * ```tsx
 * const { displayText, startTyping, startThinking, isActive } = useAITypingAnimation({
 *   speed: 75,
 *   onComplete: () => console.log('Typing complete!')
 * });
 * 
 * // Start thinking animation
 * startThinking();
 * 
 * // Later, start typing
 * startTyping('This is AI-generated content...');
 * ```
 */
export function useAITypingAnimation(
  options: UseAITypingAnimationOptions = {}
): UseAITypingAnimationReturn {
  const animationRef = useRef<AITypingAnimation | null>(null);
  const [state, setState] = useState<TypingAnimationState>({
    isTyping: false,
    isThinking: false,
    revealedText: '',
    cursorVisible: true,
    progress: 0
  });
  const [displayText, setDisplayText] = useState<string>('');

  // Initialize animation instance
  useEffect(() => {
    animationRef.current = new AITypingAnimation(options);
    
    // Set up state update callback
    animationRef.current.onStateUpdate((newState) => {
      setState(newState);
      setDisplayText(animationRef.current!.getDisplayText());
    });

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const startTyping = useCallback((text: string) => {
    if (animationRef.current) {
      animationRef.current.start(text);
    }
  }, []);

  const startThinking = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.startThinking();
    }
  }, []);

  const stopThinking = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stopThinking();
    }
  }, []);

  const skip = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.skip();
    }
  }, []);

  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
  }, []);

  const isActive = state.isTyping || state.isThinking;

  return {
    state,
    displayText,
    startTyping,
    startThinking,
    stopThinking,
    skip,
    stop,
    isActive
  };
}
