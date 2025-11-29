/**
 * Additional Pages
 * Placeholder pages for features under construction
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates a "Coming Soon" page for features under construction
 */
export function createComingSoonPage(pageNumber: string, title: string, description: string): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}${pageNumber} {yellow}${title} {cyan}${timeStr}                                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║                                                                                                                                ║',
    '{yellow}║                                          {cyan}COMING SOON{yellow}                                                                     ║',
    '{yellow}║                                                                                                                                ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    `{white}${description}`,
    '',
    '{white}This page is under construction.',
    '{white}This page will be available when',
    '{white}the full features are implemented.',
    '',
    '{white}Press {green}100{white} for main index',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=MAIN INDEX',
    ''
  ];
  
  return {
    id: pageNumber,
    title,
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' }
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

/**
 * Creates page 620 - Random Facts & Trivia
 */
export function createTriviaPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}620 {yellow}Random Facts & Trivia {cyan}${timeStr}                                                                                                                 {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ DID YOU KNOW? ▓▓▓',
    '',
    '{yellow}Fact of the Moment:',
    '{white}Honey never spoils. Archaeologists have found 3,000-year-old honey',
    '{white}in Egyptian tombs that was still perfectly edible!',
    '',
    '{cyan}▓▓▓ MORE FASCINATING FACTS ▓▓▓',
    '',
    '{green}1.{white} The shortest war in history lasted only 38 minutes',
    '{white}   (Anglo-Zanzibar War, 1896)',
    '',
    '{green}2.{white} A group of flamingos is called a "flamboyance"',
    '',
    '{green}3.{white} Bananas are berries, but strawberries aren\'t',
    '',
    '{green}4.{white} The Eiffel Tower can be 15 cm taller during summer',
    '{white}   (due to thermal expansion)',
    '',
    '{green}5.{white} Octopuses have three hearts',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}600{white}=GAMES INDEX {yellow}601{white}=QUIZ {blue}610{white}=BAMBOOZLE',
    ''
  ];
  
  return {
    id: '620',
    title: 'Random Facts',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'GAMES', targetPage: '600', color: 'green' },
      { label: 'QUIZ', targetPage: '601', color: 'yellow' },
      { label: 'BAMBOOZLE', targetPage: '610', color: 'blue' }
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

/**
 * Creates page 701 - Theme Customization
 * NOTE: This page shows theme options but actual theme switching requires
 * integration with the theme context. For now, it navigates to theme preview pages.
 */
export function createThemeCustomizationPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}701 {yellow}⚙️ Theme Customization ⚙️ {cyan}${timeStr}                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ AVAILABLE THEMES ▓▓▓',
    '',
    '{green}1.{white} Ceefax (Classic BBC)         {cyan}Traditional British teletext style',
    '{white}   Classic yellow/blue color scheme with smooth transitions',
    '',
    '{green}2.{white} Haunting Mode                 {magenta}Spooky Halloween theme with effects',
    '{white}   Dark theme with ghostly animations and eerie colors',
    '',
    '{green}3.{white} High Contrast                 {white}Accessibility-focused design',
    '{white}   Maximum readability with bold colors and clear text',
    '',
    '{green}4.{white} ORF (Austrian Style)          {yellow}Colorful European teletext',
    '{white}   Vibrant colors with smooth page transitions',
    '',
    '{cyan}▓▓▓ CURRENT THEME ▓▓▓',
    '{white}Active: {magenta}Haunting Mode {white}(Kiroween Edition)',
    '',
    '{white}Press {yellow}1-4{white} to preview a theme',
    '{white}Theme changes are temporary for this session',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: Press {yellow}1-4{white} for themes • {red}RED{white}=INDEX {green}GREEN{white}=SETTINGS {yellow}YELLOW{white}=ANIMATIONS',
    ''
  ];
  
  return {
    id: '701',
    title: 'Theme Customization',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'SETTINGS', targetPage: '700', color: 'green' },
      { label: 'ANIMATIONS', targetPage: '720', color: 'yellow' },
      { label: '1', targetPage: '701-1' }, // Ceefax preview
      { label: '2', targetPage: '701-2' }, // Haunting preview
      { label: '3', targetPage: '701-3' }, // High Contrast preview
      { label: '4', targetPage: '701-4' }  // ORF preview
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4'] // Accept 1-digit for theme selection
    }
  };
}

/**
 * Creates theme preview pages (701-1, 701-2, 701-3, 701-4)
 */
export function createThemePreviewPage(themeNumber: number): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const themes = [
    {
      name: 'Ceefax (Classic BBC)',
      description: 'Traditional British teletext style with classic yellow/blue colors',
      features: [
        'Classic BBC color scheme',
        'Smooth page transitions',
        'Nostalgic 1980s feel',
        'Easy on the eyes'
      ]
    },
    {
      name: 'Haunting Mode',
      description: 'Spooky Halloween theme with ghostly effects and dark colors',
      features: [
        'Dark, atmospheric colors',
        'Ghostly animations',
        'Halloween decorations',
        'Eerie sound effects (coming soon)'
      ]
    },
    {
      name: 'High Contrast',
      description: 'Accessibility-focused design with maximum readability',
      features: [
        'Bold, clear colors',
        'Maximum contrast ratios',
        'Large, readable text',
        'Screen reader friendly'
      ]
    },
    {
      name: 'ORF (Austrian Style)',
      description: 'Colorful European teletext with vibrant colors',
      features: [
        'Vibrant color palette',
        'Smooth transitions',
        'European teletext style',
        'Modern and clean'
      ]
    }
  ];
  
  const theme = themes[themeNumber - 1];
  const pageId = `701-${themeNumber}`;
  
  const rows = [
    `{cyan}${pageId} {yellow}${theme.name} Preview {cyan}${timeStr}                                                                                                          {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    `{cyan}▓▓▓ ${theme.name.toUpperCase()} ▓▓▓`,
    '',
    `{white}${theme.description}`,
    '',
    '{cyan}▓▓▓ THEME FEATURES ▓▓▓',
    `{green}•{white} ${theme.features[0]}`,
    `{green}•{white} ${theme.features[1]}`,
    `{green}•{white} ${theme.features[2]}`,
    `{green}•{white} ${theme.features[3]}`,
    '',
    '{cyan}▓▓▓ NOTE ▓▓▓',
    '{white}Theme switching functionality requires integration',
    '{white}with the React theme context. This is a preview page.',
    '',
    '{white}To actually change themes, you would need to:',
    '{yellow}1.{white} Update the theme context in the React app',
    '{yellow}2.{white} Store the preference in local storage',
    '{yellow}3.{white} Apply the theme colors and animations',
    '',
    '{white}For now, press BACK to return to theme selection.',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}BACK{white}=Theme Selection {green}INDEX{white}=Main Index {yellow}SETTINGS{white}=Settings Menu',
    ''
  ];
  
  return {
    id: pageId,
    title: `${theme.name} Preview`,
    rows,
    links: [
      { label: 'BACK', targetPage: '701', color: 'red' },
      { label: 'INDEX', targetPage: '100', color: 'green' },
      { label: 'SETTINGS', targetPage: '700', color: 'yellow' }
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
