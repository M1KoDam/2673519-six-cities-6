import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import FavoritesPage from './favorites-page';
import { Cities } from '@consts';
import type { Offer } from '@types';
import type { StoreState } from '@store/types';
import { AuthStatus, SortType } from '@types';

vi.mock('@components/header-nav/header-nav', () => ({
  default: () => <div>HeaderNav</div>,
}));

vi.mock('@components/place-card/place-card', () => ({
  default: ({ offer }: { offer: Offer }) => <div>{offer.title}</div>,
}));

vi.mock('@store/api-actions', () => ({
  fetchFavorites: () => ({ type: 'fetchFavorites' }),
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

describe('Page: FavoritesPage', () => {
  it('Dispatches fetchFavorites on mount and shows empty state when no cities', () => {
    storeHooksMock.setState({
      APP: { city: Cities[0].city, sortType: SortType.Popular, error: null },
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <HelmetProvider>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(storeHooksMock.dispatch).toHaveBeenCalledWith({ type: 'fetchFavorites' });
    expect(screen.getByText('Nothing yet saved')).toBeInTheDocument();
  });
});
