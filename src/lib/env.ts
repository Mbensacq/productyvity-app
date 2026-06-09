import { z } from 'zod';

/**
 * Runtime-validated frontend environment. All values are PUBLIC (shipped in the
 * bundle). Secrets never live here — see SETUP.md.
 *
 * Missing Supabase/Google values are tolerated so the app can still boot and
 * render a clear "configuration required" screen instead of crashing. Use the
 * derived `isSupabaseConfigured` / `isGoogleConfigured` flags to gate features.
 */
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().trim().default(''),
  VITE_SUPABASE_ANON_KEY: z.string().trim().default(''),
  VITE_GOOGLE_CLIENT_ID: z.string().trim().default(''),
  VITE_BASE_PATH: z
    .string()
    .trim()
    .default('/')
    .transform((value) => (value === '' ? '/' : value)),
  VITE_SENTRY_DSN: z.string().trim().default(''),
});

export type AppEnv = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  // A shape error here is a developer/build misconfiguration — fail loudly.
  throw new Error(`Invalid environment configuration:\n${parsed.error.toString()}`);
}

export const env: AppEnv = parsed.data;

export const isSupabaseConfigured: boolean =
  env.VITE_SUPABASE_URL !== '' && env.VITE_SUPABASE_ANON_KEY !== '';

export const isGoogleConfigured: boolean = env.VITE_GOOGLE_CLIENT_ID !== '';
