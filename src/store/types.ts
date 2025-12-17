import { rootReducer } from '@store/root-reducer';

export type StoreState = ReturnType<typeof rootReducer>;
export type StoreDispatch = import('./index').AppDispatch;
