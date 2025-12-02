/**
 * Services Pages (5xx, 6xx, 7xx, 8xx)
 * AI, Games, Settings, and Developer Tools
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates page 500 - AI Oracle Chat (Direct Input)
 * New flow: User can ask questions directly on page 500
 */
export function createAIOraclePage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}500 {yellow}🤖 AI ORACLE CHAT 🤖 {cyan}${timeStr}                                                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║                                    {cyan}🎯 ASK ME ANYTHING 🎯{yellow}                                                             ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '{white}I can help you with:',
    '{green}•{white} General knowledge    {green}•{white} News & current events    {green}•{white} Sports & games',
    '{green}•{white} Technology & science {green}•{white} Weather & markets        {green}•{white} Entertainment',
    '',
    '{cyan}▓▓▓ ASK YOUR QUESTION ▓▓▓',
    '',
    '{white}Type your question below and press {green}ENTER{white}:',
    '',
    '{yellow}▶{white} _',
    '',
    '',
    '',
    '',
    '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{magenta}║ {yellow}💡 TIPS:{white}                                                                                                            {magenta}║',
    '{magenta}║ {white}• Type your question and press ENTER to get an AI response                                                             {magenta}║',
    '{magenta}║ {white}• AI responses appear on this page (no navigation needed)                                                              {magenta}║',
    '{magenta}║ {white}• Responses typically take 3-5 seconds                                                                                 {magenta}║',
    '{magenta}║ {white}• Press RED button to return to main index                                                                             {magenta}║',
    '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}RED{white}=BACK TO INDEX • Type question and press {green}ENTER{white} to chat',
    ''
  ];
  
  return {
    id: '500',
    title: 'AI Oracle Chat',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'text',
      textInputEnabled: true,
      textInputPrompt: 'Type your question and press ENTER:',
      textInputPlaceholder: 'Ask me anything...',
      aiChatPage: true,
      stayOnPageAfterSubmit: true
    }
  };
}

/**
 * Creates page 600 - Games Index
 */
export function createGamesIndexPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}600 {yellow}🎮 GAMES & QUIZZES HUB 🎮 {cyan}${timeStr}                                                                                                            {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {red}FUN & GAMES{yellow}  {white}░▒▓█▓▒░  {cyan}Test Your Knowledge  {white}░▒▓█▓▒░  {yellow}New Quizzes Daily{yellow}                                                    ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ AVAILABLE GAMES ▓▓▓',
    '{green}601{white} Quiz of the Day                      {white}Test your general knowledge with today\'s quiz',
    '{green}610{white} Bamboozle Quiz Game                  {white}Can you spot the fake answer?',
    '{green}620{white} Random Facts & Trivia                {white}Learn something new every time',
    '{green}630{white} Word Games & Puzzles                 {white}Challenge your vocabulary',
    '{green}640{white} Number Challenges                    {white}Math puzzles and brain teasers',
    '',
    '{cyan}▓▓▓ TODAY\'S FEATURED QUIZ ▓▓▓',
    '{yellow}QUIZ OF THE DAY:{white} Technology & Innovation',
    '{white}Difficulty: {green}Medium',
    '{white}Questions: {green}10',
    '{white}Time Limit: {green}5 minutes',
    '{white}High Score: {green}9/10 {white}by {cyan}TechWizard',
    '',
    '{white}Press {green}601{white} to start the quiz!',
    '',
    '{cyan}▓▓▓ LEADERBOARD ▓▓▓',
    '{yellow}1.{white} TechWizard        {green}9/10  {white}2 minutes ago',
    '{yellow}2.{white} QuizMaster        {green}8/10  {white}15 minutes ago',
    '{yellow}3.{white} BrainBox          {green}8/10  {white}1 hour ago',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=MAIN INDEX {green}601{white}=QUIZ {yellow}610{white}=BAMBOOZLE {blue}620{white}=TRIVIA',
    ''
  ];
  
  return {
    id: '600',
    title: 'Games & Quizzes',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'QUIZ', targetPage: '601', color: 'green' },
      { label: 'BAMBOOZLE', targetPage: '610', color: 'yellow' },
      { label: 'TRIVIA', targetPage: '620', color: 'blue' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
      // No inputMode specified = defaults to 'triple' for 3-digit navigation
    }
  };
}

