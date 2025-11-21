/**
 * Tests for ActionFeedback Component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ActionFeedback,
  CelebrationFeedback,
  InlineFeedback,
  SavedIndicator
} from '../ActionFeedback';
import { FeedbackDisplay } from '../../lib/action-feedback';

describe('ActionFeedback', () => {
  const mockSuccessFeedback: FeedbackDisplay = {
    lines: ['✓ Success!'],
    color: 'green',
    duration: 2500,
    animation: 'checkmark'
  };

  const mockErrorFeedback: FeedbackDisplay = {
    lines: ['✗ Error occurred'],
    color: 'red',
    duration: 2500,
    animation: 'cross'
  };

  it('should render success feedback', () => {
    render(
      <ActionFeedback
        feedback={mockSuccessFeedback}
        isVisible={true}
        isAnimatingOut={false}
      />
    );
    
    expect(screen.getByText('✓ Success!')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('feedback-success');
    expect(screen.getByRole('alert')).toHaveClass('feedback-checkmark');
  });

  it('should render error feedback', () => {
    render(
      <ActionFeedback
        feedback={mockErrorFeedback}
        isVisible={true}
        isAnimatingOut={false}
      />
    );
    
    expect(screen.getByText('✗ Error occurred')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('feedback-error');
    expect(screen.getByRole('alert')).toHaveClass('feedback-cross');
  });

  it('should not render when not visible', () => {
    const { container } = render(
      <ActionFeedback
        feedback={mockSuccessFeedback}
        isVisible={false}
        isAnimatingOut={false}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should not render when feedback is null', () => {
    const { container } = render(
      <ActionFeedback
        feedback={null}
        isVisible={true}
        isAnimatingOut={false}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should apply fade-out animation when animating out', () => {
    render(
      <ActionFeedback
        feedback={mockSuccessFeedback}
        isVisible={true}
        isAnimatingOut={true}
      />
    );
    
    expect(screen.getByRole('alert')).toHaveClass('feedback-fade-out');
  });

  it('should render multiple lines', () => {
    const multiLineFeedback: FeedbackDisplay = {
      lines: ['Line 1', 'Line 2', 'Line 3'],
      color: 'green',
      duration: 2500,
      animation: 'none'
    };
    
    render(
      <ActionFeedback
        feedback={multiLineFeedback}
        isVisible={true}
        isAnimatingOut={false}
      />
    );
    
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
    expect(screen.getByText('Line 3')).toBeInTheDocument();
  });

  it('should apply flash animation', () => {
    const flashFeedback: FeedbackDisplay = {
      lines: ['✓ SAVED'],
      color: 'green',
      duration: 2000,
      animation: 'flash'
    };
    
    render(
      <ActionFeedback
        feedback={flashFeedback}
        isVisible={true}
        isAnimatingOut={false}
      />
    );
    
    expect(screen.getByRole('alert')).toHaveClass('feedback-flash');
  });

  it('should apply celebration animation', () => {
    const celebrationFeedback: FeedbackDisplay = {
      lines: ['🎉 Complete! 🎉'],
      color: 'green',
      duration: 3000,
      animation: 'celebration'
    };
    
    render(
      <ActionFeedback
        feedback={celebrationFeedback}
        isVisible={true}
        isAnimatingOut={false}
      />
    );
    
    expect(screen.getByRole('alert')).toHaveClass('feedback-celebration');
  });

  it('should apply custom className', () => {
    render(
      <ActionFeedback
        feedback={mockSuccessFeedback}
        isVisible={true}
        isAnimatingOut={false}
        className="custom-class"
      />
    );
    
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  it('should have aria-live="polite"', () => {
    render(
      <ActionFeedback
        feedback={mockSuccessFeedback}
        isVisible={true}
        isAnimatingOut={false}
      />
    );
    
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
  });
});

describe('CelebrationFeedback', () => {
  it('should render celebration message', () => {
    render(
      <CelebrationFeedback
        message="Quiz Complete!"
        isVisible={true}
        isAnimatingOut={false}
      />
    );
    
    expect(screen.getByText('🎉 Quiz Complete! 🎉')).toBeInTheDocument();
    expect(screen.getByText('✓ CONGRATULATIONS!')).toBeInTheDocument();
  });

  it('should render confetti particles', () => {
    const { container } = render(
      <CelebrationFeedback
        message="Success!"
        isVisible={true}
        isAnimatingOut={false}
        showConfetti={true}
      />
    );
    
    const confetti = container.querySelectorAll('.confetti-particle');
    expect(confetti.length).toBeGreaterThan(0);
  });

  it('should not render confetti when disabled', () => {
    const { container } = render(
      <CelebrationFeedback
        message="Success!"
        isVisible={true}
        isAnimatingOut={false}
        showConfetti={false}
      />
    );
    
    const confetti = container.querySelectorAll('.confetti-particle');
    expect(confetti.length).toBe(0);
  });

  it('should not render when not visible', () => {
    const { container } = render(
      <CelebrationFeedback
        message="Success!"
        isVisible={false}
        isAnimatingOut={false}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should apply fade-out animation', () => {
    render(
      <CelebrationFeedback
        message="Success!"
        isVisible={true}
        isAnimatingOut={true}
      />
    );
    
    expect(screen.getByRole('alert')).toHaveClass('feedback-fade-out');
  });
});

describe('InlineFeedback', () => {
  it('should render success feedback', () => {
    render(<InlineFeedback type="success" message="Operation successful" />);
    
    expect(screen.getByText('✓ Operation successful')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('teletext-green');
  });

  it('should render error feedback', () => {
    render(<InlineFeedback type="error" message="Operation failed" />);
    
    expect(screen.getByText('✗ Operation failed')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('teletext-red');
  });

  it('should render warning feedback', () => {
    render(<InlineFeedback type="warning" message="Check input" />);
    
    expect(screen.getByText('⚠ Check input')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('teletext-yellow');
  });

  it('should render info feedback', () => {
    render(<InlineFeedback type="info" message="Loading data" />);
    
    expect(screen.getByText('ℹ Loading data')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('teletext-cyan');
  });

  it('should not render when not visible', () => {
    const { container } = render(
      <InlineFeedback type="success" message="Test" visible={false} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should apply custom className', () => {
    render(
      <InlineFeedback
        type="success"
        message="Test"
        className="custom-class"
      />
    );
    
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });
});

describe('SavedIndicator', () => {
  it('should render basic saved message', () => {
    render(
      <SavedIndicator
        isVisible={true}
        isAnimatingOut={false}
      />
    );
    
    expect(screen.getByText('✓ SAVED')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('feedback-flash');
  });

  it('should render saved message with item name', () => {
    render(
      <SavedIndicator
        itemName="Settings"
        isVisible={true}
        isAnimatingOut={false}
      />
    );
    
    expect(screen.getByText('✓ Settings SAVED')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    const { container } = render(
      <SavedIndicator
        isVisible={false}
        isAnimatingOut={false}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should apply fade-out animation', () => {
    render(
      <SavedIndicator
        isVisible={true}
        isAnimatingOut={true}
      />
    );
    
    expect(screen.getByRole('alert')).toHaveClass('feedback-fade-out');
  });

  it('should apply custom className', () => {
    render(
      <SavedIndicator
        isVisible={true}
        isAnimatingOut={false}
        className="custom-class"
      />
    );
    
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });
});
