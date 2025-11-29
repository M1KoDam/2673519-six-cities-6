import { createAction } from '@reduxjs/toolkit';
import { City, Offer, Review } from '../types/index';
import { SortType } from '@types';

export const cityChanged = createAction<City>('city/changeCity');
export const offersLoaded = createAction<Offer[]>('offers/loadOffers');
export const reviewsLoaded = createAction<Review[]>('reviews/loadReviews');
export const sortTypeChecked = createAction<SortType>('sort/checkSortType');
