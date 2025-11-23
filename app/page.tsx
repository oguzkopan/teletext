'use client';

import { useState, useEffect } from 'react';
import TeletextScreen from '@/components/TeletextScreen';
import CRTFrame from '@/components/CRTFrame';
import PageRouter from '@/components/PageRouter';
import BootSequence from '@/components/BootSequence';
import PerformanceDebug from '@/components/PerformanceDebug';
import KeyboardHandler from '@/components/KeyboardHandler';
import HalloweenDecorations from '@/components/HalloweenDecorations';
import { ThemeProvider, useTheme, themes } from '@/lib/theme-context';
import { TeletextPage } from '@/types/teletext';
import { createEmptyPage, padText } from '@/lib/teletext-utils';
import { validateEnvironmentVariablesWithWarnings } from '@/lib/env-validation';

// Demo page with welcome message after boot
// Requirements: 34.2, 34.3 - Full-width layout with centered titles
// HALLOWEEN HACKATHON EDITION - Colorful spooky theme
const createDemoPage = (showWelcome: boolean = false): TeletextPage => {
  const page = createEmptyPage('100', 'KIROWEEN TELETEXT');
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { 
    weekday: 'short', 
    day: '2-digit', 
    month: 'short' 
  });
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Full-screen multi-column layout like Ceefax with ASCII art logo
  page.rows = [
    `{cyan}100 {yellow}🎃 KIROWEEN TELETEXT 🎃{cyan} ${dateStr} ${timeStr} {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    showWelcome 
      ? '{green}                    👻 SYSTEM READY - WELCOME! 👻                              '
      : '{yellow}╔══════════════════════════════════════════════════════════════════════════╗',
    showWelcome
      ? '{blue}═══════════════════════════════════════════════════════════════════════════════'
      : '{yellow}║  {magenta}MODERN TELETEXT{yellow}  {white}░▒▓█▓▒░  {cyan}Your Gateway to Information{yellow}           ║',
    showWelcome
      ? ''
      : '{yellow}╚══════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{cyan}▓▓▓ NEWS & INFO ▓▓▓      {magenta}▓▓▓ ENTERTAINMENT ▓▓▓    {yellow}▓▓▓ SERVICES ▓▓▓       ',
    '{green}101{white} System Status       {red}600{white} Games & Quizzes      {cyan}700{white} Settings          ',
    '{green}200{white} News Headlines      {red}601{white} Quiz of the Day      {cyan}701{white} Themes            ',
    '{green}201{white} UK News             {red}610{white} Bamboozle Quiz       {cyan}800{white} Dev Tools         ',
    '{green}202{white} World News          {red}620{white} Random Facts         {cyan}999{white} Help              ',
    '{green}203{white} Local News          {yellow}500{white} AI Chat             {magenta}666{white} Cursed Page       ',
    '{blue}───────────────────────────────────────────────────────────────────────────────',
    '{cyan}▓▓▓ SPORT & LEISURE ▓▓▓  {yellow}▓▓▓ MARKETS & MONEY ▓▓▓  {red}▓▓▓ WEATHER & TRAVEL ▓▓',
    '{green}300{white} Sport Headlines     {green}400{white} Markets Overview    {green}420{white} Weather Forecast  ',
    '{green}301{white} Football            {green}401{white} Stock Prices        {green}421{white} London Weather    ',
    '{green}302{white} Cricket             {green}402{white} Crypto Markets      {green}422{white} New York Weather  ',
    '{green}303{white} Tennis              {green}403{white} Commodities         {green}423{white} Tokyo Weather     ',
    '{green}304{white} Live Scores         {green}404{white} Void Page           {green}424{white} Traffic Info      ',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{cyan}🎃 NAVIGATION: {white}Type {yellow}3-digit{white} page number or use {red}R{white}/{green}G{white}/{yellow}Y{white}/{blue}B{white} buttons',
    '{white}Press {cyan}999{white} for help • Press {magenta}666{white} if you dare... 👻',
    '{blue}───────────────────────────────────────────────────────────────────────────────',
    '{yellow}POPULAR PAGES: {green}200{white} News {green}300{white} Sport {green}400{white} Markets {green}500{white} AI {green}600{white} Games',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{yellow}                    ⚡ Kiroween 2024 - Built with Kiro ⚡                       '
  ];
  
  page.links = [
    { label: 'NEWS', targetPage: '200', color: 'red' },
    { label: 'SPORT', targetPage: '300', color: 'green' },
    { label: 'WEATHER', targetPage: '420', color: 'yellow' },
    { label: 'AI', targetPage: '500', color: 'blue' }
  ];
  
  page.meta = {
    ...page.meta,
    halloweenTheme: true,
    fullScreenLayout: true
  };
  
  return page;
};

function HomeContent() {
  const { currentTheme, confirmationMessage } = useTheme();
  const [showBoot, setShowBoot] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentPage, setCurrentPage] = useState<TeletextPage | null>(null);

  // Validate environment variables on startup
  // Requirements: 38.3, 38.4
  // TEMPORARILY DISABLED - Environment variables not loading from .env.local
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log('\n🔍 Validating environment variables...\n');
  //     validateEnvironmentVariablesWithWarnings();
  //     console.log('\n');
  //   }
  // }, []);

  // Check if boot sequence has been shown in this session
  useEffect(() => {
    const bootShown = sessionStorage.getItem('bootSequenceShown');
    if (bootShown === 'true') {
      setShowBoot(false);
    }
  }, []);

  const handleBootComplete = () => {
    setShowBoot(false);
    setShowWelcome(true);
    sessionStorage.setItem('bootSequenceShown', 'true');
    
    // Remove welcome message after 5 seconds
    setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
  };

  // Override theme for haunting pages (404, 666)
  // Requirements: 36.1, 36.2, 36.3, 36.4, 36.5
  const effectiveTheme = currentPage?.meta?.haunting ? themes.haunting : currentTheme;

  // Show boot sequence on first load
  if (showBoot) {
    return (
      <BootSequence 
        onComplete={handleBootComplete}
        theme={{
          background: currentTheme.colors.background,
          text: currentTheme.colors.text,
          green: currentTheme.colors.green
        }}
      />
    );
  }

  return (
    <main className="w-screen h-screen overflow-hidden bg-black m-0 p-0 relative" style={{ width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }}>
      {/* Halloween decorations for Kiroween Hackathon */}
      <HalloweenDecorations />
      
      <PageRouter 
        initialPage={createDemoPage(showWelcome)}
        onPageChange={(page) => setCurrentPage(page)}
      >
        {(routerState) => (
          <>
            <KeyboardHandler routerState={routerState} />
            <CRTFrame 
              effects={effectiveTheme.effects}
              hauntingMode={currentPage?.meta?.haunting || false}
            >
              <TeletextScreen 
                page={routerState.currentPage || createDemoPage(showWelcome)} 
                loading={routerState.loading} 
                theme={effectiveTheme}
                isOnline={routerState.isOnline}
                inputBuffer={routerState.inputBuffer}
                expectedInputLength={routerState.expectedInputLength}
              />
            </CRTFrame>
            


            {/* On-screen input display - always show when there's input */}
            {routerState.inputBuffer && routerState.inputBuffer.length > 0 && (
              <div 
                style={{
                  position: 'fixed',
                  bottom: '32px',
                  right: '32px',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '4px solid #ffff00',
                  borderRadius: '12px',
                  padding: '24px',
                  zIndex: 9999,
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '32px',
                  color: '#ffff00',
                  minWidth: '150px',
                  textAlign: 'center',
                  boxShadow: '0 0 30px rgba(255, 255, 0, 0.8), inset 0 0 20px rgba(255, 255, 0, 0.2)',
                  pointerEvents: 'none'
                }}
              >
                <div style={{ fontSize: '16px', marginBottom: '8px', color: '#00ff00', fontWeight: 'bold' }}>
                  PAGE NUMBER:
                </div>
                <div style={{ letterSpacing: '12px', fontSize: '48px', fontWeight: 'bold' }}>
                  {routerState.inputBuffer}
                  {routerState.inputBuffer.length < routerState.expectedInputLength && <span style={{ color: '#666' }}>{'_'.repeat(routerState.expectedInputLength - routerState.inputBuffer.length)}</span>}
                </div>
              </div>
            )}

            {/* Theme confirmation message - Requirement: 37.3 */}
            {confirmationMessage && (
              <div 
                style={{
                  position: 'fixed',
                  top: '32px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 170, 0, 0.95)',
                  border: '4px solid #00ff00',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  zIndex: 9999,
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '24px',
                  color: '#ffffff',
                  textAlign: 'center',
                  boxShadow: '0 0 30px rgba(0, 255, 0, 0.8), inset 0 0 20px rgba(0, 255, 0, 0.2)',
                  pointerEvents: 'none',
                  animation: 'fadeInOut 3s ease-in-out'
                }}
              >
                ✓ {confirmationMessage}
              </div>
            )}
          </>
        )}
      </PageRouter>
      
      {/* Performance debug overlay (Ctrl+Shift+P in dev mode) */}
      <PerformanceDebug />
      
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          10% { opacity: 1; transform: translateX(-50%) translateY(0); }
          90% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
      `}</style>
    </main>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
