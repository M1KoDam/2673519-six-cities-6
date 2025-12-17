import { describe, expect, it } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { configureStore, type AnyAction, type Middleware } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';
import { APIRoute, AuthStatus, Offer, Review, User } from '@types';
import {
  checkAuth,
  fetchFavorites,
  fetchOfferDetails,
  fetchOffers,
  fetchReviews,
  sendReview,
  toggleFavorite,
} from './api-actions';
import { loadOffers, setOffersDataLoadingStatus, updateOffer } from './offers-data/offers-data';
import { setAuthorizationStatus, setUser } from './user-data/user-data';
import {
  addReview,
  loadOfferInDetails,
  reviewsLoaded,
  setOfferInDetailsDataLoadingStatus,
  updateOfferInDetails,
} from './current-offer-data/current-offer-data';
import { Cities } from '@consts';

const makeUser = (partial?: Partial<User>): User => ({
  name: partial?.name ?? 'User',
  avatarUrl: partial?.avatarUrl ?? 'img/avatar.jpg',
  isPro: partial?.isPro ?? false,
  email: partial?.email ?? 'user@example.com',
  token: partial?.token ?? 'token',
});

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

const makeReview = (partial: Partial<Review> & { id: string }): Review => ({
  id: partial.id,
  date: partial.date ?? '2023-06-01T12:00:00.000Z',
  user: partial.user ?? makeUser(),
  rating: partial.rating ?? 4,
  comment: partial.comment ?? 'Nice',
  offerId: partial.offerId,
});

const createTestStore = (api = axios.create()) => {
  const actions: AnyAction[] = [];
  const actionRecorder: Middleware = () => (next) => (action) => {
    actions.push(action as AnyAction);
    return next(action);
  };

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: api,
        },
      }).concat(actionRecorder),
  });

  return { store, actions };
};

