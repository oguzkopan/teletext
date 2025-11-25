import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PageRouter from '../PageRouter';
import { TeletextPage } from '@/types/teletext';
import { createEmptyPage } from '@/lib/teletext-utils';

// Mock fetch
global.fetch = jest.fn();

const mockPage100: TeletextPage = {
  ...createEmptyPage('100', 'Test Page 100'),
  links: [
    { label: 'NEWS', targetPage: '200', color: 'red' },
    { label: 'SPORT', targetPage: '300', color: 'green' }
  ]
};

const mockPage200: TeletextPage = {
  ...createEmptyPage('200', 'Test Page 200'),
  links: []
};

const mockPage101: TeletextPage = {
  ...createEmptyPage('101', 'Test Page 101'),
  links: []
};

describe('PageRouter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      const pageId = url.split('/').pop();
      const pages: Record<string, TeletextPage> = {
        '100': mockPage100,
        '200': mockPage200,
        '101': mockPage101
      };
      
      return Promise.resolve({
        ok: true,
        headers: {
          get: () => null
        },
        json: () => Promise.resolve({ page: pages[pageId as string] })
      });
    });
    
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });
    
    // Mock localStorage for browser cache
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });
  });

  it('should render with initial page', () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div data-testid="page-id">{state.currentPage?.id}</div>
        )}
      </PageRouter>
    );

    expect(screen.getByTestId('page-id')).toHaveTextContent('100');
  });


  it('should handle digit press and build input buffer', () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="input-buffer">{state.inputBuffer}</div>
            <button onClick={() => state.handleDigitPress(2)}>Press 2</button>
            <button onClick={() => state.handleDigitPress(0)}>Press 0</button>
          </div>
        )}
      </PageRouter>
    );

    const press2 = screen.getByText('Press 2');
    const press0 = screen.getByText('Press 0');
    
    fireEvent.click(press2);
    expect(screen.getByTestId('input-buffer')).toHaveTextContent('2');
    
    fireEvent.click(press0);
    expect(screen.getByTestId('input-buffer')).toHaveTextContent('20');
  });

  it('should validate page numbers (100-899 range)', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <button onClick={() => state.navigateToPage('050')}>
            Navigate to 050
          </button>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('Navigate to 050'));
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Invalid page number: 050');
    });
    
    consoleSpy.mockRestore();
  });

  it('should navigate back in history', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <button onClick={() => state.navigateToPage('200')}>Go to 200</button>
            <button onClick={() => state.handleNavigate('back')}>Back</button>
            <div data-testid="can-go-back">{state.canGoBack.toString()}</div>
          </div>
        )}
      </PageRouter>
    );

    expect(screen.getByTestId('can-go-back')).toHaveTextContent('false');
    
    fireEvent.click(screen.getByText('Go to 200'));
    
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('200');
      expect(screen.getByTestId('can-go-back')).toHaveTextContent('true');
    });
    
    fireEvent.click(screen.getByText('Back'));
    
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('100');
    });
  });


  it('should navigate forward in history', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <button onClick={() => state.navigateToPage('200')}>Go to 200</button>
            <button onClick={() => state.handleNavigate('back')}>Back</button>
            <button onClick={() => state.handleNavigate('forward')}>Forward</button>
            <div data-testid="can-go-forward">{state.canGoForward.toString()}</div>
          </div>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('Go to 200'));
    await waitFor(() => expect(screen.getByTestId('page-id')).toHaveTextContent('200'));
    
    fireEvent.click(screen.getByText('Back'));
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('100');
      expect(screen.getByTestId('can-go-forward')).toHaveTextContent('true');
    });
    
    fireEvent.click(screen.getByText('Forward'));
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('200');
    });
  });

  it('should not navigate up when page has no continuation', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <button onClick={() => state.handleNavigate('up')}>Channel Up</button>
          </div>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('Channel Up'));
    
    // Should remain on same page since there's no continuation
    // Requirement 35.3: Up arrow only works for multi-page navigation
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('100');
    });
  });

  it('should not navigate down when page has no continuation', async () => {
    render(
      <PageRouter initialPage={mockPage101}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <button onClick={() => state.handleNavigate('down')}>Channel Down</button>
          </div>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('Channel Down'));
    
    // Should remain on same page since there's no continuation
    // Requirement 35.2: Down arrow only works for multi-page navigation
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('101');
    });
  });


  it('should handle colored Fastext button navigation', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <button onClick={() => state.handleColorButton('red')}>Red Button</button>
            <button onClick={() => state.handleColorButton('green')}>Green Button</button>
          </div>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('Red Button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('200');
    });
  });

  it('should handle Enter key with complete input', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <div data-testid="input-buffer">{state.inputBuffer}</div>
            <button onClick={() => state.handleDigitPress(2)}>2</button>
            <button onClick={() => state.handleDigitPress(0)}>0</button>
            <button onClick={() => state.handleEnter()}>Enter</button>
          </div>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('0'));
    
    // After 2 digits, buffer should show "20"
    expect(screen.getByTestId('input-buffer')).toHaveTextContent('20');
    
    fireEvent.click(screen.getByText('0'));
    
    // After 3 digits, auto-navigation should occur and buffer should be cleared
    // Requirement 7.3: Auto-navigate when buffer is full
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('200');
      expect(screen.getByTestId('input-buffer')).toHaveTextContent('');
    });
  });

  it('should show loading state during navigation', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="loading">{state.loading.toString()}</div>
            <button onClick={() => state.navigateToPage('200')}>Navigate</button>
          </div>
        )}
      </PageRouter>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    
    fireEvent.click(screen.getByText('Navigate'));
    
    // Should show loading during fetch
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('should provide default favorite pages', () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="favorites">{JSON.stringify(state.favoritePages)}</div>
          </div>
        )}
      </PageRouter>
    );

    const favorites = JSON.parse(screen.getByTestId('favorites').textContent || '[]');
    expect(favorites).toHaveLength(10);
    expect(favorites[0]).toBe('100'); // Index
    expect(favorites[1]).toBe('200'); // News
    expect(favorites[2]).toBe('300'); // Sport
    expect(favorites[3]).toBe('400'); // Markets
    expect(favorites[4]).toBe('500'); // AI Oracle
  });

  it('should navigate to favorite page when handleFavoriteKey is called', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <button onClick={() => state.handleFavoriteKey(1)}>F2 (News)</button>
          </div>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('F2 (News)'));
    
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('200');
    });
  });

  it('should not navigate if favorite page is not set', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <button onClick={() => state.handleFavoriteKey(5)}>F6 (Not set)</button>
          </div>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('F6 (Not set)'));
    
    // Should remain on page 100
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('100');
    });
  });

  it('should handle out of range favorite key index', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <button onClick={() => state.handleFavoriteKey(15)}>Invalid Index</button>
          </div>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('Invalid Index'));
    
    // Should remain on page 100
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('100');
    });
  });

  it('should validate sub-page format (e.g., 202-1)', async () => {
    const mockSubPage: TeletextPage = {
      ...createEmptyPage('202-1', 'Article 1'),
      links: []
    };

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      const pageId = url.split('/').pop();
      if (pageId === '202-1') {
        return Promise.resolve({
          ok: true,
          headers: { get: () => null },
          json: () => Promise.resolve({ page: mockSubPage })
        });
      }
      return Promise.resolve({
        ok: true,
        headers: { get: () => null },
        json: () => Promise.resolve({ page: mockPage100 })
      });
    });

    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <button onClick={() => state.navigateToPage('202-1')}>Go to 202-1</button>
          </div>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('Go to 202-1'));

    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('202-1');
    });
  });

  it('should reject invalid sub-page format', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <button onClick={() => state.navigateToPage('202-0')}>Invalid Sub-page</button>
          </div>
        )}
      </PageRouter>
    );

    fireEvent.click(screen.getByText('Invalid Sub-page'));

    // Should remain on page 100 (invalid sub-page index 0)
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('100');
    });
  });

  it('should highlight breadcrumb on back navigation', async () => {
    render(
      <PageRouter initialPage={mockPage100}>
        {(state) => (
          <div>
            <div data-testid="page-id">{state.currentPage?.id}</div>
            <div data-testid="highlight-breadcrumb">{state.highlightBreadcrumb.toString()}</div>
            <button onClick={() => state.navigateToPage('200')}>Go to 200</button>
            <button onClick={() => state.handleNavigate('back')}>Back</button>
          </div>
        )}
      </PageRouter>
    );

    // Initially no highlight
    expect(screen.getByTestId('highlight-breadcrumb')).toHaveTextContent('false');
    
    // Navigate to page 200
    fireEvent.click(screen.getByText('Go to 200'));
    await waitFor(() => expect(screen.getByTestId('page-id')).toHaveTextContent('200'));
    
    // Navigate back - should highlight breadcrumb
    fireEvent.click(screen.getByText('Back'));
    
    // Should briefly show highlight
    expect(screen.getByTestId('highlight-breadcrumb')).toHaveTextContent('true');
    
    // Wait for navigation to complete and highlight to clear
    await waitFor(() => {
      expect(screen.getByTestId('page-id')).toHaveTextContent('100');
    }, { timeout: 1000 });
  });
});
