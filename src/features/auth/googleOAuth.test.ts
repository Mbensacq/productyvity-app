import { describe, expect, it } from 'vitest';
import { buildGoogleSignInOptions, GOOGLE_OAUTH_SCOPES } from './googleOAuth';

describe('buildGoogleSignInOptions', () => {
  it('targets Google with the required scopes', () => {
    const options = buildGoogleSignInOptions('https://app.example/');
    expect(options.provider).toBe('google');
    expect(GOOGLE_OAUTH_SCOPES).toContain('https://www.googleapis.com/auth/calendar');
    expect(GOOGLE_OAUTH_SCOPES).toContain('https://www.googleapis.com/auth/tasks');
    expect(options.options?.scopes).toBe(GOOGLE_OAUTH_SCOPES);
  });

  it('requests offline access with forced consent to obtain a refresh token', () => {
    const options = buildGoogleSignInOptions('https://app.example/');
    expect(options.options?.queryParams).toEqual({
      access_type: 'offline',
      prompt: 'consent',
    });
  });

  it('passes the redirect URL through', () => {
    const options = buildGoogleSignInOptions('https://app.example/sub/');
    expect(options.options?.redirectTo).toBe('https://app.example/sub/');
  });
});
