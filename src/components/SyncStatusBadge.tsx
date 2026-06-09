import { useEffect, useState } from 'react';
import { t } from '@/lib/i18n';

/**
 * Phase 0 placeholder: reflects browser online/offline state. Later phases will
 * extend it with pending-mutation and conflict states from the sync queue.
 */
export function SyncStatusBadge() {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );

  useEffect(() => {
    const handleOnline = (): void => setOnline(true);
    const handleOffline = (): void => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <span
      aria-live="polite"
      style={{
        fontSize: '0.8rem',
        color: online ? 'var(--color-success)' : 'var(--color-warning)',
      }}
    >
      {online ? t('sync.online') : t('sync.offline')}
    </span>
  );
}