describe('api-actions (async thunks)', () => {
  it('fetchOffers dispatches loading flags and stores offers on success', async () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);
    const offers = [makeOffer({ id: '1' }), makeOffer({ id: '2', isFavorite: true })];
    mockApi.onGet(APIRoute.Offers).reply(200, offers);

    const { store, actions } = createTestStore(api);
    await store.dispatch(fetchOffers());

    const types = actions.map((a) => a.type);
    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: setOffersDataLoadingStatus.type, payload: true }),
      expect.objectContaining({ type: loadOffers.type, payload: offers }),
      expect.objectContaining({ type: setOffersDataLoadingStatus.type, payload: false }),
    ]));

    const idxTrue = types.indexOf(setOffersDataLoadingStatus.type);
    const idxLoad = types.indexOf(loadOffers.type);
    const idxFalse = types.lastIndexOf(setOffersDataLoadingStatus.type);
    expect(idxTrue).toBeLessThan(idxLoad);
    expect(idxLoad).toBeLessThan(idxFalse);

    expect(store.getState().OFFERS.offers).toEqual(offers);
  });

  it('fetchOffers dispatches loading flag false even on failure', async () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);
    mockApi.onGet(APIRoute.Offers).networkError();

    const { store, actions } = createTestStore(api);
    const result = await store.dispatch(fetchOffers());

    expect(fetchOffers.rejected.match(result)).toBe(true);
    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: setOffersDataLoadingStatus.type, payload: true }),
      expect.objectContaining({ type: setOffersDataLoadingStatus.type, payload: false }),
    ]));
    expect(actions.some((a) => a.type === loadOffers.type)).toBe(false);
  });

  it('checkAuth sets Auth status and user on success', async () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);
    const user = makeUser({ email: 'auth@example.com' });
    mockApi.onGet(APIRoute.Login).reply(200, user);

    const { store, actions } = createTestStore(api);
    const result = await store.dispatch(checkAuth());

    expect(checkAuth.fulfilled.match(result)).toBe(true);
    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: setAuthorizationStatus.type, payload: AuthStatus.Auth }),
      expect.objectContaining({ type: setUser.type, payload: user }),
    ]));
    expect(store.getState().USER.user).toEqual(user);
    expect(store.getState().USER.authorizationStatus).toBe(AuthStatus.Auth);
  });

  it('checkAuth sets NoAuth and null user on failure', async () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);
    mockApi.onGet(APIRoute.Login).reply(401);

    const { store, actions } = createTestStore(api);
    const result = await store.dispatch(checkAuth());

    expect(checkAuth.rejected.match(result)).toBe(true);
    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: setAuthorizationStatus.type, payload: AuthStatus.NoAuth }),
      expect.objectContaining({ type: setUser.type, payload: null }),
    ]));
  });

  it('fetchOfferDetails loads offer, nearby and reviews on success', async () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);
    const offerId = '10';
    const offer = makeOffer({ id: offerId, title: 'Details' });
    const nearby = [makeOffer({ id: '11' }), makeOffer({ id: '12' })];
    const reviews = [makeReview({ id: 'r1', comment: 'A' }), makeReview({ id: 'r2', comment: 'B' })];

    mockApi.onGet(`${APIRoute.Offers}/${offerId}`).reply(200, offer);
    mockApi.onGet(`${APIRoute.Offers}/${offerId}/nearby`).reply(200, nearby);
    mockApi.onGet(`${APIRoute.Comments}/${offerId}`).reply(200, reviews);

    const { store, actions } = createTestStore(api);
    const result = await store.dispatch(fetchOfferDetails(offerId));

    expect(fetchOfferDetails.fulfilled.match(result)).toBe(true);
    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: setOfferInDetailsDataLoadingStatus.type, payload: true }),
      expect.objectContaining({ type: updateOffer.type, payload: offer }),
      expect.objectContaining({
        type: loadOfferInDetails.type,
        payload: { offerInfo: offer, nearestOffers: nearby, reviews },
      }),
      expect.objectContaining({ type: setOfferInDetailsDataLoadingStatus.type, payload: false }),
    ]));

    expect(store.getState().CURRENT_OFFER.offerInfo).toEqual(offer);
    expect(store.getState().CURRENT_OFFER.nearbyOffers).toEqual(nearby);
    expect(store.getState().CURRENT_OFFER.reviews).toEqual(reviews);
  });

  it('fetchOfferDetails rejects with NOT_FOUND on 404', async () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);
    const offerId = '404';

    mockApi.onGet(`${APIRoute.Offers}/${offerId}`).reply(404);
    mockApi.onGet(`${APIRoute.Offers}/${offerId}/nearby`).reply(200, []);
    mockApi.onGet(`${APIRoute.Comments}/${offerId}`).reply(200, []);

    const { store, actions } = createTestStore(api);
    const result = await store.dispatch(fetchOfferDetails(offerId));

    expect(fetchOfferDetails.rejected.match(result)).toBe(true);
    expect((result as AnyAction).payload).toBe('NOT_FOUND');
    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: setOfferInDetailsDataLoadingStatus.type, payload: false }),
    ]));

    expect(store.getState().CURRENT_OFFER.offerInfo).toBeNull();
  });

  it('fetchReviews stores reviews on success', async () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);
    const offerId = '1';
    const reviews = [makeReview({ id: 'r1' }), makeReview({ id: 'r2' })];
    mockApi.onGet(`${APIRoute.Comments}/${offerId}`).reply(200, reviews);

    const { store, actions } = createTestStore(api);
    const result = await store.dispatch(fetchReviews(offerId));

    expect(fetchReviews.fulfilled.match(result)).toBe(true);
    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: reviewsLoaded.type, payload: reviews }),
    ]));
    expect(store.getState().CURRENT_OFFER.reviews).toEqual(reviews);
  });

  it('sendReview adds a review on success', async () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);
    const offerId = '1';
    const review = makeReview({ id: 'r1', comment: 'Great' });
    mockApi.onPost(`${APIRoute.Comments}/${offerId}`).reply(200, review);

    const { store, actions } = createTestStore(api);
    const result = await store.dispatch(sendReview({ offerId, comment: 'Great', rating: 5 }));

    expect(sendReview.fulfilled.match(result)).toBe(true);
    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: addReview.type, payload: review }),
    ]));
    expect(store.getState().CURRENT_OFFER.reviews).toEqual([review]);
  });

  it('fetchFavorites updates offers in store for each favorite', async () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);
    const favorites = [makeOffer({ id: '1', isFavorite: true }), makeOffer({ id: '2', isFavorite: true })];
    mockApi.onGet(APIRoute.Favorite).reply(200, favorites);

    const { store, actions } = createTestStore(api);
    const result = await store.dispatch(fetchFavorites());

    expect(fetchFavorites.fulfilled.match(result)).toBe(true);
    const updateOfferActions = actions.filter((a) => a.type === updateOffer.type);
    expect(updateOfferActions).toHaveLength(favorites.length);
    expect(store.getState().OFFERS.offers).toEqual(expect.arrayContaining(favorites));
  });

  it('toggleFavorite updates offers and offer details', async () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);
    const offerId = '1';
    const updated = makeOffer({ id: offerId, isFavorite: true });
    mockApi.onPost(`${APIRoute.Favorite}/${offerId}/1`).reply(200, updated);

    const { store, actions } = createTestStore(api);
    const result = await store.dispatch(toggleFavorite({ offerId, status: 1 }));

    expect(toggleFavorite.fulfilled.match(result)).toBe(true);
    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: updateOffer.type, payload: updated }),
      expect.objectContaining({ type: updateOfferInDetails.type, payload: updated }),
    ]));
  });
});
