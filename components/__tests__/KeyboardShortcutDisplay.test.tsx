/**
 * Tests for KeyboardShortcutDisplay component
 * Requirements: 30.1, 30.2, 30.5
 */

import { render, waitFor } from '@testing-library/react';
import KeyboardShortcutDisplay from '../KeyboardShortcutDisplay';

describe('KeyboardShortcutDisplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render without crashing', () => {
    const { container } = render(<KeyboardShortcutDisplay />);
    expect(container).toBeTruthy();
  });

  it('should not render any visible elements', () => {
    const { container } = render(<KeyboardShortcutDisplay />);
    expect(container.firstChild).toBeNull();
  });

  it('should add highlighting class to highlighted keys', () => {
    // Create mock key elements
    const keyElement = document.createElement('div');
    keyElement.setAttribute('data-key', 'R');
    document.body.appendChild(keyElement);

    render(<KeyboardShortcutDisplay highlightedKeys={['R']} />);

    waitFor(() => {
      expect(keyElement.classList.contains('keyboard-key-highlighted')).toBe(true);
    });
  });

  it('should add frequent class to frequently used keys', () => {
    const keyElement = document.createElement('div');
    keyElement.setAttribute('data-key', 'Enter');
    document.body.appendChild(keyElement);

    render(<KeyboardShortcutDisplay frequentKeys={['Enter']} />);

    waitFor(() => {
      expect(keyElement.classList.contains('keyboard-key-frequent')).toBe(true);
    });
  });

  it('should handle number range pattern 0-9', () => {
    const key1 = document.createElement('div');
    key1.setAttribute('data-key', '1');
    document.body.appendChild(key1);

    const key5 = document.createElement('div');
    key5.setAttribute('data-key', '5');
    document.body.appendChild(key5);

    render(<KeyboardShortcutDisplay highlightedKeys={['0-9']} />);

    waitFor(() => {
      expect(key1.classList.contains('keyboard-key-highlighted')).toBe(true);
      expect(key5.classList.contains('keyboard-key-highlighted')).toBe(true);
    });
  });

  it('should pulse frequent keys periodically', async () => {
    const keyElement = document.createElement('div');
    keyElement.setAttribute('data-key', 'R');
    document.body.appendChild(keyElement);

    render(<KeyboardShortcutDisplay frequentKeys={['R']} />);

    // Initially no pulse
    expect(keyElement.classList.contains('keyboard-key-pulse')).toBe(false);

    // Wait for pulse interval
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(keyElement.classList.contains('keyboard-key-pulse')).toBe(true);
    });

    // Pulse should clear after 1 second
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(keyElement.classList.contains('keyboard-key-pulse')).toBe(false);
    });
  });

  it('should handle multiple highlighted keys', () => {
    const keyR = document.createElement('div');
    keyR.setAttribute('data-key', 'R');
    document.body.appendChild(keyR);

    const keyG = document.createElement('div');
    keyG.setAttribute('data-key', 'G');
    document.body.appendChild(keyG);

    const keyY = document.createElement('div');
    keyY.setAttribute('data-key', 'Y');
    document.body.appendChild(keyY);

    render(<KeyboardShortcutDisplay highlightedKeys={['R', 'G', 'Y']} />);

    waitFor(() => {
      expect(keyR.classList.contains('keyboard-key-highlighted')).toBe(true);
      expect(keyG.classList.contains('keyboard-key-highlighted')).toBe(true);
      expect(keyY.classList.contains('keyboard-key-highlighted')).toBe(true);
    });
  });

  it('should not highlight keys not in the list', () => {
    const keyR = document.createElement('div');
    keyR.setAttribute('data-key', 'R');
    document.body.appendChild(keyR);

    const keyB = document.createElement('div');
    keyB.setAttribute('data-key', 'B');
    document.body.appendChild(keyB);

    render(<KeyboardShortcutDisplay highlightedKeys={['R']} />);

    waitFor(() => {
      expect(keyR.classList.contains('keyboard-key-highlighted')).toBe(true);
      expect(keyB.classList.contains('keyboard-key-highlighted')).toBe(false);
    });
  });
});