/**
 * Creates page 700 - Theme Selection (Interactive)
 * Requirements: 3.1, 3.2 - Interactive theme selection with inputMode='single'
 */
export function createThemeSelectionPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}700 {yellow}🎨 THEME SELECTION 🎨 {cyan}${timeStr}                                                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {cyan}CUSTOMIZE{yellow}  {white}░▒▓█▓▒░  {cyan}Choose Your Visual Style  {white}░▒▓█▓▒░  {yellow}Changes Apply Instantly{yellow}                                          ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ AVAILABLE THEMES ▓▓▓',
    '',
    '{green}[1] {yellow}CEEFAX {white}- Classic BBC Teletext',
    '{white}    Traditional yellow/blue color scheme',
    '{white}    Smooth transitions, nostalgic 1980s feel',
    '',
    '{green}[2] {green}ORF {white}- Austrian Teletext Style',
    '{white}    Green/black matrix-style aesthetic',
    '{white}    Modern European teletext design',
    '',
    '{green}[3] {white}HIGH CONTRAST {white}- Accessibility Mode',
    '{white}    Maximum readability, bold colors',
    '{white}    Screen reader friendly, WCAG compliant',
    '',
    '{green}[4] {magenta}HAUNTING MODE {white}- Spooky Theme',
    '{white}    Dark atmospheric colors with effects',
    '{white}    Ghostly animations and eerie styling',
    '',
    '{cyan}▓▓▓ HOW TO SELECT ▓▓▓',
    '{white}Press {yellow}1{white}, {yellow}2{white}, {yellow}3{white}, or {yellow}4{white} to apply a theme instantly',
    '{white}Your selection will be saved automatically',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: Press {yellow}1-4{white} to select theme • {red}RED{white}=INDEX {green}GREEN{white}=SETTINGS {yellow}YELLOW{white}=BACK',
    ''
  ];
  
  return {
    id: '700',
    title: 'Theme Selection',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'SETTINGS', targetPage: '701', color: 'green' },
      { label: 'BACK', targetPage: '100', color: 'yellow' },
      { label: '1', targetPage: '700' }, // Ceefax - handled by KeyboardHandler
      { label: '2', targetPage: '700' }, // ORF - handled by KeyboardHandler
      { label: '3', targetPage: '700' }, // High Contrast - handled by KeyboardHandler
      { label: '4', targetPage: '700' }  // Haunting - handled by KeyboardHandler
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      themeSelectionPage: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4']
    }
  };
}

/**
 * Creates page 701 - Settings Index (moved from 700)
 */
