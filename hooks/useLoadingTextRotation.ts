/**
 * React Hook for Loading Text Rotation
 * 
 * Provides rotating loading messages that change every 2 seconds during loading states.
 * Automatically manages lifecycle and cleanup.
 * 
 * Requirements: 14.5
 */

import { useState, useEffect, useRef } from 'react';
import { LoadingTextRotation, getLoadingMessages } from '@/lib/loading-text-rotation';

export interface UseLoadingTextRotationOptions {
  theme?: string;
  rotationInterval?: number;
  enabled?: boolean;
}

export interface UseLoadingTextRotationReturn {
  currentMessage: string;
  messages: string[];
  elapsedTime: number;
  hasRotated: boolean;
  isActive: boolean;
}

/**
 * Hook for managing rotating loading text
 * 
 * @param options - Configuration options
 * @returns Current loading message and state
 * 
 * @example
 * ```tsx
 * function LoadingComponent({ theme, isLoading }) {
 *   const { currentMessage } = useLoadingTextRotation({
 *     theme,
 *     enabled: isLoading
 *   });
 * 
 *   if (!isLoading) return null;
 * 
 *   return <div>{currentMessage}</div>;
 * }
 * ```
 */
export function useLoadingTextRotation(
  options: UseLoadingTextRotationOptions = {}
): UseLoadingTextRotationReturn {
  const { theme = 'ceefax', rotationInterval = 2000, enabled = true } = options;

  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const rotationRef = useRef<LoadingTextRotation | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize rotation instance
  useEffect(() => {
    if (!rotationRef.current) {
      rotationRef.current = new LoadingTextRotation(
        { theme, rotationInterval },
        (message) => setCurrentMessage(message)
      );
    }

    return () => {
      if (rotationRef.current) {
        rotationRef.current.stop();
      }
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    };
  }, []);

  // Update theme when it changes
  useEffect(() => {
    if (rotationRef.current) {
      rotationRef.current.setTheme(theme);
    }
  }, [theme]);

  // Update rotation interval when it changes
  useEffect(() => {
    if (rotationRef.current) {
      rotationRef.current.setRotationInterval(rotationInterval);
    }
  }, [rotationInterval]);

  // Start/stop rotation based on enabled state
  useEffect(() => {
    if (!rotationRef.current) return;

    if (enabled) {
      rotationRef.current.start();
      setCurrentMessage(rotationRef.current.getCurrentMessage());
      setIsActive(true);

      // Update elapsed time every 100ms
      elapsedTimerRef.current = setInterval(() => {
        if (rotationRef.current) {
          setElapsedTime(rotationRef.current.getElapsedTime());
        }
      }, 100);
    } else {
      rotationRef.current.stop();
      setIsActive(false);
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
      setElapsedTime(0);
    }

    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
    };
  }, [enabled]);

  return {
    currentMessage,
    messages: getLoadingMessages(theme),
    elapsedTime,
    hasRotated: elapsedTime >= rotationInterval,
    isActive
  };
}
