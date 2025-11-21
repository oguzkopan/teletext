/**
 * Tests for Loading Text Rotation
 * 
 * Requirements: 14.5
 */

import {
  LoadingTextRotation,
  getLoadingMessages,
  createLoadingTextRotation
} from '../loading-text-rotation';

describe('LoadingTextRotation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Basic Functionality', () => {
    it('should initialize with first message', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      expect(rotation.getCurrentMessage()).toBe('LOADING...');
      expect(rotation.getCurrentIndex()).toBe(0);
    });

    it('should rotate messages every 2 seconds by default', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      rotation.start();

      expect(rotation.getCurrentMessage()).toBe('LOADING...');

      jest.advanceTimersByTime(2000);
      expect(rotation.getCurrentMessage()).toBe('FETCHING DATA...');

      jest.advanceTimersByTime(2000);
      expect(rotation.getCurrentMessage()).toBe('ALMOST THERE...');

      rotation.stop();
    });

    it('should loop back to first message after last', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      rotation.start();

      const messages = rotation.getMessages();
      
      // Advance through all messages
      for (let i = 0; i < messages.length; i++) {
        jest.advanceTimersByTime(2000);
      }

      // Should be back at first message
      expect(rotation.getCurrentMessage()).toBe(messages[0]);

      rotation.stop();
    });

    it('should stop rotation when stop is called', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      rotation.start();

      expect(rotation.isActive()).toBe(true);

      rotation.stop();
      expect(rotation.isActive()).toBe(false);

      const messageBefore = rotation.getCurrentMessage();
      jest.advanceTimersByTime(5000);
      expect(rotation.getCurrentMessage()).toBe(messageBefore);
    });
  });

  describe('Theme-Specific Messages', () => {
    it('should use Ceefax messages for ceefax theme', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      const messages = rotation.getMessages();
      
      expect(messages).toContain('LOADING...');
      expect(messages).toContain('FETCHING DATA...');
      expect(messages).toContain('ALMOST THERE...');
    });

    it('should use Haunting messages for haunting theme', () => {
      const rotation = new LoadingTextRotation({ theme: 'haunting' });
      const messages = rotation.getMessages();
      
      expect(messages).toContain('SUMMONING...');
      expect(messages).toContain('AWAKENING SPIRITS...');
      expect(messages).toContain('CONJURING DATA...');
    });

    it('should use High Contrast messages for high-contrast theme', () => {
      const rotation = new LoadingTextRotation({ theme: 'high-contrast' });
      const messages = rotation.getMessages();
      
      expect(messages).toContain('LOADING...');
      expect(messages).toContain('FETCHING...');
      expect(messages).toContain('PROCESSING...');
    });

    it('should use ORF messages for orf theme', () => {
      const rotation = new LoadingTextRotation({ theme: 'orf' });
      const messages = rotation.getMessages();
      
      expect(messages).toContain('LADEN...');
      expect(messages).toContain('DATEN ABRUFEN...');
      expect(messages).toContain('BITTE WARTEN...');
    });

    it('should switch messages when theme changes', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      rotation.start();

      expect(rotation.getCurrentMessage()).toBe('LOADING...');

      rotation.setTheme('haunting');
      expect(rotation.getCurrentMessage()).toBe('SUMMONING...');

      rotation.stop();
    });
  });

  describe('Custom Configuration', () => {
    it('should accept custom rotation interval', () => {
      const rotation = new LoadingTextRotation({ 
        theme: 'ceefax',
        rotationInterval: 1000 
      });
      rotation.start();

      expect(rotation.getCurrentMessage()).toBe('LOADING...');

      jest.advanceTimersByTime(1000);
      expect(rotation.getCurrentMessage()).toBe('FETCHING DATA...');

      rotation.stop();
    });

    it('should accept custom messages', () => {
      const customMessages = ['CUSTOM 1', 'CUSTOM 2', 'CUSTOM 3'];
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      
      rotation.setMessages(customMessages);
      rotation.start();

      expect(rotation.getCurrentMessage()).toBe('CUSTOM 1');

      jest.advanceTimersByTime(2000);
      expect(rotation.getCurrentMessage()).toBe('CUSTOM 2');

      rotation.stop();
    });

    it('should not accept empty messages array', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      rotation.setMessages([]);

      expect(consoleWarnSpy).toHaveBeenCalledWith('Cannot set empty messages array');
      expect(rotation.getMessages().length).toBeGreaterThan(0);

      consoleWarnSpy.mockRestore();
    });

    it('should enforce minimum rotation interval', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      rotation.setRotationInterval(50);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Rotation interval too short, using minimum of 100ms'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Callback Functionality', () => {
    it('should call onUpdate callback when message changes', () => {
      const onUpdate = jest.fn();
      const rotation = new LoadingTextRotation({ theme: 'ceefax' }, onUpdate);
      
      rotation.start();

      expect(onUpdate).toHaveBeenCalledWith('LOADING...');

      jest.advanceTimersByTime(2000);
      expect(onUpdate).toHaveBeenCalledWith('FETCHING DATA...');

      rotation.stop();
    });

    it('should call onUpdate when theme changes', () => {
      const onUpdate = jest.fn();
      const rotation = new LoadingTextRotation({ theme: 'ceefax' }, onUpdate);
      
      onUpdate.mockClear();
      rotation.setTheme('haunting');

      expect(onUpdate).toHaveBeenCalledWith('SUMMONING...');
    });

    it('should call onUpdate when custom messages are set', () => {
      const onUpdate = jest.fn();
      const rotation = new LoadingTextRotation({ theme: 'ceefax' }, onUpdate);
      
      onUpdate.mockClear();
      rotation.setMessages(['NEW MESSAGE']);

      expect(onUpdate).toHaveBeenCalledWith('NEW MESSAGE');
    });
  });

  describe('State Tracking', () => {
    it('should track elapsed time', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      rotation.start();

      expect(rotation.getElapsedTime()).toBe(0);

      jest.advanceTimersByTime(1000);
      expect(rotation.getElapsedTime()).toBeGreaterThanOrEqual(1000);

      jest.advanceTimersByTime(1500);
      expect(rotation.getElapsedTime()).toBeGreaterThanOrEqual(2500);

      rotation.stop();
    });

    it('should detect when rotation has occurred', () => {
      const rotation = new LoadingTextRotation({ 
        theme: 'ceefax',
        rotationInterval: 2000 
      });
      rotation.start();

      expect(rotation.hasRotated()).toBe(false);

      jest.advanceTimersByTime(1000);
      expect(rotation.hasRotated()).toBe(false);

      jest.advanceTimersByTime(1000);
      expect(rotation.hasRotated()).toBe(true);

      rotation.stop();
    });

    it('should reset elapsed time when restarted', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      rotation.start();

      jest.advanceTimersByTime(3000);
      expect(rotation.getElapsedTime()).toBeGreaterThanOrEqual(3000);

      rotation.stop();
      rotation.start();

      expect(rotation.getElapsedTime()).toBeLessThan(100);

      rotation.stop();
    });
  });

  describe('Convenience Functions', () => {
    it('should get loading messages for theme', () => {
      const ceefaxMessages = getLoadingMessages('ceefax');
      expect(ceefaxMessages).toContain('LOADING...');

      const hauntingMessages = getLoadingMessages('haunting');
      expect(hauntingMessages).toContain('SUMMONING...');

      const orfMessages = getLoadingMessages('orf');
      expect(orfMessages).toContain('LADEN...');
    });

    it('should create rotation instance with factory function', () => {
      const onUpdate = jest.fn();
      const rotation = createLoadingTextRotation('ceefax', onUpdate);

      expect(rotation).toBeInstanceOf(LoadingTextRotation);
      expect(rotation.getCurrentMessage()).toBe('LOADING...');

      rotation.start();
      expect(onUpdate).toHaveBeenCalled();

      rotation.stop();
    });

    it('should return default messages for unknown theme', () => {
      const messages = getLoadingMessages('unknown-theme');
      expect(messages).toContain('LOADING...');
      expect(messages).toContain('FETCHING DATA...');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid start/stop calls', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });

      rotation.start();
      rotation.stop();
      rotation.start();
      rotation.stop();
      rotation.start();

      expect(rotation.isActive()).toBe(true);

      rotation.stop();
      expect(rotation.isActive()).toBe(false);
    });

    it('should handle theme change while rotating', () => {
      const rotation = new LoadingTextRotation({ theme: 'ceefax' });
      rotation.start();

      jest.advanceTimersByTime(2000);
      expect(rotation.getCurrentMessage()).toBe('FETCHING DATA...');

      rotation.setTheme('haunting');
      expect(rotation.getCurrentMessage()).toBe('SUMMONING...');

      jest.advanceTimersByTime(2000);
      expect(rotation.getCurrentMessage()).toBe('AWAKENING SPIRITS...');

      rotation.stop();
    });

    it('should handle interval change while rotating', () => {
      const rotation = new LoadingTextRotation({ 
        theme: 'ceefax',
        rotationInterval: 2000 
      });
      rotation.start();

      jest.advanceTimersByTime(1000);
      
      rotation.setRotationInterval(1000);
      
      // Should restart with new interval
      expect(rotation.isActive()).toBe(true);

      rotation.stop();
    });
  });
});
