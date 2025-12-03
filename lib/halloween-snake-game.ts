/**
 * Halloween Snake Game
 * A spooky ASCII snake game for teletext with levels
 */

export interface SnakeGameState {
  snake: Array<{ x: number; y: number }>;
  food: { x: number; y: number };
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  score: number;
  level: number;
  gameOver: boolean;
  paused: boolean;
  speed: number;
}

export interface SnakeGameConfig {
  width: number;
  height: number;
  initialLength: number;
}

const LEVELS = [
  { name: 'Graveyard', speed: 200, scoreTarget: 5, obstacles: [] },
  { name: 'Haunted House', speed: 150, scoreTarget: 10, obstacles: [{ x: 10, y: 5 }, { x: 15, y: 8 }] },
  { name: 'Cursed Forest', speed: 120, scoreTarget: 15, obstacles: [{ x: 8, y: 4 }, { x: 12, y: 6 }, { x: 16, y: 9 }] },
  { name: 'Ghost Town', speed: 100, scoreTarget: 20, obstacles: [{ x: 7, y: 3 }, { x: 11, y: 7 }, { x: 15, y: 10 }, { x: 9, y: 12 }] },
  { name: 'Demon Realm', speed: 80, scoreTarget: 30, obstacles: [{ x: 6, y: 3 }, { x: 10, y: 5 }, { x: 14, y: 8 }, { x: 8, y: 11 }, { x: 12, y: 13 }] }
];

export function createInitialGameState(config: SnakeGameConfig): SnakeGameState {
  const centerX = Math.floor(config.width / 2);
  const centerY = Math.floor(config.height / 2);
  
  return {
    snake: [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY }
    ],
    food: generateFood(config.width, config.height, [{ x: centerX, y: centerY }]),
    direction: 'RIGHT',
    score: 0,
    level: 1,
    gameOver: false,
    paused: false,
    speed: LEVELS[0].speed
  };
}

export function generateFood(width: number, height: number, snake: Array<{ x: number; y: number }>, obstacles: Array<{ x: number; y: number }> = []): { x: number; y: number } {
  let food: { x: number; y: number };
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    food = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
    attempts++;
  } while (
    attempts < maxAttempts &&
    (snake.some(segment => segment.x === food.x && segment.y === food.y) ||
     obstacles.some(obs => obs.x === food.x && obs.y === food.y))
  );
  
  return food;
}

export function moveSnake(state: SnakeGameState, config: SnakeGameConfig): SnakeGameState {
  if (state.gameOver || state.paused) {
    return state;
  }
  
  const head = state.snake[0];
  let newHead: { x: number; y: number };
  
  switch (state.direction) {
    case 'UP':
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case 'DOWN':
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case 'LEFT':
      newHead = { x: head.x - 1, y: head.y };
      break;
    case 'RIGHT':
      newHead = { x: head.x + 1, y: head.y };
      break;
  }
  
  // Check wall collision
  if (newHead.x < 0 || newHead.x >= config.width || newHead.y < 0 || newHead.y >= config.height) {
    return { ...state, gameOver: true };
  }
  
  // Check self collision
  if (state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
    return { ...state, gameOver: true };
  }
  
  // Check obstacle collision
  const currentLevel = LEVELS[state.level - 1];
  if (currentLevel.obstacles.some(obs => obs.x === newHead.x && obs.y === newHead.y)) {
    return { ...state, gameOver: true };
  }
  
  const newSnake = [newHead, ...state.snake];
  
  // Check if food eaten
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    const newScore = state.score + 1;
    let newLevel = state.level;
    let newSpeed = state.speed;
    let resetSnake = newSnake;
    let newDirection = state.direction;
    
    // Check level up - only advance when reaching the target for current level
    if (newScore === currentLevel.scoreTarget && state.level < LEVELS.length) {
      newLevel = state.level + 1;
      newSpeed = LEVELS[newLevel - 1].speed;
      newDirection = 'RIGHT';
      
      // Reset snake to center for new level
      const centerX = Math.floor(config.width / 2);
      const centerY = Math.floor(config.height / 2);
      resetSnake = [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
      ];
    }
    
    return {
      ...state,
      snake: resetSnake,
      food: generateFood(config.width, config.height, resetSnake, LEVELS[newLevel - 1].obstacles),
      score: newScore,
      level: newLevel,
      speed: newSpeed,
      direction: newDirection
    };
  }
  
  // Remove tail if no food eaten
  newSnake.pop();
  
  return {
    ...state,
    snake: newSnake
  };
}

export function changeDirection(state: SnakeGameState, newDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): SnakeGameState {
  // Prevent 180-degree turns
  if (
    (state.direction === 'UP' && newDirection === 'DOWN') ||
    (state.direction === 'DOWN' && newDirection === 'UP') ||
    (state.direction === 'LEFT' && newDirection === 'RIGHT') ||
    (state.direction === 'RIGHT' && newDirection === 'LEFT')
  ) {
    return state;
  }
  
  return { ...state, direction: newDirection };
}

export function renderGameBoard(state: SnakeGameState, config: SnakeGameConfig): string[] {
  const board: string[][] = Array(config.height).fill(null).map(() => Array(config.width).fill(' '));
  
  // Draw obstacles (red blocks)
  const currentLevel = LEVELS[state.level - 1];
  currentLevel.obstacles.forEach(obs => {
    if (obs.y >= 0 && obs.y < config.height && obs.x >= 0 && obs.x < config.width) {
      board[obs.y][obs.x] = '█'; // Red block
    }
  });
  
  // Draw food (pumpkin - use O for ASCII)
  if (state.food.y >= 0 && state.food.y < config.height && state.food.x >= 0 && state.food.x < config.width) {
    board[state.food.y][state.food.x] = 'O'; // Pumpkin
  }
  
  // Draw snake (ghost - use @ for head, o for body)
  state.snake.forEach((segment, index) => {
    if (segment.y >= 0 && segment.y < config.height && segment.x >= 0 && segment.x < config.width) {
      if (index === 0) {
        board[segment.y][segment.x] = '@'; // Head
      } else {
        board[segment.y][segment.x] = 'o'; // Body
      }
    }
  });
  
  return board.map(row => row.join(''));
}

export function getLevelInfo(level: number): { name: string; speed: number; scoreTarget: number } {
  return LEVELS[Math.min(level - 1, LEVELS.length - 1)];
}

export function getMaxLevel(): number {
  return LEVELS.length;
}
