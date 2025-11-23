import { createAction } from '@reduxjs/toolkit';
import { City, Offer, Review } from '../types/index';

export const cityChanged = createAction<City>('city/changeCity');
export const offersLoaded = createAction<Offer[]>('offers/loadOffers');
export const reviewsLoaded = createAction<Review[]>('reviews/loadReviews');
