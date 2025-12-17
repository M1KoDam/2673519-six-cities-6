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
    updateOfferInDetails: (state, action: PayloadAction<Offer>) => {
      const updatedOffer = action.payload;

      if (state.offerInfo?.id === updatedOffer.id) {
        state.offerInfo = updatedOffer;
      }

      state.nearbyOffers = state.nearbyOffers.map((offer) =>
        offer.id === updatedOffer.id ? updatedOffer : offer
      );
    },
  },
});

export const { loadOfferInDetails, reviewsLoaded, addReview, setOfferInDetailsDataLoadingStatus, updateOfferInDetails } = currentOfferData.actions;
