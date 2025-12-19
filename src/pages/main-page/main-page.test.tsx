import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import MainPage from './main-page';
import { Cities } from '@consts';
import type { StoreState } from '@store/types';
import { SortType, AuthStatus } from '@types';

vi.mock('@components/header-nav/header-nav', () => ({
  default: () => <div>HeaderNav</div>,
}));

vi.mock('@components/cities-list/cities-list', () => ({
  default: () => <div>CitiesList</div>,
}));

vi.mock('@components/offers-sorting/sorting-options', () => ({
  default: () => <div>SortingOptions</div>,
}));

vi.mock('@components/offers-list/offers-list.tsx', () => ({
  default: () => <div>OffersList</div>,
}));

vi.mock('@components/map/map', () => ({
  default: () => <div>Map</div>,
}));

const storeHooksMock = vi.hoisted(() => {
  let state: StoreState;
  return {
    setState: (next: StoreState) => {
      state = next;
    },
    getState: () => state,
  };
});

vi.mock('@store/hooks', () => ({
  useStoreState: <T,>(selector: (state: StoreState) => T) => selector(storeHooksMock.getState()),
  useStoreDispatch: () => vi.fn(),
}));

describe('Page: MainPage', () => {
  it('Renders empty state when no offers in current city', () => {
    storeHooksMock.setState({
      APP: { city: Cities[0].city, sortType: SortType.Popular, error: null },
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <HelmetProvider>
        <MainPage />
      </HelmetProvider>
    );

    expect(screen.getByText('CitiesList')).toBeInTheDocument();
    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
  });
});
