import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute } from '@consts';
import PrivateRoute from '@components/private-route/private-route';
import FavoritesPage from '@pages/favorites-page/favorites-page.tsx';
import LoginPage from '@pages/login-page/login-page.tsx';
import MainPage from '@pages/main-page/main-page.tsx';
import OfferPage from '@pages/offer-page/offer-page.tsx';
import NotFoundPage from '@pages/not-found-page/not-found-page';
import { useStoreState } from '@store/hooks';
import LoadingPage from '@pages/loading-page/loading-page';
import { AuthStatus } from '@types';
import { getAuthorizationStatus } from '@store/user-data/selectors';
import { getOffersDataLoadingStatus } from '@store/offers-data/selectors';

export default function App(): JSX.Element {
  const authStatus = useStoreState(getAuthorizationStatus);
  const isOffersLoading = useStoreState(getOffersDataLoadingStatus);

  if (authStatus === AuthStatus.Unknown || isOffersLoading) {
    return (
      <LoadingPage/>
    );
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path={AppRoute.Root}
            element={<MainPage/>}
          />
          <Route
            path={AppRoute.Login}
            element={<LoginPage/>}
          />
          <Route
            path={AppRoute.Favorites}
            element={
              <PrivateRoute>
                <FavoritesPage/>
              </PrivateRoute>
            }
          />
          <Route
            path={`${AppRoute.Offer}/:id`}
            element={<OfferPage/>}
          />
          <Route
            path='*'
            element={<NotFoundPage />}
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
