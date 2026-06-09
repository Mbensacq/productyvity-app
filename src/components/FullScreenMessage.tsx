import type { ReactNode } from 'react';

export function FullScreenMessage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        color: 'var(--color-text-muted)',
      }}
    >
      <p>{children}</p>
    </div>
  );
}
