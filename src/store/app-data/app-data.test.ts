import { describe, expect, it } from 'vitest';
import { appData, cityChanged, setError, sortTypeChecked } from './app-data';
import { Cities } from '@consts';
import { SortType } from '@types';

describe('AppData reducer', () => {
  it('Returns initial state with unknown action', () => {
    const state = appData.reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      city: Cities[0].city,
      sortType: SortType.Popular,
      error: null,
    });
  });

  it('Handles cityChanged', () => {
    const nextCity = Cities[1].city;
    const state = appData.reducer(undefined, cityChanged(nextCity));

    expect(state.city).toEqual(nextCity);
  });

  it('Handles sortTypeChecked', () => {
    const state = appData.reducer(undefined, sortTypeChecked(SortType.TopRated));

    expect(state.sortType).toBe(SortType.TopRated);
  });

  it('Handles setError', () => {
    const state = appData.reducer(undefined, setError('Boom'));

    expect(state.error).toBe('Boom');
  });
});
