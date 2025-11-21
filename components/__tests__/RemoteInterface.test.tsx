import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RemoteInterface from '../RemoteInterface';

describe('RemoteInterface Component', () => {
  const mockOnDigitPress = jest.fn();
  const mockOnNavigate = jest.fn();
  const mockOnColorButton = jest.fn();
  const mockOnEnter = jest.fn();

  const mockPage = {
    id: '200',
    title: 'News',
    rows: Array(24).fill(''),
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' as const },
      { label: 'SPORT', targetPage: '300', color: 'green' as const },
      { label: 'MARKETS', targetPage: '400', color: 'yellow' as const },
      { label: 'AI', targetPage: '500', color: 'blue' as const }
    ],
    meta: {
      continuation: {
        currentPage: '200',
        nextPage: '201',
        previousPage: '199',
        totalPages: 3,
        currentIndex: 1
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders numeric keypad with digits 0-9', () => {
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('calls onDigitPress when digit button is clicked', () => {
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    const button5 = screen.getByText('5');
    fireEvent.click(button5);
    
    expect(mockOnDigitPress).toHaveBeenCalledWith(5);
  });

  it('calls onEnter when OK button is clicked', () => {
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);
    
    expect(mockOnEnter).toHaveBeenCalled();
  });

  it('displays current input in the display screen', () => {
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput="123"
      />
    );

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('displays placeholder when no input', () => {
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    expect(screen.getByText('___')).toBeInTheDocument();
  });

  it('renders colored Fastext buttons', () => {
    const { container } = render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    const redButton = container.querySelector('.color-button.red');
    const greenButton = container.querySelector('.color-button.green');
    const yellowButton = container.querySelector('.color-button.yellow');
    const blueButton = container.querySelector('.color-button.blue');

    expect(redButton).toBeInTheDocument();
    expect(greenButton).toBeInTheDocument();
    expect(yellowButton).toBeInTheDocument();
    expect(blueButton).toBeInTheDocument();
  });

  it('calls onColorButton when colored button is clicked', () => {
    const { container } = render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    const redButton = container.querySelector('.color-button.red') as HTMLElement;
    fireEvent.click(redButton);
    
    expect(mockOnColorButton).toHaveBeenCalledWith('red');
  });

  it('handles keyboard digit input', () => {
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    fireEvent.keyDown(window, { key: '7' });
    
    expect(mockOnDigitPress).toHaveBeenCalledWith(7);
  });

  it('handles keyboard Enter key', () => {
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    fireEvent.keyDown(window, { key: 'Enter' });
    
    expect(mockOnEnter).toHaveBeenCalled();
  });

  it('handles keyboard arrow keys for navigation', () => {
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(mockOnNavigate).toHaveBeenCalledWith('up');

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(mockOnNavigate).toHaveBeenCalledWith('down');

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(mockOnNavigate).toHaveBeenCalledWith('back');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(mockOnNavigate).toHaveBeenCalledWith('forward');
  });

  it('handles keyboard shortcuts for colored buttons', () => {
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    fireEvent.keyDown(window, { key: 'r' });
    expect(mockOnColorButton).toHaveBeenCalledWith('red');

    fireEvent.keyDown(window, { key: 'g' });
    expect(mockOnColorButton).toHaveBeenCalledWith('green');

    fireEvent.keyDown(window, { key: 'y' });
    expect(mockOnColorButton).toHaveBeenCalledWith('yellow');

    fireEvent.keyDown(window, { key: 'b' });
    expect(mockOnColorButton).toHaveBeenCalledWith('blue');
  });

  it('handles F1-F10 keys for favorite pages', () => {
    const mockOnFavoriteKey = jest.fn();
    
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        onFavoriteKey={mockOnFavoriteKey}
        currentInput=""
      />
    );

    // Test F1 key
    fireEvent.keyDown(window, { key: 'F1' });
    expect(mockOnFavoriteKey).toHaveBeenCalledWith(0);

    // Test F5 key
    fireEvent.keyDown(window, { key: 'F5' });
    expect(mockOnFavoriteKey).toHaveBeenCalledWith(4);

    // Test F10 key
    fireEvent.keyDown(window, { key: 'F10' });
    expect(mockOnFavoriteKey).toHaveBeenCalledWith(9);
  });

  it('does not call onFavoriteKey if handler not provided', () => {
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    // Should not throw error when F1 is pressed without handler
    expect(() => {
      fireEvent.keyDown(window, { key: 'F1' });
    }).not.toThrow();
  });

  it('prevents default for F1-F10 keys', () => {
    const mockOnFavoriteKey = jest.fn();
    
    render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        onFavoriteKey={mockOnFavoriteKey}
        currentInput=""
      />
    );

    const event = new KeyboardEvent('keydown', { key: 'F1' });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    
    fireEvent(window, event);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  // Visual feedback tests
  it('shows button press animation when digit is clicked', () => {
    const { container } = render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    const button5 = screen.getByText('5');
    fireEvent.click(button5);
    
    expect(button5).toHaveClass('pressed');
    expect(button5).toHaveClass('flashing');
  });

  it('displays dynamic button labels based on page context', () => {
    const { container } = render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
        currentPage={mockPage}
      />
    );

    expect(screen.getByText('INDEX')).toBeInTheDocument();
    expect(screen.getByText('SPORT')).toBeInTheDocument();
    expect(screen.getByText('MARKETS')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('highlights available colored buttons with glow effect', () => {
    const { container } = render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
        currentPage={mockPage}
      />
    );

    const redButton = container.querySelector('.color-button.red');
    const greenButton = container.querySelector('.color-button.green');
    
    expect(redButton).toHaveClass('available');
    expect(greenButton).toHaveClass('available');
  });

  it('highlights navigation buttons when they are available', () => {
    const { container } = render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
        currentPage={mockPage}
        canGoBack={true}
        canGoForward={true}
      />
    );

    const buttons = container.querySelectorAll('.nav-button');
    const backButton = Array.from(buttons).find(btn => btn.textContent === '◄');
    const forwardButton = Array.from(buttons).find(btn => btn.textContent === '►');
    const upButton = Array.from(buttons).find(btn => btn.textContent === '▲');
    const downButton = Array.from(buttons).find(btn => btn.textContent === '▼');
    
    expect(backButton).toHaveClass('available');
    expect(forwardButton).toHaveClass('available');
    expect(upButton).toHaveClass('available'); // Has previousPage
    expect(downButton).toHaveClass('available'); // Has nextPage
  });

  it('shows tooltips with dynamic content for colored buttons', () => {
    const { container } = render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
        currentPage={mockPage}
      />
    );

    const redButton = container.querySelector('.color-button.red') as HTMLElement;
    expect(redButton.title).toContain('INDEX');
  });

  it('updates button states when page changes', () => {
    const { container, rerender } = render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
        currentPage={mockPage}
      />
    );

    expect(screen.getByText('INDEX')).toBeInTheDocument();

    const newPage = {
      ...mockPage,
      links: [
        { label: 'HOME', targetPage: '100', color: 'red' as const }
      ]
    };

    rerender(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
        currentPage={newPage}
      />
    );

    expect(screen.getByText('HOME')).toBeInTheDocument();
    expect(screen.queryByText('INDEX')).not.toBeInTheDocument();
  });

  it('shows visual feedback for all button interactions', () => {
    const { container } = render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
        currentPage={mockPage}
      />
    );

    // Test digit button
    const button1 = screen.getByText('1');
    fireEvent.click(button1);
    expect(button1).toHaveClass('flashing');

    // Test navigation button
    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);
    expect(okButton).toHaveClass('flashing');

    // Test colored button
    const redButton = container.querySelector('.color-button.red') as HTMLElement;
    fireEvent.click(redButton);
    expect(redButton).toHaveClass('flashing');
  });

  it('clears visual feedback after animation completes', async () => {
    const { act } = await import('@testing-library/react');
    const { container } = render(
      <RemoteInterface
        onDigitPress={mockOnDigitPress}
        onNavigate={mockOnNavigate}
        onColorButton={mockOnColorButton}
        onEnter={mockOnEnter}
        currentInput=""
      />
    );

    const button5 = screen.getByText('5');
    
    act(() => {
      fireEvent.click(button5);
    });
    
    expect(button5).toHaveClass('pressed');
    expect(button5).toHaveClass('flashing');

    // Fast-forward past the pressed animation (150ms)
    await act(async () => {
      jest.advanceTimersByTime(150);
    });
    expect(button5).not.toHaveClass('pressed');
    expect(button5).toHaveClass('flashing');

    // Fast-forward past the flash animation (300ms total)
    await act(async () => {
      jest.advanceTimersByTime(150);
    });
    expect(button5).not.toHaveClass('flashing');
  });
});
