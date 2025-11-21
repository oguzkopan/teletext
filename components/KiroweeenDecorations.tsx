/**
 * Kiroween Decorations Component
 * 
 * Renders Halloween-themed decorative elements for the Haunting/Kiroween theme.
 * Includes jack-o-lanterns, floating ghosts, flying bats, and animated ASCII cat art.
 * 
 * Requirements: 6.2, 7.1, 7.2, 7.3
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/lib/theme-context';
import {
  DecorativeElement,
  DEFAULT_KIROWEEN_DECORATIONS,
  getPositionStyles,
  getAnimationClassName,
  shouldRenderDecoration
} from '@/lib/kiroween-decorations';
import { getAnimationEngine } from '@/lib/animation-engine';

interface KiroweeenDecorationsProps {
  decorations?: DecorativeElement[];
  enabled?: boolean;
}

/**
 * Component that renders Kiroween decorative elements
 */
export function KiroweeenDecorations({ 
  decorations = DEFAULT_KIROWEEN_DECORATIONS,
  enabled = true
}: KiroweeenDecorationsProps) {
  const { currentThemeKey } = useTheme();
  const decorationRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [animationIds, setAnimationIds] = useState<Map<string, string>>(new Map());

  // Only render decorations for haunting theme
  const shouldRender = enabled && shouldRenderDecoration({ id: '', type: 'emoji', content: '', position: 'corner' }, currentThemeKey);

  useEffect(() => {
    if (!shouldRender) {
      // Clean up any active animations
      const engine = getAnimationEngine();
      animationIds.forEach(animId => engine.stopAnimation(animId));
      setAnimationIds(new Map());
      return;
    }

    const engine = getAnimationEngine();
    engine.setTheme(currentThemeKey);
    const newAnimationIds = new Map<string, string>();

    // Start animations for each decoration
    decorations.forEach(decoration => {
      const element = decorationRefs.current.get(decoration.id);
      if (element && decoration.animation) {
        const animId = engine.playAnimationConfig(decoration.animation, element, { loop: true });
        newAnimationIds.set(decoration.id, animId);
      }
    });

    setAnimationIds(newAnimationIds);

    // Cleanup on unmount or theme change
    return () => {
      newAnimationIds.forEach(animId => engine.stopAnimation(animId));
    };
  }, [shouldRender, currentThemeKey, decorations]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="kiroween-decorations" style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
      {decorations.map(decoration => (
        <DecorationElement
          key={decoration.id}
          decoration={decoration}
          ref={(el) => {
            if (el) {
              decorationRefs.current.set(decoration.id, el);
            } else {
              decorationRefs.current.delete(decoration.id);
            }
          }}
        />
      ))}
    </div>
  );
}

/**
 * Individual decoration element component
 */
const DecorationElement = React.forwardRef<HTMLDivElement, { decoration: DecorativeElement }>(
  ({ decoration }, ref) => {
    const positionStyles = getPositionStyles(decoration.position, decoration.size);
    const animationClass = getAnimationClassName(decoration);

    const style: React.CSSProperties = {
      ...positionStyles,
      zIndex: decoration.zIndex || 5
    };

    // Render content based on type
    const renderContent = () => {
      if (decoration.type === 'ascii-art') {
        // For ASCII art, use the first frame or the content string
        const content = Array.isArray(decoration.content) 
          ? decoration.content[0] 
          : decoration.content;
        
        return (
          <pre style={{ 
            margin: 0, 
            padding: 0, 
            lineHeight: '1.2',
            fontFamily: 'monospace',
            whiteSpace: 'pre'
          }}>
            {content}
          </pre>
        );
      }

      // For emoji and symbol types, render directly
      const content = Array.isArray(decoration.content) 
        ? decoration.content[0] 
        : decoration.content;
      
      return <span>{content}</span>;
    };

    return (
      <div
        ref={ref}
        className={`decoration-element ${animationClass}`}
        style={style}
        data-decoration-id={decoration.id}
      >
        {renderContent()}
      </div>
    );
  }
);

DecorationElement.displayName = 'DecorationElement';

export default KiroweeenDecorations;
