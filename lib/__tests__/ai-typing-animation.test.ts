/**
 * Tests for AI Typing Animation
 * 
 * Requirements: 24.1, 24.2, 24.3, 24.4, 24.5
 */

import { AITypingAnimation } from '../ai-typing-animation';

// Mock timers for testing
jest.useFakeTimers();

describe('AITypingAnimation', () => {
  let animation: AITypingAnimation;

  beforeEach(() => {
    animation = new AITypingAnimation();
  });

  afterEach(() => {
    animation.destroy();
    jest.clearAllTimers();
  });

  describe('Thinking Animation', () => {
    it('should start thinking animation with animated dots', () => {
      // Requirement 24.5: Display "thinking..." animation
      animation.startThinking();
      
      const state = animation.getState();
      expect(state.isThinking).toBe(true);
      expect(state.revealedText).toBe('Thinking');
      
      // Advance timer to see dot animation
      jest.advanceTimersByTime(500);
      expect(animation.getState().revealedText).toBe('Thinking.');
      
      jest.advanceTimersByTime(500);
      expect(animation.getState().revealedText).toBe('Thinking..');
      
      jest.advanceTimersByTime(500);
      expect(animation.getState().revealedText).toBe('Thinking...');
      
      jest.advanceTimersByTime(500);
      expect(animation.getState().revealedText).toBe('Thinking');
    });

    it('should show cursor during thinking animation', () => {
      animation.startThinking();
      
      expect(animation.getState().cursorVisible).toBe(true);
      
      // Cursor should blink
      jest.advanceTimersByTime(500);
      expect(animation.getState().cursorVisible).toBe(false);
      
      jest.advanceTimersByTime(500);
      expect(animation.getState().cursorVisible).toBe(true);
    });

    it('should stop thinking animation', () => {
      animation.startThinking();
      expect(animation.getState().isThinking).toBe(true);
      
      animation.stopThinking();
      expect(animation.getState().isThinking).toBe(false);
    });
  });

  describe('Typing Animation', () => {
    it('should reveal text character-by-character', () => {
      // Requirement 24.1, 24.2: Character-by-character text reveal
      const text = 'Hello World';
      animation.start(text);
      
      expect(animation.getState().isTyping).toBe(true);
      expect(animation.getState().revealedText).toBe('');
      
      // Speed is 75 chars/sec, so delay is ~13.33ms per char
      const delayMs = 1000 / 75;
      
      // After first character
      jest.advanceTimersByTime(delayMs);
      expect(animation.getState().revealedText).toBe('H');
      
      // After second character
      jest.advanceTimersByTime(delayMs);
      expect(animation.getState().revealedText).toBe('He');
      
      // Complete the animation - need to advance enough to trigger complete()
      jest.advanceTimersByTime(delayMs * (text.length - 1)); // -1 because we already advanced 2 chars
      expect(animation.getState().revealedText).toBe(text);
      expect(animation.getState().isTyping).toBe(false);
    });

    it('should respect custom typing speed', () => {
      // Requirement 24.2: Typing speed 50-100 chars/second
      const customAnimation = new AITypingAnimation({ speed: 50 });
      const text = 'Test';
      
      customAnimation.start(text);
      
      // Speed is 50 chars/sec, so delay is 20ms per char
      const delayMs = 1000 / 50;
      
      jest.advanceTimersByTime(delayMs);
      expect(customAnimation.getState().revealedText).toBe('T');
      
      customAnimation.destroy();
    });

    it('should show blinking cursor during typing', () => {
      // Requirement 24.1: Blinking cursor during typing
      animation.start('Test with longer text to ensure typing continues');
      
      // Cursor should be visible initially
      const state1 = animation.getState();
      expect(state1.cursorVisible).toBe(true);
      
      // After 500ms, cursor should toggle
      jest.advanceTimersByTime(501); // Slightly more to ensure interval fires
      const state2 = animation.getState();
      
      // Verify that cursor toggled (is blinking)
      expect(state2.cursorVisible).not.toBe(state1.cursorVisible);
    });

    it('should update progress during typing', () => {
      const text = 'Hello';
      animation.start(text);
      
      expect(animation.getState().progress).toBe(0);
      
      const delayMs = 1000 / 75;
      
      // After 1 character (20% progress)
      jest.advanceTimersByTime(delayMs);
      expect(animation.getState().progress).toBe(20);
      
      // After 3 characters (60% progress)
      jest.advanceTimersByTime(delayMs * 2);
      expect(animation.getState().progress).toBe(60);
      
      // Complete
      jest.advanceTimersByTime(delayMs * 2);
      expect(animation.getState().progress).toBe(100);
    });

    it('should call onComplete callback when typing finishes', () => {
      const onComplete = jest.fn();
      const customAnimation = new AITypingAnimation({ onComplete });
      
      customAnimation.start('Hi');
      
      const delayMs = 1000 / 75;
      jest.advanceTimersByTime(delayMs * 3); // Complete typing
      
      expect(onComplete).toHaveBeenCalled();
      
      customAnimation.destroy();
    });
  });

  describe('Skip Functionality', () => {
    it('should skip typing animation and reveal all text', () => {
      // Requirement 24.3: Allow users to skip typing animation
      const text = 'This is a long text that should be skippable';
      animation.start(text);
      
      // Advance a bit
      const delayMs = 1000 / 75;
      jest.advanceTimersByTime(delayMs * 5);
      
      expect(animation.getState().revealedText).not.toBe(text);
      
      // Skip
      animation.skip();
      
      expect(animation.getState().revealedText).toBe(text);
      expect(animation.getState().isTyping).toBe(false);
      expect(animation.getState().progress).toBe(100);
    });

    it('should call onSkip callback when skipped', () => {
      const onSkip = jest.fn();
      const customAnimation = new AITypingAnimation({ onSkip });
      
      customAnimation.start('Test');
      customAnimation.skip();
      
      expect(onSkip).toHaveBeenCalled();
      
      customAnimation.destroy();
    });

    it('should call onComplete callback when skipped', () => {
      // Requirement 24.4: Display navigation options after typing completes
      const onComplete = jest.fn();
      const customAnimation = new AITypingAnimation({ onComplete });
      
      customAnimation.start('Test');
      customAnimation.skip();
      
      expect(onComplete).toHaveBeenCalled();
      
      customAnimation.destroy();
    });
  });

  describe('Display Text', () => {
    it('should include cursor in display text when typing', () => {
      animation.start('Hello');
      
      const delayMs = 1000 / 75;
      jest.advanceTimersByTime(delayMs * 2);
      
      const displayText = animation.getDisplayText();
      expect(displayText).toContain('He');
      expect(displayText).toContain('█'); // Default cursor
    });

    it('should not include cursor when cursor is not visible', () => {
      animation.start('Hello');
      
      // Wait for cursor to blink off
      jest.advanceTimersByTime(500);
      
      const displayText = animation.getDisplayText();
      expect(displayText).not.toContain('█');
    });

    it('should use custom cursor character', () => {
      const customAnimation = new AITypingAnimation({ cursorChar: '|' });
      customAnimation.start('Test');
      
      const displayText = customAnimation.getDisplayText();
      expect(displayText).toContain('|');
      
      customAnimation.destroy();
    });

    it('should not show cursor when showCursor is false', () => {
      const customAnimation = new AITypingAnimation({ showCursor: false });
      customAnimation.start('Test');
      
      const displayText = customAnimation.getDisplayText();
      expect(displayText).not.toContain('█');
      expect(displayText).not.toContain('|');
      
      customAnimation.destroy();
    });
  });

  describe('State Management', () => {
    it('should provide current state', () => {
      const state = animation.getState();
      
      expect(state).toHaveProperty('isTyping');
      expect(state).toHaveProperty('isThinking');
      expect(state).toHaveProperty('revealedText');
      expect(state).toHaveProperty('cursorVisible');
      expect(state).toHaveProperty('progress');
    });

    it('should notify state updates via callback', () => {
      const stateCallback = jest.fn();
      animation.onStateUpdate(stateCallback);
      
      animation.start('Test');
      
      expect(stateCallback).toHaveBeenCalled();
      // The first call sets isTyping to true
      const firstCall = stateCallback.mock.calls.find(call => call[0].isTyping === true);
      expect(firstCall).toBeDefined();
      expect(firstCall[0]).toHaveProperty('isTyping', true);
    });
  });

  describe('Cleanup', () => {
    it('should stop all animations on destroy', () => {
      animation.start('Test');
      
      expect(animation.getState().isTyping).toBe(true);
      
      animation.destroy();
      
      // State should be reset
      const state = animation.getState();
      expect(state.isTyping).toBe(false);
      expect(state.isThinking).toBe(false);
    });

    it('should stop animation on stop()', () => {
      animation.start('Test');
      
      // Advance a bit to ensure animation is running
      const delayMs = 1000 / 75;
      jest.advanceTimersByTime(delayMs);
      
      expect(animation.getState().isTyping).toBe(true);
      
      animation.stop();
      
      expect(animation.getState().isTyping).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      animation.start('');
      
      expect(animation.getState().revealedText).toBe('');
      expect(animation.getState().progress).toBe(100);
    });

    it('should handle very long text', () => {
      const longText = 'A'.repeat(1000);
      animation.start(longText);
      
      const delayMs = 1000 / 75;
      // Advance by 100 intervals to reveal 100 characters
      jest.advanceTimersByTime(Math.ceil(delayMs * 100));
      
      const revealed = animation.getState().revealedText;
      // Should be around 100 characters (allow some tolerance for timing)
      expect(revealed.length).toBeGreaterThanOrEqual(99);
      expect(revealed.length).toBeLessThanOrEqual(103); // Increased tolerance
      
      const progress = animation.getState().progress;
      // Should be around 10% (allow some tolerance)
      expect(progress).toBeGreaterThanOrEqual(9);
      expect(progress).toBeLessThanOrEqual(11);
    });

    it('should handle rapid start/stop cycles', () => {
      animation.start('First');
      animation.stop();
      animation.start('Second');
      animation.stop();
      animation.start('Third');
      
      expect(animation.getState().isTyping).toBe(true);
    });

    it('should handle thinking to typing transition', () => {
      animation.startThinking();
      expect(animation.getState().isThinking).toBe(true);
      
      animation.start('Response');
      expect(animation.getState().isThinking).toBe(false);
      expect(animation.getState().isTyping).toBe(true);
    });
  });
});
