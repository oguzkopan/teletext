'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RadioStation } from '@/lib/radio-pages';

interface RadioPlayerProps {
  station: RadioStation;
  onStationChange?: (stationId: string) => void;
}

/**
 * RadioPlayer Component
 * Integrated HTML5 audio player for radio streaming
 */
export function RadioPlayer({ station, onStationChange }: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle station changes
  useEffect(() => {
    if (audioRef.current && station) {
      const wasPlaying = isPlaying;
      
      // Stop current playback
      audioRef.current.pause();
      audioRef.current.src = station.streamUrl;
      
      // Resume playback if it was playing
      if (wasPlaying) {
        setIsLoading(true);
        audioRef.current.play().catch(err => {
          console.error('Playback error:', err);
          setError('Failed to play station');
          setIsPlaying(false);
        });
      }
    }
  }, [station]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setError(null);
      audioRef.current.play().catch(err => {
        console.error('Playback error:', err);
        setError('Failed to play station');
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Audio event handlers
  const handleCanPlay = () => {
    setIsLoading(false);
    setIsPlaying(true);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    setError('Stream unavailable');
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handlePlaying = () => {
    setIsLoading(false);
    setIsPlaying(true);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Space bar for play/pause
      if (e.code === 'Space' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        togglePlayPause();
      }
      // M for mute
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isMuted]);

  return (
    <div className="radio-player">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        preload="none"
      />

      {/* Player UI - styled to match teletext aesthetic */}
      <div className="radio-player-ui">
        {/* Status indicator */}
        <div className="radio-status">
          {isLoading && (
            <span className="radio-loading">
              <span className="loading-spinner">⟳</span> Loading...
            </span>
          )}
          {error && (
            <span className="radio-error">⚠ {error}</span>
          )}
          {isPlaying && !isLoading && !error && (
            <span className="radio-playing">
              <span className="playing-indicator">♪</span> Now Playing
            </span>
          )}
          {!isPlaying && !isLoading && !error && (
            <span className="radio-stopped">⏸ Stopped</span>
          )}
        </div>

        {/* Volume control */}
        <div className="radio-volume">
          <button
            onClick={toggleMute}
            className="volume-button"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Volume"
          />
        </div>
      </div>

      <style jsx>{`
        .radio-player {
          position: fixed;
          bottom: 60px;
          right: 20px;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid var(--color-cyan, #00ffff);
          border-radius: 8px;
          padding: 12px 16px;
          min-width: 250px;
          box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
          font-family: 'Courier New', monospace;
        }

        .radio-player-ui {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .radio-status {
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          min-height: 24px;
        }

        .radio-loading {
          color: var(--color-yellow, #ffff00);
        }

        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .radio-error {
          color: var(--color-red, #ff0000);
        }

        .radio-playing {
          color: var(--color-green, #00ff00);
        }

        .playing-indicator {
          display: inline-block;
          animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .radio-stopped {
          color: var(--color-white, #ffffff);
        }

        .radio-volume {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .volume-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.2s;
        }

        .volume-button:hover {
          transform: scale(1.1);
        }

        .volume-button:active {
          transform: scale(0.95);
        }

        .volume-slider {
          flex: 1;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          outline: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: var(--color-cyan, #00ffff);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 4px rgba(0, 255, 255, 0.5);
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: var(--color-cyan, #00ffff);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 4px rgba(0, 255, 255, 0.5);
        }

        .volume-slider:hover::-webkit-slider-thumb {
          background: var(--color-yellow, #ffff00);
          box-shadow: 0 0 6px rgba(255, 255, 0, 0.7);
        }

        .volume-slider:hover::-moz-range-thumb {
          background: var(--color-yellow, #ffff00);
          box-shadow: 0 0 6px rgba(255, 255, 0, 0.7);
        }

        @media (max-width: 768px) {
          .radio-player {
            bottom: 80px;
            right: 10px;
            left: 10px;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}
