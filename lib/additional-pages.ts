/**
 * Additional Pages
 * Placeholder pages for features under construction
 * Includes beautiful 404 error page with ASCII art
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates a "Coming Soon" page for features under construction
 * Requirements: 6.5 - Handle unimplemented pages gracefully with navigation hints
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
    '{white}This page is under construction and will be',
    '{white}available when the full features are implemented.',
    '',
    '{cyan}▓▓▓ AVAILABLE SECTIONS ▓▓▓',
    '{white}Try these working pages:',
    '{yellow}100{white} - Main Index          {yellow}200{white} - News Headlines',
    '{yellow}300{white} - Sports Results      {yellow}400{white} - Markets & Finance',
    '{yellow}500{white} - AI Oracle           {yellow}600{white} - Games & Quizzes',
    '{yellow}700{white} - Settings & Themes   {yellow}999{white} - Help & Information',
    '',
    '{white}Press {green}100{white} for main index or enter any page number',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}200{white}=NEWS {yellow}300{white}=SPORTS {blue}600{white}=GAMES',
    ''
  ];
  
  return {
    id: pageNumber,
    title,
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'NEWS', targetPage: '200', color: 'green' },
      { label: 'SPORTS', targetPage: '300', color: 'yellow' },
      { label: 'GAMES', targetPage: '600', color: 'blue' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      comingSoon: true
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
 * Creates a beautiful Halloween-themed 404 error page with ASCII art
 * Requirements: 5.3 - Beautiful 404 error page with decorative elements
 * Enhanced for Kiroween hackathon with spooky teletext aesthetics
 */
export function create404ErrorPage(pageNumber: string): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{magenta}404 {yellow}/!\\ Page Not Found /!\\ {magenta}${timeStr}                                                                                                                        `,
    '{magenta}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{yellow}                                    .--.      .--.      .--.      .--.      .--.      .--.',
    '{yellow}                                   (    )    (    )    (    )    (    )    (    )    (    )',
    '{yellow}                                    \'--\'      \'--\'      \'--\'      \'--\'      \'--\'      \'--\'',
    '',
    '{red}                                          ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
    '{red}                                        ▄█{white}░░░░░░░░░░░░░░░░░░░░░░░{red}█▄',
    '{red}                                      ▄█{white}░░{red}▄▄{white}░░░░░░░░░░░░░░░{red}▄▄{white}░░{red}█▄',
    '{red}                                     █{white}░░{red}█{white}░░{red}█{white}░░░░░░░░░░░░░{red}█{white}░░{red}█{white}░░{red}█',
    '{red}                                     █{white}░░░{red}▀▀{white}░░░░░░░░░░░░░░░{red}▀▀{white}░░░{red}█',
    '{red}                                     █{white}░░░░░░░░░░░{red}▄▄▄{white}░░░░░░░░░░░{red}█',
    '{red}                                     █{white}░░░░░░░░░{red}▄█{white}░░░{red}█▄{white}░░░░░░░░░{red}█',
    '{red}                                     █{white}░░░░░░░░{red}█{white}░░░░░░░{red}█{white}░░░░░░░░{red}█',
    '{red}                                     █{white}░░░░░░░░{red}█{white}░{red}▄▄▄▄▄{white}░{red}█{white}░░░░░░░░{red}█',
    '{red}                                      █{white}░░░░░░░░{red}▀▀▀▀▀▀▀{white}░░░░░░░░{red}█',
    '{red}                                       █{white}░░░░░░░░░░░░░░░░░░░░░{red}█',
    '{red}                                        ▀█{white}░░░░░░░░░░░░░░░░░░░{red}█▀',
    '{red}                                          ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
    '',
    '{yellow}                                    ╔═══════════════════════════════════════╗',
    '{yellow}                                    ║  {red}BOO! THIS PAGE IS MISSING!{yellow}        ║',
    '{yellow}                                    ║  {white}The spirits took it away...{yellow}       ║',
    '{yellow}                                    ╚═══════════════════════════════════════╝',
    '',
    `{white}Oops! Page {yellow}${pageNumber}{white} has vanished into the darkness...`,
    '',
    '{cyan}▓▓▓ WHAT HAPPENED? ▓▓▓',
    '{white}The page you requested could not be found. This could be because:',
    '{magenta}*{white} The page number is invalid (valid range: 100-999)',
    '{magenta}*{white} The page hasn\'t been implemented yet',
    '{magenta}*{white} You may have mistyped the page number',
    '{magenta}*{white} The ghosts are playing tricks on you...',
    '',
    '{cyan}▓▓▓ FIND YOUR WAY BACK ▓▓▓',
    '{white}Don\'t be scared! Try these safe pages:',
    '{yellow}100{white} - Main Index          {yellow}200{white} - News Headlines',
    '{yellow}300{white} - Sports Results      {yellow}400{white} - Markets & Finance',
    '{yellow}500{white} - AI Oracle           {yellow}600{white} - Games & Quizzes',
    '{yellow}666{white} - Cursed Page         {yellow}999{white} - Help & Information',
    '',
    '{magenta}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{magenta}NAVIGATION: {yellow}100{white}=MAIN INDEX {cyan}200{white}=NEWS {green}300{white}=SPORTS {red}666{white}=CURSED {blue}999{white}=HELP',
    ''
  ];
  
  return {
    id: pageNumber,
    title: 'Page Not Found',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'NEWS', targetPage: '200', color: 'green' },
      { label: 'SPORTS', targetPage: '300', color: 'yellow' },
      { label: 'HELP', targetPage: '999', color: 'blue' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      errorPage: true
    }
  };
}

/**
 * Creates a generic "Coming Soon" page for any unimplemented page
 * Requirements: 6.5 - Handle unimplemented pages gracefully
 */
export function createGenericComingSoonPage(pageNumber: string): TeletextPage {
  // Determine the section based on page number
  const pageNum = parseInt(pageNumber.split('-')[0], 10);
  let sectionName = 'Page';
  let sectionDescription = 'This page is not yet implemented.';
  
  if (pageNum >= 100 && pageNum < 200) {
    sectionName = 'System Page';
    sectionDescription = 'System and index pages';
  } else if (pageNum >= 200 && pageNum < 300) {
    sectionName = 'News Page';
    sectionDescription = 'News articles and headlines';
  } else if (pageNum >= 300 && pageNum < 400) {
    sectionName = 'Sports Page';
    sectionDescription = 'Sports results and fixtures';
  } else if (pageNum >= 400 && pageNum < 500) {
    sectionName = 'Markets & Weather Page';
    sectionDescription = 'Financial markets and weather forecasts';
  } else if (pageNum >= 500 && pageNum < 600) {
    sectionName = 'AI Oracle Page';
    sectionDescription = 'AI-powered questions and answers';
  } else if (pageNum >= 600 && pageNum < 700) {
    sectionName = 'Games Page';
    sectionDescription = 'Interactive games and quizzes';
  } else if (pageNum >= 700 && pageNum < 800) {
    sectionName = 'Settings Page';
    sectionDescription = 'Theme and configuration settings';
  } else if (pageNum >= 800 && pageNum < 900) {
    sectionName = 'Developer Tools Page';
    sectionDescription = 'Development and debugging tools';
  } else if (pageNum >= 900 && pageNum < 1000) {
    sectionName = 'Help & Information Page';
    sectionDescription = 'Help documentation and guides';
  }
  
  return createComingSoonPage(pageNumber, sectionName, sectionDescription);
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
