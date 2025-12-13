import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer';
export * from './types';
export * from './hooks';
export * from './actions';
import { createAPI, setDispatch } from '../services/api';

export const api = createAPI();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

setDispatch(store.dispatch);
