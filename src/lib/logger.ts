/**
 * Centralized error logging. Today it logs to the console; a Sentry transport
 * can be wired behind `VITE_SENTRY_DSN` later without changing call sites.
 */
export interface ErrorContext {
  readonly [key: string]: unknown;
}

export function logError(error: unknown, context?: ErrorContext): void {
  console.error('[app-error]', error, context ?? {});
}

let installed = false;

/** Installs global handlers so no async failure goes silently unreported. */
export function installGlobalErrorHandlers(): void {
  if (installed || typeof window === 'undefined') {
    return;
  }
  installed = true;

  window.addEventListener('error', (event) => {
    logError(event.error ?? event.message, { source: 'window.onerror' });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, { source: 'unhandledrejection' });
  });
}
