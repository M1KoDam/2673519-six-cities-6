import { describe, expect, it } from 'vitest';
import {
  addReview,
  currentOfferData,
  loadOfferInDetails,
  reviewsLoaded,
  setOfferInDetailsDataLoadingStatus,
  updateOfferInDetails,
} from './current-offer-data';
import { Cities } from '@consts';
import { Offer, Review, User } from '@types';

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

describe('currentOfferData reducer', () => {
  it('returns initial state with unknown action', () => {
    const state = currentOfferData.reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      offerInfo: null,
      nearbyOffers: [],
      reviews: [],
      isOfferInDetailsDataLoading: false,
    });
  });

  it('handles loadOfferInDetails', () => {
    const offerInfo = makeOffer({ id: '1', title: 'Details' });
    const nearestOffers = [makeOffer({ id: '2' }), makeOffer({ id: '3' })];
    const reviews = [makeReview({ id: 'r1' }), makeReview({ id: 'r2' })];

    const state = currentOfferData.reducer(
      undefined,
      loadOfferInDetails({ offerInfo, nearestOffers, reviews })
    );

    expect(state.offerInfo).toEqual(offerInfo);
    expect(state.nearbyOffers).toEqual(nearestOffers);
    expect(state.reviews).toEqual(reviews);
  });

  it('handles reviewsLoaded', () => {
    const reviews = [makeReview({ id: 'r1' })];
    const state = currentOfferData.reducer(undefined, reviewsLoaded(reviews));

    expect(state.reviews).toEqual(reviews);
  });

  it('handles addReview', () => {
    const review = makeReview({ id: 'r1' });
    const state = currentOfferData.reducer(undefined, addReview(review));

    expect(state.reviews).toEqual([review]);
  });

  it('handles setOfferInDetailsDataLoadingStatus', () => {
    const state = currentOfferData.reducer(undefined, setOfferInDetailsDataLoadingStatus(true));

    expect(state.isOfferInDetailsDataLoading).toBe(true);
  });

  it('handles updateOfferInDetails (updates offerInfo and nearbyOffers if ids match)', () => {
    const offerInfo = makeOffer({ id: '1', title: 'Old' });
    const nearbyOffers = [makeOffer({ id: '2', title: 'Nearby Old' }), makeOffer({ id: '3' })];
    const initial = {
      offerInfo,
      nearbyOffers,
      reviews: [],
      isOfferInDetailsDataLoading: false,
    };
    const updatedOfferInfo = makeOffer({ id: '1', title: 'New' });
    const updatedNearby = makeOffer({ id: '2', title: 'Nearby New' });

    const state1 = currentOfferData.reducer(initial, updateOfferInDetails(updatedOfferInfo));
    expect(state1.offerInfo?.title).toBe('New');

    const state2 = currentOfferData.reducer(initial, updateOfferInDetails(updatedNearby));
    expect(state2.nearbyOffers.find((o) => o.id === '2')?.title).toBe('Nearby New');
  });
});
