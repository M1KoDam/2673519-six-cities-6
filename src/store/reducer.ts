import { createReducer } from '@reduxjs/toolkit';
import { cityChanged, offersLoaded, offerUpdated, reviewsLoaded, sortTypeChecked, authRequired, setError, setDataLoadingStatus, setEmail } from './actions.js';
import { City, Offer, Review, SortType, AuthStatus } from '../types/index';
import { Cities } from '@consts';

interface State {
  city: City;
  offers: Offer[];
  reviews: Review[];
  sortType: SortType;
  authStatus: AuthStatus;
  error: string | null;
  isDataLoading: boolean;
  email: string;
}

const initState: State = {
  city: Cities.find((c) => c.city.name === 'Paris')?.city ?? Cities[0].city,
  offers: [],
  reviews: [],
  sortType: SortType.Popular,
  authStatus: AuthStatus.NoAuth,
  error: null,
  isDataLoading: false,
  email: ''
};

export const reducer = createReducer(initState, (builder) => {
  builder
    .addCase(cityChanged, (state, { payload }) => {
      state.city = payload;
    })
    .addCase(offersLoaded, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(offerUpdated, (state, action) => {
      const index = state.offers.findIndex((offer) => offer.id === action.payload.id);
      if (index !== -1) {
        state.offers[index] = action.payload;
      } else {
        state.offers.push(action.payload);
      }
    })
    .addCase(reviewsLoaded, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(sortTypeChecked, (state, { payload }) => {
      state.sortType = payload;
    })
    .addCase(authRequired, (state, action) => {
      state.authStatus = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(setDataLoadingStatus, (state, action) => {
      state.isDataLoading = action.payload;
    })
    .addCase(setEmail, (state, { payload }) => {
      state.email = payload;
    });
});
