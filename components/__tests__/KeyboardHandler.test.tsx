import { render, fireEvent } from '@testing-library/react';
import KeyboardHandler from '../KeyboardHandler';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { PageRouterState } from '../PageRouter';
import { TeletextPage } from '@/types/teletext';

// Mock Firebase
jest.mock('@/lib/firebase-client', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: jest.fn(() => Promise.resolve()),
  collection: jest.fn()
}));

describe('KeyboardHandler', () => {
  const mockRouterState: PageRouterState = {
    currentPage: null,
    loading: false,
    inputBuffer: '',
    navigateToPage: jest.fn(),
    handleDigitPress: jest.fn(),
    handleEnter: jest.fn(),
    handleNavigate: jest.fn(),
    handleColorButton: jest.fn(),
    handleFavoriteKey: jest.fn(),
    favoritePages: [],
    canGoBack: false,
    canGoForward: false,
    isOnline: true,
    isCached: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle digit press for normal pages', () => {
    const routerState = { ...mockRouterState };
    render(
      <ThemeProvider>
        <KeyboardHandler routerState={routerState} />
      </ThemeProvider>
    );

    fireEvent.keyDown(window, { key: '1' });
    expect(routerState.handleDigitPress).toHaveBeenCalledWith(1);
  });

  it('should handle theme selection on page 700', async () => {
    const themeSelectionPage: TeletextPage = {
      id: '700',
      title: 'Theme Selection',
      rows: Array(24).fill(''),
      links: [],
      meta: {
        themeSelectionPage: true
      }
    };

    const routerState = { ...mockRouterState, currentPage: themeSelectionPage };

    let currentThemeKey = 'ceefax';
    
    function TestComponent() {
      const { currentThemeKey: themeKey } = useTheme();
      currentThemeKey = themeKey;
      return <KeyboardHandler routerState={routerState} />;
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Press '2' to select ORF theme
    fireEvent.keyDown(window, { key: '2' });

    // Wait for theme to be applied
    await new Promise(resolve => setTimeout(resolve, 100));

    // handleDigitPress should NOT be called on page 700
    expect(routerState.handleDigitPress).not.toHaveBeenCalled();
  });

  it('should handle Enter key', () => {
    const routerState = { ...mockRouterState };
    render(
      <ThemeProvider>
        <KeyboardHandler routerState={routerState} />
      </ThemeProvider>
    );

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(routerState.handleEnter).toHaveBeenCalled();
  });

  it('should handle arrow keys', () => {
    const routerState = { ...mockRouterState };
    render(
      <ThemeProvider>
        <KeyboardHandler routerState={routerState} />
      </ThemeProvider>
    );

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(routerState.handleNavigate).toHaveBeenCalledWith('up');

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(routerState.handleNavigate).toHaveBeenCalledWith('down');

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(routerState.handleNavigate).toHaveBeenCalledWith('back');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(routerState.handleNavigate).toHaveBeenCalledWith('forward');
  });

  it('should handle color buttons', () => {
    const routerState = { ...mockRouterState };
    render(
      <ThemeProvider>
        <KeyboardHandler routerState={routerState} />
      </ThemeProvider>
    );

    fireEvent.keyDown(window, { key: 'r' });
    expect(routerState.handleColorButton).toHaveBeenCalledWith('red');

    fireEvent.keyDown(window, { key: 'g' });
    expect(routerState.handleColorButton).toHaveBeenCalledWith('green');

    fireEvent.keyDown(window, { key: 'y' });
    expect(routerState.handleColorButton).toHaveBeenCalledWith('yellow');

    fireEvent.keyDown(window, { key: 'b' });
    expect(routerState.handleColorButton).toHaveBeenCalledWith('blue');
  });

  it('should handle backspace as back navigation', () => {
    const routerState = { ...mockRouterState };
    render(
      <ThemeProvider>
        <KeyboardHandler routerState={routerState} />
      </ThemeProvider>
    );

    fireEvent.keyDown(window, { key: 'Backspace' });
    expect(routerState.handleNavigate).toHaveBeenCalledWith('back');
  });

  it('should not trigger theme selection on non-700 pages', () => {
    const normalPage: TeletextPage = {
      id: '200',
      title: 'News',
      rows: Array(24).fill(''),
      links: []
    };

    const routerState = { ...mockRouterState, currentPage: normalPage };
    render(
      <ThemeProvider>
        <KeyboardHandler routerState={routerState} />
      </ThemeProvider>
    );

    // Press '1' - should trigger normal digit press
    fireEvent.keyDown(window, { key: '1' });
    expect(routerState.handleDigitPress).toHaveBeenCalledWith(1);
  });
});
