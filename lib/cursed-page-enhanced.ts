/**
 * Enhanced Cursed Page 666
 * 
 * A haunting, animated teletext experience with interactive ASCII art.
 * Features multiple animated characters that move and interact on screen.
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates the enhanced cursed page 666 with animated interactive ASCII art
 * 
 * This page showcases:
 * - Multiple animated ASCII characters (ghosts, bats, spiders)
 * - Characters that move across the screen
 * - Interactive animations between characters
 * - Glitching text effects
 * - Pulsing warnings
 * - Teletext-style horror aesthetics
 */
export function createEnhancedCursedPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Full-screen haunting layout with multiple animated ASCII art elements
  const rows = [
    `{red}666 {magenta}/!\\ CURSED REALM /!\\ {red}${timeStr}                                                                                                                                  `,
    '{red}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}                                    /!\\  WARNING: YOU HAVE ENTERED THE CURSED REALM  /!\\',
    '{magenta}                                         PROCEED AT YOUR OWN RISK...',
    '',
    '{red}                                          ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
    '{red}                                        ▄█{white}░░░░░░░░░░░░░░░░░░░{red}█▄',
    '{red}                                      ▄█{white}░░{red}▄▄{white}░░░░░░░░░░░{red}▄▄{white}░░{red}█▄',
    '{red}                                     █{white}░░{red}█{white}░░{red}█{white}░░░░░░░░░{red}█{white}░░{red}█{white}░░{red}█',
    '{red}                                     █{white}░░░{red}▀▀{white}░░░░░░░░░░░{red}▀▀{white}░░░{red}█',
    '{red}                                     █{white}░░░░░░░░░{red}▄▄▄{white}░░░░░░░░░{red}█',
    '{red}                                     █{white}░░░░░░░{red}▄█{white}░░░{red}█▄{white}░░░░░░░{red}█',
    '{red}                                     █{white}░░░░░░{red}█{white}░░░░░░░{red}█{white}░░░░░░{red}█',
    '{red}                                     █{white}░░░░░░{red}█{white}░{red}▄▄▄▄▄{white}░{red}█{white}░░░░░░{red}█',
    '{red}                                      █{white}░░░░░░{red}▀▀▀▀▀▀▀{white}░░░░░░{red}█',
    '{red}                                       █{white}░░░░░░░░░░░░░░░░░{red}█',
    '{red}                                        ▀█{white}░░░░░░░░░░░░░░░{red}█▀',
    '{red}                                          ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
    '',
    '{magenta}                                    ╔═══════════════════════════════════════╗',
    '{magenta}                                    ║  {red}THE SPIRITS HAVE BEEN AWAKENED{magenta}     ║',
    '{magenta}                                    ║  {white}You have disturbed their slumber{magenta}  ║',
    '{magenta}                                    ╚═══════════════════════════════════════╝',
    '',
    '{red}▓▓▓ CURSED TRANSMISSIONS ▓▓▓',
    '{white}The teletext signal is corrupted... Strange messages appear...',
    '',
    '{red}[SIGNAL LOST] {white}The darkness spreads...',
    '{red}[INTERFERENCE] {white}We are watching...',
    '{red}[CORRUPTED] {white}You cannot escape...',
    '',
    '{magenta}▓▓▓ ESCAPE ROUTES (IF YOU DARE) ▓▓▓',
    '{yellow}100{white} - Return to safety (Main Index)',
    '{yellow}600{white} - Games Hub (Less cursed)',
    '{yellow}500{white} - Consult the AI Oracle',
    '{yellow}999{white} - Call for help...',
    '',
    '{red}/!\\  Press any page number to escape... or stay and face the darkness... /!\\',
    '',
    '{red}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{red}CURSED NAVIGATION: {yellow}100{white}=ESCAPE {magenta}600{white}=GAMES {cyan}500{white}=ORACLE {red}666{white}=STAY IN DARKNESS',
    ''
  ];
  
  return {
    id: '666',
    title: '⚠️ CURSED REALM ⚠️',
    rows,
    links: [
      { label: 'ESCAPE', targetPage: '100', color: 'yellow' },
      { label: 'GAMES', targetPage: '600', color: 'magenta' },
      { label: 'ORACLE', targetPage: '500', color: 'cyan' },
      { label: 'HELP', targetPage: '999', color: 'red' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      cursedPage: true,
      enableAnimations: true,
      halloweenTheme: true,
      // Special metadata for cursed page effects
      specialEffects: {
        glitch: true,
        pulse: true,
        flicker: true,
        shake: true
      },
      // Enable special animated ASCII art characters
      specialPageAnimations: [
        {
          type: 'floating-ghost',
          name: 'ghost-1',
          targetRows: [2, 3, 4],
          frames: ['▓▒░', '░▒▓', '▓▒░', '░▒▓'],
          duration: 2000,
          loop: true
        },
        {
          type: 'flying-bat',
          name: 'bat-1',
          targetRows: [1, 2],
          frames: ['/\\/\\', '\\/\\/', '/\\/\\', '\\/\\/'],
          duration: 1500,
          loop: true
        },
        {
          type: 'crawling-spider',
          name: 'spider-1',
          targetRows: [38, 39],
          frames: ['(X)', '(x)', '(X)', '(x)'],
          duration: 3000,
          loop: true
        }
      ]
    }
  };
}
