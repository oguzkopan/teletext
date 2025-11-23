'use client';

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { TeletextPage, ThemeConfig } from '@/types/teletext';
import { getAnimationEngine } from '@/lib/animation-engine';
import { useAITypingAnimation } from '@/hooks/useAITypingAnimation';
import { getInteractiveElementStyles } from '@/lib/interactive-element-highlighting';
import { useLoadingTextRotation } from '@/hooks/useLoadingTextRotation';
import { useAnimationSettingsPage } from './AnimationSettingsPage';

interface TeletextScreenProps {
  page: TeletextPage;
  loading: boolean;
  theme: ThemeConfig;
  isOnline?: boolean;
  inputBuffer?: string;
  expectedInputLength?: number;
}

/**
 * TeletextScreen Component
 * 
 * Renders a teletext page in a 40×24 character grid with monospaced font.
 * Supports color codes for the seven standard teletext colors plus black.
 * Displays cached indicator when serving offline content.
 * Implements memoization for performance optimization.
 * Enhanced with animation layer, page transitions, loading animations, and interactive element highlighting.
 * 
 * Requirements: 2.1, 2.3, 2.4, 2.5, 13.4, 6.1, 6.3, 6.4, 10.1, 10.2, 10.3, 10.4
 * Performance: Memoization for page rendering
 */
