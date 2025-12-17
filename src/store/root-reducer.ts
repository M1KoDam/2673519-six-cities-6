import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '@store/namespace.enum';
import { appData } from './app-data/app-data';
import { userData } from './user-data/user-data';
import { offersData } from './offers-data/offers-data';
import { currentOfferData } from './current-offer-data/current-offer-data';

export const rootReducer = combineReducers({
  [NameSpace.App]: appData.reducer,
  [NameSpace.User]: userData.reducer,
  [NameSpace.CurrentOffer]: currentOfferData.reducer,
  [NameSpace.Offers]: offersData.reducer,
});
