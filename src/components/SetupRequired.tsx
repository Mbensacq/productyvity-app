import { isGoogleConfigured, isSupabaseConfigured } from '@/lib/env';
import { t } from '@/lib/i18n';

export function SetupRequired() {
  return (
    <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '2rem' }}>
      <h1>{t('setup.title')}</h1>
      {!isSupabaseConfigured && <p role="alert">{t('setup.supabaseMissing')}</p>}
      {!isGoogleConfigured && <p>{t('setup.googleMissing')}</p>}
    </main>
  );
}
