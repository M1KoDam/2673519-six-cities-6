import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '@store/namespace.enum';
import { Offer, Review } from '@types';

export type CurrentOfferData = {
  offerInfo: Offer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  isOfferInDetailsDataLoading: boolean;
};

const initialState: CurrentOfferData = {
  offerInfo: null,
  nearbyOffers: [],
  reviews: [],
  isOfferInDetailsDataLoading: false,
};

export const currentOfferData = createSlice({
  name: NameSpace.CurrentOffer,
  initialState,
  reducers: {
    loadOfferInDetails: (state, action: PayloadAction<{ offerInfo: Offer; nearestOffers: Offer[]; reviews: Review[] }>) => {
      state.offerInfo = action.payload.offerInfo;
      state.nearbyOffers = action.payload.nearestOffers;
      state.reviews = action.payload.reviews;
    },
    reviewsLoaded: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.push(action.payload);
    },
    setOfferInDetailsDataLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.isOfferInDetailsDataLoading = action.payload;
    },
  },
});

export const { loadOfferInDetails, reviewsLoaded, addReview, setOfferInDetailsDataLoadingStatus } = currentOfferData.actions;
