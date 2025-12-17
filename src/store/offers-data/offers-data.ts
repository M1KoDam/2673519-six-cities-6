import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '@store/namespace.enum';
import { Offer } from '@types';

type OffersState = {
  offers: Offer[];
  isOffersDataLoading: boolean;
  favoritesCount: number;
};

const initialState: OffersState = {
  offers: [],
  isOffersDataLoading: false,
  favoritesCount: 0,
};

export const offersData = createSlice({
  name: NameSpace.Offers,
  initialState,
  reducers: {
    loadOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },
    setOffersDataLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffersDataLoading = action.payload;
    },
    updateFavoritesCount: (state, action: PayloadAction<{ id: string; isFavorite: boolean }>) => {
      const { id, isFavorite } = action.payload;

      const idx = state.offers.findIndex((o) => o.id === id);
      if (idx !== -1) {
        state.offers[idx].isFavorite = isFavorite;
      }

      state.favoritesCount = state.offers.filter((offer) => offer.isFavorite).length;
    },
    updateOffer: (state, action: PayloadAction<Offer>) => {
      const idx = state.offers.findIndex((o) => o.id === action.payload.id);
      if (idx !== -1) {
        state.offers[idx] = action.payload;
      } else {
        state.offers.push(action.payload);
      }
    },
  },
});

export const { loadOffers, setOffersDataLoadingStatus, updateFavoritesCount, updateOffer } = offersData.actions;