export function createSettingsIndexPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}701 {yellow}⚙️ SETTINGS & PREFERENCES ⚙️ {cyan}${timeStr}                                                                                                        {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {cyan}CUSTOMIZE{yellow}  {white}░▒▓█▓▒░  {cyan}Personalize Your Experience  {white}░▒▓█▓▒░  {yellow}Save Your Preferences{yellow}                                        ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ APPEARANCE ▓▓▓',
    '{green}700{white} Theme Selection                      {white}Choose from Ceefax, Haunting, High Contrast, ORF',
    '{green}702{white} CRT Effects                          {white}Adjust scanlines, flicker, and screen effects',
    '{green}703{white} Color Schemes                        {white}Customize text and background colors',
    '',
    '{cyan}▓▓▓ CONTROLS ▓▓▓',
    '{green}710{white} Keyboard Shortcuts                   {white}View and customize keyboard bindings',
    '{green}711{white} Navigation Settings                  {white}Configure page navigation behavior',
    '{green}712{white} Input Preferences                    {white}Adjust input buffer and feedback',
    '',
    '{cyan}▓▓▓ ACCESSIBILITY ▓▓▓',
    '{green}720{white} Animation Settings                   {white}Control animation speed and effects',
    '{green}721{white} Text Size & Contrast                 {white}Adjust for better readability',
    '{green}722{white} Screen Reader Support                {white}Enable accessibility features',
    '',
    '{cyan}▓▓▓ ADVANCED ▓▓▓',
    '{green}730{white} Performance Options                  {white}Optimize for your device',
    '{green}731{white} Cache Management                     {white}Clear cache and offline data',
    '{green}732{white} Reset to Defaults                    {white}Restore original settings',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=MAIN INDEX {green}700{white}=THEMES {yellow}710{white}=SHORTCUTS {blue}720{white}=ACCESSIBILITY',
    ''
  ];
  
  return {
    id: '701',
    title: 'Settings',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'THEMES', targetPage: '700', color: 'green' },
      { label: 'SHORTCUTS', targetPage: '710', color: 'yellow' },
      { label: 'ACCESS', targetPage: '720', color: 'blue' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}

/**
 * Creates page 800 - Developer Tools Index
 */
export function createDevToolsIndexPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}800 {yellow}🔧 DEVELOPER TOOLS 🔧 {cyan}${timeStr}                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {green}DEV MODE{yellow}  {white}░▒▓█▓▒░  {cyan}API Explorer & Debugging  {white}░▒▓█▓▒░  {yellow}For Developers Only{yellow}                                              ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ API TOOLS ▓▓▓',
    '{green}801{white} API Explorer                         {white}Test and explore all available APIs',
    '{green}802{white} Raw JSON Viewer                      {white}View page data in JSON format',
    '{green}803{white} Performance Monitor                  {white}Track page load times and metrics',
    '',
    '{cyan}▓▓▓ DEBUGGING ▓▓▓',
    '{green}810{white} Console Logs                         {white}View application logs and errors',
    '{green}811{white} Network Inspector                    {white}Monitor API calls and responses',
    '{green}812{white} State Inspector                      {white}View application state and context',
    '',
    '{cyan}▓▓▓ DOCUMENTATION ▓▓▓',
    '{green}820{white} API Documentation                    {white}Complete API reference guide',
    '{green}821{white} Component Library                    {white}Browse available UI components',
    '{green}822{white} Theme System Docs                    {white}Learn about theme customization',
    '',
    '{cyan}▓▓▓ UTILITIES ▓▓▓',
    '{green}830{white} Page Generator                       {white}Create custom teletext pages',
    '{green}831{white} Color Picker                         {white}Test teletext color combinations',
    '{green}832{white} Layout Tester                        {white}Preview different layouts',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=MAIN INDEX {green}801{white}=API EXPLORER {yellow}810{white}=DEBUGGING {blue}820{white}=DOCS',
    ''
  ];
  
  return {
    id: '800',
    title: 'Developer Tools',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'API', targetPage: '801', color: 'green' },
      { label: 'DEBUG', targetPage: '810', color: 'yellow' },
      { label: 'DOCS', targetPage: '820', color: 'blue' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}


/**
 * Creates page 501 - AI Quick Topics (Legacy page with shortcuts)
 * Redirects to page 500 for main chat, but provides quick topic shortcuts
 */
