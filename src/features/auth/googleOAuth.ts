import type { SignInWithOAuthCredentials } from '@supabase/supabase-js';

/**
 * Scopes requested at Google sign-in. Calendar + Tasks are required for the
 * Phase 3 sync; openid/email/profile identify the user.
 */
export const GOOGLE_OAUTH_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/tasks',
].join(' ');

/**
 * Builds the `signInWithOAuth` payload. `access_type=offline` + `prompt=consent`
 * are required to receive a Google refresh token (issued only on first consent).
 */
export function buildGoogleSignInOptions(redirectTo: string): SignInWithOAuthCredentials {
  return {
    provider: 'google',
    options: {
      scopes: GOOGLE_OAUTH_SCOPES,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo,
    },
  };
}

/** The URL Supabase redirects back to after Google consent (app base URL). */
export function getAuthRedirectUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${window.location.origin}${base}`;
}
