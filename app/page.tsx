'use client';

import { useState, useEffect } from 'react';
import TeletextScreen from '@/components/TeletextScreen';
import CRTFrame from '@/components/CRTFrame';
import PageRouter from '@/components/PageRouter';
import BootSequence from '@/components/BootSequence';
import PerformanceDebug from '@/components/PerformanceDebug';
import KeyboardHandler from '@/components/KeyboardHandler';
import { TeletextPage, ThemeConfig } from '@/types/teletext';
import { createEmptyPage, padText } from '@/lib/teletext-utils';

// Default theme (Classic Ceefax style)
const defaultTheme: ThemeConfig = {
  name: 'Classic Ceefax',
  colors: {
    background: '#0000aa',
    text: '#ffff00',
    red: '#ff0000',
    green: '#00ff00',
    yellow: '#ffff00',
    blue: '#0000ff',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    white: '#ffffff'
  },
  effects: {
    scanlines: true,
    curvature: true,
    noise: true,
    glitch: false
  }
};

// Demo page with welcome message after boot
const createDemoPage = (showWelcome: boolean = false): TeletextPage => {
  const page = createEmptyPage('100', 'MODERN TELETEXT');
  
  page.rows = [
    padText('{white}MODERN TELETEXT              P100', 40),
    padText('════════════════════════════════════════', 40),
    padText('', 40),
    showWelcome 
      ? padText('{green}★ SYSTEM READY - WELCOME! ★', 40)
      : padText('{yellow}Welcome to Modern Teletext!', 40),
    padText('', 40),
    padText('{white}A modern web application that', 40),
    padText('resurrects classic teletext technology', 40),
    padText('with contemporary capabilities.', 40),
    padText('', 40),
    padText('{cyan}MAGAZINES:', 40),
    padText('', 40),
    padText('{green}1xx {white}System Pages', 40),
    padText('{green}2xx {white}News & Headlines', 40),
    padText('{green}3xx {white}Sports & Scores', 40),
    padText('{green}4xx {white}Markets & Finance', 40),
    padText('{green}5xx {white}AI Oracle', 40),
    padText('{green}6xx {white}Games & Quizzes', 40),
    padText('{green}7xx {white}Settings & Themes', 40),
    padText('{green}8xx {white}Developer Tools', 40),
    padText('', 40),
    padText('', 40),
    padText('{yellow}Use the remote or keyboard to navigate', 40),
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

export default function Home() {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [showBoot, setShowBoot] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentPage, setCurrentPage] = useState<TeletextPage | null>(null);

  // Check if boot sequence has been shown in this session
  useEffect(() => {
    const bootShown = sessionStorage.getItem('bootSequenceShown');
    if (bootShown === 'true') {
      setShowBoot(false);
    }
  }, []);

  // Update theme effects based on page metadata (haunting mode for 404/666)
  useEffect(() => {
    if (currentPage?.meta?.haunting) {
      setTheme(prev => ({
        ...prev,
        effects: {
          ...prev.effects,
          glitch: true,
          noise: true
        }
      }));
    } else {
      setTheme(prev => ({
        ...prev,
        effects: {
          ...defaultTheme.effects
        }
      }));
    }
  }, [currentPage]);

  const handleBootComplete = () => {
    setShowBoot(false);
    setShowWelcome(true);
    sessionStorage.setItem('bootSequenceShown', 'true');
    
    // Remove welcome message after 5 seconds
    setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
  };

  // Show boot sequence on first load
  if (showBoot) {
    return (
      <BootSequence 
        onComplete={handleBootComplete}
        theme={{
          background: theme.colors.background,
          text: theme.colors.text,
          green: theme.colors.green
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
            <CRTFrame effects={theme.effects}>
              <TeletextScreen 
                page={routerState.currentPage || createDemoPage(showWelcome)} 
                loading={routerState.loading} 
                theme={theme}
                isOnline={routerState.isOnline}
                isCached={routerState.isCached}
              />
            </CRTFrame>
            
            {/* On-screen input display */}
            {routerState.inputBuffer && (
              <div 
                className="fixed bottom-8 right-8 bg-black bg-opacity-80 border-4 border-yellow-400 rounded-lg px-6 py-4 z-50"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '32px',
                  color: '#ffff00',
                  minWidth: '120px',
                  textAlign: 'center',
                  boxShadow: '0 0 20px rgba(255, 255, 0, 0.5)'
                }}
              >
                <div style={{ fontSize: '16px', marginBottom: '4px', color: '#00ff00' }}>
                  PAGE:
                </div>
                <div style={{ letterSpacing: '8px' }}>
                  {routerState.inputBuffer}
                  {routerState.inputBuffer.length < 3 && '_'.repeat(3 - routerState.inputBuffer.length)}
                </div>
              </div>
            )}
            
            {/* Keyboard shortcuts help - shows on first load */}
            <div 
              className="fixed bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded text-sm z-40"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '12px'
              }}
            >
              <div style={{ color: '#00ff00', marginBottom: '4px' }}>KEYBOARD SHORTCUTS:</div>
              <div>0-9: Enter page number</div>
              <div>Arrow Keys: Navigate</div>
              <div>R/G/Y/B: Color buttons</div>
              <div>Backspace: Go back</div>
            </div>
          </>
        )}
      </PageRouter>
      
      {/* Performance debug overlay (Ctrl+Shift+P in dev mode) */}
      <PerformanceDebug />
    </main>
  );
}
