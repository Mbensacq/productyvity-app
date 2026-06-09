import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';
import { makeSessionValue, renderWithSession } from '@/test/authTestUtils';
import type { AuthStatus } from './sessionContext';

function renderGuard(status: AuthStatus) {
  return renderWithSession(
    <Routes>
      <Route path="/login" element={<p>login screen</p>} />
      <Route
        path="/secret"
        element={
          <RequireAuth>
            <p>secret content</p>
          </RequireAuth>
        }
      />
    </Routes>,
    { value: makeSessionValue({ status }), initialEntries: ['/secret'] },
  );
}

describe('RequireAuth', () => {
  it('renders protected content when authenticated', () => {
    renderGuard('authenticated');
    expect(screen.getByText('secret content')).toBeInTheDocument();
  });

  it('redirects to /login when unauthenticated', () => {
    renderGuard('unauthenticated');
    expect(screen.getByText('login screen')).toBeInTheDocument();
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  });

  it('redirects to /login when Supabase is unconfigured', () => {
    renderGuard('unconfigured');
    expect(screen.getByText('login screen')).toBeInTheDocument();
  });

  it('shows a loading message while resolving the session', () => {
    renderGuard('loading');
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  });
});
