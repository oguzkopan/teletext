/**
 * Cursed Page Animations Component
 * 
 * Adds dynamic animated ASCII characters to the cursed page 666.
 * Characters float, fly, and crawl across the screen.
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  GHOST_FRAMES,
  BAT_FRAMES,
  SPIDER_FRAMES,
  SKULL_FRAMES,
  EYE_FRAMES,
  PARTICLE_FRAMES,
  BLOOD_FRAMES,
  getRandomFrame
} from '@/lib/cursed-ascii-art';

interface AnimatedCharacter {
  id: string;
  emoji: string;
  type: 'ghost' | 'bat' | 'spider' | 'skull' | 'eye';
  startX: number;
  startY: number;
  delay: number;
}

export default function CursedPageAnimations() {
  const [characters, setCharacters] = useState<AnimatedCharacter[]>([]);

  useEffect(() => {
    // Create multiple animated ASCII art characters using the library
    const newCharacters: AnimatedCharacter[] = [
      { id: 'ghost-1', emoji: getRandomFrame(GHOST_FRAMES), type: 'ghost', startX: -100, startY: 10, delay: 0 },
      { id: 'ghost-2', emoji: getRandomFrame(GHOST_FRAMES), type: 'ghost', startX: -100, startY: 30, delay: 5000 },
      { id: 'ghost-3', emoji: getRandomFrame(GHOST_FRAMES), type: 'ghost', startX: -100, startY: 50, delay: 10000 },
      { id: 'bat-1', emoji: getRandomFrame(BAT_FRAMES), type: 'bat', startX: window.innerWidth + 100, startY: 5, delay: 0 },
      { id: 'bat-2', emoji: getRandomFrame(BAT_FRAMES), type: 'bat', startX: window.innerWidth + 100, startY: 15, delay: 4000 },
      { id: 'bat-3', emoji: getRandomFrame(BAT_FRAMES), type: 'bat', startX: window.innerWidth + 100, startY: 25, delay: 8000 },
      { id: 'spider-1', emoji: getRandomFrame(SPIDER_FRAMES), type: 'spider', startX: 20, startY: -50, delay: 0 },
      { id: 'spider-2', emoji: getRandomFrame(SPIDER_FRAMES), type: 'spider', startX: 50, startY: -50, delay: 3000 },
      { id: 'spider-3', emoji: getRandomFrame(SPIDER_FRAMES), type: 'spider', startX: 80, startY: -50, delay: 6000 },
      { id: 'skull-1', emoji: getRandomFrame(SKULL_FRAMES), type: 'skull', startX: 10, startY: 70, delay: 0 },
      { id: 'skull-2', emoji: getRandomFrame(SKULL_FRAMES), type: 'skull', startX: 90, startY: 70, delay: 2000 },
      { id: 'eye-1', emoji: getRandomFrame(EYE_FRAMES), type: 'eye', startX: 30, startY: 40, delay: 0 },
      { id: 'eye-2', emoji: getRandomFrame(EYE_FRAMES), type: 'eye', startX: 70, startY: 40, delay: 1000 },
    ];

    setCharacters(newCharacters);
  }, []);

  return (
    <div 
      className="cursed-animations-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {characters.map((char) => (
        <div
          key={char.id}
          data-cursed-element={char.type}
          style={{
            position: 'absolute',
            left: `${char.startX}px`,
            top: `${char.startY}%`,
            fontSize: char.type === 'ghost' ? '48px' : char.type === 'bat' ? '36px' : '32px',
            animationDelay: `${char.delay}ms`,
            filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.5))'
          }}
        >
          {char.emoji}
        </div>
      ))}

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`particle-${i}`}
          data-cursed-element="particle"
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            bottom: 0,
            fontSize: '16px',
            animationDelay: `${i * 2000}ms`,
            opacity: 0.5,
            color: '#ffff00'
          }}
        >
          {getRandomFrame(PARTICLE_FRAMES)}
        </div>
      ))}

      {/* Blood drips */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`blood-${i}`}
          data-cursed-element="blood"
          style={{
            position: 'absolute',
            left: `${20 + i * 15}%`,
            top: '20%',
            fontSize: '24px',
            animationDelay: `${i * 1000}ms`,
            color: '#ff0000'
          }}
        >
          {getRandomFrame(BLOOD_FRAMES)}
        </div>
      ))}

      <style jsx>{`
        @keyframes float-ghost {
          0% {
            transform: translateX(-100px) translateY(0);
            opacity: 0.3;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateX(50vw) translateY(-20px);
            opacity: 1;
          }
          75% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(100vw) translateY(0);
            opacity: 0.3;
          }
        }

        @keyframes fly-bat {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          25% {
            transform: translateX(-25vw) translateY(-30px) rotate(-15deg);
          }
          50% {
            transform: translateX(-50vw) translateY(20px) rotate(15deg);
          }
          75% {
            transform: translateX(-75vw) translateY(-10px) rotate(-10deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(-100vw) translateY(0) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes crawl-spider {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          50% {
            transform: translateY(-50vh) translateX(20px) rotate(180deg);
            opacity: 1;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(-20px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes drip-blood {
          0% {
            transform: translateY(0) scaleY(1);
            opacity: 1;
          }
          50% {
            transform: translateY(20px) scaleY(1.5);
            opacity: 0.8;
          }
          100% {
            transform: translateY(40px) scaleY(0.5);
            opacity: 0;
          }
        }

        [data-cursed-element="ghost"] {
          animation: float-ghost 15s linear infinite;
        }

        [data-cursed-element="bat"] {
          animation: fly-bat 12s linear infinite;
        }

        [data-cursed-element="spider"] {
          animation: crawl-spider 10s linear infinite;
        }

        [data-cursed-element="particle"] {
          animation: float-particle 20s linear infinite;
        }

        [data-cursed-element="blood"] {
          animation: drip-blood 3s ease-in infinite;
        }

        [data-cursed-element="skull"] {
          animation: pulse 2s ease-in-out infinite;
        }

        [data-cursed-element="eye"] {
          animation: blink 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.1);
            filter: brightness(1.5);
          }
        }

        @keyframes blink {
          0%, 45%, 55%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          [data-cursed-element] {
            animation: none !important;
            opacity: 0.5 !important;
          }
        }
      `}</style>
    </div>
  );
}
