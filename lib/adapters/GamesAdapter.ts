// Games adapter for pages 600-699
// Provides interactive quiz games with AI integration

import { TeletextPage } from '@/types/teletext';
import { VertexAI } from '@google-cloud/vertexai';

export class GamesAdapter {
  private vertexAI: VertexAI | null = null;
  private projectId: string;
  private location: string;

  constructor() {
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
    this.location = process.env.VERTEX_LOCATION || 'us-central1';
  }

  private getVertexAI(): VertexAI {
    if (!this.vertexAI) {
      this.vertexAI = new VertexAI({
        project: this.projectId,
        location: this.location
      });
    }
    return this.vertexAI;
  }

  async getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    if (pageNumber === 600) {
      return this.getGamesIndexPage();
    } else if (pageNumber === 601) {
      // Check if this is an answer submission (has answer param)
      if (params?.answer) {
        return await this.getQuizWithAnswer(params.answer);
      }
      return await this.getQuizPage();
    } else if (pageNumber === 610) {
      // Check if this is a choice submission (has choice param)
      if (params?.choice) {
        return await this.getBamboozleWithChoice(params.choice);
      }
      return await this.getBamboozlePage();
    } else if (pageNumber === 620) {
      return await this.getRandomFactPage();
    } else if (pageNumber === 630) {
      // Check if this is an answer submission (has answer param)
      if (params?.answer) {
        return await this.getWordGameWithAnswer(params.answer);
      }
      return await this.getWordGamePage(params);
    } else if (pageNumber === 640) {
      // Check if this is an answer submission (has answer param)
      if (params?.answer) {
        return await this.getMathChallengeWithAnswer(params.answer);
      }
      return await this.getMathChallengePage(params);
    }