const TeletextScreen = React.memo(function TeletextScreen({ 
  page, 
  loading, 
  theme, 
  isOnline = true,
  inputBuffer = '',
  expectedInputLength = 3
}: TeletextScreenProps) {
  const animationEngine = getAnimationEngine();
  const screenRef = useRef<HTMLDivElement>(null);
  const loadingIndicatorRef = useRef<HTMLDivElement>(null);
  const animationLayerRef = useRef<HTMLDivElement>(null);
  const [activeAnimations, setActiveAnimations] = useState<string[]>([]);
  const previousPageIdRef = useRef<string>(page.id);
  const [showNavigationHint, setShowNavigationHint] = useState(false);

  // Use animation settings page hook for page 701
  // Requirement: 12.5 - Real-time preview of animation changes
  const displayPage = useAnimationSettingsPage(page);

  // Loading text rotation hook - Requirements: 14.5
  const { currentMessage: loadingMessage } = useLoadingTextRotation({
    theme: theme.name,
    enabled: loading && !displayPage.meta?.aiGenerated
  });

  // AI typing animation hook - Requirements: 24.1, 24.2, 24.3, 24.4, 24.5
  const typingAnimation = useAITypingAnimation({
    speed: 75, // 75 characters per second (within 50-100 range)
    showCursor: true,
    allowSkip: true,
    onComplete: () => {
      // Requirement 24.4: Display navigation options after typing completes
      setShowNavigationHint(true);
    },
    onSkip: () => {
      setShowNavigationHint(true);
    }
  });

  // Map theme names to animation engine theme keys
  const getThemeKey = (themeName: string): string => {
    const themeMap: Record<string, string> = {
      'Ceefax': 'ceefax',
      'Haunting Mode': 'haunting',
      'High Contrast': 'high-contrast',
      'ORF': 'orf'
    };
    return themeMap[themeName] || 'ceefax';
  };

  // Set theme in animation engine when theme changes
  useEffect(() => {
    const themeKey = getThemeKey(theme.name);
    animationEngine.setTheme(themeKey);
  }, [theme.name, animationEngine]);

  // Apply background effects when component mounts or theme changes
  useEffect(() => {
    if (!animationLayerRef.current) return;

    // Clean up previous background effects
    activeAnimations.forEach(id => animationEngine.stopAnimation(id));

    // Apply new background effects
    const effectIds = animationEngine.applyBackgroundEffects(animationLayerRef.current);
    setActiveAnimations(effectIds);

    return () => {
      // Clean up on unmount
      effectIds.forEach(id => animationEngine.stopAnimation(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.name, animationEngine]);

  // Play page transition animation when page changes
  useEffect(() => {
    if (!screenRef.current) return;
    
    // Only play transition if page actually changed
    if (previousPageIdRef.current !== displayPage.id && !loading) {
      const transitionId = animationEngine.playPageTransition(screenRef.current);
      
      // Clean up transition after it completes
      const animations = animationEngine.getThemeAnimations();
      if (animations) {
        setTimeout(() => {
          animationEngine.stopAnimation(transitionId);
        }, animations.pageTransition.duration);
      }
      
      previousPageIdRef.current = displayPage.id;
    }
  }, [displayPage.id, loading, animationEngine]);

  // Play loading animation
  useEffect(() => {
    if (!loadingIndicatorRef.current) return;

    let loadingAnimationId: string | null = null;

    if (loading) {
      loadingAnimationId = animationEngine.playLoadingIndicator(loadingIndicatorRef.current);
      
      // Requirement 24.5: Display "thinking..." animation while waiting for AI response
      if (displayPage.meta?.aiGenerated) {
        typingAnimation.startThinking();
      }
    } else {
      // Stop thinking animation when loading completes
      typingAnimation.stopThinking();
    }

    return () => {
      if (loadingAnimationId) {
        animationEngine.stopAnimation(loadingAnimationId);
      }
    };
  }, [loading, animationEngine, displayPage.meta?.aiGenerated, typingAnimation]);

  // Handle AI typing animation for AI-generated content
  // Requirements: 24.1, 24.2
  useEffect(() => {
    // Only apply typing animation to AI-generated content
    if (!displayPage.meta?.aiGenerated || loading) {
      return;
    }

    // Extract text content from page rows (skip header rows)
    const contentRows = displayPage.rows.slice(3); // Skip first 3 rows (header)
    const textContent = contentRows
      .map(row => row.trim())
      .filter(row => row.length > 0 && !row.startsWith('═') && !row.startsWith('INDEX'))
      .join('\n');

    if (textContent.length > 0) {
      // Reset navigation hint
      setShowNavigationHint(false);
      
      // Start typing animation
      typingAnimation.startTyping(textContent);
    }

    return () => {
      typingAnimation.stop();
    };
  }, [displayPage.id, displayPage.rows, displayPage.meta?.aiGenerated, loading, typingAnimation]);
  /**
   * Parses a row of text and applies color codes.
   * Color codes are represented as {COLOR} in the text.
   * Supported colors: red, green, yellow, blue, magenta, cyan, white, black
   * Also detects interactive elements (text in brackets) for highlighting.
   * Memoized for performance.
   */
  const parseColorCodes = useMemo(() => {
    return (text: string) => {
      const segments: Array<{ text: string; color?: string; interactive?: boolean }> = [];
      let currentColor: string | undefined = undefined;
      let currentText = '';
      
      // Match color codes like {red}, {green}, etc.
      const colorRegex = /\{(red|green|yellow|blue|magenta|cyan|white|black)\}/gi;
      // Match interactive elements like [1], [Option], etc.
      const interactiveRegex = /\[([^\]]+)\]/g;
      
      let lastIndex = 0;
      let match;
      
      // First pass: handle color codes
      const textWithoutColorCodes = text.replace(colorRegex, (match, color) => {
        currentColor = color.toLowerCase();
        return '\x00COLOR\x00'; // Placeholder
      });
      
      // Second pass: handle interactive elements
      const parts: Array<{ text: string; color?: string; interactive?: boolean }> = [];
      let tempText = '';
      let colorIndex = 0;
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // Check for color code
        if (text.slice(i).match(/^\{(red|green|yellow|blue|magenta|cyan|white|black)\}/i)) {
          if (tempText) {
            parts.push({ text: tempText, color: currentColor });
            tempText = '';
          }
          const colorMatch = text.slice(i).match(/^\{(red|green|yellow|blue|magenta|cyan|white|black)\}/i);
          if (colorMatch) {
            currentColor = colorMatch[1].toLowerCase();
            i += colorMatch[0].length - 1;
          }
          continue;
        }
        
        // Check for interactive element
        if (char === '[') {
          if (tempText) {
            parts.push({ text: tempText, color: currentColor });
            tempText = '';
          }
          let bracketContent = '';
          let j = i + 1;
          while (j < text.length && text[j] !== ']') {
            bracketContent += text[j];
            j++;
          }
          if (j < text.length) {
            parts.push({ text: `[${bracketContent}]`, color: currentColor, interactive: true });
            i = j;
            continue;
          }
        }
        
        tempText += char;
      }
      
      if (tempText) {
        parts.push({ text: tempText, color: currentColor });
      }
      
      return parts.length > 0 ? parts : [{ text, color: currentColor }];
    };
  }, []);

  /**
   * Renders all rows with memoization for performance
   * Enhanced with interactive element highlighting and visual feedback
   * Enhanced with AI typing animation for AI-generated content
   * Requirement 35.1, 35.3, 35.4: Add MORE/BACK indicators and page counter
   * Requirement 6.4: Add visual feedback for interactive elements
   * Requirements 24.1, 24.2: Character-by-character text reveal for AI content
   */
  const renderedRows = useMemo(() => {
    const continuation = displayPage.meta?.continuation;
    const isAIGenerated = displayPage.meta?.aiGenerated && !loading;
    
    return displayPage.rows.map((row, index) => {
      // For AI-generated content, replace content rows with typing animation
      if (isAIGenerated && index >= 3 && index < 23) {
        // Skip header (first 3 rows) and footer (last row)
        const contentRowIndex = index - 3;
        const typedLines = typingAnimation.displayText.split('\n');
        
        if (contentRowIndex < typedLines.length) {
          const typedLine = typedLines[contentRowIndex];
          return (
            <div key={index} className="teletext-row ai-typed-row">
              <span style={{ color: theme.colors.text }}>
                {typedLine}
              </span>
            </div>
          );
        } else {
          // Empty row after typed content
          return (
            <div key={index} className="teletext-row">
              <span style={{ color: theme.colors.text }}></span>
            </div>
          );
        }
      }
      
      // Normal rendering for non-AI content or header/footer rows
      const segments = parseColorCodes(row);
      
      // Add BACK indicator at top of continuation pages (row 0)
      // Requirement 35.3
      let rowContent = (
        <>
          {segments.map((segment, segIndex) => (
            <span
              key={segIndex}
              className={segment.interactive ? 'interactive-element' : ''}
              style={{
                color: segment.color ? theme.colors[segment.color as keyof typeof theme.colors] : theme.colors.text,
                ...(segment.interactive && {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                })
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
            <span style={{ color: theme.colors.cyan }} className="arrow-indicator">▲ BACK </span>
            {segments.map((segment, segIndex) => (
              <span
                key={segIndex}
                className={segment.interactive ? 'interactive-element' : ''}
                style={{
                  color: segment.color ? theme.colors[segment.color as keyof typeof theme.colors] : theme.colors.text,
                  ...(segment.interactive && {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  })
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
                className={segment.interactive ? 'interactive-element' : ''}
                style={{
                  color: segment.color ? theme.colors[segment.color as keyof typeof theme.colors] : theme.colors.text,
                  ...(segment.interactive && {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  })
                }}
              >
                {segment.text}
              </span>
            ))}
            <span style={{ color: theme.colors.cyan }} className="arrow-indicator"> ▼ MORE</span>
          </>
        );
      }
      
      return (
        <div key={index} className="teletext-row">
          {rowContent}
        </div>
      );
    });
  }, [displayPage.rows, displayPage.meta?.continuation, displayPage.meta?.aiGenerated, theme, parseColorCodes, typingAnimation.displayText, loading]);

  return (
    <div 
      ref={screenRef}
      className="teletext-screen"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 'clamp(14px, 1.5vw, 22px)',
        lineHeight: '1.2',
        padding: '1vh 1vw',
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Animation layer for theme-specific effects - Requirement 6.1 */}
      <div 
        ref={animationLayerRef}
        className="animation-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Loading animation with theme-appropriate indicators - Requirements: 6.3, 14.5 */}
      {loading && (
        <div 
          className="loading-indicator"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: theme.colors.green,
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 10
          }}
        >
          <span ref={loadingIndicatorRef}>
            {displayPage.meta?.aiGenerated ? typingAnimation.displayText : loadingMessage}
          </span>
        </div>
      )}

      {/* AI typing skip hint - Requirement 24.3 */}
      {!loading && typingAnimation.isActive && (
        <div 
          className="typing-skip-hint"
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '20px',
            color: theme.colors.yellow,
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 10,
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          Press any key to skip
        </div>
      )}

      {/* Navigation hint after typing completes - Requirement 24.4 */}
      {!loading && showNavigationHint && displayPage.meta?.aiGenerated && (
        <div 
          className="navigation-hint"
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: theme.colors.cyan,
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 10,
            animation: 'fadeIn 0.5s ease-in'
          }}
        >
          Use colored buttons to navigate
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
            fontWeight: 'bold',
            zIndex: 10
          }}
        >
          [OFFLINE]
        </div>
      )}
      
      {/* Page counter indicator - Requirement 35.4 */}
      {!loading && displayPage.meta?.continuation && (
        <div 
          className="page-counter"
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: theme.colors.cyan,
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 10
          }}
        >
          Page {displayPage.meta.continuation.currentIndex + 1}/{displayPage.meta.continuation.totalPages}
        </div>
      )}
      
      {/* Content with page transition animations - Requirement 10.1, 10.2, 10.3, 10.4 */}
      <div className="content-wrapper" style={{ 
        position: 'relative', 
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between'
      }}>
        {!loading && renderedRows}
      </div>
      
      <style jsx>{`
        .teletext-row {
          white-space: pre;
          height: calc((100vh - 2vh) / 24);
          min-height: 1.2em;
          width: 100%;
          overflow: visible;
          display: flex;
          align-items: center;
        }
        
        /* Interactive element highlighting - Requirements 25.1, 25.2, 25.3, 25.4, 25.5 */
        ${getInteractiveElementStyles(theme)}
        
        /* Arrow indicator animations */
        .arrow-indicator {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        /* Ceefax theme animations - Requirement 10.2 */
        :global(.ceefax-wipe) {
          animation: ceefax-wipe 0.3s ease-in-out;
        }
        
        @keyframes ceefax-wipe {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        :global(.button-flash) {
          animation: button-flash 0.15s ease-in-out;
        }
        
        @keyframes button-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; background-color: rgba(255, 255, 255, 0.3); }
        }
        
        :global(.cursor-blink) {
          animation: cursor-blink 0.5s step-end infinite;
        }
        
        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        :global(.scanlines-overlay) {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
        }
        
        /* Haunting theme animations - Requirement 10.3 */
        :global(.horror-flash) {
          animation: horror-flash 0.2s ease-in-out;
        }
        
        @keyframes horror-flash {
          0%, 100% { opacity: 1; filter: none; }
          50% { opacity: 0.7; filter: hue-rotate(180deg) brightness(1.5); }
        }
        
        :global(.glitch-cursor) {
          animation: glitch-cursor 0.3s steps(2) infinite;
        }
        
        @keyframes glitch-cursor {
          0% { opacity: 1; transform: translateX(0); }
          25% { opacity: 0.8; transform: translateX(-2px); }
          50% { opacity: 1; transform: translateX(2px); }
          75% { opacity: 0.8; transform: translateX(-1px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        :global(.ghost-float) {
          animation: ghost-float 10s ease-in-out infinite;
        }
        
        @keyframes ghost-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(50vw); opacity: 0.5; }
          90% { opacity: 0.3; }
          100% { transform: translateY(0) translateX(100vw); opacity: 0; }
        }
        
        :global(.screen-flicker) {
          animation: screen-flicker 5s ease-in-out infinite;
        }
        
        @keyframes screen-flicker {
          0%, 100% { opacity: 1; }
          10%, 30%, 50%, 70%, 90% { opacity: 0.95; }
          20%, 40%, 60%, 80% { opacity: 0.98; }
        }
        
        :global(.chromatic-aberration) {
          position: relative;
        }
        
        :global(.chromatic-aberration::before),
        :global(.chromatic-aberration::after) {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        
        :global(.chromatic-aberration::before) {
          background: rgba(255, 0, 0, 0.1);
          transform: translateX(-2px);
        }
        
        :global(.chromatic-aberration::after) {
          background: rgba(0, 255, 255, 0.1);
          transform: translateX(2px);
        }
        
        /* High Contrast theme animations - Requirement 10.4 */
        :global(.fade-transition) {
          animation: fade-transition 0.25s ease;
        }
        
        @keyframes fade-transition {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        :global(.simple-flash) {
          animation: simple-flash 0.15s ease;
        }
        
        @keyframes simple-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        :global(.steady-cursor) {
          animation: steady-cursor 0.5s ease-in-out infinite;
        }
        
        @keyframes steady-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* ORF theme animations - Requirement 10.4 */
        :global(.slide-transition) {
          animation: slide-transition 0.3s ease-in-out;
        }
        
        @keyframes slide-transition {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        :global(.color-flash) {
          animation: color-flash 0.15s ease;
        }
        
        @keyframes color-flash {
          0%, 100% { opacity: 1; filter: hue-rotate(0deg); }
          50% { opacity: 0.8; filter: hue-rotate(30deg); }
        }
        
        :global(.color-cursor) {
          animation: color-cursor 0.5s ease-in-out infinite;
        }
        
        @keyframes color-cursor {
          0%, 100% { opacity: 1; filter: hue-rotate(0deg); }
          50% { opacity: 0.7; filter: hue-rotate(60deg); }
        }
        
        :global(.color-cycle) {
          animation: color-cycle 5s linear infinite;
        }
        
        @keyframes color-cycle {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        
        /* AI typing animation styles - Requirements 24.1, 24.2 */
        .ai-typed-row {
          animation: fadeIn 0.1s ease-in;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        /* Typing skip hint animation - Requirement 24.3 */
        .typing-skip-hint {
          animation: pulse 2s ease-in-out infinite;
        }
        
        /* Navigation hint animation - Requirement 24.4 */
        .navigation-hint {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </div>
  );
});

export default TeletextScreen;
