import { describe, expect, it } from 'vitest';
import { offersData, loadOffers, setOffersDataLoadingStatus, updateFavoritesCount, updateOffer } from './offers-data';
import { Offer } from '@types';
import { Cities } from '@consts';

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
  previewImage: partial.previewImage,
  description: partial.description,
});

describe('OffersData reducer', () => {
  it('Returns initial state with unknown action', () => {
    const state = offersData.reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      offers: [],
      isOffersDataLoading: false,
      favoritesCount: 0,
    });
  });

  it('Handles loadOffers', () => {
    const offers = [makeOffer({ id: '1' }), makeOffer({ id: '2', isFavorite: true })];
    const state = offersData.reducer(undefined, loadOffers(offers));

    expect(state.offers).toEqual(offers);
  });

  it('Handles setOffersDataLoadingStatus', () => {
    const state = offersData.reducer(undefined, setOffersDataLoadingStatus(true));

    expect(state.isOffersDataLoading).toBe(true);
  });

  it('Handles updateFavoritesCount (toggles favorite and recalculates count)', () => {
    const initial = {
      offers: [
        makeOffer({ id: '1', isFavorite: false }),
        makeOffer({ id: '2', isFavorite: true }),
      ],
      isOffersDataLoading: false,
      favoritesCount: 1,
    };

    const state = offersData.reducer(initial, updateFavoritesCount({ id: '1', isFavorite: true }));

    expect(state.offers.find((o) => o.id === '1')?.isFavorite).toBe(true);
    expect(state.favoritesCount).toBe(2);
  });

  it('Handles updateOffer (updates existing offer)', () => {
    const offerV1 = makeOffer({ id: '1', title: 'Old' });
    const offerV2 = makeOffer({ id: '1', title: 'New' });
    const initial = {
      offers: [offerV1],
      isOffersDataLoading: false,
      favoritesCount: 0,
    };

    const state = offersData.reducer(initial, updateOffer(offerV2));

    expect(state.offers).toHaveLength(1);
    expect(state.offers[0]).toEqual(offerV2);
  });

  it('Handles updateOffer (adds new offer if not present)', () => {
    const initial = {
      offers: [makeOffer({ id: '1' })],
      isOffersDataLoading: false,
      favoritesCount: 0,
    };
    const state = offersData.reducer(initial, updateOffer(makeOffer({ id: '2' })));

    expect(state.offers.map((o) => o.id)).toEqual(['1', '2']);
  });
});
