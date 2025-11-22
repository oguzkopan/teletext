// Games adapter for pages 600-699
// Provides interactive quiz games with trivia API integration

import axios from 'axios';
import * as admin from 'firebase-admin';
import { VertexAI } from '@google-cloud/vertexai';
import { ContentAdapter, TeletextPage } from '../types';

/**
 * Quiz question structure
 */
interface QuizQuestion {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  category: string;
  difficulty: string;
}

/**
 * Quiz session state stored in Firestore
 */
interface QuizSession {
  sessionId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: boolean[];
  score: number;
  createdAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp;
}

/**
 * Bamboozle game session state
 */
interface BamboozleSession {
  sessionId: string;
  currentPage: string;
  path: string[];
  score: number;
  choices: Record<string, number>;
  createdAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp;
}

/**
 * GamesAdapter serves game pages (600-699)
 * Integrates with trivia APIs and provides interactive quiz functionality
 */
export class GamesAdapter implements ContentAdapter {
  private firestore: FirebaseFirestore.Firestore;
  private vertexAI: VertexAI | null = null;
  private projectId: string;
  private location: string;
  private triviaApiUrl: string = 'https://opentdb.com/api.php';

  constructor() {
    this.firestore = admin.firestore();
    
    // Get project configuration from environment
    // GOOGLE_CLOUD_PROJECT is automatically set by Firebase Functions
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || '';
    this.location = process.env.VERTEX_LOCATION || 'us-central1';

    // Don't initialize Vertex AI in constructor - do it lazily when needed
  }

  /**
   * Lazily initializes Vertex AI only when needed
   */
  private getVertexAI(): VertexAI {
    if (!this.vertexAI) {
      this.vertexAI = new VertexAI({
        project: this.projectId,
        location: this.location
      });
    }
    return this.vertexAI;
  }

  /**
   * Retrieves a games page
   * @param pageId - The page ID to retrieve (600-699)
   * @param params - Optional parameters including sessionId for quiz state
   * @returns A TeletextPage object with games content
   */
  async getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Route to specific game pages
    if (pageNumber === 600) {
      return this.getGamesIndexPage();
    } else if (pageNumber === 601) {
      // Quiz of the day - start new quiz
      return this.startQuizOfTheDay(params);
    } else if (pageNumber >= 602 && pageNumber <= 609) {
      // Quiz question pages
      return this.getQuizQuestionPage(pageId, params);
    } else if (pageNumber === 610) {
      return this.getBamboozleIntroPage(params);
    } else if (pageNumber >= 611 && pageNumber <= 619) {
      // Bamboozle game pages
      return this.getBamboozlePage(pageId, params);
    } else if (pageNumber === 620) {
      return await this.getRandomFactPage();
    } else if (pageNumber >= 600 && pageNumber < 700) {
      return this.getPlaceholderPage(pageId);
    }

