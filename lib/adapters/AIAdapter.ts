// AI adapter for pages 500-599
// Provides AI-powered Q&A using Vertex AI

import { TeletextPage } from '@/types/teletext';
import { VertexAI } from '@google-cloud/vertexai';

export class AIAdapter {
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

    // Custom question page (502) - handles user text input
    if (pageNumber === 502) {
      const question = params?.question || params?.q || '';
      if (!question) {
        return this.getErrorPage('502', 'No question provided');
      }
      return await this.getCustomQuestionPage(question);
    }

    // AI answer pages (511-516) - pre-set questions
    if (pageNumber >= 511 && pageNumber <= 516) {
      return await this.getAIAnswerPage(pageNumber);
    }

    throw new Error(`Invalid AI page: ${pageId}`);
  }

  private async getAIAnswerPage(pageNumber: number): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // Map page numbers to questions
    const questions: Record<number, string> = {
      511: 'Explain artificial intelligence in simple terms',
      512: 'What are the latest technology trends?',
      513: 'Tell me an interesting historical fact',
      514: 'Explain how the internet works',
      515: 'Tell me a joke',
      516: 'Write a short poem about teletext'
    };

    const question = questions[pageNumber];
    
    console.log(`[AIAdapter] Generating AI response for: ${question}`);
    const answer = await this.generateAIAnswer(question);
    console.log(`[AIAdapter] AI response generated, length: ${answer.length} chars`);

    // Wrap answer to fit 40-character width
    const wrappedAnswer = this.wrapText(answer, 40);

    const rows = [
      `${pageNumber} AI Answer ${timeStr}            P${pageNumber}`,
      '════════════════════════════════════════',
      '',
      'QUESTION:',
      ...this.wrapText(question, 40),
      '',
      'AI RESPONSE:',
      ...wrappedAnswer.slice(0, 10), // Limit to 10 lines
      '',
      '',
      '',
      'INDEX   ASK AGAIN   GAMES',
      ''
    ];

    return {
      id: pageNumber.toString(),
      title: 'AI Answer',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'ASK AGAIN', targetPage: '501', color: 'green' },
        { label: 'GAMES', targetPage: '600', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        aiGenerated: true
      }
    };
  }

  private async getCustomQuestionPage(question: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    console.log(`[AIAdapter] Generating AI response for custom question: ${question}`);
    const answer = await this.generateAIAnswer(question);
    console.log(`[AIAdapter] AI response generated, length: ${answer.length} chars`);

    // Wrap answer to fit 40-character width
    const wrappedAnswer = this.wrapText(answer, 40);

    const rows = [
      `502 AI Answer ${timeStr}               P502`,
      '════════════════════════════════════════',
      '',
      'YOUR QUESTION:',
      ...this.wrapText(question, 40).slice(0, 2),
      '',
      'AI RESPONSE:',
      ...wrappedAnswer.slice(0, 10), // Limit to 10 lines
      '',
      '',
      '',
      'INDEX   ASK AGAIN   GAMES',
      ''
    ];

    return {
      id: '502',
      title: 'AI Answer',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'ASK AGAIN', targetPage: '501', color: 'green' },
        { label: 'GAMES', targetPage: '600', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        aiGenerated: true,
        customQuestion: question
      }
    };
  }

  private getErrorPage(pageId: string, message: string): TeletextPage {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const rows = [
      `${pageId} AI Error ${timeStr}             P${pageId}`,
      '════════════════════════════════════════',
      '',
      'ERROR',
      '',
      ...this.wrapText(message, 40),
      '',
      'Please try again or select a',
      'pre-set question.',
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
      'INDEX   TRY AGAIN   GAMES',
      ''
    ];

    return {
      id: pageId,
      title: 'AI Error',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'TRY AGAIN', targetPage: '501', color: 'green' },
        { label: 'GAMES', targetPage: '600', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        error: message
      }
    };
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
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

  private async generateAIAnswer(question: string): Promise<string> {
    try {
      console.log('[AIAdapter] Initializing Vertex AI...');
      const vertexAI = this.getVertexAI();
      const model = vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Answer this question in a concise, informative way suitable for a teletext display (max 400 characters):

Question: ${question}

Requirements:
- Keep answer under 400 characters
- Be clear and concise
- Use simple language
- No special formatting or markdown
- Make it interesting and engaging

Provide only the answer, no preamble.`;

      console.log('[AIAdapter] Calling Vertex AI...');
      const result = await model.generateContent(prompt);
      const response = result.response;
      const candidates = response.candidates;

      if (!candidates || candidates.length === 0 || !candidates[0].content.parts.length) {
        throw new Error('No response from AI');
      }

      const text = candidates[0].content.parts[0].text || '';
      console.log('[AIAdapter] AI response received');
      
      // Truncate if too long
      return text.length > 400 ? text.substring(0, 397) + '...' : text;
    } catch (error) {
      console.error('[AIAdapter] AI generation failed:', error);
      // Fallback answer
      return 'AI service temporarily unavailable. Please try again later.';
    }
  }
}
