import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PlaceCard from './place-card';
import { AuthStatus } from '@types';
import { Cities } from '@consts';
import { CardType, AppRoute } from '@consts';
import type { Offer } from '@types';
import type { StoreState } from '@store/types';
import { SortType } from '@types';

vi.mock('@store/api-actions', () => ({
  toggleFavorite: (payload: { offerId: string; status: 0 | 1 }) => ({ type: 'toggleFavorite', payload }),
}));

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

const makeOffer = (isFavorite = false): Offer => ({
  id: '1',
  title: 'Nice place',
  type: 'apartment',
  price: 100,
  city: Cities[0].city,
  location: { latitude: 1, longitude: 2, zoom: 10 },
  rating: 4,
  isFavorite,
  isPremium: true,
});

describe('Component: PlaceCard', () => {
  it('Navigates to login when bookmark clicked and user is not authorized', async () => {
    const user = userEvent.setup();

    storeHooksMock.setState({
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      APP: { city: Cities[0].city, sortType: SortType.Popular, error: null },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <MemoryRouter>
        <PlaceCard offer={makeOffer(false)} onCursorEnter={() => {}} onCursorLeave={() => {}} cardType={CardType.Regular} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button'));
    expect(routerMock.navigate).toHaveBeenCalledWith(AppRoute.Login);
    expect(storeHooksMock.dispatch).not.toHaveBeenCalled();
  });

  it('Dispatches toggleFavorite when authorized', async () => {
    const user = userEvent.setup();

    storeHooksMock.dispatch.mockClear();
    routerMock.navigate.mockClear();

    storeHooksMock.setState({
      USER: { authorizationStatus: AuthStatus.Auth, user: { email: 'u@u.ru', name: 'U', avatarUrl: '', isPro: false, token: 't' } },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      APP: { city: Cities[0].city, sortType: SortType.Popular, error: null },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <MemoryRouter>
        <PlaceCard offer={makeOffer(false)} onCursorEnter={() => {}} onCursorLeave={() => {}} cardType={CardType.Regular} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button'));

    expect(storeHooksMock.dispatch).toHaveBeenCalledWith({
      type: 'toggleFavorite',
      payload: { offerId: '1', status: 1 },
    });
  });
});
