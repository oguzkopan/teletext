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
  const [phase, setPhase] = useState<'warmup' | 'static' | 'transition' | 'waiting'>('warmup');
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    // Phase 1: Warm-up (0-1000ms) - Screen gradually brightens
    const warmupTimer = setTimeout(() => {
      setPhase('static');
    }, 1000);

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

    // Phase 2: Static noise (1000-2500ms)
    const staticTimer = setTimeout(() => {
      setPhase('transition');
    }, 2500);

    // Phase 3: Show instructions and wait for user input (after 4000ms)
    const transitionTimer = setTimeout(() => {
      setPhase('waiting');
    }, 4000);

    return () => {
      clearTimeout(warmupTimer);
      clearTimeout(staticTimer);
      clearTimeout(transitionTimer);
      clearInterval(brightnessInterval);
    };
  }, []);

  // Handle keyboard/click only when in waiting phase
  useEffect(() => {
    if (phase !== 'waiting') return;

    const handleKeyPress = () => {
      onComplete();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleKeyPress);
    };
  }, [phase, onComplete]);

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
              {(phase === 'transition' || phase === 'waiting') && (
                <div className="transition-screen">
                  <div className="static-noise fade-out" />
                  <div 
                    className="boot-text"
                    style={{ color: theme.green }}
                  >
                    <div className="boot-line glitch-text logo-reveal">
                      ╔══════════════════════════════════╗
                    </div>
                    <div className="boot-line glitch-text logo-reveal delay-0-5">
                      ║  MODERN TELETEXT  ░▒▓█▓▒░       ║
                    </div>
                    <div className="boot-line glitch-text logo-reveal delay-0-7">
                      ╚══════════════════════════════════╝
                    </div>
                    <div className="boot-line delay-1 glitch-text">SYSTEM READY</div>
                    <div className="boot-line delay-2" style={{ fontSize: '18px', color: '#ffff00', marginTop: '40px' }}>
                      KEYBOARD CONTROLS:
                    </div>
                    <div className="boot-line delay-3" style={{ fontSize: '16px', color: '#ffffff', marginTop: '15px' }}>
                      0-9: Enter page number
                    </div>
                    <div className="boot-line delay-4" style={{ fontSize: '16px', color: '#ffffff', marginTop: '8px' }}>
                      Arrow Keys: Navigate pages
                    </div>
                    <div className="boot-line delay-5" style={{ fontSize: '16px', color: '#ffffff', marginTop: '8px' }}>
                      R/G/Y/B: Color shortcuts
                    </div>
                    <div className="boot-line delay-6" style={{ fontSize: '20px', color: '#ff0000', marginTop: '40px', fontWeight: 'bold' }}>
                      {phase === 'waiting' ? '▶ PRESS ANY KEY TO ENTER ◀' : 'LOADING...'}
                    </div>
                    <div className="boot-line delay-7" style={{ fontSize: '14px', color: '#00ffff', marginTop: '20px' }}>
                      ⚡ Powered by Kiro
                    </div>
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
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 255, 100, 0.4) 0%, rgba(255, 0, 0, 0.2) 50%, transparent 70%);
          animation: pulse-horror 0.6s ease-in-out infinite;
          box-shadow: 0 0 40px rgba(0, 255, 100, 0.5);
        }

        @keyframes pulse-horror {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.4;
            filter: hue-rotate(0deg);
          }
          25% { 
            transform: scale(1.3); 
            opacity: 0.7;
            filter: hue-rotate(90deg);
          }
          50% { 
            transform: scale(0.9); 
            opacity: 0.9;
            filter: hue-rotate(180deg);
          }
          75% { 
            transform: scale(1.2); 
            opacity: 0.6;
            filter: hue-rotate(270deg);
          }
        }

        /* Static noise phase */
        .static-screen {
          width: 100%;
          height: 100%;
          position: relative;
          background: #000;
          animation: screen-flicker 0.15s infinite;
        }

        @keyframes screen-flicker {
          0%, 100% { filter: brightness(1); }
          25% { filter: brightness(0.8) hue-rotate(5deg); }
          50% { filter: brightness(1.2) hue-rotate(-5deg); }
          75% { filter: brightness(0.9) hue-rotate(3deg); }
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
              rgba(255, 255, 255, 0.05) 2px,
              rgba(255, 255, 255, 0.05) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.05) 2px,
              rgba(255, 255, 255, 0.05) 4px
            );
          animation: static-animation 0.08s infinite, static-glitch 0.5s infinite;
          opacity: 0.9;
        }

        @keyframes static-glitch {
          0%, 90% { transform: translate(0, 0); }
          91% { transform: translate(-2px, 2px); }
          92% { transform: translate(2px, -2px); }
          93% { transform: translate(-1px, -1px); }
          94% { transform: translate(1px, 1px); }
          95% { transform: translate(0, 0); }
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

        .boot-line.delay-0-5 {
          animation-delay: 0.05s;
        }

        .boot-line.delay-0-7 {
          animation-delay: 0.1s;
        }

        .boot-line.delay-1 {
          animation-delay: 0.2s;
        }

        .boot-line.delay-2 {
          animation-delay: 0.4s;
        }

        .boot-line.delay-3 {
          animation-delay: 0.6s;
        }

        .boot-line.delay-4 {
          animation-delay: 0.7s;
        }

        .boot-line.delay-5 {
          animation-delay: 0.8s;
        }

        .boot-line.delay-6 {
          animation-delay: 1s;
          animation: fade-in 0.3s ease-in forwards, blink-text 1s ease-in-out infinite 1.3s;
        }

        .boot-line.delay-7 {
          animation-delay: 1.2s;
        }

        .logo-reveal {
          font-family: 'Courier New', Courier, monospace;
          font-size: 16px;
          letter-spacing: 0;
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes blink-text {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }

        /* Glitch text effect */
        .glitch-text {
          position: relative;
          animation: glitch-skew 2s infinite;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          10% { transform: skew(-2deg); }
          20% { transform: skew(2deg); }
          30% { transform: skew(0deg); }
          40% { transform: skew(1deg); }
          50% { transform: skew(-1deg); }
          60% { transform: skew(0deg); }
          70% { transform: skew(-2deg); }
          80% { transform: skew(2deg); }
          90% { transform: skew(0deg); }
          100% { transform: skew(0deg); }
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
