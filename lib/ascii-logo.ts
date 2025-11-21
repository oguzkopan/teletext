/**
 * ASCII Art Logo and Branding for Modern Teletext
 * 
 * Provides animated ASCII art logos, frame-by-frame animations,
 * and branding elements for the teletext interface.
 * 
 * Requirements: 29.1, 29.2, 29.3, 29.4, 29.5
 */

import { AnimationConfig } from './animation-engine';

// ============================================================================
// ASCII Art Definitions
// ============================================================================

/**
 * Main "Modern Teletext" ASCII art logo
 * Designed to fit within 40-character width
 */
export const MODERN_TELETEXT_LOGO = [
  '╔══════════════════════════════════╗',
  '║  MODERN TELETEXT  ░▒▓█▓▒░       ║',
  '╚══════════════════════════════════╝'
];

/**
 * Alternative compact logo for headers
 */
export const COMPACT_LOGO = [
  '▓▓▓ MODERN TELETEXT ▓▓▓'
];

/**
 * Large ASCII art logo for boot sequence
 */
export const LARGE_LOGO = [
  '███╗   ███╗ ██████╗ ██████╗ ███████╗██████╗ ███╗   ██╗',
  '████╗ ████║██╔═══██╗██╔══██╗██╔════╝██╔══██╗████╗  ██║',
  '██╔████╔██║██║   ██║██║  ██║█████╗  ██████╔╝██╔██╗ ██║',
  '██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██╔══██╗██║╚██╗██║',
  '██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗██║  ██║██║ ╚████║',
  '╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝',
  '',
  '████████╗███████╗██╗     ███████╗████████╗███████╗██╗  ██╗████████╗',
  '╚══██╔══╝██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝╚██╗██╔╝╚══██╔══╝',
  '   ██║   █████╗  ██║     █████╗     ██║   █████╗   ╚███╔╝    ██║   ',
  '   ██║   ██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝   ██╔██╗    ██║   ',
  '   ██║   ███████╗███████╗███████╗   ██║   ███████╗██╔╝ ██╗   ██║   ',
  '   ╚═╝   ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝   '
];

/**
 * Simplified logo that fits in 40 characters
 */
export const SIMPLE_LOGO_40 = [
  '┌────────────────────────────────────┐',
  '│    MODERN TELETEXT SYSTEM v1.0    │',
  '└────────────────────────────────────┘'
];

/**
 * Retro-style logo with block characters
 */
export const RETRO_LOGO = [
  '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
  '█ MODERN █ TELETEXT █ SYSTEM █ v1.0 █',
  '▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀'
];

/**
 * "Powered by Kiro" badge
 */
export const KIRO_BADGE = '⚡ Powered by Kiro';

/**
 * Alternative Kiro badges
 */
export const KIRO_BADGE_VARIANTS = [
  '⚡ Powered by Kiro',
  '✨ Built with Kiro',
  '🚀 Made with Kiro',
  '💫 Created with Kiro'
];

// ============================================================================
// Animation Frame Definitions
// ============================================================================

/**
 * Frame-by-frame animation for logo appearing letter by letter
 * Each frame shows progressive reveal of the logo
 */
export const LOGO_REVEAL_FRAMES = [
  '╔══════════════════════════════════╗\n║                                  ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  M                               ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MO                              ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MOD                             ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODE                            ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODER                           ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN                          ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN T                        ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TE                       ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TEL                      ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELE                     ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELET                    ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETE                   ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEX                  ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT                 ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░              ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒             ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓            ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓█           ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓█▓          ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓█▓▒         ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓█▓▒░        ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓█▓▒░       ║\n╚══════════════════════════════════╝'
];

/**
 * Pulsing animation frames for the logo
 */
export const LOGO_PULSE_FRAMES = [
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓█▓▒░       ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓█▓▒░       ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ▒▓█▓▒          ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ▓█▓            ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  █              ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ▓█▓            ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ▒▓█▓▒          ║\n╚══════════════════════════════════╝',
  '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓█▓▒░       ║\n╚══════════════════════════════════╝'
];

/**
 * Kiro badge animation frames (subtle pulse)
 */
export const KIRO_BADGE_FRAMES = [
  '⚡ Powered by Kiro',
  '✨ Powered by Kiro',
  '⚡ Powered by Kiro',
  '💫 Powered by Kiro',
  '⚡ Powered by Kiro'
];

// ============================================================================
// Scrolling Credits
// ============================================================================

/**
 * Credits content for scrolling animation on about page
 */
