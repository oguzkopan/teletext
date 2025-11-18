'use client';

import { useState } from 'react';
import TeletextScreen from '@/components/TeletextScreen';
import CRTFrame from '@/components/CRTFrame';
import RemoteInterface from '@/components/RemoteInterface';
import PageRouter from '@/components/PageRouter';
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

// Demo page
const createDemoPage = (): TeletextPage => {
  const page = createEmptyPage('100', 'MODERN TELETEXT');
  
  page.rows = [
    padText('{white}MODERN TELETEXT              P100', 40),
    padText('════════════════════════════════════════', 40),
    padText('', 40),
    padText('{yellow}Welcome to Modern Teletext!', 40),
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
  const [theme] = useState<ThemeConfig>(defaultTheme);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900">
      <PageRouter initialPage={createDemoPage()}>
        {(routerState) => (
          <div className="flex gap-8 items-start">
            <CRTFrame effects={theme.effects}>
              <TeletextScreen 
                page={routerState.currentPage || createDemoPage()} 
                loading={routerState.loading} 
                theme={theme} 
              />
            </CRTFrame>
            
            <RemoteInterface
              onDigitPress={routerState.handleDigitPress}
              onNavigate={routerState.handleNavigate}
              onColorButton={routerState.handleColorButton}
              onEnter={routerState.handleEnter}
              currentInput={routerState.inputBuffer}
            />
          </div>
        )}
      </PageRouter>
    </main>
  );
}
