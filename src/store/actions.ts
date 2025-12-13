import { createAction } from '@reduxjs/toolkit';
import { City, Offer, Review } from '../types/index';
import { SortType, AuthStatus } from '@types';

export const cityChanged = createAction<City>('city/changeCity');
export const offersLoaded = createAction<Offer[]>('offers/loadOffers');
export const offerUpdated = createAction<Offer>('offers/updateOffer');
export const reviewsLoaded = createAction<Review[]>('reviews/loadReviews');
export const sortTypeChecked = createAction<SortType>('sort/checkSortType');
export const authRequired = createAction<AuthStatus>('authRequired');
export const setError = createAction<string | null>('setError');
export const setDataLoadingStatus = createAction<boolean>('setDataLoadingStatus');
export const setEmail = createAction<string>('setEmail');
