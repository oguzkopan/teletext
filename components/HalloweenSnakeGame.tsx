'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  SnakeGameState,
  createInitialGameState,
  moveSnake,
  changeDirection,
  renderGameBoard,
  getLevelInfo,
  getMaxLevel
} from '@/lib/halloween-snake-game';

const GAME_CONFIG = {
  width: 30,
  height: 15,
  initialLength: 3
};

export default function HalloweenSnakeGame() {
  const [gameState, setGameState] = useState<SnakeGameState>(() => createInitialGameState(GAME_CONFIG));
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setGameState(createInitialGameState(GAME_CONFIG));
    setIsPlaying(true);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }));
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Game control keys that should always be handled
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D', ' ', 'Enter'];
    
    // Only handle game keys, let other keys pass through for navigation
    if (!gameKeys.includes(e.key)) {
      return;
    }
    
    // Prevent default for game keys
    e.preventDefault();
    e.stopPropagation();

    if (e.key === ' ') {
      if (isPlaying && !gameState.gameOver) {
        pauseGame();
      }
      return;
    }

    if (e.key === 'Enter') {
      if (!isPlaying || gameState.gameOver) {
        startGame();
      }
      return;
    }

    // Only handle movement keys when game is playing
    if (isPlaying && !gameState.gameOver && !gameState.paused) {
      const directionMap: Record<string, 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> = {
        'ArrowUp': 'UP',
        'ArrowDown': 'DOWN',
        'ArrowLeft': 'LEFT',
        'ArrowRight': 'RIGHT',
        'w': 'UP',
        'W': 'UP',
        's': 'DOWN',
        'S': 'DOWN',
        'a': 'LEFT',
        'A': 'LEFT',
        'd': 'RIGHT',
        'D': 'RIGHT'
      };

      const newDirection = directionMap[e.key];
      if (newDirection) {
        setGameState(prev => changeDirection(prev, newDirection));
      }
    }
  }, [pauseGame, startGame, isPlaying, gameState.gameOver, gameState.paused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (isPlaying && !gameState.gameOver && !gameState.paused) {
      gameLoopRef.current = setInterval(() => {
        setGameState(prev => moveSnake(prev, GAME_CONFIG));
      }, gameState.speed);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameState.gameOver, gameState.paused, gameState.speed]);

  const board = renderGameBoard(gameState, GAME_CONFIG);
  const levelInfo = getLevelInfo(gameState.level);

  return (
    <div className="halloween-snake-game" style={{ 
      fontFamily: 'monospace', 
      padding: '20px',
      color: '#00ff00'
    }}>
      <div style={{ marginBottom: '15px', fontSize: '14px' }}>
        <div style={{ color: '#00ff00', marginBottom: '5px' }}>
          Level: {gameState.level}/{getMaxLevel()} - {levelInfo.name}
        </div>
        <div style={{ color: '#ffff00' }}>
          Score: {gameState.score} / Target: {levelInfo.scoreTarget}
        </div>
      </div>

      <div style={{ 
        border: '3px solid #ff6600', 
        padding: '15px', 
        backgroundColor: '#000',
        display: 'inline-block',
        fontSize: '16px',
        lineHeight: '1.3'
      }}>
        {board.map((row, i) => (
          <div key={i} style={{ 
            whiteSpace: 'pre',
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}>
            {row.split('').map((char, j) => {
              let color = '#00ff00'; // Default green
              if (char === 'O') color = '#ffaa00'; // Pumpkin - orange
              else if (char === '█') color = '#ff0000'; // Obstacle - red
              else if (char === '@') color = '#00ffff'; // Head - cyan
              else if (char === 'o') color = '#00ff00'; // Body - green
              else if (char === ' ') color = '#000000'; // Empty
              
              return (
                <span key={j} style={{ color }}>
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '15px', color: '#00ffff', fontSize: '14px' }}>
        {!isPlaying && !gameState.gameOver && (
          <div style={{ color: '#ffff00', fontWeight: 'bold' }}>
            Press ENTER to Start
          </div>
        )}
        {gameState.paused && (
          <div style={{ color: '#ffff00', fontWeight: 'bold' }}>
            PAUSED - Press SPACE to Resume
          </div>
        )}
        {gameState.gameOver && (
          <div>
            <div style={{ color: '#ff0000', fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
              GAME OVER!
            </div>
            <div style={{ color: '#ffff00', marginBottom: '5px' }}>
              Final Score: {gameState.score}
            </div>
            <div style={{ color: '#00ff00' }}>
              Press ENTER to Restart
            </div>
          </div>
        )}
        {isPlaying && !gameState.gameOver && !gameState.paused && (
          <div style={{ color: '#00ffff' }}>
            <div>@ = You (Ghost Snake)</div>
            <div>O = Pumpkin (Food)</div>
            <div>█ = Obstacle</div>
            <div style={{ marginTop: '10px', color: '#ffff00' }}>
              Arrow Keys or W/A/S/D to Move
            </div>
            <div style={{ color: '#ffff00' }}>
              SPACE to Pause
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
