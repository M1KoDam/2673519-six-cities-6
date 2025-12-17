import { NameSpace } from '@store/namespace.enum';
import { StoreState } from '@store/types';
import { City, SortType } from '@types';

export const getCity = (state: StoreState): City => state[NameSpace.App].city;
export const getSortType = (state: StoreState): SortType => state[NameSpace.App].sortType;
export const getError = (state: StoreState): string | null => state[NameSpace.App].error;
