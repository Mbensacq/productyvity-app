import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from './env';

/** Thrown when Supabase access is attempted before the project is configured. */
export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see SETUP.md).',
    );
    this.name = 'SupabaseNotConfiguredError';
  }
}

let client: SupabaseClient | null = null;

/**
 * Returns a lazily-created Supabase client configured for the browser PKCE
 * flow with a persisted session. Throws {@link SupabaseNotConfiguredError} when
 * the project env vars are missing so the UI can render a setup screen instead
 * of crashing at import time.
 */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new SupabaseNotConfiguredError();
  }
  if (client === null) {
    client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

/** Test-only reset of the memoized client. */
export function resetSupabaseClientForTests(): void {
  client = null;
}
