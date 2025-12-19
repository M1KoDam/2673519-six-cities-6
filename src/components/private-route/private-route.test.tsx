import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './private-route';

type AuthStatusValue = 0 | 1 | 2;

const storeHooksMock = vi.hoisted(() => {
  let authStatus: AuthStatusValue = 1;
  return {
    setAuthStatus: (next: AuthStatusValue) => {
      authStatus = next;
    },
    useStoreState: vi.fn(() => authStatus),
  };
});

vi.mock('@store/hooks', () => ({
  useStoreState: storeHooksMock.useStoreState,
  useStoreDispatch: () => vi.fn(),
}));

describe('Component: PrivateRoute', () => {
  it('Renders children when authorized', () => {
    storeHooksMock.setAuthStatus(0);

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Routes>
          <Route
            path="/favorites"
            element={(
              <PrivateRoute>
                <div>Private content</div>
              </PrivateRoute>
            )}
          />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Private content')).toBeInTheDocument();
  });

  it('Redirects to /login when not authorized', () => {
    storeHooksMock.setAuthStatus(1);

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Routes>
          <Route
            path="/favorites"
            element={(
              <PrivateRoute>
                <div>Private content</div>
              </PrivateRoute>
            )}
          />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
