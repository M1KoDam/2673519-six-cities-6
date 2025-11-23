import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer';
export * from './types';
export * from './hooks';
export * from './actions';

export const store = configureStore({ reducer });