    return this.getPlaceholderPage(pageId);
  }

  private getGamesIndexPage(): TeletextPage {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    const rows = [
      `600 Games & Quizzes ${timeStr}         P600`,
      '════════════════════════════════════════',
      '',
      '*** AI-POWERED GAMES ***',
      '',
      '601 Trivia Quiz',
      '    AI-generated questions',
      '610 Bamboozle Story Game',
      '    Interactive adventures',
      '620 Random Facts & Trivia',
      '    Learn something new',
      '630 Anagram Challenge',
      '    Unscramble the word',
      '640 Math Challenge',
      '    Solve arithmetic problems',
      '',
      'All games use Vertex AI to',
      'generate unique content!',
      '',
      '',
      'INDEX   QUIZ   FACTS   WORD',
      ''
    ];

    return {
      id: '600',
      title: 'Games & Quizzes Hub',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'QUIZ', targetPage: '601', color: 'green' },
        { label: 'FACTS', targetPage: '620', color: 'yellow' },
        { label: 'WORD', targetPage: '630', color: 'blue' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private async getQuizPage(): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // ALWAYS generate new quiz question with AI
    console.log('[GamesAdapter] Generating quiz question with Vertex AI...');
    const questions = await this.generateQuizQuestions(1);
    const question = questions[0];
    console.log('[GamesAdapter] Quiz question generated:', question);
    
    // Limit question to 3 lines max
    const questionLines = this.wrapText(question.question, 40).slice(0, 3);
    
    const rows = [
      `601 Trivia Quiz ${timeStr}             P601`,
      '════════════════════════════════════════',
      '',
      this.centerText(`${question.category.toUpperCase()}`),
      '',
      ...questionLines,
      '',
      'SELECT YOUR ANSWER:',
      '',
      `1. ${this.truncateText(question.options[0], 36)}`,
      `2. ${this.truncateText(question.options[1], 36)}`,
      `3. ${this.truncateText(question.options[2], 36)}`,
      `4. ${this.truncateText(question.options[3], 36)}`,
      '',
      'Press 1-4 to answer',
      'Reload for new question',
      '',
      '',
      '',
      'INDEX   GAMES   FACTS',
      ''
    ];

    return {
      id: '601',
      title: 'Trivia Quiz',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'FACTS', targetPage: '620', color: 'yellow' },
        { label: '1', targetPage: '601?answer=1', color: undefined },
        { label: '2', targetPage: '601?answer=2', color: undefined },
        { label: '3', targetPage: '601?answer=3', color: undefined },
        { label: '4', targetPage: '601?answer=4', color: undefined }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4'],
        quizQuestion: question,
        aiGenerated: true,
        stayOnPageAfterSubmit: true
      }
    };
  }

  private async getBamboozlePage(): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // Generate AI story
    console.log('[GamesAdapter] Generating Bamboozle story...');
    const story = await this.generateBamboozleStory();
    console.log('[GamesAdapter] Story generated:', story.title);
    
    // Limit scenario to 2 lines max
    const scenarioLines = this.wrapText(story.scenario, 40).slice(0, 2);
    
    const rows = [
      `610 Bamboozle Story ${timeStr}         P610`,
      '════════════════════════════════════════',
      '',
      this.centerText(story.title.toUpperCase()),
      '',
      ...scenarioLines,
      '',
      'WHAT DO YOU DO?',
      '',
      `1. ${this.truncateText(story.choices[0], 36)}`,
      `2. ${this.truncateText(story.choices[1], 36)}`,
      `3. ${this.truncateText(story.choices[2], 36)}`,
      `4. ${this.truncateText(story.choices[3], 36)}`,
      '',
      'Press 1-4 to choose',
      'Reload for new story',
      '',
      '',
      '',
      '',
      'INDEX   GAMES   FACTS',
      ''
    ];

    return {
      id: '610',
      title: 'Bamboozle Story Game',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'FACTS', targetPage: '620', color: 'yellow' },
        { label: '1', targetPage: '610?choice=1', color: undefined },
        { label: '2', targetPage: '610?choice=2', color: undefined },
        { label: '3', targetPage: '610?choice=3', color: undefined },
        { label: '4', targetPage: '610?choice=4', color: undefined }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4'],
        bamboozleStory: story,
        aiGenerated: true,
        stayOnPageAfterSubmit: true
      }
    };
  }

  private async generateBamboozleStory(): Promise<{
    title: string;
    scenario: string;
    choices: string[];
    outcomes: string[];
  }> {
    try {
      const vertexAI = this.getVertexAI();
      const model = vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Generate an interactive story scenario for a choice-based game.

Requirements:
- Create an engaging scenario (1-2 sentences, max 80 characters total)
- Provide 4 different choices (each max 30 characters)
- Each choice should lead to a different outcome
- Keep it family-friendly and fun
- Make it mysterious or adventurous

Return ONLY a valid JSON object:
{
  "title": "The Mysterious Cave",
  "scenario": "You discover a hidden cave. Strange symbols cover the walls.",
  "choices": [
    "Enter carefully",
    "Study symbols",
    "Call for backup",
    "Mark and leave"
  ],
  "outcomes": [
    "You find treasure!",
    "You decipher secrets!",
    "Team discovers city!",
    "You return safely!"
  ]
}`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const candidates = response.candidates;

      if (!candidates || candidates.length === 0 || !candidates[0].content.parts.length) {
        throw new Error('No response from AI');
      }

      const text = candidates[0].content.parts[0].text || '';
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      return JSON.parse(jsonText);
    } catch (error) {
      console.error('[GamesAdapter] Bamboozle generation failed:', error);
      // Fallback story
      return {
        title: 'The Mysterious Cave',
        scenario: 'You discover a hidden cave behind a waterfall. Strange glowing symbols cover the walls.',
        choices: [
          'Enter the cave carefully',
          'Study the symbols first',
          'Call for backup',
          'Mark location and leave'
        ],
        outcomes: [
          'You find ancient treasure!',
          'You decipher a secret message!',
          'Your team discovers a lost city!',
          'You return safely with data!'
        ]
      };
    }
  }

  private async getRandomFactPage(): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const fact = this.getCuratedRandomFact();
    
    // Limit fact to 10 lines max
    const factLines = this.wrapText(fact.text, 40).slice(0, 10);
    
    const rows = [
      `620 Random Fact ${timeStr}             P620`,
      '════════════════════════════════════════',
      '',
      `Category: ${fact.category}`,
      '',
      ...factLines,
      '',
      '',
      '',
      'Reload for different fact',
      '',
      '',
      '',
      '',
      '',
      'INDEX   GAMES   WORD   MATH',
      ''
    ];

    return {
      id: '620',
      title: 'Random Fact',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'WORD', targetPage: '630', color: 'yellow' },
        { label: 'MATH', targetPage: '640', color: 'blue' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private async getWordGamePage(params?: Record<string, any>): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // ALWAYS generate new word game with AI
    console.log('[GamesAdapter] Generating word game with Vertex AI...');
    const wordGame = await this.generateWordGame();
    console.log('[GamesAdapter] Word game generated:', wordGame);

    const rows = [
      `630 Anagram Challenge ${timeStr}       P630`,
      '════════════════════════════════════════',
      '',
      'SCRAMBLED WORD:',
      this.centerText(wordGame.scrambled),
      '',
      `Hint: ${this.truncateText(wordGame.hint, 34)}`,
      '',
      'SELECT YOUR ANSWER:',
      '',
      `1. ${this.truncateText(wordGame.options[0], 36)}`,
      `2. ${this.truncateText(wordGame.options[1], 36)}`,
      `3. ${this.truncateText(wordGame.options[2], 36)}`,
      `4. ${this.truncateText(wordGame.options[3], 36)}`,
      '',
      'Press 1-4 to answer',
      'Reload for new puzzle',
      'AI-generated content',
      '',
      '',
      '',
      'INDEX   GAMES   MATH',
      ''
    ];

    return {
      id: '630',
      title: 'Anagram Challenge',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'MATH', targetPage: '640', color: 'yellow' },
        { label: '1', targetPage: '630?answer=1', color: undefined },
        { label: '2', targetPage: '630?answer=2', color: undefined },
        { label: '3', targetPage: '630?answer=3', color: undefined },
        { label: '4', targetPage: '630?answer=4', color: undefined }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4'],
        wordGame: wordGame,
        aiGenerated: true,
        stayOnPageAfterSubmit: true
      }
    };
  }

  private async generateQuizQuestions(count: number = 5): Promise<Array<{
    question: string;
    options: string[];
    correctIndex: number;
    category: string;
  }>> {
    try {
      const vertexAI = this.getVertexAI();
      const model = vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Generate ${count} multiple-choice quiz questions for a trivia game.

Requirements:
- Mix of categories (science, history, geography, pop culture, etc.)
- Medium difficulty
- Each question has 4 options (1 correct, 3 wrong)
- Questions should be interesting and educational

Return ONLY a valid JSON array:
[
  {
    "question": "What is the capital of France?",
    "options": ["Paris", "London", "Berlin", "Madrid"],
    "correctIndex": 0,
    "category": "Geography"
  }
]

Generate exactly ${count} questions. The correct answer must always be at index 0.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const candidates = response.candidates;

      if (!candidates || candidates.length === 0 || !candidates[0].content.parts.length) {
        throw new Error('No response from AI');
      }

      const text = candidates[0].content.parts[0].text || '';
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      const questions = JSON.parse(jsonText);
      return questions;
    } catch (error) {
      console.error('[GamesAdapter] AI quiz generation failed, using randomized fallback');
      // Fallback questions - randomize the order
      const allQuestions = [
        {
          question: 'What year was the first teletext service launched?',
          options: ['1974', '1970', '1978', '1982'],
          correctIndex: 0,
          category: 'Technology'
        },
        {
          question: 'Which planet is known as the Red Planet?',
          options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
          correctIndex: 0,
          category: 'Science'
        },
        {
          question: 'Who painted the Mona Lisa?',
          options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'],
          correctIndex: 0,
          category: 'Art'
        },
        {
          question: 'What is the largest ocean on Earth?',
          options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
          correctIndex: 0,
          category: 'Geography'
        },
        {
          question: 'In what year did World War II end?',
          options: ['1945', '1944', '1946', '1943'],
          correctIndex: 0,
          category: 'History'
        },
        {
          question: 'What is the speed of light?',
          options: ['299,792 km/s', '150,000 km/s', '400,000 km/s', '250,000 km/s'],
          correctIndex: 0,
          category: 'Science'
        },
        {
          question: 'Who wrote "Romeo and Juliet"?',
          options: ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Mark Twain'],
          correctIndex: 0,
          category: 'Literature'
        },
        {
          question: 'What is the capital of Japan?',
          options: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima'],
          correctIndex: 0,
          category: 'Geography'
        },
        {
          question: 'How many continents are there?',
          options: ['7', '5', '6', '8'],
          correctIndex: 0,
          category: 'Geography'
        },
        {
          question: 'What is the smallest prime number?',
          options: ['2', '1', '3', '0'],
          correctIndex: 0,
          category: 'Mathematics'
        }
      ];
      
      // Shuffle and return random questions
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    }
  }

  private async generateWordGame(): Promise<{
    word: string;
    scrambled: string;
    hint: string;
    options: string[];
    correctIndex: number;
  }> {
    try {
      console.log('[GamesAdapter] Initializing Vertex AI...');
      console.log('[GamesAdapter] Project ID:', this.projectId);
      console.log('[GamesAdapter] Location:', this.location);
      
      const vertexAI = this.getVertexAI();
      const model = vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Generate an anagram word puzzle for a quiz game.

Requirements:
- Choose an interesting word (6-10 letters)
- Scramble the letters
- Provide a helpful hint
- Create 4 answer options (1 correct, 3 plausible but wrong)

Return ONLY a valid JSON object:
{
  "word": "COMPUTER",
  "scrambled": "TOMPUCER",
  "hint": "An electronic device for processing data",
  "options": ["COMPUTER", "COMPTURE", "COMPUTRE", "COMUPTER"]
}

The correct answer must be the first option. Generate a NEW unique puzzle now.`;

      console.log('[GamesAdapter] Calling Vertex AI...');
      const result = await model.generateContent(prompt);
      const response = result.response;
      const candidates = response.candidates;

      if (!candidates || candidates.length === 0 || !candidates[0].content.parts.length) {
        throw new Error('No response from AI');
      }

      const text = candidates[0].content.parts[0].text || '';
      console.log('[GamesAdapter] AI Response:', text);
      
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      const gameData = JSON.parse(jsonText);
      console.log('[GamesAdapter] Parsed game data:', gameData);

      return {
        word: gameData.word,
        scrambled: gameData.scrambled,
        hint: gameData.hint,
        options: gameData.options,
        correctIndex: 0
      };
    } catch (error) {
      console.error('[GamesAdapter] ERROR generating word game:', error);
      console.error('[GamesAdapter] Error details:', error instanceof Error ? error.message : String(error));
      console.error('[GamesAdapter] Using randomized fallback word game');
      
      // Fallback word games - randomize
      const fallbackGames = [
        {
          word: 'COMPUTER',
          scrambled: 'TOMPUCER',
          hint: 'An electronic device for processing data',
          options: ['COMPUTER', 'COMPTURE', 'COMPUTRE', 'COMUPTER']
        },
        {
          word: 'KEYBOARD',
          scrambled: 'YBOARDKE',
          hint: 'Input device with letters and numbers',
          options: ['KEYBOARD', 'KEYBAORD', 'KEYBROAD', 'KEYBOADR']
        },
        {
          word: 'INTERNET',
          scrambled: 'TENINTER',
          hint: 'Global network connecting computers',
          options: ['INTERNET', 'INTARNET', 'INTERNIT', 'INTERENT']
        },
        {
          word: 'TELETEXT',
          scrambled: 'TLEEXTET',
          hint: 'A system for displaying text on TV',
          options: ['TELETEXT', 'TEXTLEET', 'LEETTEXT', 'TEXTTELE']
        },
        {
          word: 'MOUNTAIN',
          scrambled: 'TAINMOUN',
          hint: 'A large natural elevation of earth',
          options: ['MOUNTAIN', 'MONTAUIN', 'MOUNTIAN', 'MOUTAINN']
        }
      ];
      
      const randomGame = fallbackGames[Math.floor(Math.random() * fallbackGames.length)];
      return {
        ...randomGame,
        correctIndex: 0
      };
    }
  }

  private async getQuizWithAnswer(answerStr: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // Generate a new question for next round
    const questions = await this.generateQuizQuestions(1);
    const newQuestion = questions[0];
    
    const answerIndex = parseInt(answerStr, 10) - 1;
    const isCorrect = answerIndex === 0; // Assuming correct answer is always first

    // Limit question to 2 lines
    const questionLines = this.wrapText(newQuestion.question, 40).slice(0, 2);

    const rows = [
      `601 Trivia Quiz ${timeStr}             P601`,
      '════════════════════════════════════════',
      '',
      isCorrect ? '✓ CORRECT!' : '✗ INCORRECT',
      isCorrect ? 'Excellent!' : 'Keep trying!',
      '',
      'NEXT QUESTION:',
      ...questionLines,
      '',
      `1. ${this.truncateText(newQuestion.options[0], 36)}`,
      `2. ${this.truncateText(newQuestion.options[1], 36)}`,
      `3. ${this.truncateText(newQuestion.options[2], 36)}`,
      `4. ${this.truncateText(newQuestion.options[3], 36)}`,
      '',
      'Press 1-4 to answer',
      '',
      '',
      '',
      '',
      'INDEX   GAMES   RELOAD',
      ''
    ];

    return {
      id: '601',
      title: 'Trivia Quiz',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'RELOAD', targetPage: '601', color: 'yellow' },
        { label: '1', targetPage: '601?answer=1', color: undefined },
        { label: '2', targetPage: '601?answer=2', color: undefined },
        { label: '3', targetPage: '601?answer=3', color: undefined },
        { label: '4', targetPage: '601?answer=4', color: undefined }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4'],
        quizQuestion: newQuestion,
        aiGenerated: true,
        stayOnPageAfterSubmit: true
      }
    };
  }

  private async getQuizAnswerPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    // Default fallback question if params not provided
    const quizQuestion = params?.quizQuestion || {
      question: 'What year was the first teletext service launched?',
      options: ['1974', '1970', '1978', '1982'],
      correctIndex: 0,
      category: 'Technology'
    };

    const answerIndex = parseInt(pageId.slice(-1), 10) - 2; // 602 -> index 0, 603 -> index 1, etc.
    const selectedAnswer = quizQuestion.options[answerIndex];
    const isCorrect = answerIndex === quizQuestion.correctIndex;
    const correctAnswer = quizQuestion.options[quizQuestion.correctIndex];

    const rows = [
      `QUIZ RESULT                  P${pageId}`,
      '════════════════════════════════════',
      '',
      '',
      isCorrect ? '✓ CORRECT!' : '✗ INCORRECT',
      '',
      '',
      `You selected: ${this.truncateText(selectedAnswer, 30)}`,
      '',
      isCorrect ? 'That\'s right!' : `Correct answer: ${this.truncateText(correctAnswer, 20)}`,
      '',
      `Category: ${quizQuestion.category}`,
      '',
      '',
      isCorrect ? 'Excellent work!' : 'Keep trying!',
      '',
      'Reload page 601 for a new question',
      '',
      '',
      '',
      'GAMES   RETRY   INDEX',
      ''
    ];

    return {
      id: pageId,
      title: 'Quiz Result',
      rows: this.padRows(rows),
      links: [
        { label: 'GAMES', targetPage: '600', color: 'red' },
        { label: 'RETRY', targetPage: '601', color: 'green' },
        { label: 'INDEX', targetPage: '100', color: 'yellow' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private async getBamboozleWithChoice(choiceStr: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // Generate a new story for next round
    const newStory = await this.generateBamboozleStory();
    
    const choiceIndex = parseInt(choiceStr, 10) - 1;
    // Use a simple outcome since we don't have the original story
    const outcomes = [
      'You find treasure!',
      'You discover secrets!',
      'Team finds a city!',
      'You return safely!'
    ];
    const outcome = outcomes[choiceIndex];

    const scenarioLines = this.wrapText(newStory.scenario, 40).slice(0, 2);

    const rows = [
      `610 Bamboozle Story ${timeStr}         P610`,
      '════════════════════════════════════════',
      '',
      `OUTCOME: ${outcome}`,
      '',
      'NEXT STORY:',
      this.centerText(newStory.title.toUpperCase()),
      '',
      ...scenarioLines,
      '',
      'WHAT DO YOU DO?',
      '',
      `1. ${this.truncateText(newStory.choices[0], 36)}`,
      `2. ${this.truncateText(newStory.choices[1], 36)}`,
      `3. ${this.truncateText(newStory.choices[2], 36)}`,
      `4. ${this.truncateText(newStory.choices[3], 36)}`,
      '',
      '',
      '',
      'INDEX   GAMES   RELOAD',
      ''
    ];

    return {
      id: '610',
      title: 'Bamboozle Story Game',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'RELOAD', targetPage: '610', color: 'yellow' },
        { label: '1', targetPage: '610?choice=1', color: undefined },
        { label: '2', targetPage: '610?choice=2', color: undefined },
        { label: '3', targetPage: '610?choice=3', color: undefined },
        { label: '4', targetPage: '610?choice=4', color: undefined }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4'],
        bamboozleStory: newStory,
        aiGenerated: true,
        stayOnPageAfterSubmit: true
      }
    };
  }

  private async getBamboozleAnswerPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    // Default fallback story if params not provided
    const bamboozleStory = params?.bamboozleStory || {
      title: 'The Mysterious Cave',
      scenario: 'You discover a hidden cave behind a waterfall.',
      choices: [
        'Enter the cave carefully',
        'Study the symbols first',
        'Call for backup',
        'Mark location and leave'
      ],
      outcomes: [
        'You find ancient treasure!',
        'You decipher a secret message!',
        'Your team discovers a lost city!',
        'You return safely with data!'
      ]
    };

    const choiceIndex = parseInt(pageId.slice(-1), 10) - 1; // 611 -> index 0, 612 -> index 1, etc.
    const selectedChoice = bamboozleStory.choices[choiceIndex];
    const outcome = bamboozleStory.outcomes[choiceIndex];

    const rows = [
      `STORY OUTCOME                P${pageId}`,
      '════════════════════════════════════',
      '',
      this.centerText(bamboozleStory.title.toUpperCase()),
      '',
      'YOUR CHOICE:',
      ...this.wrapText(selectedChoice, 40).slice(0, 2),
      '',
      'OUTCOME:',
      ...this.wrapText(outcome, 40).slice(0, 3),
      '',
      '',
      'Every choice leads to a different',
      'adventure!',
      '',
      'Reload page 610 for a new story',
      '',
      '',
      '',
      'GAMES   RETRY   INDEX',
      ''
    ];

    return {
      id: pageId,
      title: 'Story Outcome',
      rows: this.padRows(rows),
      links: [
        { label: 'GAMES', targetPage: '600', color: 'red' },
        { label: 'RETRY', targetPage: '610', color: 'green' },
        { label: 'INDEX', targetPage: '100', color: 'yellow' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private async getWordGameWithAnswer(answerStr: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // Generate a new word game for next round
    const newWordGame = await this.generateWordGame();
    
    const answerIndex = parseInt(answerStr, 10) - 1;
    const isCorrect = answerIndex === 0; // Correct answer is always at index 0

    const rows = [
      `630 Anagram Challenge ${timeStr}       P630`,
      '════════════════════════════════════════',
      '',
      isCorrect ? '✓ CORRECT!' : '✗ INCORRECT',
      isCorrect ? 'Well done!' : 'Try again!',
      '',
      'SCRAMBLED WORD:',
      newWordGame.scrambled,
      '',
      `Hint: ${this.truncateText(newWordGame.hint, 34)}`,
      '',
      'SELECT YOUR ANSWER:',
      '',
      `1. ${this.truncateText(newWordGame.options[0], 36)}`,
      `2. ${this.truncateText(newWordGame.options[1], 36)}`,
      `3. ${this.truncateText(newWordGame.options[2], 36)}`,
      `4. ${this.truncateText(newWordGame.options[3], 36)}`,
      '',
      'Press 1-4 to answer',
      '',
      'INDEX   GAMES   RELOAD',
      ''
    ];

    return {
      id: '630',
      title: 'Anagram Challenge',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'RELOAD', targetPage: '630', color: 'yellow' },
        { label: '1', targetPage: '630?answer=1', color: undefined },
        { label: '2', targetPage: '630?answer=2', color: undefined },
        { label: '3', targetPage: '630?answer=3', color: undefined },
        { label: '4', targetPage: '630?answer=4', color: undefined }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4'],
        wordGame: newWordGame,
        aiGenerated: true,
        stayOnPageAfterSubmit: true
      }
    };
  }

  private async getWordGameAnswerPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    const wordGame = params?.wordGame || {
      word: 'TELETEXT',
      scrambled: 'TLEEXTET',
      hint: 'A system for displaying text on TV',
      options: ['TELETEXT', 'TEXTLEET', 'LEETTEXT', 'TEXTTELE'],
      correctIndex: 0
    };

    const answerIndex = parseInt(pageId.slice(-1), 10) - 1;
    const selectedAnswer = wordGame.options[answerIndex];
    const isCorrect = answerIndex === wordGame.correctIndex;

    const rows = [
      `ANSWER RESULT                P${pageId}`,
      '════════════════════════════════════',
      '',
      '',
      isCorrect ? '✓ CORRECT!' : '✗ INCORRECT',
      '',
      '',
      `You selected: ${selectedAnswer}`,
      '',
      isCorrect ? `${wordGame.scrambled} unscrambles to` : `The correct answer is:`,
      this.centerText(wordGame.word),
      '',
      wordGame.hint,
      '',
      '',
      isCorrect ? 'Well done!' : 'Better luck next time!',
      '',
      'Reload page 630 for a new puzzle',
      '',
      '',
      'GAMES   RETRY   INDEX',
      ''
    ];

    return {
      id: pageId,
      title: 'Answer Result',
      rows: this.padRows(rows),
      links: [
        { label: 'GAMES', targetPage: '600', color: 'red' },
        { label: 'RETRY', targetPage: '630', color: 'green' },
        { label: 'INDEX', targetPage: '100', color: 'yellow' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private async getMathChallengePage(params?: Record<string, any>): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // ALWAYS generate new math challenge with AI
    console.log('[GamesAdapter] Generating math challenge with Vertex AI...');
    const mathChallenge = await this.generateMathChallenge();
    console.log('[GamesAdapter] Math challenge generated:', mathChallenge);

    const rows = [
      `640 Math Challenge ${timeStr}          P640`,
      '════════════════════════════════════════',
      '',
      'PROBLEM:',
      mathChallenge.problem,
      '',
      '',
      'SELECT YOUR ANSWER:',
      '',
      `1. ${this.truncateText(mathChallenge.options[0], 36)}`,
      `2. ${this.truncateText(mathChallenge.options[1], 36)}`,
      `3. ${this.truncateText(mathChallenge.options[2], 36)}`,
      `4. ${this.truncateText(mathChallenge.options[3], 36)}`,
      '',
      'Press 1-4 to answer',
      'Reload for new problem',
      'AI-generated content',
      '',
      '',
      '',
      'INDEX   GAMES   WORD',
      ''
    ];

    return {
      id: '640',
      title: 'Math Challenge',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'WORD', targetPage: '630', color: 'yellow' },
        { label: '1', targetPage: '640?answer=1', color: undefined },
        { label: '2', targetPage: '640?answer=2', color: undefined },
        { label: '3', targetPage: '640?answer=3', color: undefined },
        { label: '4', targetPage: '640?answer=4', color: undefined }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4'],
        mathChallenge: mathChallenge,
        aiGenerated: true,
        stayOnPageAfterSubmit: true
      }
    };
  }

  private async generateMathChallenge(): Promise<{
    problem: string;
    answer: number;
    solution: string;
    options: string[];
    correctIndex: number;
  }> {
    try {
      console.log('[GamesAdapter] Initializing Vertex AI for math...');
      const vertexAI = this.getVertexAI();
      const model = vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Generate a mental math challenge for a quiz game.

Requirements:
- Create a medium difficulty arithmetic problem
- Use operations: addition, subtraction, multiplication
- Result should be a whole number between 10 and 1000
- Provide step-by-step solution
- Create 4 answer options (1 correct, 3 plausible but wrong)

Return ONLY a valid JSON object:
{
  "problem": "23 × 4 + 17 = ?",
  "answer": 109,
  "solution": "23 × 4 = 92, then 92 + 17 = 109",
  "options": ["109", "92", "105", "113"]
}

The correct answer must be the first option. Generate a NEW unique problem now.`;

      console.log('[GamesAdapter] Calling Vertex AI for math...');
      const result = await model.generateContent(prompt);
      const response = result.response;
      const candidates = response.candidates;

      if (!candidates || candidates.length === 0 || !candidates[0].content.parts.length) {
        throw new Error('No response from AI');
      }

      const text = candidates[0].content.parts[0].text || '';
      console.log('[GamesAdapter] AI Math Response:', text);
      
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      const challengeData = JSON.parse(jsonText);
      console.log('[GamesAdapter] Parsed math data:', challengeData);

      return {
        problem: challengeData.problem,
        answer: challengeData.answer,
        solution: challengeData.solution,
        options: challengeData.options,
        correctIndex: 0
      };
    } catch (error) {
      console.error('[GamesAdapter] ERROR generating math challenge:', error);
      console.error('[GamesAdapter] Error details:', error instanceof Error ? error.message : String(error));
      console.error('[GamesAdapter] Using randomized fallback math challenge');
      
      // Fallback math challenges - randomize
      const fallbackChallenges = [
        {
          problem: '47 × 8 + 15 = ?',
          answer: 391,
          solution: '47 × 8 = 376, then 376 + 15 = 391',
          options: ['391', '376', '406', '401']
        },
        {
          problem: '23 × 4 + 17 = ?',
          answer: 109,
          solution: '23 × 4 = 92, then 92 + 17 = 109',
          options: ['109', '92', '105', '113']
        },
        {
          problem: '156 - 89 + 34 = ?',
          answer: 101,
          solution: '156 - 89 = 67, then 67 + 34 = 101',
          options: ['101', '67', '95', '111']
        },
        {
          problem: '12 × 15 - 28 = ?',
          answer: 152,
          solution: '12 × 15 = 180, then 180 - 28 = 152',
          options: ['152', '180', '148', '162']
        },
        {
          problem: '250 ÷ 5 + 33 = ?',
          answer: 83,
          solution: '250 ÷ 5 = 50, then 50 + 33 = 83',
          options: ['83', '50', '78', '88']
        }
      ];
      
      const randomChallenge = fallbackChallenges[Math.floor(Math.random() * fallbackChallenges.length)];
      return {
        ...randomChallenge,
        correctIndex: 0
      };
    }
  }

  private async getMathChallengeWithAnswer(answerStr: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // Generate a new math challenge for next round
    const newChallenge = await this.generateMathChallenge();
    
    const answerIndex = parseInt(answerStr, 10) - 1;
    const isCorrect = answerIndex === 0; // Correct answer is always at index 0

    const rows = [
      `640 Math Challenge ${timeStr}          P640`,
      '════════════════════════════════════════',
      '',
      isCorrect ? '✓ CORRECT!' : '✗ INCORRECT',
      isCorrect ? 'Excellent!' : 'Try again!',
      '',
      'PROBLEM:',
      newChallenge.problem,
      '',
      '',
      'SELECT YOUR ANSWER:',
      '',
      `1. ${this.truncateText(newChallenge.options[0], 36)}`,
      `2. ${this.truncateText(newChallenge.options[1], 36)}`,
      `3. ${this.truncateText(newChallenge.options[2], 36)}`,
      `4. ${this.truncateText(newChallenge.options[3], 36)}`,
      '',
      'Press 1-4 to answer',
      '',
      '',
      'INDEX   GAMES   RELOAD',
      ''
    ];

    return {
      id: '640',
      title: 'Math Challenge',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'RELOAD', targetPage: '640', color: 'yellow' },
        { label: '1', targetPage: '640?answer=1', color: undefined },
        { label: '2', targetPage: '640?answer=2', color: undefined },
        { label: '3', targetPage: '640?answer=3', color: undefined },
        { label: '4', targetPage: '640?answer=4', color: undefined }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4'],
        mathChallenge: newChallenge,
        aiGenerated: true,
        stayOnPageAfterSubmit: true
      }
    };
  }

  private async getMathChallengeAnswerPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    const mathChallenge = params?.mathChallenge || {
      problem: '47 × 8 + 15 = ?',
      answer: 391,
      solution: '47 × 8 = 376, then 376 + 15 = 391',
      options: ['391', '376', '406', '401'],
      correctIndex: 0
    };

    const answerIndex = parseInt(pageId.slice(-1), 10) - 1;
    const selectedAnswer = mathChallenge.options[answerIndex];
    const isCorrect = answerIndex === mathChallenge.correctIndex;

    const rows = [
      `ANSWER RESULT                P${pageId}`,
      '════════════════════════════════════',
      '',
      '',
      isCorrect ? '✓ CORRECT!' : '✗ INCORRECT',
      '',
      '',
      `You selected: ${selectedAnswer}`,
      '',
      isCorrect ? 'Solution:' : 'The correct answer is:',
      this.centerText(mathChallenge.answer.toString()),
      '',
      ...this.wrapText(mathChallenge.solution, 40),
      '',
      '',
      isCorrect ? 'Excellent work!' : 'Keep practicing!',
      '',
      'Reload page 640 for a new challenge',
      '',
      'GAMES   RETRY   INDEX',
      ''
    ];

    return {
      id: pageId,
      title: 'Answer Result',
      rows: this.padRows(rows),
      links: [
        { label: 'GAMES', targetPage: '600', color: 'red' },
        { label: 'RETRY', targetPage: '640', color: 'green' },
        { label: 'INDEX', targetPage: '100', color: 'yellow' }
      ],
      meta: {
        source: 'GamesAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private getCuratedRandomFact(): { text: string; category: string } {
    const facts = [
      {
        text: 'Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still perfectly edible.',
        category: 'Science'
      },
      {
        text: 'The first teletext service, BBC Ceefax, launched in 1974 and ran until 2012. It displayed 40 characters by 24 rows.',
        category: 'Technology'
      },
      {
        text: 'Octopuses have three hearts. Two pump blood to the gills, while the third pumps it to the rest of the body.',
        category: 'Science'
      },
      {
        text: 'The shortest war in history was between Britain and Zanzibar in 1896. It lasted only 38 minutes.',
        category: 'History'
      },
      {
        text: 'The word "robot" comes from the Czech word "robota", meaning forced labor. It was first used in a 1920 play.',
        category: 'General'
      },
      {
        text: 'A single bolt of lightning contains enough energy to toast 100,000 slices of bread.',
        category: 'Science'
      },
      {
        text: 'Bananas are berries, but strawberries are not. In botanical terms, a berry is a fruit produced from a single flower.',
        category: 'Science'
      },
      {
        text: 'The Great Wall of China is not visible from space with the naked eye, contrary to popular belief.',
        category: 'History'
      },
      {
        text: 'The first computer mouse was made of wood and had only one button. It was invented by Doug Engelbart in 1964.',
        category: 'Technology'
      },
      {
        text: 'The shortest complete sentence in English is "I am." It has both a subject and a predicate.',
        category: 'Language'
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
        text: 'Oxford University is older than the Aztec Empire. Teaching began at Oxford in 1096, while the Aztec Empire began in 1428.',
        category: 'History'
      },
      {
        text: 'The longest word you can type using only the top row of a QWERTY keyboard is "typewriter".',
        category: 'Language'
      },
      {
        text: 'Your brain uses about 20% of your body\'s total oxygen and energy, despite being only 2% of your body weight.',
        category: 'Science'
      }
    ];

    // Randomize selection
    const randomIndex = Math.floor(Math.random() * facts.length);
    console.log(`[GamesAdapter] Selected random fact #${randomIndex + 1} of ${facts.length}`);
    return facts[randomIndex];
  }

  private getPlaceholderPage(pageId: string): TeletextPage {
    const rows = [
      `GAMES PAGE ${pageId}             P${pageId}`,
      '════════════════════════════════════',
      '',
      'COMING SOON',
      '',
      `Games page ${pageId} is under construction.`,
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
      '',
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
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private getErrorPage(pageId: string, title: string): TeletextPage {
    const rows = [
      `${title.toUpperCase().padEnd(28, ' ')} P${pageId}`,
      '════════════════════════════════════',
      '',
      'SERVICE UNAVAILABLE',
      '',
      'Unable to load game at this time.',
      '',
      'Please try again later.',
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
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
  }

  private centerText(text: string, width: number = 40): string {
    if (text.length >= width) {
      return text.substring(0, width);
    }
    
    const leftPadding = Math.floor((width - text.length) / 2);
    const rightPadding = width - text.length - leftPadding;
    return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
  }

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
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [''];
  }

  private padRows(rows: string[]): string[] {
    const paddedRows = rows.map(row => {
      if (row.length > 40) {
        return row.substring(0, 40);
      }
      return row.padEnd(40, ' ');
    });

    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(40, ' '));
    }

    return paddedRows.slice(0, 24);
  }
}
