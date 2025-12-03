/**
 * Halloween Snake Game Page (650)
 */

import { TeletextPage } from '@/types/teletext';

export function createSnakeGamePage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}650 {yellow}🐍 HALLOWEEN SNAKE GAME 🐍 {cyan}${timeStr}                                                                                                          {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {green}SPOOKY SNAKE{yellow}  {white}░▒▓█▓▒░  {cyan}Guide the Ghost  {white}░▒▓█▓▒░  {magenta}Collect Pumpkins{yellow}                                                    ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{green}🎮 GAME WILL AUTO-START IN A MOMENT! 🎮',
    '',
    '{cyan}▓▓▓ GAME DESCRIPTION ▓▓▓',
    '',
    '{white}Guide the ghostly snake through haunted levels!',
    '{white}Collect pumpkins to grow and advance through spooky locations.',
    '',
    '{cyan}@ {white}You are a friendly ghost snake (head)',
    '{green}o {white}Your snake body - don\'t hit yourself!',
    '{yellow}O {white}Collect pumpkins to score points',
    '{red}█ {white}Avoid obstacles and walls',
    '',
    '{cyan}▓▓▓ LEVELS ▓▓▓',
    '',
    '{green}Level 1:{white} Graveyard       {cyan}(Target: 5 pumpkins)',
    '{green}Level 2:{white} Haunted House    {cyan}(Target: 10 pumpkins)',
    '{green}Level 3:{white} Cursed Forest    {cyan}(Target: 15 pumpkins)',
    '{green}Level 4:{white} Ghost Town       {cyan}(Target: 20 pumpkins)',
    '{green}Level 5:{white} Demon Realm      {cyan}(Target: 30 pumpkins)',
    '',
    '{cyan}▓▓▓ CONTROLS ▓▓▓',
    '',
    '{yellow}Arrow Keys{white} or {yellow}W/A/S/D{white} - Move the snake',
    '{white}  (W=Up, A=Left, S=Down, D=Right)',
    '{yellow}SPACE{white} - Pause/Resume game',
    '{yellow}ENTER{white} - Start/Restart game',
    '',
    '{white}The game speeds up as you progress through levels!',
    '{white}Each level adds new obstacles to avoid.',
    '',
    '{cyan}▓▓▓ HOW TO PLAY ▓▓▓',
    '',
    '{white}1. Press {yellow}ENTER{white} to start the game',
    '{white}2. Use arrow keys or W/A/S/D to guide your snake',
    '{white}3. Collect {yellow}O{white} (pumpkins) to grow and score',
    '{white}4. Avoid {red}█{white} (obstacles) and walls',
    '{white}5. Reach the target score to advance levels',
    '{white}6. Try to complete all 5 haunted levels!',
    '',
    '{magenta}⚠️ WARNING: Game gets faster and harder each level!',
    '',
    '{white}This is an offline game - no internet required!',
    '{white}Perfect for quick Halloween fun.',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}600{white}=GAMES HUB {yellow}PLAY{white}=Start Game {blue}BACK{white}=Return',
    ''
  ];
  
  return {
    id: '650',
    title: 'Halloween Snake Game',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'GAMES', targetPage: '600', color: 'green' },
      { label: 'BACK', targetPage: '600', color: 'blue' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      snakeGame: true
    }
  };
}

export function createSnakeGamePlayPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}650 {yellow}🐍 PLAYING SNAKE 🐍 {cyan}${timeStr}                                                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{white}[GAME BOARD RENDERS HERE]',
    '',
    '{white}Use the interactive component to play!',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}BACK{white}=Instructions {green}INDEX{white}=Main Menu',
    ''
  ];
  
  return {
    id: '650-play',
    title: 'Snake Game - Playing',
    rows,
    links: [
      { label: 'BACK', targetPage: '650', color: 'red' },
      { label: 'INDEX', targetPage: '100', color: 'green' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}
