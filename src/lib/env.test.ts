import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('env', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('reports Supabase as configured when url and anon key are present', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');
    const mod = await import('./env');
    expect(mod.isSupabaseConfigured).toBe(true);
  });

  it('reports Supabase as not configured when values are missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
    const mod = await import('./env');
    expect(mod.isSupabaseConfigured).toBe(false);
  });

  it('detects Google client id presence and defaults base path to "/"', async () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'client-id.apps.googleusercontent.com');
    vi.stubEnv('VITE_BASE_PATH', '');
    const mod = await import('./env');
    expect(mod.isGoogleConfigured).toBe(true);
    expect(mod.env.VITE_BASE_PATH).toBe('/');
  });
});
