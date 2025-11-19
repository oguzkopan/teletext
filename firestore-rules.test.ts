/**
 * Firestore Security Rules Tests
 * 
 * Tests the security rules for pages_cache, conversations, and user_preferences collections
 * Run with: npm run test:firestore-rules
 */

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { setLogLevel } from 'firebase/firestore';
import * as fs from 'fs';

// Disable logging for cleaner test output
setLogLevel('error');

let testEnv: RulesTestEnvironment;

describe('Firestore Security Rules', () => {
  beforeAll(async () => {
    // Initialize test environment with security rules
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-modern-teletext',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  describe('pages_cache collection', () => {
    it('should allow anyone to read valid page IDs', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      
      // Set up test data using admin context
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('pages_cache').doc('201').set({
          pageId: '201',
          page: {
            id: '201',
            title: 'Test Page',
            rows: Array(24).fill('Test row'),
            links: [],
          },
          source: 'NewsAdapter',
          cachedAt: new Date(),
          expiresAt: new Date(Date.now() + 300000),
          accessCount: 0,
        });
      });

      await assertSucceeds(db.collection('pages_cache').doc('201').get());
    });

    it('should deny reading invalid page IDs', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      
      await assertFails(db.collection('pages_cache').doc('99').get());
      await assertFails(db.collection('pages_cache').doc('900').get());
      await assertFails(db.collection('pages_cache').doc('abc').get());
    });

    it('should deny write operations from users', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      const pageData = {
        pageId: '201',
        page: {
          id: '201',
          title: 'Test',
          rows: Array(24).fill('Test'),
          links: [],
        },
        source: 'Test',
        cachedAt: new Date(),
        expiresAt: new Date(),
        accessCount: 0,
      };

      await assertFails(db.collection('pages_cache').doc('201').set(pageData));
      await assertFails(db.collection('pages_cache').doc('201').update({ accessCount: 1 }));
      await assertFails(db.collection('pages_cache').doc('201').delete());
    });
  });

  describe('conversations collection', () => {
    const validConversation = {
      contextId: 'test-context-123',
      userId: 'user1',
      state: {
        contextId: 'test-context-123',
        mode: 'qa',
        history: [
          { role: 'user', content: 'Hello', pageId: '500' },
        ],
        parameters: {},
      },
      createdAt: new Date(),
      lastAccessedAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
    };

    it('should allow authenticated users to create their own conversations', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      await assertSucceeds(
        db.collection('conversations').doc('conv1').set(validConversation)
      );
    });

    it('should deny users from creating conversations for other users', async () => {
      const db = testEnv.authenticatedContext('user2').firestore();
      
      await assertFails(
        db.collection('conversations').doc('conv1').set(validConversation)
      );
    });

    it('should allow users to read their own conversations', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('conversations').doc('conv1').set(validConversation);
      });

      await assertSucceeds(db.collection('conversations').doc('conv1').get());
    });

    it('should deny users from reading other users conversations', async () => {
      const db = testEnv.authenticatedContext('user2').firestore();
      
      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('conversations').doc('conv1').set(validConversation);
      });

      await assertFails(db.collection('conversations').doc('conv1').get());
    });

    it('should allow users to update their own conversations', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('conversations').doc('conv1').set(validConversation);
      });

      await assertSucceeds(
        db.collection('conversations').doc('conv1').update({
          lastAccessedAt: new Date(),
        })
      );
    });

    it('should deny users from updating other users conversations', async () => {
      const db = testEnv.authenticatedContext('user2').firestore();
      
      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('conversations').doc('conv1').set(validConversation);
      });

      await assertFails(
        db.collection('conversations').doc('conv1').update({
          lastAccessedAt: new Date(),
        })
      );
    });

    it('should allow users to delete their own conversations', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('conversations').doc('conv1').set(validConversation);
      });

      await assertSucceeds(db.collection('conversations').doc('conv1').delete());
    });

    it('should deny invalid conversation data', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      const invalidConversation = {
        contextId: 'test-context-123',
        userId: 'user1',
        // Missing required fields
      };

      await assertFails(
        db.collection('conversations').doc('conv1').set(invalidConversation)
      );
    });
  });

  describe('user_preferences collection', () => {
    const validPreferences = {
      userId: 'user1',
      theme: 'ceefax',
      favoritePages: ['100', '201', '301'],
      settings: {
        scanlines: true,
        curvature: true,
        noise: false,
      },
      updatedAt: new Date(),
    };

    it('should allow users to create their own preferences', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      await assertSucceeds(
        db.collection('user_preferences').doc('user1').set(validPreferences)
      );
    });

    it('should deny users from creating preferences for other users', async () => {
      const db = testEnv.authenticatedContext('user2').firestore();
      
      await assertFails(
        db.collection('user_preferences').doc('user1').set(validPreferences)
      );
    });

    it('should allow users to read their own preferences', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('user_preferences').doc('user1').set(validPreferences);
      });

      await assertSucceeds(db.collection('user_preferences').doc('user1').get());
    });

    it('should deny users from reading other users preferences', async () => {
      const db = testEnv.authenticatedContext('user2').firestore();
      
      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('user_preferences').doc('user1').set(validPreferences);
      });

      await assertFails(db.collection('user_preferences').doc('user1').get());
    });

    it('should allow users to update their own preferences', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('user_preferences').doc('user1').set(validPreferences);
      });

      await assertSucceeds(
        db.collection('user_preferences').doc('user1').update({
          theme: 'high-contrast',
        })
      );
    });

    it('should deny users from updating other users preferences', async () => {
      const db = testEnv.authenticatedContext('user2').firestore();
      
      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('user_preferences').doc('user1').set(validPreferences);
      });

      await assertFails(
        db.collection('user_preferences').doc('user1').update({
          theme: 'high-contrast',
        })
      );
    });

    it('should deny preferences with more than 10 favorite pages', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      const invalidPreferences = {
        ...validPreferences,
        favoritePages: Array(11).fill('100'),
      };

      await assertFails(
        db.collection('user_preferences').doc('user1').set(invalidPreferences)
      );
    });

    it('should deny invalid preferences data', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      const invalidPreferences = {
        userId: 'user1',
        theme: 'ceefax',
        // Missing required fields
      };

      await assertFails(
        db.collection('user_preferences').doc('user1').set(invalidPreferences)
      );
    });
  });

  describe('analytics collection', () => {
    it('should allow anyone to read analytics', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      
      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('analytics').doc('2024-01-01').set({
          date: '2024-01-01',
          pageViews: { '100': 50, '201': 30 },
          totalRequests: 80,
          errorCount: 2,
          avgLoadTime: 250,
        });
      });

      await assertSucceeds(db.collection('analytics').doc('2024-01-01').get());
    });

    it('should deny write operations from users', async () => {
      const db = testEnv.authenticatedContext('user1').firestore();
      
      const analyticsData = {
        date: '2024-01-01',
        pageViews: {},
        totalRequests: 0,
        errorCount: 0,
        avgLoadTime: 0,
      };

      await assertFails(db.collection('analytics').doc('2024-01-01').set(analyticsData));
      await assertFails(db.collection('analytics').doc('2024-01-01').update({ totalRequests: 1 }));
      await assertFails(db.collection('analytics').doc('2024-01-01').delete());
    });
  });
});
