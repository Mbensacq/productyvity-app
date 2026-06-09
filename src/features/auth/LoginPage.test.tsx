import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { makeSessionValue, renderWithSession } from '@/test/authTestUtils';

function renderLogin(value = makeSessionValue()) {
  return renderWithSession(
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<p>home screen</p>} />
    </Routes>,
    { value, initialEntries: ['/login'] },
  );
}

describe('LoginPage', () => {
  it('renders the Google sign-in button when unauthenticated', () => {
    renderLogin();
    expect(
      screen.getByRole('button', { name: /se connecter avec google/i }),
    ).toBeInTheDocument();
  });

  it('calls signInWithGoogle when the button is clicked', async () => {
    const signInWithGoogle = vi.fn().mockResolvedValue(undefined);
    renderLogin(makeSessionValue({ signInWithGoogle }));

    await userEvent.click(
      screen.getByRole('button', { name: /se connecter avec google/i }),
    );

    expect(signInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('shows an error when sign-in fails', async () => {
    const signInWithGoogle = vi.fn().mockRejectedValue(new Error('nope'));
    renderLogin(makeSessionValue({ signInWithGoogle }));

    await userEvent.click(
      screen.getByRole('button', { name: /se connecter avec google/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(/échec de la connexion/i);
  });

  it('shows the configuration screen when Supabase is unconfigured', () => {
    renderLogin(makeSessionValue({ status: 'unconfigured' }));
    expect(screen.getByRole('heading', { name: /configuration requise/i })).toBeInTheDocument();
  });

  it('redirects authenticated users to the home screen', () => {
    renderLogin(makeSessionValue({ status: 'authenticated' }));
    expect(screen.getByText('home screen')).toBeInTheDocument();
  });
});
