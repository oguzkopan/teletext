/**
 * Cursed ASCII Art Library
 * 
 * Collection of ASCII art characters for the cursed page 666.
 * All characters are designed for teletext display.
 */

/**
 * Ghost ASCII art variations
 */
export const GHOST_FRAMES = [
  '▓▒░',  // Fading ghost
  '░▒▓',  // Reverse fade
  '(o)',  // Simple ghost
  '~o~',  // Wavy ghost
  '.o.',  // Dotted ghost
];

/**
 * Bat ASCII art variations
 */
export const BAT_FRAMES = [
  '/\\/\\',  // Wings up
  '\\/\\/',  // Wings down
  '^v^',   // Flying
  'v^v',   // Flapping
  '<>',    // Side view
];

/**
 * Spider ASCII art variations
 */
export const SPIDER_FRAMES = [
  '(X)',   // Spider body
  '(x)',   // Small spider
  '{8}',   // Eight legs
  '[o]',   // Round spider
  '(*)' ,  // Star spider
];

/**
 * Skull ASCII art variations
 */
export const SKULL_FRAMES = [
  '[X_X]',  // Dead eyes
  '[O_O]',  // Open eyes
  '[^_^]',  // Evil grin
  '[>_<]',  // Angry
  '[@_@]',  // Dizzy
];

/**
 * Eye ASCII art variations
 */
export const EYE_FRAMES = [
  '(@)',   // Open eye
  '(-)',   // Closed eye
  '(o)',   // Wide eye
  '(O)',   // Bigger eye
  '(*)',   // Glowing eye
];

/**
 * Particle ASCII art variations
 */
export const PARTICLE_FRAMES = [
  '*',   // Star
  '+',   // Plus
  '.',   // Dot
  '°',   // Degree
  '·',   // Middle dot
  '˙',   // Dot above
];

/**
 * Blood drip ASCII art variations
 */
export const BLOOD_FRAMES = [
  '|',   // Straight drip
  '!',   // Drip with emphasis
  ':',   // Double drip
  '.',   // Drop
  'v',   // Pointed drip
];

/**
 * Large multi-line ASCII art for static display
 */

/**
 * Large ghost (3 lines)
 */
export const LARGE_GHOST = [
  ' .-.  ',
  '(o o) ',
  ' \\_/  '
];

/**
 * Large bat (3 lines)
 */
export const LARGE_BAT = [
  ' /\\ /\\ ',
  '(  o  )',
  ' \\___/ '
];

/**
 * Large spider (3 lines)
 */
export const LARGE_SPIDER = [
  '/\\(o)/\\',
  '  | |  ',
  ' /   \\ '
];

/**
 * Large skull (5 lines)
 */
export const LARGE_SKULL = [
  ' .---. ',
  '| o o |',
  '|  ^  |',
  '| \\_/ |',
  ' \\___/ '
];

/**
 * Animated ASCII art sequences
 */

/**
 * Walking ghost animation (4 frames)
 */
export const WALKING_GHOST = [
  ' .-.  ',
  '(o o) ',
  ' \\_/  ',
  '  |   '
];

/**
 * Flying bat animation (4 frames)
 */
export const FLYING_BAT = [
  ' /\\ /\\ ',
  '(  o  )',
  ' \\___/ ',
  '       '
];

/**
 * Crawling spider animation (4 frames)
 */
export const CRAWLING_SPIDER = [
  '/\\(o)/\\',
  '  | |  ',
  ' /   \\ ',
  '       '
];

/**
 * Pulsing skull animation (4 frames)
 */
export const PULSING_SKULL = [
  ' .---. ',
  '| O O |',
  '|  ^  |',
  '| \\_/ |'
];

/**
 * Blinking eye animation (4 frames)
 */
export const BLINKING_EYE = [
  ' (@) ',
  ' (o) ',
  ' (-) ',
  ' (o) '
];

/**
 * Decorative elements
 */

/**
 * Horizontal dividers
 */
export const DIVIDERS = {
  BONES: '═══════════════════════════════════════',
  SPIKES: '▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼',
  DOTS: '·······································',
  DASHES: '---------------------------------------',
  WAVES: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
};

/**
 * Corner decorations
 */
export const CORNERS = {
  TOP_LEFT: '╔',
  TOP_RIGHT: '╗',
  BOTTOM_LEFT: '╚',
  BOTTOM_RIGHT: '╝',
  HORIZONTAL: '═',
  VERTICAL: '║',
};

/**
 * Warning symbols
 */
export const WARNINGS = {
  TRIANGLE: '/!\\',
  SKULL: '[X_X]',
  DANGER: '<!>',
  ALERT: '(!))',
  CAUTION: '[!]',
};

/**
 * Status indicators
 */
export const STATUS = {
  ERROR: '[X]',
  WARNING: '[!]',
  INFO: '[i]',
  LOADING: '[~]',
  SUCCESS: '[✓]',
};

/**
 * Get a random frame from an array
 */
export function getRandomFrame(frames: string[]): string {
  return frames[Math.floor(Math.random() * frames.length)];
}

/**
 * Get the next frame in a sequence
 */
export function getNextFrame(frames: string[], currentIndex: number): string {
  return frames[(currentIndex + 1) % frames.length];
}

/**
 * Create an animated sequence
 */
export function createAnimationSequence(
  frames: string[],
  duration: number,
  loop: boolean = true
): {
  frames: string[];
  duration: number;
  loop: boolean;
} {
  return { frames, duration, loop };
}
