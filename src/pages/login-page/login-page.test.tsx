import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LoginPage from './login-page';
import type { StoreState } from '@store/types';
import { SortType } from '@types';

const city = {
  name: 'Paris',
  location: { latitude: 48.85661, longitude: 2.351499, zoom: 16 },
} as const;

const routerMock = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => routerMock.navigate,
  };
});

vi.mock('@store/api-actions', () => ({
  login: () => ({ type: 'login' }),
  fetchOffers: () => ({ type: 'fetchOffers' }),
}));

const storeHooksMock = vi.hoisted(() => {
  const dispatch = vi.fn(() => Promise.resolve({ type: 'login/rejected', payload: 'Login failed' } as const));
  let state: StoreState;
  return {
    dispatch,
    setState: (next: StoreState) => {
      state = next;
    },
    getState: () => state,
  };
});

vi.mock('@store/hooks', () => ({
  useStoreDispatch: () => storeHooksMock.dispatch,
  useStoreState: <T,>(selector: (state: StoreState) => T) => selector(storeHooksMock.getState()),
}));

describe('Page: LoginPage', () => {
  it('Shows validation error when password contains spaces', async () => {
    const user = userEvent.setup({ delay: 0 });

    storeHooksMock.dispatch.mockClear();
    routerMock.navigate.mockClear();

    storeHooksMock.setState({
      USER: { authorizationStatus: 1, user: null },
      APP: { city: city as unknown as StoreState['APP']['city'], sortType: SortType.Popular, error: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <HelmetProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    emailInput.focus();
    await user.paste('user@example.com');

    const passwordInput = screen.getByPlaceholderText('Password');
    passwordInput.focus();
    await user.paste('bad password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Password cannot contain spaces')).toBeInTheDocument();
    expect(storeHooksMock.dispatch).not.toHaveBeenCalled();
  });
});
