'use client';

import React from 'react';

interface CRTFrameProps {
  children: React.ReactNode;
  effects: {
    scanlines: boolean;
    curvature: boolean;
    noise: boolean;
    glitch: boolean;
  };
  hauntingMode?: boolean;  // Enable enhanced Halloween effects
}

/**
 * CRTFrame Component
 * 
 * Wraps content with retro CRT television styling including:
 * - Scanline effects
 * - Screen curvature
 * - Noise/static overlay
 * - Glitch effects (for Haunting Mode)
 * - Enhanced Halloween effects (chromatic aberration, flicker, shake, particles)
 * 
 * Requirements: 2.5, 9.4, 9.5, 36.1, 36.2, 36.3, 36.4, 36.5
 */
export default function CRTFrame({ children, effects, hauntingMode = false }: CRTFrameProps) {
  return (
    <div className="crt-container">
      <div className={`crt-frame ${effects.glitch ? 'glitch' : ''} ${hauntingMode ? 'haunting' : ''}`}>
        {/* CRT bezel/frame */}
        <div className="crt-bezel">
          {/* Screen content */}
          <div className={`crt-screen ${effects.curvature ? 'curved' : ''} ${hauntingMode ? 'haunting-screen' : ''}`}>
            {children}
            
            {/* Scanlines overlay */}
            {effects.scanlines && <div className="scanlines" />}
            
            {/* Noise overlay */}
            {effects.noise && <div className="noise" />}
            
            {/* Screen glare effect */}
            <div className="screen-glare" />
            
            {/* Halloween particle effects - Requirement 36.3 */}
            {hauntingMode && (
              <>
                <div className="halloween-particles">
                  <div className="particle ghost">👻</div>
                  <div className="particle bat">🦇</div>
                  <div className="particle pumpkin">🎃</div>
                  <div className="particle skull">💀</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
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
          overflow: hidden;
          background: #000;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .crt-screen.curved {
          border-radius: 8px;
          transform: perspective(1000px) rotateX(0deg);
        }

        /* Scanlines effect */
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
          z-index: 10;
        }

        /* Noise/static effect */
        .noise {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 11;
          animation: noise-animation 0.2s infinite;
        }

        @keyframes noise-animation {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }

        /* Screen glare effect */
        .screen-glare {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.05) 0%,
            transparent 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          pointer-events: none;
          z-index: 12;
        }

        /* Glitch effect for Haunting Mode */
        .crt-frame.glitch {
          animation: glitch-animation 3s infinite;
        }

        @keyframes glitch-animation {
          0%, 90%, 100% { transform: translate(0, 0); }
          91% { transform: translate(-2px, 2px); }
          92% { transform: translate(2px, -2px); }
          93% { transform: translate(-2px, -2px); }
          94% { transform: translate(2px, 2px); }
          95% { transform: translate(0, 0); }
        }

        .crt-frame.glitch .crt-screen {
          animation: screen-glitch 5s infinite;
        }

        @keyframes screen-glitch {
          0%, 95%, 100% { 
            filter: none;
          }
          96% { 
            filter: hue-rotate(90deg) saturate(3);
          }
          97% { 
            filter: hue-rotate(-90deg) saturate(3);
          }
          98% { 
            filter: hue-rotate(180deg) saturate(2);
          }
        }

        /* Enhanced Halloween effects - Requirements 36.1, 36.2, 36.4 */
        .crt-frame.haunting {
          animation: haunting-shake 4s infinite, haunting-glitch 3s infinite;
        }

        @keyframes haunting-shake {
          0%, 95%, 100% { transform: translate(0, 0); }
          96% { transform: translate(-3px, 2px) rotate(0.5deg); }
          97% { transform: translate(3px, -2px) rotate(-0.5deg); }
          98% { transform: translate(-2px, -3px) rotate(0.3deg); }
          99% { transform: translate(2px, 3px) rotate(-0.3deg); }
        }

        @keyframes haunting-glitch {
          0%, 90%, 100% { 
            filter: none;
          }
          91% { 
            filter: hue-rotate(90deg) saturate(4) brightness(1.2);
          }
          92% { 
            filter: hue-rotate(-90deg) saturate(4) brightness(0.8);
          }
          93% { 
            filter: hue-rotate(180deg) saturate(3) brightness(1.1);
          }
          94% { 
            filter: contrast(1.5) brightness(0.9);
          }
        }

        /* Chromatic aberration effect - Requirement 36.2 */
        .crt-screen.haunting-screen {
          animation: chromatic-aberration 2s infinite, screen-flicker 0.5s infinite;
        }

        @keyframes chromatic-aberration {
          0%, 100% {
            text-shadow: 
              2px 0 0 rgba(255, 0, 0, 0.5),
              -2px 0 0 rgba(0, 255, 255, 0.5);
          }
          50% {
            text-shadow: 
              -2px 0 0 rgba(255, 0, 0, 0.5),
              2px 0 0 rgba(0, 255, 255, 0.5);
          }
        }

        /* Screen flicker effect - Requirement 36.4 */
        @keyframes screen-flicker {
          0%, 100% { opacity: 1; }
          10% { opacity: 0.95; }
          20% { opacity: 1; }
          30% { opacity: 0.92; }
          40% { opacity: 1; }
          50% { opacity: 0.97; }
          60% { opacity: 1; }
          70% { opacity: 0.94; }
          80% { opacity: 1; }
          90% { opacity: 0.96; }
        }

        /* Halloween particle effects - Requirement 36.3 */
        .halloween-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 5;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          font-size: 24px;
          opacity: 0.6;
          pointer-events: none;
        }

        .particle.ghost {
          animation: float-ghost 8s infinite ease-in-out;
          left: 10%;
          top: -50px;
        }

        .particle.bat {
          animation: float-bat 6s infinite ease-in-out;
          left: 70%;
          top: -50px;
          animation-delay: 2s;
        }

        .particle.pumpkin {
          animation: float-pumpkin 10s infinite ease-in-out;
          left: 40%;
          top: -50px;
          animation-delay: 4s;
        }

        .particle.skull {
          animation: float-skull 7s infinite ease-in-out;
          left: 85%;
          top: -50px;
          animation-delay: 6s;
        }

        @keyframes float-ghost {
          0% {
            transform: translateY(-50px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            transform: translateY(50vh) translateX(30px) rotate(10deg);
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(110vh) translateX(-20px) rotate(-5deg);
            opacity: 0;
          }
        }

        @keyframes float-bat {
          0% {
            transform: translateY(-50px) translateX(0) rotate(0deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          25% {
            transform: translateY(25vh) translateX(-40px) rotate(-15deg) scale(1.2);
          }
          50% {
            transform: translateY(50vh) translateX(20px) rotate(10deg) scale(0.9);
            opacity: 0.8;
          }
          75% {
            transform: translateY(75vh) translateX(-30px) rotate(-10deg) scale(1.1);
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(110vh) translateX(40px) rotate(5deg) scale(1);
            opacity: 0;
          }
        }

        @keyframes float-pumpkin {
          0% {
            transform: translateY(-50px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          50% {
            transform: translateY(50vh) translateX(-50px) rotate(-20deg);
            opacity: 0.7;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(110vh) translateX(30px) rotate(15deg);
            opacity: 0;
          }
        }

        @keyframes float-skull {
          0% {
            transform: translateY(-50px) translateX(0) rotate(0deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          30% {
            transform: translateY(30vh) translateX(25px) rotate(8deg) scale(1.1);
          }
          50% {
            transform: translateY(50vh) translateX(-35px) rotate(-12deg) scale(0.95);
            opacity: 0.8;
          }
          70% {
            transform: translateY(70vh) translateX(15px) rotate(6deg) scale(1.05);
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(110vh) translateX(-25px) rotate(-8deg) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
