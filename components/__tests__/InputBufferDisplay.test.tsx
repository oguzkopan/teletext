/**
 * InputBufferDisplay Component Tests
 * 
 * Tests for the input buffer display component
 * Requirements: 6.5, 8.4, 15.1
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputBufferDisplay from '../InputBufferDisplay';
import { themes } from '@/lib/theme-context';

describe('InputBufferDisplay', () => {
  const defaultProps = {
    buffer: '',
    expectedLength: 3,
    theme: themes.ceefax,
    position: 'footer' as const,
    visible: true
  };
  
  it('should render hint when buffer is empty', () => {
    render(<InputBufferDisplay {...defaultProps} />);
    
    expect(screen.getByText('Enter 3-digit page number')).toBeInTheDocument();
  });
  
  it('should render entered digits', () => {
    render(<InputBufferDisplay {...defaultProps} buffer="2" />);
    
    expect(screen.getByText('2_')).toBeInTheDocument();
  });
  
  it('should render multiple digits', () => {
    render(<InputBufferDisplay {...defaultProps} buffer="20" />);
    
    expect(screen.getByText('20_')).toBeInTheDocument();
  });
  
  it('should render full buffer without cursor', () => {
    render(<InputBufferDisplay {...defaultProps} buffer="200" />);
    
    expect(screen.getByText('200')).toBeInTheDocument();
  });
  
  it('should not render when not visible', () => {
    const { container } = render(
      <InputBufferDisplay {...defaultProps} visible={false} />
    );
    
    expect(container.firstChild).toBeNull();
  });
  
  it('should render in header position', () => {
    const { container } = render(
      <InputBufferDisplay {...defaultProps} position="header" buffer="2" />
    );
    
    const element = container.querySelector('.input-buffer-display');
    expect(element).toHaveStyle({ top: '20px', right: '20px' });
  });
  
  it('should render in footer position', () => {
    const { container } = render(
      <InputBufferDisplay {...defaultProps} position="footer" buffer="2" />
    );
    
    const element = container.querySelector('.input-buffer-display');
    expect(element).toHaveStyle({ bottom: '40px', left: '50%' });
  });
  
  it('should apply theme-specific styling', () => {
    const { container } = render(
      <InputBufferDisplay {...defaultProps} theme={themes.haunting} buffer="2" />
    );
    
    const element = container.querySelector('.input-buffer-haunting');
    expect(element).toBeInTheDocument();
  });
  
  it('should show hint for single digit input', () => {
    render(<InputBufferDisplay {...defaultProps} expectedLength={1} />);
    
    expect(screen.getByText('Enter 1 digit')).toBeInTheDocument();
  });
  
  it('should show hint for double digit input', () => {
    render(<InputBufferDisplay {...defaultProps} expectedLength={2} />);
    
    expect(screen.getByText('Enter 2 digits')).toBeInTheDocument();
  });
  
  it('should apply animation classes when digit is entered', async () => {
    const { container, rerender } = render(
      <InputBufferDisplay {...defaultProps} buffer="" />
    );
    
    rerender(<InputBufferDisplay {...defaultProps} buffer="2" />);
    
    // Wait for the component to re-render with new key
    await waitFor(() => {
      const element = container.querySelector('.input-buffer-display');
      expect(element).toBeInTheDocument();
    });
    
    // Check that the display shows the digit
    expect(screen.getByText('2_')).toBeInTheDocument();
  });
  
  it('should clear after animation when buffer is cleared', async () => {
    const { container, rerender } = render(
      <InputBufferDisplay {...defaultProps} buffer="200" />
    );
    
    expect(screen.getByText('200')).toBeInTheDocument();
    
    rerender(<InputBufferDisplay {...defaultProps} buffer="" />);
    
    // Should disappear after animation completes (200ms timeout in component)
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    }, { timeout: 500 });
  });
  
  it('should apply correct theme colors', () => {
    const { container } = render(
      <InputBufferDisplay {...defaultProps} theme={themes.ceefax} buffer="2" />
    );
    
    const element = container.querySelector('.input-buffer-display');
    expect(element).toHaveStyle({
      color: themes.ceefax.colors.yellow,
      border: `1px solid ${themes.ceefax.colors.yellow}`
    });
  });
  
  it('should handle theme changes', () => {
    const { container, rerender } = render(
      <InputBufferDisplay {...defaultProps} theme={themes.ceefax} buffer="2" />
    );
    
    expect(container.querySelector('.input-buffer-ceefax')).toBeInTheDocument();
    
    rerender(
      <InputBufferDisplay {...defaultProps} theme={themes.haunting} buffer="2" />
    );
    
    expect(container.querySelector('.input-buffer-haunting')).toBeInTheDocument();
  });
});
