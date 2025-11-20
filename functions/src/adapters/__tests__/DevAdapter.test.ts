// Unit tests for DevAdapter

import { DevAdapter } from '../DevAdapter';


describe('DevAdapter', () => {
  let adapter: DevAdapter;

  beforeEach(() => {
    adapter = new DevAdapter();
  });

  describe('getPage', () => {
    it('should return API explorer index for page 800', async () => {
      const page = await adapter.getPage('800');
      expect(page.id).toBe('800');
      expect(page.title).toBe('API Explorer');
    });
  });
});
