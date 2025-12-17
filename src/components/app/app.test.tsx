import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@store/root-reducer';
import { AuthStatus } from '@types';

vi.mock('@pages/main-page/main-page.tsx', () => ({
  default: () => <h1>MainPage</h1>,
}));

vi.mock('@pages/login-page/login-page.tsx', () => ({
  default: () => <h1>LoginPage</h1>,
}));

vi.mock('@pages/favorites-page/favorites-page.tsx', () => ({
  default: () => <h1>FavoritesPage</h1>,
}));

vi.mock('@pages/offer-page/offer-page.tsx', () => ({
  default: () => <h1>OfferPage</h1>,
}));

vi.mock('@pages/not-found-page/not-found-page', () => ({
  default: () => <h1>NotFoundPage</h1>,
}));

vi.mock('@pages/loading-page/loading-page', () => ({
  default: () => <h1>LoadingPage</h1>,
}));

import App from './app';

const makeStore = (preloadedState?: unknown) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as never,
  });

describe('App routing', () => {
  it('renders LoadingPage when authorization status is Unknown', () => {
    window.history.pushState({}, '', '/');

    const store = makeStore({
      APP: { city: { name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 10 } }, sortType: 'Popular', error: null },
      USER: { authorizationStatus: AuthStatus.Unknown, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('LoadingPage')).toBeInTheDocument();
  });

  it('renders LoginPage on /login', () => {
    window.history.pushState({}, '', '/login');

    const store = makeStore({
      APP: { city: { name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 10 } }, sortType: 'Popular', error: null },
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('LoginPage')).toBeInTheDocument();
  });

  it('renders NotFoundPage on unknown route', () => {
    window.history.pushState({}, '', '/some-unknown-route');

    const store = makeStore({
      APP: { city: { name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 10 } }, sortType: 'Popular', error: null },
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('NotFoundPage')).toBeInTheDocument();
  });

  it('redirects /favorites to /login when user is not authorized', () => {
    window.history.pushState({}, '', '/favorites');

    const store = makeStore({
      APP: { city: { name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 10 } }, sortType: 'Popular', error: null },
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('LoginPage')).toBeInTheDocument();
  });

  it('renders FavoritesPage on /favorites when user is authorized', () => {
    window.history.pushState({}, '', '/favorites');

    const store = makeStore({
      APP: { city: { name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 10 } }, sortType: 'Popular', error: null },
      USER: {
        authorizationStatus: AuthStatus.Auth,
        user: { name: 'U', avatarUrl: '', isPro: false, email: 'u@u.ru', token: 't' },
      },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('FavoritesPage')).toBeInTheDocument();
  });
});
