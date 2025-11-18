import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RemoteInterface from '../RemoteInterface';

describe('RemoteInterface Component', () => {
  const mockOnDigitPress = jest.fn();
  const mockOnNavigate = jest.fn();
  const mockOnColorButton = jest.fn();
  const mockOnEnter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
});
