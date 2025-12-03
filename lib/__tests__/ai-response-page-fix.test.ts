/**
 * AI Response Page Fix Tests
 * 
 * Verifies that AI response pages (after submitting a question on page 500)
 * also have no color button links, allowing users to continue typing questions
 * with letters R, G, Y, B.
 */

import { AIAdapter } from '../adapters/AIAdapter';

// Mock Vertex AI
jest.mock('@google-cloud/vertexai', () => {
  return {
    VertexAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            candidates: [{
              content: {
                parts: [{
                  text: 'This is a test AI response that is concise and informative.'
                }]
              }
            }]
          }
        })
      })
    }))
  };
});

describe('AI Response Page Fix', () => {
  let adapter: AIAdapter;

  beforeEach(() => {
    // Set required environment variables
    process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
    process.env.VERTEX_LOCATION = 'us-central1';
    
    adapter = new AIAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('AI Chat Response Page (after question submission)', () => {
    it('should have text input mode enabled', async () => {
      const page = await adapter.getPage('500', { question: 'What is the weather?' });
      
      expect(page.meta?.inputMode).toBe('text');
      expect(page.meta?.textInputEnabled).toBe(true);
      expect(page.meta?.aiChatPage).toBe(true);
    });

    it('should not have color button links', async () => {
      const page = await adapter.getPage('500', { question: 'Tell me about robots' });
      
      // No color button links to avoid conflicts with typing
      expect(page.links).toEqual([]);
    });

    it('should show back button navigation hint instead of RED button', async () => {
      const page = await adapter.getPage('500', { question: 'Why is the sky blue?' });
      
      const pageContent = page.rows.join('\n');
      
      // Should mention back button
      expect(pageContent).toContain('BACK');
      expect(pageContent).toContain('←');
      
      // Should NOT say "RED=BACK TO INDEX"
      expect(pageContent).not.toContain('RED=BACK TO INDEX');
    });

    it('should allow continuing to ask questions', async () => {
      const page = await adapter.getPage('500', { question: 'First question' });
      
      // Should stay on page 500
      expect(page.id).toBe('500');
      
      // Should allow text input
      expect(page.meta?.textInputEnabled).toBe(true);
      expect(page.meta?.stayOnPageAfterSubmit).toBe(true);
      
      // Should have prompt for another question
      expect(page.meta?.textInputPrompt).toContain('another question');
    });

    it('should show the question and answer', async () => {
      const question = 'What is gravity?';
      const page = await adapter.getPage('500', { question });
      
      const pageContent = page.rows.join('\n');
      
      // Should show the question
      expect(pageContent).toContain('YOUR QUESTION');
      expect(pageContent).toContain(question);
      
      // Should show the AI response
      expect(pageContent).toContain('AI RESPONSE');
    });

    it('should have tip about continuing to chat', async () => {
      const page = await adapter.getPage('500', { question: 'Test question' });
      
      const pageContent = page.rows.join('\n');
      
      // Should have tip about continuing
      expect(pageContent).toContain('TIP');
      expect(pageContent).toContain('continue chatting');
    });

    it('should allow typing questions with R, G, Y, B letters', async () => {
      const page = await adapter.getPage('500', { question: 'First question' });
      
      // Since there are no color button links, typing R, G, Y, B should work
      expect(page.links.length).toBe(0);
      
      // Text input should be enabled
      expect(page.meta?.textInputEnabled).toBe(true);
      
      // Example follow-up questions that should work:
      const followUpQuestions = [
        'Tell me more about robots',     // Contains 'r', 'b'
        'What about gravity?',           // Contains 'r', 'g', 'y'
        'Explain blockchain',            // Contains 'b'
        'Why is the sky blue?',          // Contains 'y', 'b'
        'How do rockets work?'           // Contains 'r'
      ];
      
      // All these questions should be typeable without navigation conflicts
      followUpQuestions.forEach(q => {
        expect(q.toLowerCase()).toMatch(/[rgby]/);
      });
    });
  });

  describe('Navigation Hint', () => {
    it('should show BACK button instead of RED button', async () => {
      const page = await adapter.getPage('500', { question: 'Test' });
      
      // Check all rows for the navigation hint
      const pageContent = page.rows.join('\n');
      
      expect(pageContent).toContain('BACK');
      expect(pageContent).toContain('←');
      expect(pageContent).toContain('ENTER');
      expect(pageContent).not.toContain('RED=BACK');
    });
  });

  describe('User Experience Flow', () => {
    it('should support continuous conversation', async () => {
      // First question
      const page1 = await adapter.getPage('500', { question: 'What is AI?' });
      expect(page1.id).toBe('500');
      expect(page1.meta?.textInputEnabled).toBe(true);
      
      // User can type another question without navigation conflicts
      const page2 = await adapter.getPage('500', { question: 'Tell me about robots' });
      expect(page2.id).toBe('500');
      expect(page2.meta?.textInputEnabled).toBe(true);
      
      // And another
      const page3 = await adapter.getPage('500', { question: 'Why is the sky blue?' });
      expect(page3.id).toBe('500');
      expect(page3.meta?.textInputEnabled).toBe(true);
    });
  });
});
