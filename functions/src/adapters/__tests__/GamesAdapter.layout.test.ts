// Layout tests for quiz pages - verifying Requirements 11.1-11.5

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
      })),
      Timestamp: mockTimestamp
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

describe('GamesAdapter - Quiz Layout (Requirements 11.1-11.5)', () => {
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

  describe('Quiz Question Page Layout', () => {
    it('should display question text prominently (Requirement 11.1)', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'What is the capital of France?',
              correctAnswer: 'Paris',
              incorrectAnswers: ['London', 'Berlin', 'Madrid'],
              category: 'Geography',
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
      
      // Question should be visible in the page content
      const pageContent = page.rows.join('\n');
      expect(pageContent).toContain('What is the capital of France?');
      
      // Question should appear early in the page (within first 10 rows)
      const firstTenRows = page.rows.slice(0, 10).join('\n');
      expect(firstTenRows).toContain('What is the capital of France?');
    });

    it('should number answer options 1-4 with clear alignment (Requirement 11.2)', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'Test question?',
              correctAnswer: 'Answer A',
              incorrectAnswers: ['Answer B', 'Answer C', 'Answer D'],
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

      const page = await adapter.getPage('602', { sessionId: 'test_session' });
      const pageContent = page.rows.join('\n');
      
      // All options should be numbered 1-4
      expect(pageContent).toContain('1.');
      expect(pageContent).toContain('2.');
      expect(pageContent).toContain('3.');
      expect(pageContent).toContain('4.');
      
      // Options should be left-aligned (numbers at start of line)
      const optionLines = page.rows.filter(row => /^[1-4]\./.test(row.trim()));
      expect(optionLines.length).toBeGreaterThanOrEqual(4);
    });

    it('should display question counter (Requirement 11.4)', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            { question: 'Q1', correctAnswer: 'A1', incorrectAnswers: ['B1', 'C1', 'D1'], category: 'Test', difficulty: 'easy' },
            { question: 'Q2', correctAnswer: 'A2', incorrectAnswers: ['B2', 'C2', 'D2'], category: 'Test', difficulty: 'easy' },
            { question: 'Q3', correctAnswer: 'A3', incorrectAnswers: ['B3', 'C3', 'D3'], category: 'Test', difficulty: 'easy' }
          ],
          currentQuestionIndex: 1, // On question 2 of 3
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
      const pageContent = page.rows.join('\n');
      
      // Should show "Question 2/3" format
      expect(pageContent).toMatch(/Question\s+2\/3/);
    });

    it('should format all rows to exactly 40 characters', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'Test question?',
              correctAnswer: 'Answer',
              incorrectAnswers: ['Wrong1', 'Wrong2', 'Wrong3'],
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

      const page = await adapter.getPage('602', { sessionId: 'test_session' });
      
      // All rows must be exactly 40 characters
      page.rows.forEach((row, index) => {
        expect(row.length).toBe(40);
      });
    });

    it('should have exactly 24 rows', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'Test?',
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

      const page = await adapter.getPage('602', { sessionId: 'test_session' });
      expect(page.rows).toHaveLength(24);
    });
  });

  describe('Question Navigation', () => {
    it('should clear previous question before showing next (Requirement 11.5)', async () => {
      // First question
      const mockGetQ1 = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'First question about cats?',
              correctAnswer: 'Meow',
              incorrectAnswers: ['Woof', 'Moo', 'Quack'],
              category: 'Animals',
              difficulty: 'easy'
            },
            {
              question: 'Second question about dogs?',
              correctAnswer: 'Woof',
              incorrectAnswers: ['Meow', 'Moo', 'Quack'],
              category: 'Animals',
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
          get: mockGetQ1
        }))
      });

      const page1 = await adapter.getPage('602', { sessionId: 'test_session' });
      const page1Content = page1.rows.join('\n');
      
      // First page should contain first question
      expect(page1Content).toContain('cats');
      expect(page1Content).not.toContain('dogs');
      
      // Second question
      const mockGetQ2 = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'First question about cats?',
              correctAnswer: 'Meow',
              incorrectAnswers: ['Woof', 'Moo', 'Quack'],
              category: 'Animals',
              difficulty: 'easy'
            },
            {
              question: 'Second question about dogs?',
              correctAnswer: 'Woof',
              incorrectAnswers: ['Meow', 'Moo', 'Quack'],
              category: 'Animals',
              difficulty: 'easy'
            }
          ],
          currentQuestionIndex: 1, // Now on second question
          answers: [true],
          score: 1,
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() },
          expiresAt: { toMillis: () => Date.now() + 3600000, toDate: () => new Date(Date.now() + 3600000) }
        })
      });

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGetQ2
        }))
      });

      const page2 = await adapter.getPage('602', { sessionId: 'test_session' });
      const page2Content = page2.rows.join('\n');
      
      // Second page should contain second question and NOT first question
      expect(page2Content).toContain('dogs');
      expect(page2Content).not.toContain('cats');
      
      // Verify complete page replacement (no remnants of previous question)
      expect(page2.rows).toHaveLength(24);
      page2.rows.forEach(row => {
        expect(row.length).toBe(40);
      });
    });
  });

  describe('Answer Feedback Page Layout', () => {
    it('should show clear feedback (correct/incorrect) (Requirement 11.3)', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            {
              question: 'Test question?',
              correctAnswer: 'Correct Answer',
              incorrectAnswers: ['Wrong1', 'Wrong2', 'Wrong3'],
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

      const mockUpdate = jest.fn().mockResolvedValue(undefined);

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: mockGet,
          update: mockUpdate
        }))
      });

      // Process a correct answer
      const resultPage = await (adapter as any).processQuizAnswer('test_session', 0);
      const pageContent = resultPage.rows.join('\n');
      
      // Should show clear feedback
      expect(pageContent).toMatch(/CORRECT|INCORRECT/);
    });

    it('should display score after answer', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          sessionId: 'test_session',
          questions: [
            { question: 'Q1', correctAnswer: 'A1', incorrectAnswers: ['B1', 'C1', 'D1'], category: 'Test', difficulty: 'easy' },
            { question: 'Q2', correctAnswer: 'A2', incorrectAnswers: ['B2', 'C2', 'D2'], category: 'Test', difficulty: 'easy' }
          ],
          currentQuestionIndex: 0,
          answers: [],
          score: 0,
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

      const resultPage = await (adapter as any).processQuizAnswer('test_session', 0);
      const pageContent = resultPage.rows.join('\n');
      
      // Should show score
      expect(pageContent).toMatch(/Score:/);
    });
  });
});
