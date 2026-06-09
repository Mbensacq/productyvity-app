import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase, SupabaseNotConfiguredError } from '@/lib/supabase';
import { logError } from '@/lib/logger';
import { buildGoogleSignInOptions, getAuthRedirectUrl } from './googleOAuth';
import { SessionContext, type AuthStatus, type SessionContextValue } from './sessionContext';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabase();
    } catch (error) {
      if (error instanceof SupabaseNotConfiguredError) {
        setStatus('unconfigured');
        return;
      }
      throw error;
    }

    let active = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) {
        return;
      }
      if (error) {
        logError(error, { scope: 'auth.getSession' });
      }
      setSession(data.session);
      setStatus(data.session ? 'authenticated' : 'unauthenticated');
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) {
        return;
      }
      setSession(nextSession);
      setStatus(nextSession ? 'authenticated' : 'unauthenticated');
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      signInWithGoogle: async () => {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signInWithOAuth(
          buildGoogleSignInOptions(getAuthRedirectUrl()),
        );
        if (error) {
          logError(error, { scope: 'auth.signInWithOAuth' });
          throw error;
        }
      },
      signOut: async () => {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signOut();
        if (error) {
          logError(error, { scope: 'auth.signOut' });
          throw error;
        }
      },
    }),
    [status, session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
