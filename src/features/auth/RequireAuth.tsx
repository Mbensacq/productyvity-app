import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { FullScreenMessage } from '@/components/FullScreenMessage';
import { t } from '@/lib/i18n';
import { useSession } from './sessionContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useSession();

  if (status === 'loading') {
    return <FullScreenMessage>{t('app.loading')}</FullScreenMessage>;
  }
  if (status === 'authenticated') {
    return <>{children}</>;
  }
  // 'unauthenticated' and 'unconfigured' both route to /login, which renders the
  // appropriate sign-in or configuration screen.
  return <Navigate to="/login" replace />;
}
