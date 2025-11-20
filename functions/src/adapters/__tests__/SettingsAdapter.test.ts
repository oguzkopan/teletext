// Tests for SettingsAdapter

import { SettingsAdapter } from '../SettingsAdapter';

describe('SettingsAdapter', () => {
  let adapter: SettingsAdapter;

  beforeEach(() => {
    adapter = new SettingsAdapter();
  });

  describe('getPage', () => {
    it('should return theme selection page for page 700', async () => {
      const page = await adapter.getPage('700');
      expect(page.id).toBe('700');
      expect(page.title).toBe('Theme Selection');
    });
  });
});
