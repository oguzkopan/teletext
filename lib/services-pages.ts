/**
 * Services Pages (5xx, 6xx, 7xx, 8xx)
 * AI, Games, Settings, and Developer Tools
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates page 500 - AI Oracle Index
 */
export function createAIOraclePage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}500 {yellow}🤖 AI CHAT & ORACLE 🤖 {cyan}${timeStr}                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {magenta}AI ORACLE{yellow}  {white}░▒▓█▓▒░  {cyan}Ask Me Anything  {white}░▒▓█▓▒░  {yellow}Powered by Advanced AI{yellow}                                                    ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ WELCOME TO AI ORACLE ▓▓▓',
    '{white}Ask me anything! I can help you with:',
    '',
    '{green}•{white} General knowledge and information',
    '{green}•{white} News analysis and summaries',
    '{green}•{white} Sports statistics and predictions',
    '{green}•{white} Market insights and trends',
    '{green}•{white} Weather forecasts and explanations',
    '{green}•{white} Entertainment recommendations',
    '{green}•{white} Technology advice and tips',
    '',
    '{cyan}▓▓▓ HOW TO USE ▓▓▓',
    '{yellow}1.{white} Navigate to page {cyan}501{white} to start a conversation',
    '{yellow}2.{white} Type your question or prompt',
    '{yellow}3.{white} Press {green}ENTER{white} to submit',
    '{yellow}4.{white} Wait for AI response (usually < 5 seconds)',
    '{yellow}5.{white} Continue the conversation or ask follow-up questions',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=MAIN INDEX {green}501{white}=START CHAT {yellow}999{white}=HELP',
    ''
  ];
  
  return {
    id: '500',
    title: 'AI Oracle',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'CHAT', targetPage: '501', color: 'green' },
      { label: 'HELP', targetPage: '999', color: 'yellow' }
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
      cacheStatus: 'fresh',
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}

/**
 * Creates page 700 - Settings Index
 */
export function createSettingsIndexPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}700 {yellow}⚙️ SETTINGS & PREFERENCES ⚙️ {cyan}${timeStr}                                                                                                        {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {cyan}CUSTOMIZE{yellow}  {white}░▒▓█▓▒░  {cyan}Personalize Your Experience  {white}░▒▓█▓▒░  {yellow}Save Your Preferences{yellow}                                        ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ APPEARANCE ▓▓▓',
    '{green}701{white} Theme Customization                  {white}Choose from Ceefax, Haunting, High Contrast, ORF',
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
    '{cyan}NAVIGATION: {red}100{white}=MAIN INDEX {green}701{white}=THEMES {yellow}710{white}=SHORTCUTS {blue}720{white}=ACCESSIBILITY',
    ''
  ];
  
  return {
    id: '700',
    title: 'Settings',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'THEMES', targetPage: '701', color: 'green' },
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
