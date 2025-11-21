/**
 * useTimestampUpdates Hook
 * 
 * React hook for managing automatic timestamp updates every minute
 * without requiring page refresh.
 * 
 * Requirements: 18.4
 */

import { useEffect, useState } from 'react';
import { getMillisecondsUntilNextMinute } from '@/lib/timestamp-cache-status';

/**
 * Hook to trigger re-renders every minute for timestamp updates
 * 
 * @returns Current timestamp (updates every minute)
 */
export function useTimestampUpdates(): Date {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    // Calculate time until next minute boundary
    const msUntilNextMinute = getMillisecondsUntilNextMinute();

    // Set initial timeout to sync with minute boundary
    const initialTimeout = setTimeout(() => {
      setCurrentTime(new Date());

      // Then update every minute
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000); // 60 seconds

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }, msUntilNextMinute);

    // Cleanup initial timeout on unmount
    return () => clearTimeout(initialTimeout);
  }, []);

  return currentTime;
}

/**
 * Hook to check if a timestamp should trigger updates
 * 
 * @param timestamp - ISO timestamp string
 * @param contentType - Content type
 * @returns Object with shouldUpdate flag and current time
 */
export function useTimestampUpdateCheck(
  timestamp: string | undefined,
  contentType?: string
): { shouldUpdate: boolean; currentTime: Date } {
  const currentTime = useTimestampUpdates();

  // Only update for time-sensitive content
  const timeSensitiveTypes = ['NEWS', 'SPORT', 'MARKETS', 'WEATHER'];
  const shouldUpdate = !!(
    timestamp &&
    contentType &&
    timeSensitiveTypes.includes(contentType.toUpperCase())
  );

  return { shouldUpdate, currentTime };
}
