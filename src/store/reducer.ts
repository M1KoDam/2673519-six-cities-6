import { createReducer } from '@reduxjs/toolkit';
import { cityChanged, offersLoaded, reviewsLoaded, sortTypeChecked } from './actions.js';
import { City, Offer, Review, SortType } from '../types/index';
import { offers } from '@mocks/offers';
import { reviews } from '@mocks/reviews';
import { Cities } from '@consts';

interface State {
  city: City;
  offers: Offer[];
  reviews: Review[];
  sortType: SortType;
}

const initState: State = {
  city: Cities.find((c) => c.city.name === 'Paris')?.city ?? Cities[0].city,
  offers: [],
  reviews: [],
  sortType: SortType.Popular
};

export const reducer = createReducer(initState, (builder) => {
  builder
    .addCase(cityChanged, (state, { payload }) => {
      state.city = payload;
    })
    .addCase(offersLoaded, (state) => {
      state.offers = offers;
    })
    .addCase(reviewsLoaded, (state) => {
      state.reviews = reviews;
    })
    .addCase(sortTypeChecked, (state, { payload }) => {
      state.sortType = payload;
    });
});