export const CREDITS_CONTENT = [
  '',
  '',
  '════════════════════════════════════',
  '         MODERN TELETEXT',
  '            Version 1.0',
  '════════════════════════════════════',
  '',
  '',
  '         CREATED BY',
  '',
  '      The Modern Teletext Team',
  '',
  '',
  '════════════════════════════════════',
  '           BUILT WITH',
  '════════════════════════════════════',
  '',
  '         Next.js & React',
  '      TypeScript & Tailwind CSS',
  '',
  '         Firebase Platform',
  '    Hosting • Functions • Firestore',
  '',
  '        Google Gemini AI',
  '      Vertex AI • Generative AI',
  '',
  '         External APIs',
  '    News • Sports • Weather • Markets',
  '',
  '',
  '════════════════════════════════════',
  '        INSPIRED BY',
  '════════════════════════════════════',
  '',
  '       BBC Ceefax (1974-2012)',
  '      ITV Oracle (1978-1992)',
  '      Channel 4 4-Tel (1982-1993)',
  '',
  '    Classic teletext services that',
  '    brought information to millions',
  '',
  '',
  '════════════════════════════════════',
  '       SPECIAL THANKS',
  '════════════════════════════════════',
  '',
  '    To the original teletext pioneers',
  '    who created this revolutionary',
  '    information delivery system',
  '',
  '    And to everyone who remembers',
  '    the joy of pressing 888 for',
  '    subtitles and 100 for the index',
  '',
  '',
  '════════════════════════════════════',
  '         TECHNOLOGY',
  '════════════════════════════════════',
  '',
  '    40×24 character grid display',
  '    7 colors + black background',
  '    Authentic teletext aesthetics',
  '    Modern web technologies',
  '',
  '    CRT effects & scanlines',
  '    Theme system with animations',
  '    Real-time data integration',
  '    AI-powered interactions',
  '',
  '',
  '════════════════════════════════════',
  '      ⚡ POWERED BY KIRO ⚡',
  '════════════════════════════════════',
  '',
  '    Built with Kiro AI Assistant',
  '    Designed for the Kiroween',
  '    Hackathon 2024',
  '',
  '',
  '════════════════════════════════════',
  '         OPEN SOURCE',
  '════════════════════════════════════',
  '',
  '    Source code available on GitHub',
  '    github.com/your-repo/modern-teletext',
  '',
  '    Contributions welcome!',
  '',
  '',
  '════════════════════════════════════',
  '          THANK YOU',
  '════════════════════════════════════',
  '',
  '    For experiencing this nostalgic',
  '    journey through teletext history',
  '',
  '    Press 100 to return to index',
  '',
  '',
  '',
  '',
  ''
];

// ============================================================================
// Animation Configuration Helpers
// ============================================================================

/**
 * Creates an animation config for logo reveal
 */
export function createLogoRevealAnimation(): AnimationConfig {
  return {
    name: 'logo-reveal',
    type: 'ascii-frames',
    duration: 2300, // ~100ms per frame
    frames: LOGO_REVEAL_FRAMES,
    loop: false
  };
}

/**
 * Creates an animation config for logo pulse
 */
export function createLogoPulseAnimation(): AnimationConfig {
  return {
    name: 'logo-pulse',
    type: 'ascii-frames',
    duration: 2400, // 300ms per frame
    frames: LOGO_PULSE_FRAMES,
    loop: true
  };
}

/**
 * Creates an animation config for Kiro badge
 */
export function createKiroBadgeAnimation(): AnimationConfig {
  return {
    name: 'kiro-badge-pulse',
    type: 'ascii-frames',
    duration: 2000, // 400ms per frame
    frames: KIRO_BADGE_FRAMES,
    loop: true
  };
}

/**
 * Creates scrolling credits animation frames
 * @param startLine - Starting line in the credits
 * @param visibleLines - Number of lines visible at once (default 24)
 * @returns Array of frames showing scrolling credits
 */
export function createScrollingCreditsFrames(
  startLine: number = 0,
  visibleLines: number = 24
): string[] {
  const frames: string[] = [];
  const totalLines = CREDITS_CONTENT.length;
  
  // Create frames for scrolling from start to end
  for (let i = startLine; i < totalLines; i++) {
    const visibleContent = CREDITS_CONTENT.slice(i, i + visibleLines);
    
    // Pad to exactly visibleLines
    while (visibleContent.length < visibleLines) {
      visibleContent.push('');
    }
    
    // Center each line and pad to 40 characters
    const frame = visibleContent
      .map(line => centerText(line, 40))
      .join('\n');
    
    frames.push(frame);
  }
  
  return frames;
}

/**
 * Creates an animation config for scrolling credits
 */
export function createScrollingCreditsAnimation(): AnimationConfig {
  const frames = createScrollingCreditsFrames();
  
  return {
    name: 'scrolling-credits',
    type: 'ascii-frames',
    duration: frames.length * 150, // 150ms per frame
    frames,
    loop: false
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Centers text within specified width
 */
export function centerText(text: string, width: number): string {
  if (text.length >= width) {
    return text.slice(0, width);
  }
  const padding = width - text.length;
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
}

/**
 * Gets a random Kiro badge variant
 */
export function getRandomKiroBadge(): string {
  return KIRO_BADGE_VARIANTS[Math.floor(Math.random() * KIRO_BADGE_VARIANTS.length)];
}

/**
 * Formats logo for display in page rows
 * @param logo - Array of logo lines
 * @param padToWidth - Pad each line to this width (default 40)
 * @returns Array of formatted lines
 */
export function formatLogoForPage(logo: string[], padToWidth: number = 40): string[] {
  return logo.map(line => {
    if (line.length > padToWidth) {
      return line.substring(0, padToWidth);
    }
    return line.padEnd(padToWidth, ' ');
  });
}

/**
 * Creates a boot sequence logo animation
 * Combines multiple animation effects for dramatic reveal
 */
export function createBootSequenceAnimation(): AnimationConfig[] {
  return [
    createLogoRevealAnimation(),
    {
      name: 'boot-flash',
      type: 'css',
      duration: 500,
      cssClass: 'boot-flash-effect'
    }
  ];
}

