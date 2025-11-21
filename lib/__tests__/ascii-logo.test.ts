/**
 * Tests for ASCII Logo and Branding
 * Requirements: 29.1, 29.2, 29.3, 29.4, 29.5
 */

import {
  MODERN_TELETEXT_LOGO,
  COMPACT_LOGO,
  SIMPLE_LOGO_40,
  RETRO_LOGO,
  KIRO_BADGE,
  KIRO_BADGE_VARIANTS,
  LOGO_REVEAL_FRAMES,
  LOGO_PULSE_FRAMES,
  KIRO_BADGE_FRAMES,
  CREDITS_CONTENT,
  createLogoRevealAnimation,
  createLogoPulseAnimation,
  createKiroBadgeAnimation,
  createScrollingCreditsFrames,
  createScrollingCreditsAnimation,
  centerText,
  getRandomKiroBadge,
  formatLogoForPage,
  createBootSequenceAnimation
} from '../ascii-logo';

describe('ASCII Logo Module', () => {
  describe('Logo Definitions', () => {
    it('should have Modern Teletext logo with 3 lines', () => {
      expect(MODERN_TELETEXT_LOGO).toHaveLength(3);
      expect(MODERN_TELETEXT_LOGO[0]).toContain('╔');
      expect(MODERN_TELETEXT_LOGO[1]).toContain('MODERN TELETEXT');
      expect(MODERN_TELETEXT_LOGO[2]).toContain('╚');
    });

    it('should have compact logo', () => {
      expect(COMPACT_LOGO).toHaveLength(1);
      expect(COMPACT_LOGO[0]).toContain('MODERN TELETEXT');
    });

    it('should have simple logo that fits in 40 characters', () => {
      expect(SIMPLE_LOGO_40).toHaveLength(3);
      SIMPLE_LOGO_40.forEach(line => {
        expect(line.length).toBeLessThanOrEqual(40);
      });
    });

    it('should have retro logo', () => {
      expect(RETRO_LOGO).toHaveLength(3);
      expect(RETRO_LOGO[1]).toContain('MODERN');
      expect(RETRO_LOGO[1]).toContain('TELETEXT');
    });

    it('should have Kiro badge', () => {
      expect(KIRO_BADGE).toContain('Kiro');
      expect(KIRO_BADGE).toContain('Powered');
    });

    it('should have multiple Kiro badge variants', () => {
      expect(KIRO_BADGE_VARIANTS.length).toBeGreaterThan(1);
      KIRO_BADGE_VARIANTS.forEach(badge => {
        expect(badge).toContain('Kiro');
      });
    });
  });

  describe('Animation Frames', () => {
    it('should have logo reveal frames showing progressive reveal', () => {
      expect(LOGO_REVEAL_FRAMES.length).toBeGreaterThan(10);
      
      // First frame should be empty or minimal
      expect(LOGO_REVEAL_FRAMES[0]).toContain('╔');
      
      // Last frame should have complete logo
      const lastFrame = LOGO_REVEAL_FRAMES[LOGO_REVEAL_FRAMES.length - 1];
      expect(lastFrame).toContain('MODERN TELETEXT');
      expect(lastFrame).toContain('░▒▓█▓▒░');
    });

    it('should have logo pulse frames', () => {
      expect(LOGO_PULSE_FRAMES.length).toBeGreaterThan(3);
      LOGO_PULSE_FRAMES.forEach(frame => {
        expect(frame).toContain('MODERN TELETEXT');
      });
    });

    it('should have Kiro badge animation frames', () => {
      expect(KIRO_BADGE_FRAMES.length).toBeGreaterThan(2);
      KIRO_BADGE_FRAMES.forEach(frame => {
        expect(frame).toContain('Kiro');
      });
    });
  });

  describe('Credits Content', () => {
    it('should have credits content', () => {
      expect(CREDITS_CONTENT.length).toBeGreaterThan(20);
    });

    it('should contain key sections', () => {
      const creditsText = CREDITS_CONTENT.join('\n');
      expect(creditsText).toContain('MODERN TELETEXT');
      expect(creditsText).toContain('BUILT WITH');
      expect(creditsText).toContain('POWERED BY KIRO');
    });

    it('should have lines that fit within 40 characters', () => {
      CREDITS_CONTENT.forEach(line => {
        expect(line.length).toBeLessThanOrEqual(40);
      });
    });
  });

  describe('Animation Config Creators', () => {
    it('should create logo reveal animation config', () => {
      const config = createLogoRevealAnimation();
      
      expect(config.name).toBe('logo-reveal');
      expect(config.type).toBe('ascii-frames');
      expect(config.duration).toBeGreaterThan(0);
      expect(config.frames).toBeDefined();
      expect(config.frames?.length).toBeGreaterThan(0);
      expect(config.loop).toBe(false);
    });

    it('should create logo pulse animation config', () => {
      const config = createLogoPulseAnimation();
      
      expect(config.name).toBe('logo-pulse');
      expect(config.type).toBe('ascii-frames');
      expect(config.duration).toBeGreaterThan(0);
      expect(config.frames).toBeDefined();
      expect(config.loop).toBe(true);
    });

    it('should create Kiro badge animation config', () => {
      const config = createKiroBadgeAnimation();
      
      expect(config.name).toBe('kiro-badge-pulse');
      expect(config.type).toBe('ascii-frames');
      expect(config.duration).toBeGreaterThan(0);
      expect(config.frames).toBeDefined();
      expect(config.loop).toBe(true);
    });

    it('should create scrolling credits animation config', () => {
      const config = createScrollingCreditsAnimation();
      
      expect(config.name).toBe('scrolling-credits');
      expect(config.type).toBe('ascii-frames');
      expect(config.duration).toBeGreaterThan(0);
      expect(config.frames).toBeDefined();
      expect(config.frames?.length).toBeGreaterThan(0);
      expect(config.loop).toBe(false);
    });

    it('should create boot sequence animation configs', () => {
      const configs = createBootSequenceAnimation();
      
      expect(configs.length).toBeGreaterThan(0);
      expect(configs[0].name).toBe('logo-reveal');
    });
  });

  describe('Scrolling Credits Frames', () => {
    it('should create scrolling credits frames', () => {
      const frames = createScrollingCreditsFrames();
      
      expect(frames.length).toBeGreaterThan(0);
      
      // Each frame should be a string
      frames.forEach(frame => {
        expect(typeof frame).toBe('string');
      });
    });

    it('should create frames with correct number of lines', () => {
      const visibleLines = 24;
      const frames = createScrollingCreditsFrames(0, visibleLines);
      
      frames.forEach(frame => {
        const lines = frame.split('\n');
        expect(lines.length).toBe(visibleLines);
      });
    });

    it('should create frames with lines padded to 40 characters', () => {
      const frames = createScrollingCreditsFrames();
      
      frames.forEach(frame => {
        const lines = frame.split('\n');
        lines.forEach(line => {
          expect(line.length).toBe(40);
        });
      });
    });

    it('should show progressive scrolling through content', () => {
      const frames = createScrollingCreditsFrames();
      
      // First frame should show beginning of credits
      expect(frames[0]).toContain('MODERN TELETEXT');
      
      // Later frames should show different content
      const midFrame = frames[Math.floor(frames.length / 2)];
      expect(midFrame).not.toBe(frames[0]);
    });
  });

  describe('Utility Functions', () => {
    describe('centerText', () => {
      it('should center text within specified width', () => {
        const result = centerText('TEST', 10);
        expect(result.length).toBe(10);
        expect(result.trim()).toBe('TEST');
        expect(result.indexOf('TEST')).toBe(3); // 3 spaces on left
      });

      it('should handle text longer than width', () => {
        const result = centerText('VERY LONG TEXT HERE', 10);
        expect(result.length).toBe(10);
        expect(result).toBe('VERY LONG ');
      });

      it('should handle text equal to width', () => {
        const result = centerText('1234567890', 10);
        expect(result).toBe('1234567890');
      });

      it('should handle odd padding', () => {
        const result = centerText('TEST', 9);
        expect(result.length).toBe(9);
        expect(result.trim()).toBe('TEST');
      });
    });

    describe('getRandomKiroBadge', () => {
      it('should return a Kiro badge variant', () => {
        const badge = getRandomKiroBadge();
        expect(badge).toContain('Kiro');
        expect(KIRO_BADGE_VARIANTS).toContain(badge);
      });

      it('should return different badges on multiple calls', () => {
        const badges = new Set();
        for (let i = 0; i < 20; i++) {
          badges.add(getRandomKiroBadge());
        }
        // Should get at least 2 different badges in 20 tries
        expect(badges.size).toBeGreaterThan(1);
      });
    });

    describe('formatLogoForPage', () => {
      it('should format logo lines to specified width', () => {
        const logo = ['SHORT', 'MEDIUM LINE', 'VERY LONG LINE THAT EXCEEDS WIDTH'];
        const formatted = formatLogoForPage(logo, 20);
        
        expect(formatted.length).toBe(3);
        formatted.forEach(line => {
          expect(line.length).toBe(20);
        });
      });

      it('should pad short lines', () => {
        const logo = ['TEST'];
        const formatted = formatLogoForPage(logo, 40);
        
        expect(formatted[0].length).toBe(40);
        expect(formatted[0].trim()).toBe('TEST');
      });

      it('should truncate long lines', () => {
        const logo = ['THIS IS A VERY LONG LINE THAT EXCEEDS FORTY CHARACTERS'];
        const formatted = formatLogoForPage(logo, 40);
        
        expect(formatted[0].length).toBe(40);
      });

      it('should default to 40 character width', () => {
        const logo = ['TEST'];
        const formatted = formatLogoForPage(logo);
        
        expect(formatted[0].length).toBe(40);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should create complete boot sequence with logo reveal', () => {
      const animations = createBootSequenceAnimation();
      const logoReveal = animations[0];
      
      expect(logoReveal.frames).toBeDefined();
      expect(logoReveal.frames!.length).toBeGreaterThan(10);
      
      // Verify progressive reveal - last frame should have complete text
      const lastFrame = logoReveal.frames![logoReveal.frames!.length - 1];
      
      expect(lastFrame).toContain('MODERN TELETEXT');
      expect(lastFrame).toContain('░▒▓█▓▒░');
    });

    it('should format Modern Teletext logo for page display', () => {
      const formatted = formatLogoForPage(MODERN_TELETEXT_LOGO);
      
      expect(formatted.length).toBe(3);
      formatted.forEach(line => {
        expect(line.length).toBe(40);
      });
      
      expect(formatted[1]).toContain('MODERN TELETEXT');
    });

    it('should create scrolling credits that fit page format', () => {
      const frames = createScrollingCreditsFrames(0, 24);
      
      // Each frame should be exactly 24 lines of 40 characters
      frames.forEach(frame => {
        const lines = frame.split('\n');
        expect(lines.length).toBe(24);
        lines.forEach(line => {
          expect(line.length).toBe(40);
        });
      });
    });
  });
});

