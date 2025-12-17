import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '@store/namespace.enum';
import { StoreState } from '@store/types';
import { Offer, SortType } from '@types';
import { getCity, getSortType } from '@store/app-data/selectors';

const selectOffersState = (state: StoreState) => state[NameSpace.Offers];

export const getOffers = createSelector(
  [selectOffersState],
  (offersState): Offer[] => offersState.offers
);

export const getOffersDataLoadingStatus = createSelector(
  [selectOffersState],
  (offersState): boolean => offersState.isOffersDataLoading
);

export const getFavoriteOffers = createSelector(
  [getOffers],
  (offers) => offers.filter((offer) => offer.isFavorite)
);

export const getFavoritesCount = createSelector(
  [getFavoriteOffers],
  (favoriteOffers) => favoriteOffers.length
);

export const getOffersByActiveCity = createSelector(
  [getOffers, getCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city.name)
);

const sortOffers = (offers: Offer[], sortType: SortType): Offer[] => {
  const sorted = [...offers];
  switch (sortType) {
    case SortType.PriceLowToHigh:
      return sorted.sort((a, b) => a.price - b.price);
    case SortType.PriceHighToLow:
      return sorted.sort((a, b) => b.price - a.price);
    case SortType.TopRated:
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
};

export const getSortedOffersByActiveCity = createSelector(
  [getOffersByActiveCity, getSortType],
  (offers, sortType) => sortOffers(offers, sortType)
);

export const getFavoriteCities = createSelector(
  [getFavoriteOffers],
  (favorites) => Array.from(new Set(favorites.map((offer) => offer.city.name))).sort()
);

export const makeGetOfferById = () =>
  createSelector(
    [getOffers, (_: StoreState, offerId: string | undefined) => offerId],
    (offers, offerId) => offers.find((offer) => offer.id === offerId) ?? null
  );
