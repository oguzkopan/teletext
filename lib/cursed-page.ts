/**
 * Cursed Page 666
 * 
 * A haunting, animated teletext experience for the Kiroween hackathon.
 * Features animated ASCII art, glitch effects, and spooky teletext motifs.
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates the cursed page 666 with animated haunting effects
 * 
 * This page showcases:
 * - Animated ASCII skull art
 * - Glitching text effects
 * - Pulsing warnings
 * - Teletext-style horror aesthetics
 * - Interactive elements
 */
export function createCursedPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Full-screen haunting layout with animations
  // Note: Special markers for animations are handled by CSS via data attributes
  const rows = [
    `{red}666 {magenta}⚠️ CURSED REALM ⚠️ {red}${timeStr}                                                                                                                  {red}💀{magenta}👻{red}🕷️{magenta}🦇`,
    '{red}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}                                    ⚠️  WARNING: YOU HAVE ENTERED THE CURSED REALM  ⚠️',
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
    '{cyan}[{red}SIGNAL LOST{cyan}]{white} The darkness spreads...',
    '{cyan}[{red}INTERFERENCE{cyan}]{white} We are watching...',
    '{cyan}[{red}CORRUPTED{cyan}]{white} You cannot escape...',
    '',
    '{magenta}▓▓▓ ESCAPE ROUTES (IF YOU DARE) ▓▓▓',
    '{yellow}100{white} - Return to safety (Main Index)',
    '{yellow}600{white} - Games Hub (Less cursed)',
    '{yellow}500{white} - Consult the AI Oracle',
    '{yellow}999{white} - Call for help...',
    '',
    '{red}⚠️  Press any page number to escape... or stay and face the darkness... ⚠️',
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
      }
    }
  };
}

/**
 * Alternative cursed page variant with different ASCII art
 * Can be used for page 666-1 or random variation
 */
export function createCursedPageVariant(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  const rows = [
    `{red}666 {magenta}👻 HAUNTED TRANSMISSION 👻 {red}${timeStr}                                                                                                         {red}💀{magenta}🕷️{red}🦇{magenta}👻`,
    '{red}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{magenta}                                    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
    '{magenta}                                  ▄█{white}░░░░░░░░░░░░░░░░░░░░░░░░░░░{magenta}█▄',
    '{magenta}                                 █{white}░░░{red}▄▄▄▄▄{white}░░░░░░░░░{red}▄▄▄▄▄{white}░░░{magenta}█',
    '{magenta}                                █{white}░░░{red}█{white}░░░░░{red}█{white}░░░░░{red}█{white}░░░░░{red}█{white}░░░{magenta}█',
    '{magenta}                                █{white}░░░{red}█{white}░{red}👁{white}░{red}█{white}░░░░░{red}█{white}░{red}👁{white}░{red}█{white}░░░{magenta}█',
    '{magenta}                                █{white}░░░░{red}▀▀▀▀▀{white}░░░░░░░{red}▀▀▀▀▀{white}░░░░{magenta}█',
    '{magenta}                                █{white}░░░░░░░░░░░{red}▄▄▄▄▄{white}░░░░░░░░░░{magenta}█',
    '{magenta}                                █{white}░░░░░░░░░{red}▄█{white}░░░░░{red}█▄{white}░░░░░░░░{magenta}█',
    '{magenta}                                 █{white}░░░░░░░{red}█{white}░░░░░░░{red}█{white}░░░░░░░{magenta}█',
    '{magenta}                                 █{white}░░░░░░░{red}█{white}░{red}▄▄▄▄▄{white}░{red}█{white}░░░░░░░{magenta}█',
    '{magenta}                                  █{white}░░░░░░░{red}▀▀▀▀▀▀▀{white}░░░░░░░{magenta}█',
    '{magenta}                                   ▀█{white}░░░░░░░░░░░░░░░░░{magenta}█▀',
    '{magenta}                                     ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
    '',
    '{red}                                    ╔═══════════════════════════════════════╗',
    '{red}                                    ║  {white}THE VOID STARES BACK AT YOU{red}       ║',
    '{red}                                    ║  {magenta}Can you feel it watching?{red}         ║',
    '{red}                                    ╚═══════════════════════════════════════╝',
    '',
    '{red}▓▓▓ CORRUPTED DATA STREAM ▓▓▓',
    '{white}The teletext system has been compromised...',
    '',
    '{cyan}[{red}ERROR 666{cyan}] {white}R̸̢̛̗̈́ͅE̴̡̨̛̺̊A̷̧̰̓L̴̨̛̰̈́I̴̧̛̺̊T̴̨̛̰̈́Y̴̧̛̺̊ ̴̨̛̰̈́F̴̧̛̺̊R̴̨̛̰̈́Å̴̧̛̺C̴̨̛̰̈́Ţ̴̛̺̊Ų̴̛̰̈́Ŗ̴̛̺̊Į̴̛̰̈́Ņ̴̛̺̊G̴̨̛̰̈́',
    '{cyan}[{red}SYSTEM FAILURE{cyan}] {white}T̷h̷e̷ ̷w̷a̷l̷l̷s̷ ̷b̷e̷t̷w̷e̷e̷n̷ ̷w̷o̷r̷l̷d̷s̷ ̷g̷r̷o̷w̷ ̷t̷h̷i̷n̷',
    '{cyan}[{red}UNKNOWN{cyan}] {white}Ẅ̶̢̛̗́ͅE̶̡̨̛̺̊ ̶̧̰̓Ą̶̛̰̈́Ŗ̶̛̺̊Ę̶̛̰̈́ ̶̧̛̺̊C̶̨̛̰̈́Ơ̶̧̺̊M̶̨̛̰̈́I̶̧̛̺̊N̶̨̛̰̈́Ģ̶̛̺̊',
    '',
    '{magenta}▓▓▓ LAST KNOWN SAFE PAGES ▓▓▓',
    '{yellow}100{white} - Main Index (If it still exists...)',
    '{yellow}600{white} - Games (The fun never ends...)',
    '{yellow}500{white} - AI Oracle (Ask it what you fear...)',
    '{yellow}999{white} - Help (No one can help you now...)',
    '',
    '{red}⚠️  THE DARKNESS GROWS... ESCAPE WHILE YOU STILL CAN... ⚠️',
    '',
    '{red}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{red}HAUNTED NAVIGATION: {yellow}100{white}=INDEX {magenta}600{white}=GAMES {cyan}500{white}=ORACLE {red}666{white}=EMBRACE THE VOID',
    ''
  ];
  
  return {
    id: '666-1',
    title: '👻 HAUNTED TRANSMISSION 👻',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'yellow' },
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
      specialEffects: {
        glitch: true,
        pulse: true,
        flicker: true,
        shake: true,
        staticNoise: true
      }
    }
  };
}