    throw new Error(`Invalid games page: ${pageId}`);
  }



  /**
   * Creates the games index page (600)
   */
  private getGamesIndexPage(): TeletextPage {
    const rows = [
      'GAMES INDEX                  P600',
      '════════════════════════════════════',
      '',
      'WELCOME TO TELETEXT GAMES',
      '',
      'Test your knowledge and have fun!',
      '',
      'AVAILABLE GAMES:',
      '',
      '1. Quiz of the Day (Page 601)',
      '   Multiple-choice trivia quiz',
      '   with AI-generated commentary',
      '',
      '2. Bamboozle Quiz (Page 610)',
      '   Branching story quiz game',
      '',
      '3. Random Facts (Page 620)',
      '   Discover interesting trivia',
      '',
      '',
      '',
      '',
      'INDEX   QUIZ    FACTS',
      ''
    ];

    return {
      id: '600',
      title: 'Games Index',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'QUIZ', targetPage: '601', color: 'green' },
        { label: 'FACTS', targetPage: '620', color: 'yellow' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
        customHints: ['Use colored buttons or type page number']
      }
    };
  }

  /**
   * Starts a new quiz of the day
   */
  private async startQuizOfTheDay(params?: Record<string, any>): Promise<TeletextPage> {
    try {
      // Check if there's an existing session
      const sessionId = params?.sessionId;
      
      if (sessionId) {
        const session = await this.getQuizSession(sessionId);
        if (session) {
          // Resume existing quiz
          return this.getQuizQuestionPage('602', { sessionId });
        }
      }

      // Create new quiz session
      const questions = await this.fetchTriviaQuestions(5);
      const newSessionId = await this.createQuizSession(questions);

      // Show quiz intro page
      const rows = [
        'QUIZ OF THE DAY              P601',
        '════════════════════════════════════',
        '',
        'READY TO TEST YOUR KNOWLEDGE?',
        'You will be asked 5 multiple-choice',
        'questions on various topics.',
        '',
        'Answer each question by pressing',
        'the color button (R/G/Y/B).',
        '',
        'At the end, you will receive:',
        '• Your final score',
        '• Correct/incorrect answers',
        '• AI-generated witty commentary',
        '',
        'Good luck!',
        '',
        '',
        'HOW TO START:',
        '• Press GREEN button, or',
        '• Type 602 and press Enter',
        '',
        'INDEX   START   GAMES',
        ''
      ];

      return {
        id: '601',
        title: 'Quiz of the Day',
        rows: this.padRows(rows),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'START', targetPage: '602', color: 'green' },
          { label: 'GAMES', targetPage: '600', color: 'yellow' }
        ],
        meta: {
          source: 'GamesAdapter',
          lastUpdated: new Date().toISOString(),
          aiContextId: newSessionId,
          customHints: ['Press GREEN to start or type 602']
        }
      };
    } catch (error) {
      console.error('Error starting quiz:', error);
      return this.getErrorPage('601', 'Quiz of the Day', error);
    }
  }

  /**
   * Gets a quiz question page (602-609)
   */
  private async getQuizQuestionPage(
    pageId: string,
    params?: Record<string, any>
  ): Promise<TeletextPage> {
    try {
      let sessionId = params?.sessionId || params?.aiContextId;
      let session = sessionId ? await this.getQuizSession(sessionId) : null;
      
      // If no session or session expired, create a new one
      if (!session) {
        const questions = await this.fetchTriviaQuestions(5);
        sessionId = await this.createQuizSession(questions);
        session = await this.getQuizSession(sessionId);
        
        if (!session) {
          return this.getErrorPage(pageId, 'Quiz Question', new Error('Failed to create session'));
        }
      }

      // Check if quiz is complete
      if (session.currentQuestionIndex >= session.questions.length) {
        return this.getQuizResultsPage(sessionId);
      }

      const question = session.questions[session.currentQuestionIndex];
      const questionNumber = session.currentQuestionIndex + 1;
      const totalQuestions = session.questions.length;
      
      // Shuffle answers
      const allAnswers = [question.correctAnswer, ...question.incorrectAnswers];
      const shuffledAnswers = this.shuffleArray(allAnswers);

      // Create progress indicator
      const progressBar = this.renderProgressBar(questionNumber, totalQuestions, 20);
      const questionCounter = `Question ${questionNumber}/${totalQuestions}`;

      const rows = [
        `QUIZ OF THE DAY              P${pageId}`,
        '════════════════════════════════════',
        this.centerText(questionCounter),
        this.centerText(progressBar),
        '',
        `Category: ${this.truncateText(question.category, 30)}`,
        '',
        ...this.wrapText(this.decodeHtml(question.question), 40),
        '',
        'SELECT YOUR ANSWER:',
        ''
      ];

      // Add answer options with color button indicators
      const colorLabels = ['RED', 'GREEN', 'YELLOW', 'BLUE'];
      const colorCodes = ['{red}', '{green}', '{yellow}', '{blue}'];
      
      shuffledAnswers.forEach((answer, index) => {
        const colorLabel = colorLabels[index];
        const colorCode = colorCodes[index];
        const wrappedAnswer = this.wrapText(`${colorCode}${colorLabel}: ${this.decodeHtml(answer)}`, 38);
        rows.push(...wrappedAnswer);
        if (index < shuffledAnswers.length - 1) {
          rows.push('');
        }
      });

      return {
        id: pageId,
        title: `Quiz Question ${questionNumber}`,
        rows: this.padRows(rows),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'QUIT', targetPage: '600', color: 'blue' }
        ],
        meta: {
          source: 'GamesAdapter',
          lastUpdated: new Date().toISOString(),
          aiContextId: sessionId,
          progress: {
            current: questionNumber,
            total: totalQuestions,
            percentage: Math.round((questionNumber / totalQuestions) * 100)
          }
        }
      };
    } catch (error) {
      console.error('Error loading quiz question:', error);
      return this.getErrorPage(pageId, 'Quiz Question', error);
    }
  }

  /**
   * Renders a progress bar for quiz questions
   */
  private renderProgressBar(current: number, total: number, width: number = 20): string {
    const filledCount = Math.round((current / total) * width);
    const emptyCount = width - filledCount;
    return '▓'.repeat(filledCount) + '░'.repeat(emptyCount);
  }

  /**
   * Centers text within a given width
   */
  private centerText(text: string, width: number = 40): string {
    if (text.length >= width) {
      return text.substring(0, width);
    }
    
    const leftPadding = Math.floor((width - text.length) / 2);
    const rightPadding = width - text.length - leftPadding;
    return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
  }

  /**
   * Processes a quiz answer and shows result
   */
  async processQuizAnswer(
    sessionId: string,
    answerIndex: number
  ): Promise<TeletextPage> {
    try {
      const session = await this.getQuizSession(sessionId);
      
      if (!session) {
        return this.getSessionExpiredPage('602');
      }

      const question = session.questions[session.currentQuestionIndex];
      
      // Shuffle answers the same way
      const allAnswers = [question.correctAnswer, ...question.incorrectAnswers];
      const shuffledAnswers = this.shuffleArray(allAnswers);
      const correctIndex = shuffledAnswers.indexOf(question.correctAnswer);
      
      const isCorrect = answerIndex === correctIndex;
      
      // Update session
      session.answers.push(isCorrect);
      if (isCorrect) {
        session.score++;
      }
      session.currentQuestionIndex++;
      
      await this.updateQuizSession(sessionId, session);

      // Show result page
      const questionNumber = session.currentQuestionIndex;
      const rows = [
        `ANSWER RESULT                P602`,
        '════════════════════════════════════',
        ''
      ];

      if (isCorrect) {
        rows.push('✓ CORRECT!');
        rows.push('');
        rows.push('Well done! You got it right.');
      } else {
        rows.push('✗ INCORRECT');
        rows.push('');
        rows.push('The correct answer was:');
        rows.push(...this.wrapText(this.decodeHtml(question.correctAnswer), 40));
      }

      rows.push('');
      rows.push(`Score: ${session.score}/${questionNumber}`);
      rows.push('');

      if (session.currentQuestionIndex < session.questions.length) {
        rows.push('');
        rows.push('Press NEXT for the next question');
      } else {
        rows.push('');
        rows.push('Quiz complete!');
        rows.push('Press RESULTS to see your score');
      }

      const nextPage = session.currentQuestionIndex < session.questions.length ? '602' : '603';

      return {
        id: '602',
        title: 'Answer Result',
        rows: this.padRows(rows),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: session.currentQuestionIndex < session.questions.length ? 'NEXT' : 'RESULTS', targetPage: nextPage, color: 'green' }
        ],
        meta: {
          source: 'GamesAdapter',
          lastUpdated: new Date().toISOString(),
          aiContextId: sessionId
        }
      };
    } catch (error) {
      console.error('Error processing quiz answer:', error);
      return this.getErrorPage('602', 'Answer Result', error);
    }
  }

  /**
   * Gets the quiz results page with AI commentary
   */
  private async getQuizResultsPage(sessionId: string): Promise<TeletextPage> {
    try {
      const session = await this.getQuizSession(sessionId);
      
      if (!session) {
        return this.getSessionExpiredPage('603');
      }

      const totalQuestions = session.questions.length;
      const score = session.score;
      const percentage = Math.round((score / totalQuestions) * 100);

      // Generate AI commentary
      const commentary = await this.generateQuizCommentary(score, totalQuestions);

      // Create completion animation
      const confetti = [
        '    *  ·  *  ·  *  ·  *  ·  *    ',
        '  ·  *  ·  *  ·  *  ·  *  ·  *  ',
        '    *  ·  *  ·  *  ·  *  ·  *    '
      ];

      const rows = [
        'QUIZ RESULTS                 P603',
        '════════════════════════════════════',
        '',
        ...confetti,
        '',
        this.centerText('✓ QUIZ COMPLETE!'),
        '',
        this.centerText(`Final Score: ${score}/${totalQuestions} (${percentage}%)`),
        '',
        '════════════════════════════════════',
        '',
        'AI COMMENTARY:',
        '',
        ...this.wrapText(commentary, 40),
        '',
        '',
        '',
        '',
        'INDEX   RETRY   GAMES',
        ''
      ];

      return {
        id: '603',
        title: 'Quiz Results',
        rows: this.padRows(rows),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'RETRY', targetPage: '601', color: 'green' },
          { label: 'GAMES', targetPage: '600', color: 'yellow' }
        ],
        meta: {
          source: 'GamesAdapter',
          lastUpdated: new Date().toISOString(),
          completed: true,
          finalScore: {
            correct: score,
            total: totalQuestions,
            percentage
          }
        }
      };
    } catch (error) {
      console.error('Error loading quiz results:', error);
      return this.getErrorPage('603', 'Quiz Results', error);
    }
  }

  /**
   * Fetches trivia questions from Open Trivia Database
   */
  private async fetchTriviaQuestions(amount: number = 5): Promise<QuizQuestion[]> {
    try {
      const response = await axios.get(this.triviaApiUrl, {
        params: {
          amount,
          type: 'multiple'
        },
        timeout: 5000
      });

      if (response.data.response_code !== 0) {
        throw new Error('Failed to fetch trivia questions');
      }

      return response.data.results.map((q: any) => ({
        question: q.question,
        correctAnswer: q.correct_answer,
        incorrectAnswers: q.incorrect_answers,
        category: q.category,
        difficulty: q.difficulty
      }));
    } catch (error) {
      console.error('Error fetching trivia questions:', error);
      // Return fallback questions
      return this.getFallbackQuestions();
    }
  }

  /**
   * Returns fallback questions when API is unavailable
   */
  private getFallbackQuestions(): QuizQuestion[] {
    return [
      {
        question: 'What year was the first teletext service launched?',
        correctAnswer: '1974',
        incorrectAnswers: ['1970', '1978', '1982'],
        category: 'Technology',
        difficulty: 'medium'
      },
      {
        question: 'Which BBC service was the first teletext service?',
        correctAnswer: 'Ceefax',
        incorrectAnswers: ['ORACLE', 'Prestel', 'Viewdata'],
        category: 'Technology',
        difficulty: 'medium'
      },
      {
        question: 'How many characters wide is a teletext page?',
        correctAnswer: '40',
        incorrectAnswers: ['32', '80', '64'],
        category: 'Technology',
        difficulty: 'easy'
      },
      {
        question: 'How many rows tall is a teletext page?',
        correctAnswer: '24',
        incorrectAnswers: ['20', '25', '30'],
        category: 'Technology',
        difficulty: 'easy'
      },
      {
        question: 'When did BBC Ceefax shut down?',
        correctAnswer: '2012',
        incorrectAnswers: ['2008', '2010', '2015'],
        category: 'Technology',
        difficulty: 'medium'
      }
    ];
  }

  /**
   * Creates a new quiz session in Firestore
   */
  private async createQuizSession(questions: QuizQuestion[]): Promise<string> {
    const sessionId = this.generateSessionId();
    const now = admin.firestore.Timestamp.now();
    
    // Set expiration to 1 hour from now
    const expiresAt = admin.firestore.Timestamp.fromMillis(
      now.toMillis() + 60 * 60 * 1000
    );

    const session: QuizSession = {
      sessionId,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      createdAt: now,
      expiresAt
    };

    await this.firestore
      .collection('quiz_sessions')
      .doc(sessionId)
      .set(session);

    return sessionId;
  }

  /**
   * Retrieves a quiz session from Firestore
   */
  private async getQuizSession(sessionId: string): Promise<QuizSession | null> {
    try {
      const doc = await this.firestore
        .collection('quiz_sessions')
        .doc(sessionId)
        .get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data() as QuizSession;
      
      // Check if expired
      if (data.expiresAt.toMillis() < Date.now()) {
        await this.firestore.collection('quiz_sessions').doc(sessionId).delete();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error retrieving quiz session:', error);
      return null;
    }
  }

  /**
   * Updates a quiz session in Firestore
   */
  private async updateQuizSession(sessionId: string, session: QuizSession): Promise<void> {
    await this.firestore
      .collection('quiz_sessions')
      .doc(sessionId)
      .update({
        currentQuestionIndex: session.currentQuestionIndex,
        answers: session.answers,
        score: session.score
      });
  }

  /**
   * Generates AI commentary for quiz results
   */
  private async generateQuizCommentary(score: number, total: number): Promise<string> {
    try {
      const percentage = (score / total) * 100;
      
      const vertexAI = this.getVertexAI();
      const model = vertexAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Generate a short, witty, and entertaining comment about someone's quiz performance. 
They scored ${score} out of ${total} questions correct (${percentage}%).

Requirements:
- Keep it under 100 words
- Be playful and humorous
- Match the tone to their performance (encouraging if low, congratulatory if high, playful if medium)
- No special formatting or markdown
- Make it feel like a retro teletext message

Just provide the commentary text, nothing else.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const candidates = response.candidates;
      
      if (candidates && candidates.length > 0 && candidates[0].content.parts.length > 0) {
        const text = candidates[0].content.parts[0].text || '';
        return text.trim();
      }
      
      throw new Error('No response from AI');
    } catch (error) {
      console.error('Error generating AI commentary:', error);
      
      // Fallback commentary based on score
      const percentage = (score / total) * 100;
      
      if (percentage === 100) {
        return 'Perfect score! You are a trivia master! Your knowledge is as impressive as a 1970s teletext engineer.';
      } else if (percentage >= 80) {
        return 'Excellent work! You clearly know your stuff. Just a few more study sessions and you will be unstoppable!';
      } else if (percentage >= 60) {
        return 'Not bad! You got more than half right. With a bit more practice, you will be acing these quizzes!';
      } else if (percentage >= 40) {
        return 'Room for improvement! But hey, every quiz is a learning opportunity. Try again and show us what you have got!';
      } else {
        return 'Well, that was... interesting. But do not worry! Even the best quiz masters started somewhere. Give it another go!';
      }
    }
  }

  /**
   * Creates the Bamboozle intro page (610)
   */
  private async getBamboozleIntroPage(params?: Record<string, any>): Promise<TeletextPage> {
    // Check if there's an existing session
    const sessionId = params?.sessionId || params?.aiContextId;
    
    if (sessionId) {
      const session = await this.getBamboozleSession(sessionId);
      if (session && session.currentPage !== '610') {
        // Resume existing game
        return this.getBamboozlePage(session.currentPage, { sessionId });
      }
    }

    const rows = [
      'BAMBOOZLE QUIZ               P610',
      '════════════════════════════════════',
      '',
      'THE MYSTERY OF THE LOST ARTIFACT',
      '',
      'You are an archaeologist who has',
      'discovered a mysterious ancient',
      'temple. Your choices will determine',
      'your fate!',
      '',
      'This is a branching story quiz where',
      'different answers lead to different',
      'paths and endings.',
      '',
      'There are 3 possible endings:',
      '• The Scholar Path',
      '• The Adventurer Path',
      '• The Cursed Path',
      '',
      'HOW TO START:',
      '• Press GREEN button, or',
      '• Type 611 and press Enter',
      'INDEX   START   GAMES',
      ''
    ];

    return {
      id: '610',
      title: 'Bamboozle Quiz',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'START', targetPage: '611', color: 'green' },
        { label: 'GAMES', targetPage: '600', color: 'yellow' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
        customHints: ['Press GREEN to start or type 611']
      }
    };
  }

  /**
   * Gets a Bamboozle game page (611-619)
   */
  private async getBamboozlePage(
    pageId: string,
    params?: Record<string, any>
  ): Promise<TeletextPage> {
    try {
      let sessionId = params?.sessionId || params?.aiContextId;
      let session = sessionId ? await this.getBamboozleSession(sessionId) : null;

      // If no session or starting fresh, create new session
      if (!session || pageId === '611') {
        sessionId = await this.createBamboozleSession();
        session = await this.getBamboozleSession(sessionId);
      }

      if (!session) {
        return this.getSessionExpiredPage(pageId);
      }

      // Get the story node for this page
      const storyNode = this.getBamboozleStoryNode(pageId, session);
      
      if (!storyNode) {
        return this.getErrorPage(pageId, 'Bamboozle', new Error('Invalid page'));
      }

      // Update session with current page
      session.currentPage = pageId;
      session.path.push(pageId);
      await this.updateBamboozleSession(sessionId, session);

      return {
        id: pageId,
        title: storyNode.title,
        rows: this.padRows(storyNode.rows),
        links: storyNode.links,
        meta: {
          source: 'GamesAdapter',
          lastUpdated: new Date().toISOString(),
          aiContextId: sessionId
        }
      };
    } catch (error) {
      console.error('Error loading Bamboozle page:', error);
      return this.getErrorPage(pageId, 'Bamboozle', error);
    }
  }

  /**
   * Gets the story node for a Bamboozle page
   */
  private getBamboozleStoryNode(
    pageId: string,
    session: BamboozleSession
  ): { title: string; rows: string[]; links: any[] } | null {
    const pageNumber = parseInt(pageId, 10);

    // Question 1: Entrance (611)
    if (pageNumber === 611) {
      return {
        title: 'The Temple Entrance',
        rows: [
          'BAMBOOZLE: QUESTION 1        P611',
          '════════════════════════════════════',
          '',
          'You stand before the ancient temple.',
          'The entrance is dark and foreboding.',
          'Strange symbols cover the walls.',
          '',
          'What do you do?',
          '',
          '1. Study the symbols carefully',
          '   before entering',
          '',
          '2. Rush in boldly, adventure',
          '   awaits!',
          '',
          '3. Search for a hidden entrance',
          '   around the back',
          '',
          '',
          '',
          '',
          'INDEX   QUIT',
          ''
        ],
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'QUIT', targetPage: '610', color: 'blue' }
        ]
      };
    }

    // Question 2 paths based on Q1 answer
    if (pageNumber === 612) {
      // Scholar path (chose option 1)
      return {
        title: 'The Ancient Chamber',
        rows: [
          'BAMBOOZLE: QUESTION 2        P612',
          '════════════════════════════════════',
          '',
          'Your knowledge of the symbols reveals',
          'a safe passage. You enter a chamber',
          'filled with ancient scrolls.',
          '',
          'In the center is a pedestal with',
          'three artifacts. Which do you take?',
          '',
          '1. The golden amulet (looks',
          '   valuable)',
          '',
          '2. The dusty old book (might',
          '   contain knowledge)',
          '',
          '3. The crystal orb (glows',
          '   mysteriously)',
          '',
          '',
          'INDEX   QUIT',
          ''
        ],
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'QUIT', targetPage: '610', color: 'blue' }
        ]
      };
    }

    if (pageNumber === 613) {
      // Adventurer path (chose option 2)
      return {
        title: 'The Trap Room',
        rows: [
          'BAMBOOZLE: QUESTION 2        P613',
          '════════════════════════════════════',
          '',
          'You rush in and trigger a trap!',
          'Arrows fly from the walls. You dive',
          'and roll, barely escaping.',
          '',
          'You find yourself in a room with',
          'three doors. Which do you choose?',
          '',
          '1. The left door (you hear',
          '   water flowing)',
          '',
          '2. The middle door (ornately',
          '   decorated)',
          '',
          '3. The right door (feels warm',
          '   to the touch)',
          '',
          'INDEX   QUIT',
          ''
        ],
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'QUIT', targetPage: '610', color: 'blue' }
        ]
      };
    }

    if (pageNumber === 614) {
      // Cursed path (chose option 3)
      return {
        title: 'The Hidden Passage',
        rows: [
          'BAMBOOZLE: QUESTION 2        P614',
          '════════════════════════════════════',
          '',
          'You find a hidden entrance covered',
          'in vines. Inside, the air feels',
          'heavy and strange.',
          '',
          'You see three statues, each holding',
          'a different object. Which do you',
          'examine?',
          '',
          '1. The statue with the sword',
          '',
          '2. The statue with the shield',
          '',
          '3. The statue with the crown',
          '',
          '',
          '',
          'INDEX   QUIT',
          ''
        ],
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'QUIT', targetPage: '610', color: 'blue' }
        ]
      };
    }

    // Ending pages (615-617)
    if (pageNumber === 615) {
      // Scholar ending
      const score = this.calculateBamboozleScore(session, 'scholar');
      return {
        title: 'The Scholar Ending',
        rows: [
          'BAMBOOZLE: THE END           P615',
          '════════════════════════════════════',
          '',
          'THE SCHOLAR PATH',
          '',
          'Through careful study and wisdom,',
          'you unlock the temple\'s secrets.',
          'The ancient knowledge you gain',
          'makes you famous among historians.',
          '',
          'You leave with the dusty tome,',
          'which contains lost knowledge of',
          'an ancient civilization.',
          '',
          `Your Score: ${score}/100`,
          '',
          'You chose the path of knowledge!',
          '',
          '',
          '',
          'INDEX   RETRY   GAMES',
          ''
        ],
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'RETRY', targetPage: '610', color: 'green' },
          { label: 'GAMES', targetPage: '600', color: 'yellow' }
        ]
      };
    }

    if (pageNumber === 616) {
      // Adventurer ending
      const score = this.calculateBamboozleScore(session, 'adventurer');
      return {
        title: 'The Adventurer Ending',
        rows: [
          'BAMBOOZLE: THE END           P616',
          '════════════════════════════════════',
          '',
          'THE ADVENTURER PATH',
          '',
          'Your bold actions and quick reflexes',
          'lead you to the temple\'s treasure',
          'room. You escape with riches beyond',
          'imagination!',
          '',
          'Tales of your daring adventure',
          'spread far and wide. You become',
          'a legend among treasure hunters.',
          '',
          `Your Score: ${score}/100`,
          '',
          'You chose the path of adventure!',
          '',
          '',
          'INDEX   RETRY   GAMES',
          ''
        ],
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'RETRY', targetPage: '610', color: 'green' },
          { label: 'GAMES', targetPage: '600', color: 'yellow' }
        ]
      };
    }

    if (pageNumber === 617) {
      // Cursed ending
      const score = this.calculateBamboozleScore(session, 'cursed');
      return {
        title: 'The Cursed Ending',
        rows: [
          'BAMBOOZLE: THE END           P617',
          '════════════════════════════════════',
          '',
          'THE CURSED PATH',
          '',
          'The hidden passage was a trap!',
          'You disturb an ancient curse.',
          'The temple begins to collapse',
          'around you.',
          '',
          'You barely escape with your life,',
          'but the curse follows you. Strange',
          'things happen wherever you go.',
          '',
          `Your Score: ${score}/100`,
          '',
          'You chose the path of mystery...',
          'and paid the price!',
          '',
          'INDEX   RETRY   GAMES',
          ''
        ],
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'RETRY', targetPage: '610', color: 'green' },
          { label: 'GAMES', targetPage: '600', color: 'yellow' }
        ]
      };
    }

    return null;
  }

  /**
   * Processes a Bamboozle answer and determines next page
   */
  async processBamboozleAnswer(
    sessionId: string,
    currentPage: string,
    answerIndex: number
  ): Promise<string> {
    const session = await this.getBamboozleSession(sessionId);
    
    if (!session) {
      return '610'; // Return to start if session expired
    }

    // Store the choice
    session.choices[currentPage] = answerIndex;

    // Determine next page based on current page and answer
    const pageNumber = parseInt(currentPage, 10);
    let nextPage = '610';

    if (pageNumber === 611) {
      // Question 1: determines main path
      if (answerIndex === 1) {
        nextPage = '612'; // Scholar path
        session.score += 30;
      } else if (answerIndex === 2) {
        nextPage = '613'; // Adventurer path
        session.score += 25;
      } else if (answerIndex === 3) {
        nextPage = '614'; // Cursed path
        session.score += 20;
      }
    } else if (pageNumber === 612) {
      // Scholar path Q2
      if (answerIndex === 2) {
        nextPage = '615'; // Best scholar ending
        session.score += 40;
      } else {
        nextPage = '615'; // Scholar ending
        session.score += 30;
      }
    } else if (pageNumber === 613) {
      // Adventurer path Q2
      if (answerIndex === 2) {
        nextPage = '616'; // Best adventurer ending
        session.score += 45;
      } else {
        nextPage = '616'; // Adventurer ending
        session.score += 35;
      }
    } else if (pageNumber === 614) {
      // Cursed path Q2
      if (answerIndex === 3) {
        nextPage = '617'; // Worst cursed ending
        session.score += 15;
      } else {
        nextPage = '617'; // Cursed ending
        session.score += 25;
      }
    }

    // Update session
    session.currentPage = nextPage;
    await this.updateBamboozleSession(sessionId, session);

    return nextPage;
  }

  /**
   * Calculates the final score for a Bamboozle ending
   */
  private calculateBamboozleScore(session: BamboozleSession, pathType: string): number {
    // Base score from choices
    let score = session.score;

    // Bonus for completing the game
    score += 10;

    // Path-specific bonuses
    if (pathType === 'scholar') {
      score += 5; // Bonus for wisdom
    } else if (pathType === 'adventurer') {
      score += 10; // Bonus for bravery
    }

    return Math.min(score, 100);
  }

  /**
   * Creates a new Bamboozle session in Firestore
   */
  private async createBamboozleSession(): Promise<string> {
    const sessionId = this.generateSessionId().replace('quiz_', 'bamboozle_');
    const now = admin.firestore.Timestamp.now();
    
    // Set expiration to 1 hour from now
    const expiresAt = admin.firestore.Timestamp.fromMillis(
      now.toMillis() + 60 * 60 * 1000
    );

    const session: BamboozleSession = {
      sessionId,
      currentPage: '611',
      path: [],
      score: 0,
      choices: {},
      createdAt: now,
      expiresAt
    };

    await this.firestore
      .collection('bamboozle_sessions')
      .doc(sessionId)
      .set(session);

    return sessionId;
  }

  /**
   * Retrieves a Bamboozle session from Firestore
   */
  private async getBamboozleSession(sessionId: string): Promise<BamboozleSession | null> {
    try {
      const doc = await this.firestore
        .collection('bamboozle_sessions')
        .doc(sessionId)
        .get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data() as BamboozleSession;
      
      // Check if expired
      if (data.expiresAt.toMillis() < Date.now()) {
        await this.firestore.collection('bamboozle_sessions').doc(sessionId).delete();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error retrieving Bamboozle session:', error);
      return null;
    }
  }

  /**
   * Updates a Bamboozle session in Firestore
   */
  private async updateBamboozleSession(
    sessionId: string,
    session: BamboozleSession
  ): Promise<void> {
    await this.firestore
      .collection('bamboozle_sessions')
      .doc(sessionId)
      .update({
        currentPage: session.currentPage,
        path: session.path,
        score: session.score,
        choices: session.choices
      });
  }

  /**
   * Creates the random fact page (620)
   */
  private async getRandomFactPage(): Promise<TeletextPage> {
    try {
      // Try to fetch from API first, fall back to curated database
      const fact = await this.fetchRandomFact();
      
      const rows = [
        'RANDOM FACT                  P620',
        '════════════════════════════════════',
        '',
        `Category: ${fact.category}`,
        '',
        ...this.wrapText(fact.text, 40),
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'Reload page for a new fact',
        '',
        '',
        'INDEX   QUIZ    GAMES',
        ''
      ];

      return {
        id: '620',
        title: 'Random Fact',
        rows: this.padRows(rows),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'QUIZ', targetPage: '601', color: 'green' },
          { label: 'GAMES', targetPage: '600', color: 'yellow' }
        ],
        meta: {
          source: 'GamesAdapter',
          lastUpdated: new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('Error loading random fact:', error);
      return this.getErrorPage('620', 'Random Fact', error);
    }
  }

  /**
   * Fetches a random fact from API or curated database
   */
  private async fetchRandomFact(): Promise<{ text: string; category: string }> {
    try {
      // Try to fetch from API Ninjas Facts API
      const apiKey = process.env.API_NINJAS_KEY;
      
      if (apiKey) {
        const response = await axios.get('https://api.api-ninjas.com/v1/facts', {
          headers: { 'X-Api-Key': apiKey },
          params: { limit: 1 },
          timeout: 3000
        });

        if (response.data && response.data.length > 0) {
          return {
            text: response.data[0].fact,
            category: 'General'
          };
        }
      }
    } catch (error) {
      console.log('API fetch failed, using curated facts:', error);
    }

    // Fall back to curated database
    return this.getCuratedRandomFact();
  }

  /**
   * Returns a random fact from curated database
   */
  private getCuratedRandomFact(): { text: string; category: string } {
    const facts = [
      // Science facts
      {
        text: 'Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still perfectly edible.',
        category: 'Science'
      },
      {
        text: 'A single bolt of lightning contains enough energy to toast 100,000 slices of bread.',
        category: 'Science'
      },
      {
        text: 'Octopuses have three hearts. Two pump blood to the gills, while the third pumps it to the rest of the body.',
        category: 'Science'
      },
      {
        text: 'Bananas are berries, but strawberries are not. In botanical terms, a berry is a fruit produced from a single flower with one ovary.',
        category: 'Science'
      },
      {
        text: 'Your brain uses about 20% of your body\'s total oxygen and energy, despite being only 2% of your body weight.',
        category: 'Science'
      },
      
      // History facts
      {
        text: 'The first computer programmer was Ada Lovelace in 1843. She wrote the first algorithm intended for a machine.',
        category: 'History'
      },
      {
        text: 'The Great Wall of China is not visible from space with the naked eye, contrary to popular belief.',
        category: 'History'
      },
      {
        text: 'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza.',
        category: 'History'
      },
      {
        text: 'The shortest war in history was between Britain and Zanzibar in 1896. It lasted only 38 minutes.',
        category: 'History'
      },
      {
        text: 'Oxford University is older than the Aztec Empire. Teaching began at Oxford in 1096, while the Aztec Empire began in 1428.',
        category: 'History'
      },
      
      // Technology facts
      {
        text: 'The first teletext service, BBC Ceefax, launched in 1974 and ran until 2012. It displayed 40 characters by 24 rows.',
        category: 'Technology'
      },
      {
        text: 'The first computer mouse was made of wood and had only one button. It was invented by Doug Engelbart in 1964.',
        category: 'Technology'
      },
      {
        text: 'The first email was sent in 1971 by Ray Tomlinson. He also chose the @ symbol for email addresses.',
        category: 'Technology'
      },
      {
        text: 'The first 1GB hard drive, released in 1980, weighed over 500 pounds and cost $40,000.',
        category: 'Technology'
      },
      {
        text: 'The QWERTY keyboard layout was designed in the 1870s to prevent typewriter keys from jamming by separating common letter pairs.',
        category: 'Technology'
      },
      
      // Nature facts
      {
        text: 'A group of flamingos is called a "flamboyance". They get their pink color from the shrimp and algae they eat.',
        category: 'Nature'
      },
      {
        text: 'Trees can communicate with each other through an underground network of fungi called the "Wood Wide Web".',
        category: 'Nature'
      },
      {
        text: 'A single cloud can weigh more than 1 million pounds. That\'s about the weight of 100 elephants.',
        category: 'Nature'
      },
      {
        text: 'Sharks have been around longer than trees. Sharks evolved about 400 million years ago, while trees appeared 350 million years ago.',
        category: 'Nature'
      },
      {
        text: 'Wombat poop is cube-shaped. This prevents it from rolling away and helps mark their territory.',
        category: 'Nature'
      },
      
      // Space facts
      {
        text: 'A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.',
        category: 'Space'
      },
      {
        text: 'There are more stars in the universe than grains of sand on all the beaches on Earth.',
        category: 'Space'
      },
      {
        text: 'Neutron stars are so dense that a teaspoon of their material would weigh about 6 billion tons on Earth.',
        category: 'Space'
      },
      {
        text: 'The footprints on the Moon will last for millions of years because there is no wind or water to erode them.',
        category: 'Space'
      },
      {
        text: 'Jupiter\'s Great Red Spot is a storm that has been raging for at least 400 years and is larger than Earth.',
        category: 'Space'
      },
      
      // General facts
      {
        text: 'The word "robot" comes from the Czech word "robota", meaning forced labor. It was first used in a 1920 play.',
        category: 'General'
      },
      {
        text: 'The shortest complete sentence in English is "I am." It has both a subject and a predicate.',
        category: 'General'
      },
      {
        text: 'A jiffy is an actual unit of time. It equals 1/100th of a second in physics.',
        category: 'General'
      },
      {
        text: 'The dot over the letters "i" and "j" is called a tittle. It was added in medieval times to distinguish them from similar letters.',
        category: 'General'
      },
      {
        text: 'The longest word you can type using only the top row of a QWERTY keyboard is "typewriter".',
        category: 'General'
      }
    ];

    // Select a random fact
    const randomIndex = Math.floor(Math.random() * facts.length);
    return facts[randomIndex];
  }

  /**
   * Creates a session expired page
   */
  private getSessionExpiredPage(pageId: string): TeletextPage {
    const rows = [
      `SESSION EXPIRED              P${pageId}`,
      '════════════════════════════════════',
      '',
      'YOUR QUIZ SESSION HAS EXPIRED',
      '',
      'Quiz sessions expire after 1 hour',
      'of inactivity.',
      '',
      'Please start a new quiz to continue',
      'playing.',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'INDEX   QUIZ    GAMES',
      ''
    ];

    return {
      id: pageId,
      title: 'Session Expired',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'QUIZ', targetPage: '601', color: 'green' },
        { label: 'GAMES', targetPage: '600', color: 'yellow' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates an error page when something fails
   */
  private getErrorPage(pageId: string, title: string, error: any): TeletextPage {
    const rows = [
      `${this.truncateText(title.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
      '════════════════════════════════════',
      '',
      'SERVICE UNAVAILABLE',
      '',
      'Unable to load game at this time.',
      '',
      'This could be due to:',
      '• Service is temporarily down',
      '• Network connectivity issues',
      '• Session expired',
      '',
      'Please try again in a few moments.',
      '',
      '',
      '',
      '',
      '',
      'Press 600 for games index',
      'Press 100 for main index',
      '',
      'INDEX   GAMES',
      ''
    ];

    return {
      id: pageId,
      title: title,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates a placeholder page for pages not yet implemented
   */
  private getPlaceholderPage(pageId: string): TeletextPage {
    const rows = [
      `GAMES PAGE ${pageId}             P${pageId}`,
      '════════════════════════════════════',
      '',
      'COMING SOON',
      '',
      `Games page ${pageId} is under construction.`,
      '',
      'This page will be available in a',
      'future update.',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Press 600 for games index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   GAMES',
      ''
    ];

    return {
      id: pageId,
      title: `Games Page ${pageId}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Generates a unique session ID
   */
  private generateSessionId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Shuffles an array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Decodes HTML entities
   */
  private decodeHtml(html: string): string {
    if (!html) return '';
    
    let text = html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&lsquo;/g, "'")
      .replace(/&rsquo;/g, "'");
    
    return text;
  }

  /**
   * Truncates text to specified length with ellipsis
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
  }

  /**
   * Wraps text to fit within specified width
   */
  private wrapText(text: string, width: number): string[] {
    if (!text) return [''];
    
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= width) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        
        // Handle words longer than width
        if (word.length > width) {
          let remaining = word;
          while (remaining.length > width) {
            lines.push(remaining.substring(0, width));
            remaining = remaining.substring(width);
          }
          currentLine = remaining;
        } else {
          currentLine = word;
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [''];
  }

  /**
   * Pads rows array to exactly 24 rows, each max 60 characters
   */
  private padRows(rows: string[]): string[] {
    const paddedRows = rows.map(row => {
      if (row.length > 60) {
        return row.substring(0, 60);
      }
      return row.padEnd(60, ' ');
    });

    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(60, ' '));
    }

    return paddedRows.slice(0, 24);
  }
}
