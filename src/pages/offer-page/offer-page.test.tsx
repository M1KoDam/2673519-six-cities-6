import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import OfferPage from './offer-page';
import { Cities } from '@consts';
import type { StoreState } from '@store/types';
import { SortType, AuthStatus } from '@types';

vi.mock('@pages/loading-page/loading-page', () => ({
  default: () => <div>LoadingPage</div>,
}));

vi.mock('@pages/not-found-page/not-found-page', () => ({
  default: () => <div>NotFoundPage</div>,
}));

vi.mock('@components/header-nav/header-nav', () => ({
  default: () => <div>HeaderNav</div>,
}));

vi.mock('@components/review-list/review-list', () => ({
  default: () => <div>ReviewsList</div>,
}));

vi.mock('@components/review-form/review-form', () => ({
  default: () => <div>ReviewForm</div>,
}));

vi.mock('@components/map/map', () => ({
  default: () => <div>Map</div>,
}));

vi.mock('@components/nearby-offers-list/nearby-offers-list', () => ({
  default: () => <div>NearbyOffersList</div>,
}));

vi.mock('@store/api-actions', () => ({
  fetchOfferDetails: () => ({ type: 'fetchOfferDetails' }),
  toggleFavorite: () => ({ type: 'toggleFavorite' }),
}));

const routerMock = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => routerMock.navigate,
  };
});

const storeHooksMock = vi.hoisted(() => {
  const dispatch = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
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

describe('Page: OfferPage', () => {
  it('Renders LoadingPage when offer is loading and not yet available', () => {
    storeHooksMock.setState({
      APP: { city: Cities[0].city, sortType: SortType.Popular, error: null },
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: true },
    });

    render(
      <HelmetProvider>
        <OfferPage />
      </HelmetProvider>
    );

    expect(screen.getByText('LoadingPage')).toBeInTheDocument();
  });

  it('Renders NotFoundPage when offer is missing and not loading', () => {
    storeHooksMock.setState({
      APP: { city: Cities[0].city, sortType: SortType.Popular, error: null },
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <HelmetProvider>
        <OfferPage />
      </HelmetProvider>
    );

    expect(screen.getByText('NotFoundPage')).toBeInTheDocument();
  });
});
