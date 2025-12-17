import { rootReducer } from '@store/root-reducer';

export type StoreState = ReturnType<typeof rootReducer>;
export type StoreDispatch = typeof import('./index').store.dispatch;
