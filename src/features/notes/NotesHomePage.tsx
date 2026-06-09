import { t } from '@/lib/i18n';

/**
 * Phase 0 placeholder home. Phase 1 replaces this with the notes list, editor,
 * graph and search. Default-exported for route-level lazy loading.
 */
export default function NotesHomePage() {
  return (
    <section>
      <h1>{t('nav.notes')}</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>{t('app.tagline')}</p>
    </section>
  );
}
