import { createOfflinePage } from '../teletext';

/**
 * Tests for teletext utility functions
 * Requirement: 13.4
 */
describe('createOfflinePage', () => {
  it('should create a valid offline error page', () => {
    const pageId = '404';
    const offlinePage = createOfflinePage(pageId);

    expect(offlinePage.id).toBe(pageId);
    expect(offlinePage.title).toBe('OFFLINE');
    expect(offlinePage.rows).toHaveLength(24);
    expect(offlinePage.rows.every(row => row.length === 40)).toBe(true);
  });

  it('should include page ID in header', () => {
    const pageId = '200';
    const offlinePage = createOfflinePage(pageId);

    expect(offlinePage.rows[0]).toContain(pageId);
  });

  it('should include helpful error message', () => {
    const offlinePage = createOfflinePage('300');

    const content = offlinePage.rows.join(' ');
    expect(content).toContain('NO NETWORK CONNECTION');
    expect(content).toContain('not available offline');
  });

  it('should include navigation link to index', () => {
    const offlinePage = createOfflinePage('500');

    expect(offlinePage.links).toHaveLength(1);
    expect(offlinePage.links[0].targetPage).toBe('100');
    expect(offlinePage.links[0].label).toBe('INDEX');
  });

  it('should mark cache status as stale', () => {
    const offlinePage = createOfflinePage('600');

    expect(offlinePage.meta?.cacheStatus).toBe('stale');
  });

  it('should include system source', () => {
    const offlinePage = createOfflinePage('700');

    expect(offlinePage.meta?.source).toBe('System');
  });
});
