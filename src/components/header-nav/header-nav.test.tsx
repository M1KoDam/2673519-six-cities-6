import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HeaderNav from './header-nav';
import { AuthStatus } from '@types';
import type { StoreState } from '@store/types';
import { Cities } from '@consts';
import { Offer, SortType } from '@types';

const logoutAction = { type: 'logout' } as const;

vi.mock('@store/api-actions', () => ({
  logout: () => logoutAction,
}));

const storeHooksMock = vi.hoisted(() => {
  const dispatch = vi.fn();
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

const makeOffer = (partial: Partial<Offer> & { id: string }): Offer => ({
  id: partial.id,
  title: partial.title ?? 'Offer',
  type: partial.type ?? 'apartment',
  price: partial.price ?? 100,
  city: partial.city ?? Cities[0].city,
  location: partial.location ?? { latitude: 1, longitude: 2, zoom: 10 },
  rating: partial.rating ?? 4,
  isFavorite: partial.isFavorite ?? false,
  isPremium: partial.isPremium ?? false,
});

describe('Component: HeaderNav', () => {
  it('Shows Sign in when not authorized', () => {
    storeHooksMock.dispatch.mockClear();
    storeHooksMock.setState({
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      APP: { city: Cities[0].city, sortType: SortType.Popular, error: null },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <MemoryRouter>
        <HeaderNav />
      </MemoryRouter>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('Shows user email and dispatches logout on click', async () => {
    const user = userEvent.setup();

    storeHooksMock.dispatch.mockClear();

    storeHooksMock.setState({
      USER: { authorizationStatus: AuthStatus.Auth, user: { email: 'u@u.ru', name: 'U', avatarUrl: '', isPro: false, token: 't' } },
      OFFERS: {
        offers: [
          makeOffer({ id: '1', isFavorite: true }),
          makeOffer({ id: '2', isFavorite: true }),
          makeOffer({ id: '3', isFavorite: true }),
        ],
        isOffersDataLoading: false,
        favoritesCount: 3,
      },
      APP: { city: Cities[0].city, sortType: SortType.Popular, error: null },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <MemoryRouter>
        <HeaderNav />
      </MemoryRouter>
    );

    expect(screen.getByText('u@u.ru')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    await user.click(screen.getByText('Sign out'));
    expect(storeHooksMock.dispatch).toHaveBeenCalledWith(logoutAction);
  });
});
