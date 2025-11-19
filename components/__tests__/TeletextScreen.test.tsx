import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeletextScreen from '../TeletextScreen';
import { TeletextPage, ThemeConfig } from '@/types/teletext';
import { createEmptyPage, padText } from '@/lib/teletext-utils';

const mockTheme: ThemeConfig = {
  name: 'Test Theme',
  colors: {
    background: '#000000',
    text: '#ffffff',
    red: '#ff0000',
    green: '#00ff00',
    yellow: '#ffff00',
    blue: '#0000ff',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    white: '#ffffff'
  },
  effects: {
    scanlines: false,
    curvature: false,
    noise: false,
    glitch: false
  }
};

describe('TeletextScreen Component', () => {
  it('renders a 40×24 character grid', () => {
    const page = createEmptyPage('100', 'Test Page');
    const { container } = render(
      <TeletextScreen page={page} loading={false} theme={mockTheme} />
    );
    
    const rows = container.querySelectorAll('.teletext-row');
    expect(rows).toHaveLength(24);
  });

  it('displays loading indicator when loading is true', () => {
    const page = createEmptyPage('100', 'Test Page');
    render(<TeletextScreen page={page} loading={true} theme={mockTheme} />);
    
    expect(screen.getByText('LOADING...')).toBeInTheDocument();
  });

  it('does not display loading indicator when loading is false', () => {
    const page = createEmptyPage('100', 'Test Page');
    render(<TeletextScreen page={page} loading={false} theme={mockTheme} />);
    
    expect(screen.queryByText('LOADING...')).not.toBeInTheDocument();
  });

  it('applies theme colors correctly', () => {
    const page = createEmptyPage('100', 'Test Page');
    const { container } = render(
      <TeletextScreen page={page} loading={false} theme={mockTheme} />
    );
    
    const screen = container.querySelector('.teletext-screen');
    expect(screen).toHaveStyle({
      backgroundColor: mockTheme.colors.background,
      color: mockTheme.colors.text
    });
  });

  it('parses color codes in text', () => {
    const page = createEmptyPage('100', 'Test Page');
    page.rows[0] = padText('{red}Red text {green}Green text', 40);
    
    const { container } = render(
      <TeletextScreen page={page} loading={false} theme={mockTheme} />
    );
    
    const spans = container.querySelectorAll('.teletext-row span');
    expect(spans.length).toBeGreaterThan(0);
  });

  it('uses monospaced font', () => {
    const page = createEmptyPage('100', 'Test Page');
    const { container } = render(
      <TeletextScreen page={page} loading={false} theme={mockTheme} />
    );
    
    const screen = container.querySelector('.teletext-screen');
    const fontFamily = screen?.getAttribute('style');
    expect(fontFamily).toContain('Courier');
  });

  // Offline support tests - Requirement 13.4
  it('displays cached indicator when isCached is true', () => {
    const page = createEmptyPage('200', 'Cached Page');
    render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
        isCached={true}
      />
    );
    
    expect(screen.getByText('[CACHED]')).toBeInTheDocument();
  });

  it('displays cached indicator when page meta has cached status', () => {
    const page = createEmptyPage('200', 'Cached Page');
    page.meta = { cacheStatus: 'cached' };
    
    render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
      />
    );
    
    expect(screen.getByText('[CACHED]')).toBeInTheDocument();
  });

  it('displays offline indicator when isOnline is false', () => {
    const page = createEmptyPage('200', 'Offline Page');
    render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
        isOnline={false}
      />
    );
    
    expect(screen.getByText('[OFFLINE]')).toBeInTheDocument();
  });

  it('displays both cached and offline indicators when appropriate', () => {
    const page = createEmptyPage('200', 'Offline Cached Page');
    render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
        isOnline={false}
        isCached={true}
      />
    );
    
    expect(screen.getByText('[CACHED]')).toBeInTheDocument();
    expect(screen.getByText('[OFFLINE]')).toBeInTheDocument();
  });

  it('does not display indicators when online and not cached', () => {
    const page = createEmptyPage('200', 'Fresh Page');
    render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
        isOnline={true}
        isCached={false}
      />
    );
    
    expect(screen.queryByText('[CACHED]')).not.toBeInTheDocument();
    expect(screen.queryByText('[OFFLINE]')).not.toBeInTheDocument();
  });

  it('does not display indicators during loading', () => {
    const page = createEmptyPage('200', 'Loading Page');
    render(
      <TeletextScreen 
        page={page} 
        loading={true} 
        theme={mockTheme}
        isOnline={false}
        isCached={true}
      />
    );
    
    // Loading indicator should be shown
    expect(screen.getByText('LOADING...')).toBeInTheDocument();
    // But not the cached/offline indicators
    expect(screen.queryByText('[CACHED]')).not.toBeInTheDocument();
    expect(screen.queryByText('[OFFLINE]')).not.toBeInTheDocument();
  });
});
