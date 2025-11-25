// Navigation tests for AIAdapter
// Tests that AI pages have proper inputMode and inputOptions metadata

import { AIAdapter } from '../AIAdapter';

// Mock Firebase Admin
jest.mock('firebase-admin', () => {
  const mockTimestamp = {
    now: jest.fn(() => ({
      toMillis: () => Date.now(),
      toDate: () => new Date()
    })),
    fromMillis: jest.fn((millis: number) => ({
      toMillis: () => millis,
      toDate: () => new Date(millis)
    }))
  };

  const mockFieldValue = {
    increment: jest.fn((n: number) => n),
    arrayUnion: jest.fn((...items: any[]) => items)
  };

  const mockFirestore = {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ exists: false, data: () => null })),
        set: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve())
      })),
      where: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ empty: true, docs: [] }))
      })),
      orderBy: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ empty: true, docs: [] }))
        }))
      }))
    })),
    Timestamp: mockTimestamp,
    FieldValue: mockFieldValue
  };

  return {
    initializeApp: jest.fn(),
    firestore: jest.fn(() => mockFirestore),
    apps: [],
    credential: {
      cert: jest.fn()
    },
    Timestamp: mockTimestamp,
    FieldValue: mockFieldValue
  };
});

// Mock Vertex AI
jest.mock('@google-cloud/vertexai', () => {
  return {
    VertexAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn(() => ({
        generateContent: jest.fn(() =>
          Promise.resolve({
            response: {
              candidates: [
                {
                  content: {
                    parts: [{ text: 'This is a test AI response.' }]
                  }
                }
              ]
            }
          })
        )
      }))
    }))
  };
});

