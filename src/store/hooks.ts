import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import type { StoreState, StoreDispatch } from './types';

export const useStoreState: TypedUseSelectorHook<StoreState> = useSelector;
export const useStoreDispatch = () => useDispatch<StoreDispatch>();
