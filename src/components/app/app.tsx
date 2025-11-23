import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute, AuthStatus } from '@consts';
import PrivateRoute from '@components/private-route/private-route';
import FavoritesPage from '@pages/favorites-page/favorites-page.tsx';
import LoginPage from '@pages/login-page/login-page.tsx';
import MainPage from '@pages/main-page/main-page.tsx';
import OfferPage from '@pages//offer-page/offer-page.tsx';
import NotFoundPage from '@pages/not-found-page/not-found-page';
import { useStoreState, useStoreDispatch, offersLoaded, reviewsLoaded } from '@store/index';

export default function App(): JSX.Element {
  const offers = useStoreState((state) => state.offers);
  const reviews = useStoreState((state) => state.reviews);
  const dispatch = useStoreDispatch();
  dispatch(offersLoaded(offers));
  dispatch(reviewsLoaded(reviews));

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
              <PrivateRoute
                authorizationStatus={AuthStatus.Auth}
              >
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
