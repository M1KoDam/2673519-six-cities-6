import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '@store/namespace.enum';
import { StoreState } from '@store/types';
import { Offer, Review } from '@types';

const selectCurrentOfferState = (state: StoreState) => state[NameSpace.CurrentOffer];

export const getOfferInDetails = createSelector(

  [selectCurrentOfferState],
  (state): Offer | null => state.offerInfo
);

export const getNearbyOffers = createSelector(
  [selectCurrentOfferState],
  (state): Offer[] => state.nearbyOffers
);

export const getReviews = createSelector(
  [selectCurrentOfferState],
  (state): Review[] => state.reviews
);

export const getOfferInDetailsDataLoadingStatus = createSelector(
  [selectCurrentOfferState],
  (state): boolean => state.isOfferInDetailsDataLoading
);
