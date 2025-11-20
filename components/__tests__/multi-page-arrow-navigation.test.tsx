/**
 * Multi-page Arrow Navigation Tests
 * 
 * Tests for arrow key navigation with continuation metadata.
 * Requirements: 35.2, 35.3
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import PageRouter from '../PageRouter';
import { TeletextPage } from '@/types/teletext';

// Mock the hooks
jest.mock('@/hooks/useOfflineSupport', () => ({
  useOfflineSupport: () => ({
    isOnline: true,
    serviceWorkerReady: false,
    cachePage: jest.fn()
  }),
  useBrowserCache: () => ({
    savePage: jest.fn(),
    loadPage: jest.fn(() => null)
  })
}));

jest.mock('@/hooks/usePagePreload', () => ({
  usePagePreload: jest.fn()
}));

jest.mock('@/hooks/useRequestCancellation', () => ({
  useRequestCancellation: () => ({
    createCancellableRequest: jest.fn(() => new AbortController()),
    clearRequest: jest.fn(),
    isRequestActive: jest.fn(() => true)
  })
}));

// Mock fetch
global.fetch = jest.fn();

describe('Multi-page Arrow Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to next page when down arrow is pressed on page with continuation', async () => {
    const mockPage1: TeletextPage = {
      id: '201',
      title: 'Test Page 1',
      rows: Array(24).fill('').map(() => ' '.repeat(40)),
      links: [],
      meta: {
        continuation: {
          currentPage: '201',
          nextPage: '201-2',
          previousPage: undefined,
          totalPages: 2,
          currentIndex: 0
        }
      }
    };

    const mockPage2: TeletextPage = {
      id: '201-2',
      title: 'Test Page 2',
      rows: Array(24).fill('').map(() => ' '.repeat(40)),
      links: [],
      meta: {
        continuation: {
          currentPage: '201-2',
          nextPage: undefined,
          previousPage: '201',
          totalPages: 2,
          currentIndex: 1
        }
      }
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ page: mockPage1 }),
        headers: new Headers()
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ page: mockPage2 }),
        headers: new Headers()
      });

    let routerState: any;
    
    render(
      <PageRouter initialPage={mockPage1}>
        {(state) => {
          routerState = state;
          return <div data-testid="test-content" />;
        }}
      </PageRouter>
    );

    await waitFor(() => {
      expect(routerState.currentPage).toBeDefined();
    });

    // Verify initial page
    expect(routerState.currentPage?.id).toBe('201');
    expect(routerState.currentPage?.meta?.continuation?.nextPage).toBe('201-2');

    // Simulate down arrow press (navigate to next page in continuation)
    routerState.handleNavigate('down');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/page/201-2', expect.any(Object));
    });
  });

  it('should navigate to previous page when up arrow is pressed on continuation page', async () => {
    const mockPage2: TeletextPage = {
      id: '201-2',
      title: 'Test Page 2',
      rows: Array(24).fill('').map(() => ' '.repeat(40)),
      links: [],
      meta: {
        continuation: {
          currentPage: '201-2',
          nextPage: undefined,
          previousPage: '201',
          totalPages: 2,
          currentIndex: 1
        }
      }
    };

    const mockPage1: TeletextPage = {
      id: '201',
      title: 'Test Page 1',
      rows: Array(24).fill('').map(() => ' '.repeat(40)),
      links: [],
      meta: {
        continuation: {
          currentPage: '201',
          nextPage: '201-2',
          previousPage: undefined,
          totalPages: 2,
          currentIndex: 0
        }
      }
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ page: mockPage2 }),
        headers: new Headers()
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ page: mockPage1 }),
        headers: new Headers()
      });

    let routerState: any;
    
    render(
      <PageRouter initialPage={mockPage2}>
        {(state) => {
          routerState = state;
          return <div data-testid="test-content" />;
        }}
      </PageRouter>
    );

    await waitFor(() => {
      expect(routerState.currentPage).toBeDefined();
    });

    // Verify initial page
    expect(routerState.currentPage?.id).toBe('201-2');
    expect(routerState.currentPage?.meta?.continuation?.previousPage).toBe('201');

    // Simulate up arrow press (navigate to previous page in continuation)
    routerState.handleNavigate('up');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/page/201', expect.any(Object));
    });
  });

  it('should fall back to sequential navigation when no continuation metadata', async () => {
    const mockPage: TeletextPage = {
      id: '201',
      title: 'Test Page',
      rows: Array(24).fill('').map(() => ' '.repeat(40)),
      links: [],
      meta: {
        // No continuation metadata
      }
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ page: mockPage }),
      headers: new Headers()
    });

    let routerState: any;
    
    render(
      <PageRouter initialPage={mockPage}>
        {(state) => {
          routerState = state;
          return <div data-testid="test-content" />;
        }}
      </PageRouter>
    );

    await waitFor(() => {
      expect(routerState.currentPage).toBeDefined();
    });

    // Simulate down arrow press (should use sequential navigation)
    routerState.handleNavigate('down');

    await waitFor(() => {
      // Should navigate to page 200 (201 - 1)
      expect(global.fetch).toHaveBeenCalledWith('/api/page/200', expect.any(Object));
    });
  });
});