export function createAIChatPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}501 {yellow}🤖 AI QUICK TOPICS 🤖 {cyan}${timeStr}                                                                                                                 {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║                              {cyan}🎯 QUICK TOPIC SHORTCUTS 🎯{yellow}                                                            ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '{white}Press a number for instant AI answers on these topics:',
    '',
    '{green}1.{white} Explain AI in simple terms        {green}4.{white} How does the internet work?',
    '{green}2.{white} Latest technology trends           {green}5.{white} Tell me a joke',
    '{green}3.{white} Interesting historical fact        {green}6.{white} Write a poem about teletext',
    '',
    '{cyan}▓▓▓ WANT TO ASK YOUR OWN QUESTION? ▓▓▓',
    '',
    '{white}Go to page {cyan}500{white} for the main AI chat interface',
    '{white}where you can type any question you want!',
    '',
    '',
    '',
    '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{magenta}║ {yellow}💡 TIP:{white} Page 500 now has direct chat - no need to navigate between pages!                                          {magenta}║',
    '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}500{white}=AI CHAT {yellow}1-6{white}=QUICK TOPICS',
    ''
  ];
  
  return {
    id: '501',
    title: 'AI Quick Topics',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'AI CHAT', targetPage: '500', color: 'green' },
      { label: '1', targetPage: '511', color: undefined },
      { label: '2', targetPage: '512', color: undefined },
      { label: '3', targetPage: '513', color: undefined },
      { label: '4', targetPage: '514', color: undefined },
      { label: '5', targetPage: '515', color: undefined },
      { label: '6', targetPage: '516', color: undefined }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4', '5', '6']
    }
  };
}

/**
 * Creates page 601 - Quiz of the Day
 */
export function createQuizPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}601 {yellow}Quiz of the Day {cyan}${timeStr}                                                                                                                        {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ TODAY\'S QUIZ: TECHNOLOGY & INNOVATION ▓▓▓',
    '',
    '{white}Question 1 of 10:',
    '',
    '{yellow}What year was the World Wide Web invented?',
    '',
    '{green}1.{white} 1989',
    '{green}2.{white} 1991',
    '{green}3.{white} 1995',
    '{green}4.{white} 1998',
    '',
    '{white}Press the number of your answer (1-4)',
    '',
    '{cyan}▓▓▓ QUIZ INFO ▓▓▓',
    '{white}Difficulty:     {green}Medium',
    '{white}Time Limit:     {green}5 minutes',
    '{white}Questions:      {green}10',
    '{white}Your Score:     {yellow}0/0',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}600{white}=GAMES INDEX {yellow}999{white}=HELP',
    ''
  ];
  
  return {
    id: '601',
    title: 'Quiz of the Day',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'GAMES', targetPage: '600', color: 'green' },
      { label: 'HELP', targetPage: '999', color: 'yellow' },
      { label: '1', targetPage: '601-1' }, // Answer 1
      { label: '2', targetPage: '601-2' }, // Answer 2
      { label: '3', targetPage: '601-3' }, // Answer 3
      { label: '4', targetPage: '601-4' }  // Answer 4
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4'] // Accept 1-digit for quiz answers
    }
  };
}

/**
 * Creates page 610 - Bamboozle Quiz Game
 */
export function createBamboozlePage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}610 {yellow}Bamboozle Quiz Game {cyan}${timeStr}                                                                                                                   {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ BAMBOOZLE - SPOT THE FAKE! ▓▓▓',
    '',
    '{white}One of these facts is FALSE. Can you spot it?',
    '',
    '{yellow}Question: Which of these is NOT true about honey?',
    '',
    '{green}1.{white} Honey never spoils - archaeologists found 3000-year-old honey that was still edible',
    '{green}2.{white} Bees must visit 2 million flowers to make one pound of honey',
    '{green}3.{white} Honey is the only food made by insects that humans eat',
    '{green}4.{white} Honey bees can recognize human faces',
    '',
    '{white}Press the number of your answer (1-4)',
    '',
    '{cyan}▓▓▓ GAME INFO ▓▓▓',
    '{white}Difficulty:     {green}Easy',
    '{white}Questions:      {green}10',
    '{white}Your Score:     {yellow}0/0',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}600{white}=GAMES INDEX {yellow}999{white}=HELP',
    ''
  ];
  
  return {
    id: '610',
    title: 'Bamboozle Quiz',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'GAMES', targetPage: '600', color: 'green' },
      { label: 'HELP', targetPage: '999', color: 'yellow' },
      { label: '1', targetPage: '610-1' }, // Answer 1
      { label: '2', targetPage: '610-2' }, // Answer 2
      { label: '3', targetPage: '610-3' }, // Answer 3
      { label: '4', targetPage: '610-4' }  // Answer 4
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4'] // Accept 1-digit for quiz answers
    }
  };
}