describe('AIAdapter Navigation', () => {
  let adapter: AIAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
    process.env.VERTEX_LOCATION = 'us-central1';
    adapter = new AIAdapter();
  });

  describe('AI Index Page (500)', () => {
    it('should not have single-digit input mode', async () => {
      const page = await adapter.getPage('500');
      
      // Page 500 uses 3-digit navigation (510, 520, 505)
      expect(page.meta?.inputMode).toBeUndefined();
      expect(page.meta?.inputOptions).toBeUndefined();
    });

    it('should have links to AI services', async () => {
      const page = await adapter.getPage('500');
      
      // Should have colored button links
      const hasQALink = page.links.some(link => link.targetPage === '510');
      const hasHistoryLink = page.links.some(link => link.targetPage === '520');
      
      expect(hasQALink).toBe(true);
      expect(hasHistoryLink).toBe(true);
    });
  });

  describe('Spooky Story Menu Page (505)', () => {
    it('should have single-digit input mode', async () => {
      const page = await adapter.getPage('505');
      
      // Requirement: 4.1 - AI selection pages should accept numeric input
      expect(page.meta?.inputMode).toBe('single');
    });

    it('should have inputOptions array with 6 options', async () => {
      const page = await adapter.getPage('505');
      
      // Requirement: 4.2 - Should navigate to corresponding AI page
      expect(page.meta?.inputOptions).toEqual(['1', '2', '3', '4', '5', '6']);
    });

    it('should have links for all theme options', async () => {
      const page = await adapter.getPage('505');
      
      // Should have links for options 1-6
      const option1Link = page.links.find(link => link.label === '1');
      const option2Link = page.links.find(link => link.label === '2');
      const option3Link = page.links.find(link => link.label === '3');
      const option4Link = page.links.find(link => link.label === '4');
      const option5Link = page.links.find(link => link.label === '5');
      const option6Link = page.links.find(link => link.label === '6');
      
      expect(option1Link).toBeDefined();
      expect(option1Link?.targetPage).toBe('506');
      expect(option2Link).toBeDefined();
      expect(option2Link?.targetPage).toBe('507');
      expect(option3Link).toBeDefined();
      expect(option3Link?.targetPage).toBe('508');
      expect(option4Link).toBeDefined();
      expect(option4Link?.targetPage).toBe('509');
      expect(option5Link).toBeDefined();
      expect(option6Link).toBeDefined();
    });

    it('should not cause page refresh loops', async () => {
      const page = await adapter.getPage('505');
      
      // Requirement: 4.5 - Should not refresh the same page repeatedly
      // Verify that no link points back to page 505
      const selfLink = page.links.find(link => link.targetPage === '505');
      
      // Only BACK button should point to 500, not 505
      expect(selfLink).toBeUndefined();
    });
  });

  describe('Q&A Topic Selection Page (510)', () => {
    it('should have single-digit input mode', async () => {
      const page = await adapter.getPage('510');
      
      // Requirement: 4.1 - AI selection pages should accept numeric input
      expect(page.meta?.inputMode).toBe('single');
    });

    it('should have inputOptions array with 5 options', async () => {
      const page = await adapter.getPage('510');
      
      // Requirement: 4.2 - Should navigate to corresponding AI page
      expect(page.meta?.inputOptions).toEqual(['1', '2', '3', '4', '5']);
    });

    it('should have links for all topic options', async () => {
      const page = await adapter.getPage('510');
      
      // Should have links for options 1-5
      const option1Link = page.links.find(link => link.label === '1');
      const option2Link = page.links.find(link => link.label === '2');
      const option3Link = page.links.find(link => link.label === '3');
      const option4Link = page.links.find(link => link.label === '4');
      const option5Link = page.links.find(link => link.label === '5');
      
      expect(option1Link).toBeDefined();
      expect(option1Link?.targetPage).toBe('511');
      expect(option2Link).toBeDefined();
      expect(option2Link?.targetPage).toBe('512');
      expect(option3Link).toBeDefined();
      expect(option3Link?.targetPage).toBe('513');
      expect(option4Link).toBeDefined();
      expect(option4Link?.targetPage).toBe('514');
      expect(option5Link).toBeDefined();
      expect(option5Link?.targetPage).toBe('515');
    });

    it('should not cause page refresh loops', async () => {
      const page = await adapter.getPage('510');
      
      // Requirement: 4.5 - Should not refresh the same page repeatedly
      // Verify that no link points back to page 510
      const selfLink = page.links.find(link => link.targetPage === '510');
      
      expect(selfLink).toBeUndefined();
    });
  });

  describe('Navigation Flow', () => {
    it('should allow navigation from AI index to spooky stories', async () => {
      const indexPage = await adapter.getPage('500');
      
      // Page 500 uses 3-digit navigation, so user types "505" to get to spooky stories
      // The colored buttons are for Q&A (510) and HISTORY (520)
      const contentText = indexPage.rows.join('\n');
      expect(contentText).toContain('Spooky Stories');
      expect(contentText).toContain('505');
      
      // Navigate to spooky stories page by typing 505
      const spookyPage = await adapter.getPage('505');
      expect(spookyPage.id).toBe('505');
      expect(spookyPage.meta?.inputMode).toBe('single');
    });

    it('should allow navigation from AI index to Q&A', async () => {
      const indexPage = await adapter.getPage('500');
      const qaLink = indexPage.links.find(link => link.targetPage === '510');
      
      expect(qaLink).toBeDefined();
      
      // Navigate to Q&A page
      const qaPage = await adapter.getPage('510');
      expect(qaPage.id).toBe('510');
      expect(qaPage.meta?.inputMode).toBe('single');
    });

    it('should allow navigation from spooky stories to theme pages', async () => {
      const spookyPage = await adapter.getPage('505');
      const theme1Link = spookyPage.links.find(link => link.label === '1');
      
      expect(theme1Link).toBeDefined();
      expect(theme1Link?.targetPage).toBe('506');
      
      // Navigate to theme page
      const themePage = await adapter.getPage('506');
      expect(themePage.id).toBe('506');
    });

    it('should allow navigation from Q&A to topic pages', async () => {
      const qaPage = await adapter.getPage('510');
      const topic1Link = qaPage.links.find(link => link.label === '1');
      
      expect(topic1Link).toBeDefined();
      expect(topic1Link?.targetPage).toBe('511');
      
      // Navigate to topic page
      const topicPage = await adapter.getPage('511');
      expect(topicPage.id).toBe('511');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid page numbers gracefully', async () => {
      // Requirement: 4.3 - Display error for invalid option
      await expect(adapter.getPage('999')).rejects.toThrow();
    });

    it('should provide navigation back to index on error pages', async () => {
      // Error pages should have INDEX link
      const placeholderPage = await adapter.getPage('550');
      const indexLink = placeholderPage.links.find(link => link.targetPage === '100');
      
      expect(indexLink).toBeDefined();
    });
  });
});
