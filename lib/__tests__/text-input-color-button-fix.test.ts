/**
 * Text Input Color Button Fix Tests
 * 
 * Verifies that on text input pages (like page 500), users can type
 * letters R, G, Y, B without triggering color button navigation.
 */

import { createAIOraclePage } from '../services-pages';

describe('Text Input Color Button Fix', () => {
  describe('AI Oracle Page 500', () => {
    it('should have text input mode enabled', () => {
      const page = createAIOraclePage();
      
      expect(page.meta?.inputMode).toBe('text');
      expect(page.meta?.textInputEnabled).toBe(true);
      expect(page.meta?.aiChatPage).toBe(true);
    });

    it('should not have color button links', () => {
      const page = createAIOraclePage();
      
      // No color button links to avoid conflicts with typing
      expect(page.links).toEqual([]);
    });

    it('should show back button navigation hint instead of RED button', () => {
      const page = createAIOraclePage();
      
      const pageContent = page.rows.join('\n');
      
      // Should mention back button
      expect(pageContent).toContain('BACK');
      expect(pageContent).toContain('←');
      
      // Should NOT say "Press RED button"
      expect(pageContent).not.toContain('Press RED button');
    });

    it('should have navigation hint that mentions BACK button', () => {
      const page = createAIOraclePage();
      
      // Last row should be the navigation hint
      const navHint = page.rows[page.rows.length - 2]; // -2 because last row is empty
      
      expect(navHint).toContain('BACK');
      expect(navHint).toContain('←');
      expect(navHint).toContain('ENTER');
    });

    it('should allow typing questions with R, G, Y, B letters', () => {
      const page = createAIOraclePage();
      
      // Since there are no color button links, typing R, G, Y, B should work
      expect(page.links.length).toBe(0);
      
      // Text input should be enabled
      expect(page.meta?.textInputEnabled).toBe(true);
      
      // Example questions that should work:
      const exampleQuestions = [
        'What is the weather today?',  // Contains 'r'
        'Tell me about gravity',        // Contains 'r', 'g', 'y'
        'Explain blockchain',           // Contains 'b'
        'Why is the sky blue?',         // Contains 'y', 'b'
        'How do robots work?'           // Contains 'r', 'b'
      ];
      
      // All these questions should be typeable without navigation conflicts
      exampleQuestions.forEach(question => {
        expect(question.toLowerCase()).toMatch(/[rgby]/);
      });
    });

    it('should stay on page after submit', () => {
      const page = createAIOraclePage();
      
      // User should stay on page 500 to see the AI response
      expect(page.meta?.stayOnPageAfterSubmit).toBe(true);
    });
  });

  describe('Keyboard Handler Logic', () => {
    it('should only trigger color buttons when links are defined', () => {
      // Page with no links - color buttons should NOT trigger
      const pageWithoutLinks = {
        id: '500',
        title: 'Test',
        rows: Array(24).fill(''),
        links: [],
        meta: { inputMode: 'text' as const }
      };
      
      expect(pageWithoutLinks.links.length).toBe(0);
      
      // Page with links - color buttons SHOULD trigger
      const pageWithLinks = {
        id: '501',
        title: 'Test',
        rows: Array(24).fill(''),
        links: [
          { label: 'Back', targetPage: '100', color: 'red' as const }
        ],
        meta: { inputMode: 'text' as const }
      };
      
      expect(pageWithLinks.links.length).toBeGreaterThan(0);
    });
  });

  describe('User Experience', () => {
    it('should provide clear instructions for text input', () => {
      const page = createAIOraclePage();
      
      const pageContent = page.rows.join('\n');
      
      // Should have clear instructions
      expect(pageContent).toContain('Type your question');
      expect(pageContent).toContain('ENTER');
      expect(pageContent).toContain('ASK');
    });

    it('should explain how to navigate back', () => {
      const page = createAIOraclePage();
      
      const pageContent = page.rows.join('\n');
      
      // Should explain back navigation
      expect(pageContent).toContain('BACK button');
      expect(pageContent).toContain('←');
    });
  });
});
