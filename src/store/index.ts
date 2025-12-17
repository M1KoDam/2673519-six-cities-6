import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';
export * from './types';
export * from './hooks';
import { createAPI, setDispatch } from '@services/api';

export const api = createAPI();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

setDispatch(store.dispatch);
