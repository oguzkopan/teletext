'use client';

import React, { useMemo } from 'react';
import { TeletextPage, ThemeConfig } from '@/types/teletext';

interface TeletextScreenProps {
  page: TeletextPage;
  loading: boolean;
  theme: ThemeConfig;
  isOnline?: boolean;
  isCached?: boolean;
}

/**
 * TeletextScreen Component
 * 
 * Renders a teletext page in a 40×24 character grid with monospaced font.
 * Supports color codes for the seven standard teletext colors plus black.
 * Displays cached indicator when serving offline content.
 * Implements memoization for performance optimization.
 * 
 * Requirements: 2.1, 2.3, 2.4, 2.5, 13.4
 * Performance: Memoization for page rendering
 */
const TeletextScreen = React.memo(function TeletextScreen({ 
  page, 
  loading, 
  theme, 
  isOnline = true, 
  isCached = false 
}: TeletextScreenProps) {
  /**
   * Parses a row of text and applies color codes.
   * Color codes are represented as {COLOR} in the text.
   * Supported colors: red, green, yellow, blue, magenta, cyan, white, black
   * Memoized for performance.
   */
  const parseColorCodes = useMemo(() => {
    return (text: string) => {
      const segments: Array<{ text: string; color?: string }> = [];
      let currentColor: string | undefined = undefined;
      let currentText = '';
      
      // Match color codes like {red}, {green}, etc.
      const colorRegex = /\{(red|green|yellow|blue|magenta|cyan|white|black)\}/gi;
      let lastIndex = 0;
      let match;
      
      while ((match = colorRegex.exec(text)) !== null) {
        // Add text before the color code
        if (match.index > lastIndex) {
          currentText += text.slice(lastIndex, match.index);
        }
        
        // If we have accumulated text, push it with current color
        if (currentText.length > 0) {
          segments.push({ text: currentText, color: currentColor });
          currentText = '';
        }
        
        // Update current color
        currentColor = match[1].toLowerCase();
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      currentText += text.slice(lastIndex);
      if (currentText.length > 0) {
        segments.push({ text: currentText, color: currentColor });
      }
      
      return segments;
    };
  }, []);

  /**
   * Renders all rows with memoization for performance
   * Requirement 35.1, 35.3, 35.4: Add MORE/BACK indicators and page counter
   */
  const renderedRows = useMemo(() => {
    const continuation = page.meta?.continuation;
    
    return page.rows.map((row, index) => {
      const segments = parseColorCodes(row);
      
      // Add BACK indicator at top of continuation pages (row 0)
      // Requirement 35.3
      let rowContent = (
        <>
          {segments.map((segment, segIndex) => (
            <span
              key={segIndex}
              style={{
                color: segment.color ? theme.colors[segment.color as keyof typeof theme.colors] : theme.colors.text
              }}
            >
              {segment.text}
            </span>
          ))}
        </>
      );
      
      if (index === 0 && continuation && continuation.previousPage) {
        // Add BACK indicator at the beginning of the first row
        rowContent = (
          <>
            <span style={{ color: theme.colors.cyan }}>▲ BACK </span>
            {segments.map((segment, segIndex) => (
              <span
                key={segIndex}
                style={{
                  color: segment.color ? theme.colors[segment.color as keyof typeof theme.colors] : theme.colors.text
                }}
              >
                {segment.text}
              </span>
            ))}
          </>
        );
      }
      
      // Add MORE indicator at bottom of pages with continuation (row 23)
      // Requirement 35.1
      if (index === 23 && continuation && continuation.nextPage) {
        rowContent = (
          <>
            {segments.map((segment, segIndex) => (
              <span
                key={segIndex}
                style={{
                  color: segment.color ? theme.colors[segment.color as keyof typeof theme.colors] : theme.colors.text
                }}
              >
                {segment.text}
              </span>
            ))}
            <span style={{ color: theme.colors.cyan }}> ▼ MORE</span>
          </>
        );
      }
      
      return (
        <div key={index} className="teletext-row">
          {rowContent}
        </div>
      );
    });
  }, [page.rows, page.meta?.continuation, theme, parseColorCodes]);

  return (
    <div 
      className="teletext-screen"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 'clamp(10px, 1.5vw, 20px)',
        lineHeight: '1.2',
        padding: '1.5vh 1.5vw',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {loading && (
        <div 
          className="loading-indicator"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: theme.colors.green,
            animation: 'blink 1s infinite'
          }}
        >
          LOADING...
        </div>
      )}
      
      {/* Cached indicator - Requirement 13.4 */}
      {!loading && (isCached || page.meta?.cacheStatus === 'cached') && (
        <div 
          className="cached-indicator"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: theme.colors.yellow,
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          [CACHED]
        </div>
      )}
      
      {/* Offline indicator */}
      {!loading && !isOnline && (
        <div 
          className="offline-indicator"
          style={{
            position: 'absolute',
            top: '40px',
            right: '20px',
            color: theme.colors.red,
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          [OFFLINE]
        </div>
      )}
      
      {/* Page counter indicator - Requirement 35.4 */}
      {!loading && page.meta?.continuation && (
        <div 
          className="page-counter"
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: theme.colors.cyan,
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Page {page.meta.continuation.currentIndex + 1}/{page.meta.continuation.totalPages}
        </div>
      )}
      
      {!loading && renderedRows}
      
      <style jsx>{`
        .teletext-row {
          white-space: pre;
          height: 1.2em;
        }
        
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
});

export default TeletextScreen;