/**
 * Creates quiz answer result pages (601-1, 601-2, etc.)
 */
export function createQuizAnswerPage(quizPage: string, answerNumber: number): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const pageId = `${quizPage}-${answerNumber}`;
  
  // Define correct answers and feedback
  const quizData: Record<string, { correctAnswer: number; feedback: string[]; gameType: string }> = {
    '601': {
      correctAnswer: 1,
      gameType: 'Quiz',
      feedback: [
        'Correct! The World Wide Web was invented in 1989 by Tim Berners-Lee.',
        'Incorrect. The correct answer is 1989. Tim Berners-Lee invented the WWW in 1989.',
        'Incorrect. The correct answer is 1989, not 1995.',
        'Incorrect. The correct answer is 1989, not 1998.'
      ]
    },
    '610': {
      correctAnswer: 4,
      gameType: 'Bamboozle Quiz',
      feedback: [
        'Incorrect. Honey does never spoil - this is true!',
        'Incorrect. Bees do visit 2 million flowers - this is true!',
        'Incorrect. Honey is the only insect-made food humans eat - this is true!',
        'Correct! Honey bees cannot recognize human faces - this is FALSE!'
      ]
    },
    '630': {
      correctAnswer: 1,
      gameType: 'Anagram Challenge',
      feedback: [
        'Correct! TLEEXTET unscrambles to TELETEXT - the system for displaying text on TV!',
        'Incorrect. TEXTLEET is not a real word. The correct answer is TELETEXT.',
        'Incorrect. LEETTEXT is not correct. The answer is TELETEXT.',
        'Incorrect. TEXTTELE is not right. The correct answer is TELETEXT.'
      ]
    },
    '640': {
      correctAnswer: 1,
      gameType: 'Math Challenge',
      feedback: [
        'Correct! 47 × 8 = 376, then 376 + 15 = 391. Well done!',
        'Incorrect. 47 × 8 = 376, then 376 + 15 = 391, not 376.',
        'Incorrect. You selected the same answer as option 1, which is correct (391)!',
        'Incorrect. 47 × 8 = 376, then 376 + 15 = 391, not 401.'
      ]
    }
  };
  
  const quiz = quizData[quizPage] || quizData['601'];
  const isCorrect = answerNumber === quiz.correctAnswer;
  const feedback = quiz.feedback[answerNumber - 1];
  
  const rows = [
    `{cyan}${pageId} {yellow}${quiz.gameType} Result {cyan}${timeStr}                                                                                                                    {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    isCorrect ? '{green}✓ CORRECT! ✓' : '{red}✗ INCORRECT ✗',
    '',
    `{white}${feedback}`,
    '',
    '{cyan}▓▓▓ YOUR ANSWER ▓▓▓',
    `{white}You selected: {yellow}Answer ${answerNumber}`,
    isCorrect ? '{green}That\'s right!' : `{red}The correct answer was: ${quiz.correctAnswer}`,
    '',
    '{cyan}▓▓▓ SCORE ▓▓▓',
    `{white}Current Score: {yellow}${isCorrect ? '1' : '0'}/1`,
    `{white}Game: {cyan}${quiz.gameType}`,
    '',
    '{white}This is a demo game. Full game functionality',
    '{white}with multiple questions and scoring requires',
    '{white}integration with a game engine.',
    '',
    '{white}Press BACK to play again',
    '{white}Press GAMES to try other games',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    `{cyan}NAVIGATION: {red}BACK{white}=Play Again {green}INDEX{white}=Main Index {yellow}GAMES{white}=Games Hub`,
    ''
  ];
  
  return {
    id: pageId,
    title: 'Quiz Result',
    rows,
    links: [
      { label: 'BACK', targetPage: quizPage, color: 'red' },
      { label: 'INDEX', targetPage: '100', color: 'green' },
      { label: 'GAMES', targetPage: '600', color: 'yellow' }
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
 * Creates page 630 - Word Puzzle Game (Anagram Challenge)
 */
export function createWordGamesPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}630 {yellow}🔤 ANAGRAM CHALLENGE 🔤 {cyan}${timeStr}                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ UNSCRAMBLE THE WORD ▓▓▓',
    '',
    '{white}Scrambled Word: {yellow}TLEEXTET',
    '',
    '{white}Hint: {cyan}A system for displaying text and graphics on TV',
    '',
    '{white}What is the correct word?',
    '',
    '{green}1.{white} TELETEXT',
    '{green}2.{white} TEXTLEET',
    '{green}3.{white} LEETTEXT',
    '{green}4.{white} TEXTTELE',
    '',
    '{white}Press the number of your answer (1-4)',
    '',
    '{cyan}▓▓▓ GAME INFO ▓▓▓',
    '{white}Difficulty:     {green}Easy',
    '{white}Category:       {green}Technology',
    '{white}Your Score:     {yellow}0/0',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: Press {yellow}1-4{white} for answer • {red}RED{white}=GAMES {green}GREEN{white}=INDEX {yellow}YELLOW{white}=QUIZ {blue}BLUE{white}=TRIVIA',
    ''
  ];
  
  return {
    id: '630',
    title: 'Anagram Challenge',
    rows,
    links: [
      { label: 'BACK', targetPage: '600', color: 'red' },
      { label: 'INDEX', targetPage: '100', color: 'green' },
      { label: 'QUIZ', targetPage: '601', color: 'yellow' },
      { label: 'TRIVIA', targetPage: '620', color: 'blue' },
      { label: '1', targetPage: '630-1' },
      { label: '2', targetPage: '630-2' },
      { label: '3', targetPage: '630-3' },
      { label: '4', targetPage: '630-4' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4']
    }
  };
}

/**
 * Creates page 640 - Math Challenge Game
 */
export function createNumberChallengesPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}640 {yellow}🔢 MATH CHALLENGE 🔢 {cyan}${timeStr}                                                                                                                   {red}�{greeen}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ QUICK CALCULATION ▓▓▓',
    '',
    '{white}Solve this math problem:',
    '',
    '{yellow}        47 × 8 + 15 = ?',
    '',
    '{white}What is the answer?',
    '',
    '{green}1.{white} 391',
    '{green}2.{white} 376',
    '{green}3.{white} 391',
    '{green}4.{white} 401',
    '',
    '{white}Press the number of your answer (1-4)',
    '',
    '{cyan}▓▓▓ CHALLENGE INFO ▓▓▓',
    '{white}Difficulty:     {green}Medium',
    '{white}Category:       {green}Arithmetic',
    '{white}Time Limit:     {yellow}30 seconds',
    '{white}Your Score:     {yellow}0/0',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: Press {yellow}1-4{white} for answer • {red}RED{white}=GAMES {green}GREEN{white}=INDEX {yellow}YELLOW{white}=QUIZ {blue}BLUE{white}=WORD',
    ''
  ];
  
  return {
    id: '640',
    title: 'Math Challenge',
    rows,
    links: [
      { label: 'BACK', targetPage: '600', color: 'red' },
      { label: 'INDEX', targetPage: '100', color: 'green' },
      { label: 'QUIZ', targetPage: '601', color: 'yellow' },
      { label: 'WORD', targetPage: '630', color: 'blue' },
      { label: '1', targetPage: '640-1' },
      { label: '2', targetPage: '640-2' },
      { label: '3', targetPage: '640-3' },
      { label: '4', targetPage: '640-4' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4']
    }
  };
}
