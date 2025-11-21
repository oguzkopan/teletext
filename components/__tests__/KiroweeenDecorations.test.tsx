/**
 * Tests for Kiroween Decorations Component
 * 
 * Requirements: 6.2, 7.1, 7.2, 7.3
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KiroweeenDecorations } from '../KiroweeenDecorations';
import { DEFAULT_KIROWEEN_DECORATIONS } from '@/lib/kiroween-decorations';

// Mock the animation engine
jest.mock('@/lib/animation-engine', () => ({
  getAnimationEngine: jest.fn(() => ({
    setTheme: jest.fn(),
    playAnimationConfig: jest.fn(() => 'mock-anim-id'),
    stopAnimation: jest.fn()
  }))
}));

// Mock the theme context
jest.mock('@/lib/theme-context', () => ({
  useTheme: jest.fn(() => ({
    currentThemeKey: 'haunting',
    currentTheme: {
      name: 'Haunting Mode',
      colors: {},
      effects: {}
    }
  }))
}));

describe('KiroweeenDecorations Component', () => {
  const renderComponent = (component: React.ReactElement) => {
    return render(component);
  };

  test('renders decorations when haunting theme is active', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    const decorationsContainer = container.querySelector('.kiroween-decorations');
    expect(decorationsContainer).toBeInTheDocument();
  });

  test('renders all default decorations', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    // Check that decoration elements are rendered
    const decorationElements = container.querySelectorAll('.decoration-element');
    expect(decorationElements.length).toBe(DEFAULT_KIROWEEN_DECORATIONS.length);
  });

  test('renders jack-o-lantern decoration', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    const jackOLantern = container.querySelector('[data-decoration-id="jack-o-lantern"]');
    expect(jackOLantern).toBeInTheDocument();
    expect(jackOLantern?.textContent).toContain('🎃');
  });

  test('renders floating ghost decoration', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    const ghost = container.querySelector('[data-decoration-id="floating-ghost"]');
    expect(ghost).toBeInTheDocument();
    expect(ghost?.textContent).toContain('👻');
  });

  test('renders flying bat decoration', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    const bat = container.querySelector('[data-decoration-id="flying-bat"]');
    expect(bat).toBeInTheDocument();
    expect(bat?.textContent).toContain('🦇');
  });

  test('renders ASCII cat decoration', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    const cat = container.querySelector('[data-decoration-id="ascii-cat"]');
    expect(cat).toBeInTheDocument();
    
    // Check for cat ASCII art structure
    const catContent = cat?.textContent || '';
    expect(catContent).toContain('/\\_/\\');
    expect(catContent).toContain('> ^ <');
  });

  test('applies correct CSS classes for animations', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    const ghost = container.querySelector('[data-decoration-id="floating-ghost"]');
    expect(ghost?.classList.contains('ghost-float-decoration')).toBe(true);
    
    const bat = container.querySelector('[data-decoration-id="flying-bat"]');
    expect(bat?.classList.contains('bat-fly-decoration')).toBe(true);
  });

  test('does not render when disabled', () => {
    const { container } = renderComponent(<KiroweeenDecorations enabled={false} />);
    
    const decorationsContainer = container.querySelector('.kiroween-decorations');
    expect(decorationsContainer).not.toBeInTheDocument();
  });

  test('applies correct positioning styles', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    const decorationElements = container.querySelectorAll('.decoration-element');
    
    decorationElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      expect(styles.position).toBe('absolute');
      expect(styles.pointerEvents).toBe('none');
    });
  });

  test('renders ASCII cat with pre tag for proper formatting', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    const cat = container.querySelector('[data-decoration-id="ascii-cat"]');
    const preTag = cat?.querySelector('pre');
    
    expect(preTag).toBeInTheDocument();
    expect(preTag?.style.fontFamily).toContain('monospace');
  });

  test('sets correct z-index for decorations', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    const decorationElements = container.querySelectorAll('.decoration-element');
    
    decorationElements.forEach(element => {
      const zIndex = (element as HTMLElement).style.zIndex;
      expect(zIndex).toBeTruthy();
      expect(parseInt(zIndex)).toBeGreaterThan(0);
    });
  });

  test('container has pointer-events none to not block interactions', () => {
    const { container } = renderComponent(<KiroweeenDecorations />);
    
    const decorationsContainer = container.querySelector('.kiroween-decorations');
    
    if (decorationsContainer) {
      const styles = window.getComputedStyle(decorationsContainer);
      expect(styles.pointerEvents).toBe('none');
    }
  });
});
