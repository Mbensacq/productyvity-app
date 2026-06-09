import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FullScreenMessage } from '@/components/FullScreenMessage';
import { SetupRequired } from '@/components/SetupRequired';
import { t } from '@/lib/i18n';
import { useSession } from './sessionContext';

export function LoginPage() {
  const { status, signInWithGoogle } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (status === 'loading') {
    return <FullScreenMessage>{t('app.loading')}</FullScreenMessage>;
  }
  if (status === 'authenticated') {
    return <Navigate to="/" replace />;
  }
  if (status === 'unconfigured') {
    return <SetupRequired />;
  }

  const handleSignIn = async (): Promise<void> => {
    setSubmitting(true);
    setHasError(false);
    try {
      await signInWithGoogle();
      // On success the browser navigates to Google; nothing else to do here.
    } catch {
      setHasError(true);
      setSubmitting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '24rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>{t('app.title')}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>{t('app.tagline')}</p>
        {hasError && (
          <p role="alert" style={{ color: 'var(--color-danger)' }}>
            {t('auth.error')}
          </p>
        )}
        <button
          type="button"
          onClick={() => void handleSignIn()}
          disabled={submitting}
          style={{
            marginTop: '1rem',
            background: 'var(--color-primary)',
            color: 'var(--color-primary-contrast)',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.6rem 1.2rem',
            cursor: submitting ? 'progress' : 'pointer',
          }}
        >
          {submitting ? t('auth.signingIn') : t('auth.signInWithGoogle')}
        </button>
      </div>
    </main>
  );
}
