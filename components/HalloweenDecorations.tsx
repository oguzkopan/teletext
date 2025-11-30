'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme-context';

/**
 * HalloweenDecorations Component
 * 
 * Adds spooky Halloween-themed decorative elements to the screen
 * ONLY when the Haunting theme is active
 * Requirements: 3.3, 3.4 - Theme-specific decorations
 */
export default function HalloweenDecorations() {
  const { currentThemeKey } = useTheme();
  const [showDecorations, setShowDecorations] = useState(false);
  
  // Only show decorations when haunting theme is active
  useEffect(() => {
    setShowDecorations(currentThemeKey === 'haunting');
  }, [currentThemeKey]);

  // Spooky decorations with varied positions and animations
  const decorations = [
    // Jack-o-lanterns in corners
    { emoji: '🎃', top: '5%', left: '5%', animation: 'jack-o-lantern-flicker', delay: '0s', size: '3rem' },
    { emoji: '🎃', top: '5%', right: '5%', animation: 'jack-o-lantern-flicker', delay: '0.5s', size: '3rem' },
    { emoji: '🎃', bottom: '5%', left: '5%', animation: 'jack-o-lantern-flicker', delay: '1s', size: '2.5rem' },
    { emoji: '🎃', bottom: '5%', right: '5%', animation: 'jack-o-lantern-flicker', delay: '1.5s', size: '2.5rem' },
    
    // Floating ghosts
    { emoji: '👻', top: '15%', left: '10%', animation: 'ghost-float-decoration', delay: '0s', size: '2.5rem' },
    { emoji: '👻', top: '60%', right: '12%', animation: 'ghost-float-decoration', delay: '2s', size: '2rem' },
    { emoji: '👻', top: '40%', left: '15%', animation: 'ghost-float-decoration', delay: '4s', size: '2.2rem' },
    
    // Flying bats
    { emoji: '🦇', top: '20%', right: '15%', animation: 'bat-fly-decoration', delay: '0s', size: '2rem' },
    { emoji: '🦇', top: '35%', left: '20%', animation: 'bat-fly-decoration', delay: '3s', size: '1.8rem' },
    { emoji: '🦇', top: '70%', right: '25%', animation: 'bat-fly-decoration', delay: '5s', size: '2rem' },
    
    // Skulls
    { emoji: '💀', top: '80%', left: '8%', animation: 'skull-pulse-decoration', delay: '0s', size: '2.5rem' },
    { emoji: '💀', top: '25%', right: '8%', animation: 'skull-pulse-decoration', delay: '2s', size: '2rem' },
    
    // Crawling spiders
    { emoji: '🕷️', top: '10%', right: '20%', animation: 'spider-crawl-decoration', delay: '1s', size: '1.5rem' },
    { emoji: '🕷️', top: '50%', left: '5%', animation: 'spider-crawl-decoration', delay: '3s', size: '1.5rem' },
    { emoji: '🕷️', bottom: '20%', right: '10%', animation: 'spider-crawl-decoration', delay: '5s', size: '1.5rem' },
    
    // Spider webs (static)
    { emoji: '🕸️', top: '3%', left: '15%', animation: 'none', delay: '0s', size: '2rem' },
    { emoji: '🕸️', top: '3%', right: '10%', animation: 'none', delay: '0s', size: '2rem' },
    { emoji: '🕸️', bottom: '3%', left: '20%', animation: 'none', delay: '0s', size: '1.8rem' },
    
    // Lightning bolts
    { emoji: '⚡', top: '50%', left: '2%', animation: 'jack-o-lantern-flicker', delay: '1.5s', size: '2rem' },
    { emoji: '⚡', top: '50%', right: '2%', animation: 'jack-o-lantern-flicker', delay: '1.8s', size: '2rem' },
  ];

  return (
    <>
      {showDecorations && decorations.map((deco, index) => (
        <div
          key={index}
          className={deco.animation}
          style={{
            position: 'fixed',
            top: deco.top,
            bottom: deco.bottom,
            left: deco.left,
            right: deco.right,
            fontSize: deco.size,
            pointerEvents: 'none',
            zIndex: 100,
            opacity: 0.8,
            animationDelay: deco.delay,
            textShadow: '0 0 15px rgba(255, 100, 0, 0.9), 0 0 30px rgba(255, 0, 0, 0.5)',
            filter: 'drop-shadow(0 0 10px rgba(255, 100, 0, 0.8))'
          }}
        >
          {deco.emoji}
        </div>
      ))}
      
      {/* Floating particles effect */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50,
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 100, 0, 0.05) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />
    </>
  );
}
