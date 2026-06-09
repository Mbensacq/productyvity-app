import type { ReactElement } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import {
  SessionContext,
  type SessionContextValue,
} from '@/features/auth/sessionContext';

export function makeSessionValue(
  overrides: Partial<SessionContextValue> = {},
): SessionContextValue {
  return {
    status: 'unauthenticated',
    session: null,
    user: null,
    signInWithGoogle: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

interface RenderWithSessionOptions {
  value: SessionContextValue;
  initialEntries?: string[];
}

export function renderWithSession(
  ui: ReactElement,
  { value, initialEntries = ['/'] }: RenderWithSessionOptions,
): RenderResult {
  return render(
    <SessionContext.Provider value={value}>
      <MemoryRouter
        initialEntries={initialEntries}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {ui}
      </MemoryRouter>
    </SessionContext.Provider>,
  );
}
