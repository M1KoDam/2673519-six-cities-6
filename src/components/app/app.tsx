import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute } from '@consts';
import PrivateRoute from '@components/private-route/private-route';
import FavoritesPage from '@pages/favorites-page/favorites-page.tsx';
import LoginPage from '@pages/login-page/login-page.tsx';
import MainPage from '@pages/main-page/main-page.tsx';
import OfferPage from '@pages/offer-page/offer-page.tsx';
import NotFoundPage from '@pages/not-found-page/not-found-page';
import { useStoreState } from '@store/index';
import LoadingPage from '@pages/loading-page/loading-page';
import { AuthStatus } from '@types';

export default function App(): JSX.Element {
  const authStatus = useStoreState((state) => state.authStatus);
  const isDataLoading = useStoreState((state) => state.isDataLoading);

  if (authStatus === AuthStatus.Unknown || isDataLoading) {
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
