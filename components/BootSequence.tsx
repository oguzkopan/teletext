'use client';

import React, { useEffect, useState } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
  theme: {
    background: string;
    text: string;
    green: string;
  };
}

/**
 * BootSequence Component
 * 
 * Displays a CRT warm-up animation when the application first loads.
 * Features:
 * - Static noise animation
 * - Gradual screen warm-up effect
 * - Completes within 3 seconds
 * - Can be skipped by pressing any key
 * 
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5
 */
export default function BootSequence({ onComplete, theme }: BootSequenceProps) {
  const [phase, setPhase] = useState<'warmup' | 'static' | 'transition'>('warmup');
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    // Handle keyboard skip
    const handleKeyPress = () => {
      onComplete();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleKeyPress);

    // Phase 1: Warm-up (0-800ms) - Screen gradually brightens
    const warmupTimer = setTimeout(() => {
      setPhase('static');
    }, 800);

    // Gradual brightness increase during warm-up
    const brightnessInterval = setInterval(() => {
      setBrightness(prev => {
        if (prev >= 1) {
          clearInterval(brightnessInterval);
          return 1;
        }
        return prev + 0.05;
      });
    }, 40);

    // Phase 2: Static noise (800-2200ms)
    const staticTimer = setTimeout(() => {
      setPhase('transition');
    }, 2200);

    // Phase 3: Transition to page 100 (2200-3000ms)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(warmupTimer);
      clearTimeout(staticTimer);
      clearTimeout(completeTimer);
      clearInterval(brightnessInterval);
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleKeyPress);
    };
  }, [onComplete]);

  return (
    <div className="boot-sequence">
      <div className="crt-container">
        <div className="crt-frame">
          <div className="crt-bezel">
            <div className="crt-screen">
              {/* Warm-up phase - dark screen with slight glow */}
              {phase === 'warmup' && (
                <div 
                  className="warmup-screen"
                  style={{
                    opacity: brightness,
                    backgroundColor: theme.background,
                  }}
                >
                  <div className="warmup-glow" />
                </div>
              )}

              {/* Static noise phase */}
              {phase === 'static' && (
                <div className="static-screen">
                  <div className="static-noise" />
                  <div className="static-lines" />
                </div>
              )}

              {/* Transition phase - static fades, text appears */}
              {phase === 'transition' && (
                <div className="transition-screen">
                  <div className="static-noise fade-out" />
                  <div 
                    className="boot-text"
                    style={{ color: theme.green }}
                  >
                    <div className="boot-line">MODERN TELETEXT</div>
                    <div className="boot-line delay-1">SYSTEM READY</div>
                    <div className="boot-line delay-2">LOADING PAGE 100...</div>
                  </div>
                </div>
              )}

              {/* Scanlines overlay (always present) */}
              <div className="scanlines" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .boot-sequence {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #000;
          z-index: 9999;
        }

        .crt-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
          background: #1a1a1a;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        }

        .crt-frame {
          position: relative;
          background: #2a2a2a;
          padding: 1.5vh 1.5vw;
          border-radius: 20px;
          box-shadow: 
            0 0 50px rgba(0, 0, 0, 0.8),
            inset 0 0 20px rgba(0, 0, 0, 0.5);
          max-width: 98vw;
          max-height: 98vh;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .crt-bezel {
          position: relative;
          background: #000;
          padding: 1vh 1vw;
          border-radius: 10px;
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.9);
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .crt-screen {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #000;
          border-radius: 8px;
          box-sizing: border-box;
        }

        /* Warm-up phase */
        .warmup-screen {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: opacity 0.1s linear;
        }

        .warmup-glow {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          animation: pulse 0.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        /* Static noise phase */
        .static-screen {
          width: 100%;
          height: 100%;
          position: relative;
          background: #000;
        }

        .static-noise {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            );
          animation: static-animation 0.1s infinite;
          opacity: 0.8;
        }

        .static-noise::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            rgba(255, 255, 255, 0.1) 2px
          );
          animation: static-scroll 0.2s linear infinite;
        }

        @keyframes static-animation {
          0% { opacity: 0.8; }
          25% { opacity: 0.6; }
          50% { opacity: 0.9; }
          75% { opacity: 0.7; }
          100% { opacity: 0.8; }
        }

        @keyframes static-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }

        .static-lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 2px,
            transparent 10px
          );
          animation: scan-lines 2s linear infinite;
        }

        @keyframes scan-lines {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }

        /* Transition phase */
        .transition-screen {
          width: 100%;
          height: 100%;
          position: relative;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .static-noise.fade-out {
          animation: fade-out 0.8s ease-out forwards;
        }

        @keyframes fade-out {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }

        .boot-text {
          position: relative;
          z-index: 10;
          text-align: center;
          font-family: 'Courier New', Courier, monospace;
          font-size: 24px;
          font-weight: bold;
          text-shadow: 0 0 10px currentColor;
        }

        .boot-line {
          opacity: 0;
          animation: fade-in 0.3s ease-in forwards;
          margin: 10px 0;
        }

        .boot-line.delay-1 {
          animation-delay: 0.2s;
        }

        .boot-line.delay-2 {
          animation-delay: 0.4s;
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Scanlines overlay */
        .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15) 0px,
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 100;
        }
      `}</style>
    </div>
  );
}
