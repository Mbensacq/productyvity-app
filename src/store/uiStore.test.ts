import { beforeEach, describe, expect, it } from 'vitest';
import { nextThemePreference, useUiStore } from './uiStore';

describe('nextThemePreference', () => {
  it('cycles system -> light -> dark -> system', () => {
    expect(nextThemePreference('system')).toBe('light');
    expect(nextThemePreference('light')).toBe('dark');
    expect(nextThemePreference('dark')).toBe('system');
  });
});

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.setState({ theme: 'system', sidebarOpen: true });
  });

  it('sets the theme', () => {
    useUiStore.getState().setTheme('dark');
    expect(useUiStore.getState().theme).toBe('dark');
  });

  it('cycles the theme', () => {
    useUiStore.getState().cycleTheme();
    expect(useUiStore.getState().theme).toBe('light');
  });

  it('toggles the sidebar', () => {
    expect(useUiStore.getState().sidebarOpen).toBe(true);
    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });
});
