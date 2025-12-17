import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '@store/namespace.enum';
import { Cities } from '@consts';
import { City, SortType } from '@types';

type AppData = {
    city: City;
    sortType: SortType;
    error: string | null;
};

const initialState: AppData = {
  city: Cities[0].city,
  sortType: SortType.Popular,
  error: null,
};

export const appData = createSlice({
  name: NameSpace.App,
  initialState,
  reducers: {
    cityChanged: (state, action: PayloadAction<City>) => {
      state.city = action.payload;
    },
    sortTypeChecked: (state, action: PayloadAction<SortType>) => {
      state.sortType = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { cityChanged, sortTypeChecked, setError } = appData.actions;
