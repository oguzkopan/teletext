/**
 * React Hook for Action Feedback
 * 
 * Provides a hook for displaying success/error feedback messages
 * with animations in the teletext interface.
 * 
 * Requirements: 28.1, 28.2, 28.3, 28.4, 28.5
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  createSuccessMessage,
  createErrorMessage,
  createSavedMessage,
  createCelebrationMessage,
  createFeedbackMessage,
  FeedbackConfig,
  FeedbackDisplay,
  FeedbackType
} from '../lib/action-feedback';

/**
 * Feedback state
 */
interface FeedbackState {
  display: FeedbackDisplay | null;
  visible: boolean;
  animatingOut: boolean;
}

/**
 * Hook return type
 */
interface UseActionFeedbackReturn {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showSaved: (itemName?: string, duration?: number) => void;
  showCelebration: (message: string, duration?: number) => void;
  showFeedback: (config: FeedbackConfig) => void;
  hideFeedback: () => void;
  feedback: FeedbackDisplay | null;
  isVisible: boolean;
  isAnimatingOut: boolean;
}

/**
 * Hook for managing action feedback display
 * 
 * @returns Feedback control functions and state
 * 
 * @example
 * const { showSuccess, showError, feedback, isVisible } = useActionFeedback();
 * 
 * // Show success message
 * showSuccess('Settings saved!');
 * 
 * // Show error message
 * showError('Failed to save settings');
 * 
 * // Show saved message
 * showSaved('Theme preferences');
 * 
 * // Show celebration
 * showCelebration('Quiz Complete!');
 */
export function useActionFeedback(): UseActionFeedbackReturn {
  const [state, setState] = useState<FeedbackState>({
    display: null,
    visible: false,
    animatingOut: false
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear any existing timeouts
  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);
  
  // Show feedback with automatic hide
  const showFeedbackInternal = useCallback((display: FeedbackDisplay) => {
    clearTimeouts();
    
    // Show feedback
    setState({
      display,
      visible: true,
      animatingOut: false
    });
    
    // Schedule hide after duration
    timeoutRef.current = setTimeout(() => {
      // Start fade out animation
      setState(prev => ({
        ...prev,
        animatingOut: true
      }));
      
      // Hide after animation completes (200ms fade out)
      animationTimeoutRef.current = setTimeout(() => {
        setState({
          display: null,
          visible: false,
          animatingOut: false
        });
      }, 200);
    }, display.duration);
  }, [clearTimeouts]);
  
  // Show success message
  const showSuccess = useCallback((message: string, duration?: number) => {
    const display = createSuccessMessage(message, { duration });
    showFeedbackInternal(display);
  }, [showFeedbackInternal]);
  
  // Show error message
  const showError = useCallback((message: string, duration?: number) => {
    const display = createErrorMessage(message, { duration });
    showFeedbackInternal(display);
  }, [showFeedbackInternal]);
  
  // Show saved message
  const showSaved = useCallback((itemName?: string, duration?: number) => {
    const display = createSavedMessage(itemName, { duration });
    showFeedbackInternal(display);
  }, [showFeedbackInternal]);
  
  // Show celebration message
  const showCelebration = useCallback((message: string, duration?: number) => {
    const display = createCelebrationMessage(message, { duration });
    showFeedbackInternal(display);
  }, [showFeedbackInternal]);
  
  // Show generic feedback
  const showFeedback = useCallback((config: FeedbackConfig) => {
    const display = createFeedbackMessage(config);
    showFeedbackInternal(display);
  }, [showFeedbackInternal]);
  
  // Hide feedback immediately
  const hideFeedback = useCallback(() => {
    clearTimeouts();
    setState({
      display: null,
      visible: false,
      animatingOut: false
    });
  }, [clearTimeouts]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);
  
  return {
    showSuccess,
    showError,
    showSaved,
    showCelebration,
    showFeedback,
    hideFeedback,
    feedback: state.display,
    isVisible: state.visible,
    isAnimatingOut: state.animatingOut
  };
}

/**
 * Hook options for customizing feedback behavior
 */
export interface UseActionFeedbackOptions {
  defaultDuration?: number;
  onShow?: (feedback: FeedbackDisplay) => void;
  onHide?: () => void;
}

/**
 * Advanced hook with custom options
 * 
 * @param options - Hook configuration options
 * @returns Feedback control functions and state
 */
export function useActionFeedbackWithOptions(
  options: UseActionFeedbackOptions = {}
): UseActionFeedbackReturn {
  const { defaultDuration = 2500, onShow, onHide } = options;
  
  const [state, setState] = useState<FeedbackState>({
    display: null,
    visible: false,
    animatingOut: false
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);
  
  const showFeedbackInternal = useCallback((display: FeedbackDisplay) => {
    clearTimeouts();
    
    setState({
      display,
      visible: true,
      animatingOut: false
    });
    
    onShow?.(display);
    
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        animatingOut: true
      }));
      
      animationTimeoutRef.current = setTimeout(() => {
        setState({
          display: null,
          visible: false,
          animatingOut: false
        });
        onHide?.();
      }, 200);
    }, display.duration);
  }, [clearTimeouts, onShow, onHide]);
  
  const showSuccess = useCallback((message: string, duration?: number) => {
    const display = createSuccessMessage(message, { duration: duration ?? defaultDuration });
    showFeedbackInternal(display);
  }, [showFeedbackInternal, defaultDuration]);
  
  const showError = useCallback((message: string, duration?: number) => {
    const display = createErrorMessage(message, { duration: duration ?? defaultDuration });
    showFeedbackInternal(display);
  }, [showFeedbackInternal, defaultDuration]);
  
  const showSaved = useCallback((itemName?: string, duration?: number) => {
    const display = createSavedMessage(itemName, { duration: duration ?? defaultDuration });
    showFeedbackInternal(display);
  }, [showFeedbackInternal, defaultDuration]);
  
  const showCelebration = useCallback((message: string, duration?: number) => {
    const display = createCelebrationMessage(message, { duration: duration ?? defaultDuration });
    showFeedbackInternal(display);
  }, [showFeedbackInternal, defaultDuration]);
  
  const showFeedback = useCallback((config: FeedbackConfig) => {
    const display = createFeedbackMessage(config);
    showFeedbackInternal(display);
  }, [showFeedbackInternal]);
  
  const hideFeedback = useCallback(() => {
    clearTimeouts();
    setState({
      display: null,
      visible: false,
      animatingOut: false
    });
    onHide?.();
  }, [clearTimeouts, onHide]);
  
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);
  
  return {
    showSuccess,
    showError,
    showSaved,
    showCelebration,
    showFeedback,
    hideFeedback,
    feedback: state.display,
    isVisible: state.visible,
    isAnimatingOut: state.animatingOut
  };
}
