'use client';

import { useState, useEffect } from 'react';
import TeletextScreen from '@/components/TeletextScreen';
import CRTFrame from '@/components/CRTFrame';
import PageRouter from '@/components/PageRouter';
import BootSequence from '@/components/BootSequence';
import PerformanceDebug from '@/components/PerformanceDebug';
import KeyboardHandler from '@/components/KeyboardHandler';
import { ThemeProvider, useTheme, themes } from '@/lib/theme-context';
import { TeletextPage } from '@/types/teletext';
import { createEmptyPage, padText } from '@/lib/teletext-utils';
import { validateEnvironmentVariablesWithWarnings } from '@/lib/env-validation';

// Demo page with welcome message after boot
// Requirements: 34.2, 34.3 - Full-width layout with centered titles
const createDemoPage = (showWelcome: boolean = false): TeletextPage => {
  const page = createEmptyPage('100', 'MODERN TELETEXT');
  
  // Helper function to center text
  const centerText = (text: string, width: number = 40): string => {
    if (text.length >= width) return text.slice(0, width);
    const padding = width - text.length;
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
  };
  
  page.rows = [
    padText('{white}' + centerText('MODERN TELETEXT', 32) + '    P100', 40),
    padText('════════════════════════════════════════', 40),
    padText('', 40),
    showWelcome 
      ? padText('{green}' + centerText('★ SYSTEM READY - WELCOME! ★', 40), 40)
      : padText('{yellow}' + centerText('Welcome to Modern Teletext!', 40), 40),
    padText('', 40),
    padText('{white}' + centerText('A modern web application that', 40), 40),
    padText(centerText('resurrects classic teletext', 40), 40),
    padText(centerText('with contemporary capabilities', 40), 40),
    padText('', 40),
    padText('{cyan}' + centerText('★ MAGAZINES ★', 40), 40),
    padText('', 40),
    padText('  {green}101 {white}System Info & Help', 40),
    padText('  {green}200 {white}News & Headlines', 40),
    padText('  {green}300 {white}Sports & Scores', 40),
    padText('  {green}400 {white}Markets & Finance', 40),
    padText('  {green}500 {white}AI Oracle Assistant', 40),
    padText('  {green}600 {white}Games & Quizzes', 40),
    padText('  {green}700 {white}Settings & Themes', 40),
    padText('  {green}800 {white}Developer Tools', 40),
    padText('', 40),
    padText('', 40),
    padText('{yellow}' + centerText('Use remote or keyboard to navigate', 40), 40),
    padText('', 40),
    padText('{red}NEWS {green}SPORT {yellow}MARKETS {blue}AI', 40)
  ];
  
  page.links = [
    { label: 'NEWS', targetPage: '200', color: 'red' },
    { label: 'SPORT', targetPage: '300', color: 'green' },
    { label: 'MARKETS', targetPage: '400', color: 'yellow' },
    { label: 'AI', targetPage: '500', color: 'blue' }
  ];
  
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
    <main className="w-screen h-screen overflow-hidden bg-gray-900 m-0 p-0 relative">
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
                isCached={routerState.isCached}
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
                  {routerState.inputBuffer.length < 3 && <span style={{ color: '#666' }}>{'_'.repeat(3 - routerState.inputBuffer.length)}</span>}
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
