import { useUiStore, type ThemePreference } from '@/store/uiStore';
import { t } from '@/lib/i18n';

const THEME_LABEL: Record<ThemePreference, string> = {
  system: t('theme.system'),
  light: t('theme.light'),
  dark: t('theme.dark'),
};

export function ThemeToggle() {
  const theme = useUiStore((state) => state.theme);
  const cycleTheme = useUiStore((state) => state.cycleTheme);

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={t('theme.toggle')}
      title={t('theme.toggle')}
      style={{
        background: 'var(--color-bg-subtle)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
        borderRadius: '0.5rem',
        padding: '0.35rem 0.7rem',
        cursor: 'pointer',
      }}
    >
      {THEME_LABEL[theme]}
    </button>
  );
}
