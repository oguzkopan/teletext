import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import BootSequence from '../BootSequence';

describe('BootSequence', () => {
  const mockOnComplete = jest.fn();
  const mockTheme = {
    background: '#0000aa',
    text: '#ffff00',
    green: '#00ff00'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render the boot sequence', () => {
    render(<BootSequence onComplete={mockOnComplete} theme={mockTheme} />);
    
    // Boot sequence should be visible
    const bootElement = document.querySelector('.boot-sequence');
    expect(bootElement).toBeInTheDocument();
  });

  it('should complete after 3 seconds', async () => {
    render(<BootSequence onComplete={mockOnComplete} theme={mockTheme} />);
    
    expect(mockOnComplete).not.toHaveBeenCalled();
    
    // Fast-forward 3 seconds
    jest.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('should skip on keyboard press', async () => {
    render(<BootSequence onComplete={mockOnComplete} theme={mockTheme} />);
    
    expect(mockOnComplete).not.toHaveBeenCalled();
    
    // Press any key
    fireEvent.keyDown(window, { key: 'Enter' });
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('should skip on click', async () => {
    render(<BootSequence onComplete={mockOnComplete} theme={mockTheme} />);
    
    expect(mockOnComplete).not.toHaveBeenCalled();
    
    // Click anywhere
    fireEvent.click(window);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('should progress through phases', () => {
    render(<BootSequence onComplete={mockOnComplete} theme={mockTheme} />);
    
    // Should start with warmup phase
    let warmupScreen = document.querySelector('.warmup-screen');
    expect(warmupScreen).toBeInTheDocument();
    
    // Advance to static phase (800ms)
    act(() => {
      jest.advanceTimersByTime(800);
    });
    
    warmupScreen = document.querySelector('.warmup-screen');
    const staticScreen = document.querySelector('.static-screen');
    expect(warmupScreen).not.toBeInTheDocument();
    expect(staticScreen).toBeInTheDocument();
    
    // Advance to transition phase (2200ms total)
    act(() => {
      jest.advanceTimersByTime(1400);
    });
    
    const transitionScreen = document.querySelector('.transition-screen');
    expect(transitionScreen).toBeInTheDocument();
  });

  it('should display boot text during transition phase', () => {
    render(<BootSequence onComplete={mockOnComplete} theme={mockTheme} />);
    
    // Advance to transition phase
    act(() => {
      jest.advanceTimersByTime(2200);
    });
    
    const bootText = document.querySelector('.boot-text');
    expect(bootText).toBeInTheDocument();
    expect(bootText).toHaveTextContent('MODERN TELETEXT');
    expect(bootText).toHaveTextContent('SYSTEM READY');
    expect(bootText).toHaveTextContent('LOADING PAGE 100...');
  });

  it('should apply theme colors', () => {
    render(<BootSequence onComplete={mockOnComplete} theme={mockTheme} />);
    
    // Advance to transition phase to see boot text
    act(() => {
      jest.advanceTimersByTime(2200);
    });
    
    const bootText = document.querySelector('.boot-text');
    expect(bootText).toHaveStyle({ color: mockTheme.green });
  });

  it('should have scanlines overlay', () => {
    render(<BootSequence onComplete={mockOnComplete} theme={mockTheme} />);
    
    const scanlines = document.querySelector('.scanlines');
    expect(scanlines).toBeInTheDocument();
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<BootSequence onComplete={mockOnComplete} theme={mockTheme} />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
});
