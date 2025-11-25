// Navigation tests for GamesAdapter
// Tests for Requirements 5.1, 5.2, 5.3, 5.4, 5.5

import { GamesAdapter } from '../GamesAdapter';
import * as admin from 'firebase-admin';

// Mock firebase-admin
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

  return {
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(),
          set: jest.fn(),
          update: jest.fn(),
          delete: jest.fn()
        }))
      }))
    })),
    Timestamp: mockTimestamp
  };
});

// Mock Vertex AI
jest.mock('@google-cloud/vertexai', () => {
  return {
    VertexAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn(() => ({
        generateContent: jest.fn(() => Promise.resolve({
          response: {
            candidates: [{
              content: {
                parts: [{
                  text: 'Great job! You really know your stuff!'
                }]
              }
            }]
          }
        }))
      }))
    }))
  };
});

// Mock axios
jest.mock('axios');

describe('GamesAdapter Navigation', () => {
  let adapter: GamesAdapter;
  let mockFirestore: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock Firestore
    mockFirestore = {
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(),
          set: jest.fn(),
          update: jest.fn(),
          delete: jest.fn()
        }))
      }))
    };

    (admin.firestore as unknown as jest.Mock).mockReturnValue(mockFirestore);
    
    adapter = new GamesAdapter();
  });

  describe('Game selection page (600)', () => {
    it('should set inputMode to single for game selection', async () => {
      const page = await adapter.getPage('600');
      
      expect(page.meta?.inputMode).toBe('single');
    });

    it('should provide inputOptions for game selection', async () => {
      const page = await adapter.getPage('600');
      
      expect(page.meta?.inputOptions).toEqual(['1', '2', '3']);
    });

    it('should have links for each game option', async () => {
      const page = await adapter.getPage('600');
      
      // Should have links for options 1, 2, 3
      expect(page.links.some(link => link.label === '1' && link.targetPage === '601')).toBe(true);
      expect(page.links.some(link => link.label === '2' && link.targetPage === '610')).toBe(true);
      expect(page.links.some(link => link.label === '3' && link.targetPage === '620')).toBe(true);
    });
  });

  describe('Quiz question pages (602-609)', () => {
    it('should set inputMode to single for quiz questions', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'What is 2+2?',
              correctAnswer: '4',
              incorrectAnswers: ['3', '5', '6'],
              category: 'Math',
              difficulty: 'easy'
            }
          ],
          currentQuestionIndex: 0,
          answers: [],
          score: 0,
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() },
          expiresAt: { toMillis: () => Date.now() + 3600000, toDate: () => new Date(Date.now() + 3600000) }
        })
      });

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet
        }))
      });

      const page = await adapter.getPage('602', { sessionId: 'test_session' });
      
      expect(page.meta?.inputMode).toBe('single');
    });

    it('should provide inputOptions for quiz answers (1-4)', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'What is 2+2?',
              correctAnswer: '4',
              incorrectAnswers: ['3', '5', '6'],
              category: 'Math',
              difficulty: 'easy'
            }
          ],
          currentQuestionIndex: 0,
          answers: [],
          score: 0,
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() },
          expiresAt: { toMillis: () => Date.now() + 3600000, toDate: () => new Date(Date.now() + 3600000) }
        })
      });

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet
        }))
      });

      const page = await adapter.getPage('602', { sessionId: 'test_session' });
      
      expect(page.meta?.inputOptions).toEqual(['1', '2', '3', '4']);
    });

    it('should have links for each answer option', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'What is 2+2?',
              correctAnswer: '4',
              incorrectAnswers: ['3', '5', '6'],
              category: 'Math',
              difficulty: 'easy'
            }
          ],
          currentQuestionIndex: 0,
          answers: [],
          score: 0,
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() },
          expiresAt: { toMillis: () => Date.now() + 3600000, toDate: () => new Date(Date.now() + 3600000) }
        })
      });

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet
        }))
      });

      const page = await adapter.getPage('602', { sessionId: 'test_session' });
      
      // Should have links for options 1, 2, 3, 4
      expect(page.links.some(link => link.label === '1')).toBe(true);
      expect(page.links.some(link => link.label === '2')).toBe(true);
      expect(page.links.some(link => link.label === '3')).toBe(true);
      expect(page.links.some(link => link.label === '4')).toBe(true);
    });
  });

  describe('Bamboozle game pages (611-619)', () => {
    it('should set inputMode to single for Bamboozle questions with existing session', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'bamboozle_test',
          currentPage: '611',
          path: [],
          score: 0,
          choices: {},
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() },
          expiresAt: { toMillis: () => Date.now() + 3600000, toDate: () => new Date(Date.now() + 3600000) }
        })
      });
      const mockUpdate = jest.fn().mockResolvedValue(undefined);

      mockFirestore.collection.mockImplementation((collectionName: string) => ({
        doc: jest.fn(() => ({
          get: mockGet,
          update: mockUpdate
        }))
      }));

      const page = await adapter.getPage('611', { sessionId: 'bamboozle_test' });
      
      expect(page.meta?.inputMode).toBe('single');
    });

    it('should provide inputOptions for Bamboozle choices (1-3) with existing session', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'bamboozle_test',
          currentPage: '611',
          path: [],
          score: 0,
          choices: {},
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() },
          expiresAt: { toMillis: () => Date.now() + 3600000, toDate: () => new Date(Date.now() + 3600000) }
        })
      });
      const mockUpdate = jest.fn().mockResolvedValue(undefined);

      mockFirestore.collection.mockImplementation((collectionName: string) => ({
        doc: jest.fn(() => ({
          get: mockGet,
          update: mockUpdate
        }))
      }));

      const page = await adapter.getPage('611', { sessionId: 'bamboozle_test' });
      
      expect(page.meta?.inputOptions).toEqual(['1', '2', '3']);
    });

    it('should have links for each Bamboozle choice with existing session', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'bamboozle_test',
          currentPage: '611',
          path: [],
          score: 0,
          choices: {},
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() },
          expiresAt: { toMillis: () => Date.now() + 3600000, toDate: () => new Date(Date.now() + 3600000) }
        })
      });
      const mockUpdate = jest.fn().mockResolvedValue(undefined);

      mockFirestore.collection.mockImplementation((collectionName: string) => ({
        doc: jest.fn(() => ({
          get: mockGet,
          update: mockUpdate
        }))
      }));

      const page = await adapter.getPage('611', { sessionId: 'bamboozle_test' });
      
      // Should have links for options 1, 2, 3
      expect(page.links.some(link => link.label === '1')).toBe(true);
      expect(page.links.some(link => link.label === '2')).toBe(true);
      expect(page.links.some(link => link.label === '3')).toBe(true);
    });

    it('should maintain inputMode across different Bamboozle pages', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'bamboozle_test',
          currentPage: '612',
          path: ['611'],
          score: 30,
          choices: { '611': 1 },
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() },
          expiresAt: { toMillis: () => Date.now() + 3600000, toDate: () => new Date(Date.now() + 3600000) }
        })
      });
      const mockUpdate = jest.fn().mockResolvedValue(undefined);

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet,
          update: mockUpdate
        }))
      });

      const page = await adapter.getPage('612', { sessionId: 'bamboozle_test' });
      
      expect(page.meta?.inputMode).toBe('single');
      expect(page.meta?.inputOptions).toEqual(['1', '2', '3']);
    });
  });

  describe('Quiz state management', () => {
    it('should maintain quiz state across page transitions', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'Question 1',
              correctAnswer: 'A',
              incorrectAnswers: ['B', 'C', 'D'],
              category: 'Test',
              difficulty: 'easy'
            },
            {
              question: 'Question 2',
              correctAnswer: 'X',
              incorrectAnswers: ['Y', 'Z', 'W'],
              category: 'Test',
              difficulty: 'easy'
            }
          ],
          currentQuestionIndex: 1,
          answers: [true],
          score: 1,
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() },
          expiresAt: { toMillis: () => Date.now() + 3600000, toDate: () => new Date(Date.now() + 3600000) }
        })
      });

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet
        }))
      });

      const page = await adapter.getPage('602', { sessionId: 'test_session' });
      
      // Should show question 2 (index 1)
      expect(page.meta?.progress?.current).toBe(2);
      expect(page.meta?.progress?.total).toBe(2);
    });
  });

  describe('Complete quiz flow', () => {
    it('should show quiz intro page with navigation to questions', async () => {
      // Test that page 601 (quiz intro) has proper navigation
      const mockSet = jest.fn().mockResolvedValue(undefined);
      mockFirestore.collection.mockImplementation((collectionName: string) => ({
        doc: jest.fn(() => ({
          set: mockSet
        }))
      }));

      // Start quiz - page 601 shows intro
      const startPage = await adapter.getPage('601');
      expect(startPage.id).toBe('601');
      // Should have a link to start the quiz (page 602)
      expect(startPage.links.some(link => link.targetPage === '602')).toBe(true);
    });

    it('should show quiz questions with single-digit input mode', async () => {
      // Test that quiz questions have proper input mode
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'Question 1',
              correctAnswer: 'A',
              incorrectAnswers: ['B', 'C', 'D'],
              category: 'Test',
              difficulty: 'easy'
            }
          ],
          currentQuestionIndex: 0,
          answers: [],
          score: 0,
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() },
          expiresAt: { toMillis: () => Date.now() + 3600000, toDate: () => new Date(Date.now() + 3600000) }
        })
      });

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet
        }))
      });

      // Get first question
      const questionPage = await adapter.getPage('602', { sessionId: 'test_session' });
      expect(questionPage.meta?.inputMode).toBe('single');
      expect(questionPage.meta?.inputOptions).toEqual(['1', '2', '3', '4']);
    });
  });
});
