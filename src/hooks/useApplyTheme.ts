import { useEffect } from 'react';
import { useUiStore, type ResolvedTheme, type ThemePreference } from '@/store/uiStore';

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') {
    const prefersDark =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  return preference;
}

/** Applies the active theme to `<html data-theme>` and tracks system changes. */
export function useApplyTheme(): void {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    const apply = (): void => {
      document.documentElement.dataset.theme = resolveTheme(theme);
    };
    apply();

    if (theme === 'system' && typeof window.matchMedia === 'function') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
    return undefined;
  }, [theme]);
}
