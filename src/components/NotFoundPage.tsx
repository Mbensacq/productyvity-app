import { Link } from 'react-router-dom';
import { t } from '@/lib/i18n';

export function NotFoundPage() {
  return (
    <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '2rem' }}>
      <h1>{t('notFound.title')}</h1>
      <Link to="/">{t('notFound.back')}</Link>
    </main>
  );
}
