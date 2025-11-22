'use client';

import React, { useEffect, useState } from 'react';

/**
 * HalloweenDecorations Component
 * 
 * Adds spooky Halloween-themed decorative elements to the screen
 * for the Kiroween Hackathon theme
 */
export default function HalloweenDecorations() {
  const [showDecorations, setShowDecorations] = useState(true);

  // Randomly positioned decorations
  const decorations = [
    { emoji: '🎃', top: '5%', left: '5%', animation: 'jack-o-lantern-flicker', delay: '0s' },
    { emoji: '🎃', top: '5%', right: '5%', animation: 'jack-o-lantern-flicker', delay: '0.5s' },
    { emoji: '👻', top: '15%', left: '10%', animation: 'ghost-float-decoration', delay: '0s' },
    { emoji: '🦇', top: '20%', right: '15%', animation: 'bat-fly-decoration', delay: '2s' },
    { emoji: '💀', top: '80%', left: '8%', animation: 'skull-pulse-decoration', delay: '0s' },
    { emoji: '🕷️', top: '10%', right: '20%', animation: 'spider-crawl-decoration', delay: '1s' },
    { emoji: '🕸️', top: '3%', left: '15%', animation: 'none', delay: '0s' },
    { emoji: '🕸️', top: '3%', right: '10%', animation: 'none', delay: '0s' },
    { emoji: '⚡', top: '50%', left: '2%', animation: 'jack-o-lantern-flicker', delay: '1.5s' },
    { emoji: '⚡', top: '50%', right: '2%', animation: 'jack-o-lantern-flicker', delay: '1.8s' },
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
            left: deco.left,
            right: deco.right,
            fontSize: '2rem',
            pointerEvents: 'none',
            zIndex: 100,
            opacity: 0.7,
            animationDelay: deco.delay,
            textShadow: '0 0 10px rgba(255, 100, 0, 0.8)'
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
