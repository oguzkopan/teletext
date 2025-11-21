/**
 * Action Feedback Component
 * 
 * Displays success/error feedback messages with animations
 * in the teletext interface.
 * 
 * Requirements: 28.1, 28.2, 28.3, 28.4, 28.5
 */

'use client';

import React from 'react';
import { FeedbackDisplay } from '../lib/action-feedback';

/**
 * Component props
 */
export interface ActionFeedbackProps {
  feedback: FeedbackDisplay | null;
  isVisible: boolean;
  isAnimatingOut: boolean;
  className?: string;
}

/**
 * Action Feedback Component
 * 
 * Displays feedback messages with appropriate animations and styling
 * 
 * @example
 * <ActionFeedback
 *   feedback={feedback}
 *   isVisible={isVisible}
 *   isAnimatingOut={isAnimatingOut}
 * />
 */
export function ActionFeedback({
  feedback,
  isVisible,
  isAnimatingOut,
  className = ''
}: ActionFeedbackProps): JSX.Element | null {
  if (!feedback || !isVisible) {
    return null;
  }
  
  // Determine animation class
  const getAnimationClass = (): string => {
    if (isAnimatingOut) {
      return 'feedback-fade-out';
    }
    
    switch (feedback.animation) {
      case 'checkmark':
        return 'feedback-checkmark feedback-fade-in';
      case 'cross':
        return 'feedback-cross feedback-fade-in';
      case 'flash':
        return 'feedback-flash';
      case 'celebration':
        return 'feedback-celebration';
      default:
        return 'feedback-fade-in';
    }
  };
  
  // Determine color class
  const getColorClass = (): string => {
    switch (feedback.color) {
      case 'green':
        return 'feedback-success';
      case 'red':
        return 'feedback-error';
      case 'yellow':
        return 'feedback-warning';
      case 'cyan':
        return 'feedback-info';
      default:
        return 'feedback-success';
    }
  };
  
  const animationClass = getAnimationClass();
  const colorClass = getColorClass();
  
  return (
    <div
      className={`feedback-container ${colorClass} ${animationClass} ${className}`}
      role="alert"
      aria-live="polite"
    >
      {feedback.lines.map((line, index) => (
        <div key={index} className="feedback-line">
          {line}
        </div>
      ))}
    </div>
  );
}

/**
 * Confetti Particle Component
 */
interface ConfettiParticleProps {
  symbol: string;
  delay: number;
  left: string;
}

function ConfettiParticle({ symbol, delay, left }: ConfettiParticleProps): JSX.Element {
  return (
    <div
      className="confetti-particle feedback-confetti"
      style={{
        animationDelay: `${delay}ms`,
        left
      }}
    >
      {symbol}
    </div>
  );
}

/**
 * Celebration Feedback Component with Confetti
 * 
 * Special component for celebration messages with animated confetti
 */
export interface CelebrationFeedbackProps {
  message: string;
  isVisible: boolean;
  isAnimatingOut: boolean;
  showConfetti?: boolean;
  className?: string;
}

export function CelebrationFeedback({
  message,
  isVisible,
  isAnimatingOut,
  showConfetti = true,
  className = ''
}: CelebrationFeedbackProps): JSX.Element | null {
  if (!isVisible) {
    return null;
  }
  
  const confettiSymbols = ['*', '·', '✦', '✧', '★', '☆', '◆', '◇', '○'];
  
  return (
    <>
      {showConfetti && (
        <>
          {confettiSymbols.map((symbol, index) => (
            <ConfettiParticle
              key={index}
              symbol={symbol}
              delay={index * 100}
              left={`${(index + 1) * 10}%`}
            />
          ))}
        </>
      )}
      <div
        className={`feedback-container feedback-success feedback-celebration ${
          isAnimatingOut ? 'feedback-fade-out' : ''
        } ${className}`}
        role="alert"
        aria-live="polite"
      >
        <div className="feedback-line">🎉 {message} 🎉</div>
        <div className="feedback-line">✓ CONGRATULATIONS!</div>
      </div>
    </>
  );
}

/**
 * Inline Feedback Component
 * 
 * Displays feedback inline within page content (not as overlay)
 */
export interface InlineFeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  visible?: boolean;
  className?: string;
}

export function InlineFeedback({
  type,
  message,
  visible = true,
  className = ''
}: InlineFeedbackProps): JSX.Element | null {
  if (!visible) {
    return null;
  }
  
  const getSymbol = (): string => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };
  
  const getColorClass = (): string => {
    switch (type) {
      case 'success':
        return 'teletext-green';
      case 'error':
        return 'teletext-red';
      case 'warning':
        return 'teletext-yellow';
      case 'info':
        return 'teletext-cyan';
      default:
        return '';
    }
  };
  
  return (
    <div className={`${getColorClass()} ${className}`} role="status">
      {getSymbol()} {message}
    </div>
  );
}

/**
 * Saved Indicator Component
 * 
 * Displays a "SAVED" indicator with flash animation
 */
export interface SavedIndicatorProps {
  itemName?: string;
  isVisible: boolean;
  isAnimatingOut: boolean;
  className?: string;
}

export function SavedIndicator({
  itemName,
  isVisible,
  isAnimatingOut,
  className = ''
}: SavedIndicatorProps): JSX.Element | null {
  if (!isVisible) {
    return null;
  }
  
  const message = itemName ? `✓ ${itemName} SAVED` : '✓ SAVED';
  
  return (
    <div
      className={`feedback-container feedback-success feedback-flash ${
        isAnimatingOut ? 'feedback-fade-out' : ''
      } ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="feedback-line">{message}</div>
    </div>
  );
}

export default ActionFeedback;
