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
    const { container } = render(<TeletextScreen page={page} loading={true} theme={mockTheme} />);
    
    const loadingIndicator = container.querySelector('.loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
    // Loading indicator shows rotating character or loading message
    expect(loadingIndicator?.textContent).toBeTruthy();
  });

  it('does not display loading indicator when loading is false', () => {
    const page = createEmptyPage('100', 'Test Page');
    const { container } = render(<TeletextScreen page={page} loading={false} theme={mockTheme} />);
    
    const loadingIndicator = container.querySelector('.loading-indicator');
    expect(loadingIndicator).not.toBeInTheDocument();
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
  // Note: Cached indicator is not displayed in the enhanced version
  // The cache status is handled by the page content itself

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

  it('displays offline indicator when offline', () => {
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

  it('does not display offline indicator when online', () => {
    const page = createEmptyPage('200', 'Fresh Page');
    render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
        isOnline={true}
      />
    );
    
    expect(screen.queryByText('[OFFLINE]')).not.toBeInTheDocument();
  });

  it('does not display offline indicator during loading', () => {
    const page = createEmptyPage('200', 'Loading Page');
    const { container } = render(
      <TeletextScreen 
        page={page} 
        loading={true} 
        theme={mockTheme}
        isOnline={false}
      />
    );
    
    // Loading indicator should be shown
    const loadingIndicator = container.querySelector('.loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
    // But not the offline indicator
    expect(screen.queryByText('[OFFLINE]')).not.toBeInTheDocument();
  });

  // Input buffer display tests - Requirement 16.3
  it('displays input buffer when digits are entered', () => {
    const page = createEmptyPage('200', 'News Page');
    render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
        inputBuffer="12"
        expectedInputLength={3}
      />
    );
    
    expect(screen.getByText('[12_]')).toBeInTheDocument();
  });

  it('does not display input buffer when empty', () => {
    const page = createEmptyPage('200', 'News Page');
    const { container } = render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
        inputBuffer=""
        expectedInputLength={3}
      />
    );
    
    const inputDisplay = container.querySelector('.input-buffer-display');
    expect(inputDisplay).not.toBeInTheDocument();
  });

  it('does not display input buffer during loading', () => {
    const page = createEmptyPage('200', 'News Page');
    const { container } = render(
      <TeletextScreen 
        page={page} 
        loading={true} 
        theme={mockTheme}
        inputBuffer="12"
        expectedInputLength={3}
      />
    );
    
    const inputDisplay = container.querySelector('.input-buffer-display');
    expect(inputDisplay).not.toBeInTheDocument();
  });

  // Input hint tests - Requirement 16.4
  it('displays single-digit input hint when expectedInputLength is 1', () => {
    const page = createEmptyPage('500', 'AI Page');
    render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
        expectedInputLength={1}
      />
    );
    
    expect(screen.getByText('Enter 1-digit option')).toBeInTheDocument();
  });

  it('displays double-digit input hint when expectedInputLength is 2', () => {
    const page = createEmptyPage('200', 'News Page');
    render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
        expectedInputLength={2}
      />
    );
    
    expect(screen.getByText('Enter 2-digit page')).toBeInTheDocument();
  });

  it('does not display input hint for standard 3-digit pages', () => {
    const page = createEmptyPage('200', 'News Page');
    const { container } = render(
      <TeletextScreen 
        page={page} 
        loading={false} 
        theme={mockTheme}
        expectedInputLength={3}
      />
    );
    
    const inputHint = container.querySelector('.input-hint');
    expect(inputHint).not.toBeInTheDocument();
  });

  it('does not display input hint during loading', () => {
    const page = createEmptyPage('500', 'AI Page');
    const { container } = render(
      <TeletextScreen 
        page={page} 
        loading={true} 
        theme={mockTheme}
        expectedInputLength={1}
      />
    );
    
    const inputHint = container.querySelector('.input-hint');
    expect(inputHint).not.toBeInTheDocument();
  });
});
