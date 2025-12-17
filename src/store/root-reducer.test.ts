import { describe, expect, it } from 'vitest';
import { rootReducer } from './root-reducer';
import { NameSpace } from './namespace.enum';
import { cityChanged } from './app-data/app-data';
import { Cities } from '@consts';

describe('RootReducer', () => {
  it('Returns state with all namespaces initialized', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toHaveProperty(NameSpace.App);
    expect(state).toHaveProperty(NameSpace.User);
    expect(state).toHaveProperty(NameSpace.Offers);
    expect(state).toHaveProperty(NameSpace.CurrentOffer);
  });

  it('Routes actions to the correct slice reducer', () => {
    const nextCity = Cities[2].city;
    const state = rootReducer(undefined, cityChanged(nextCity));

    expect(state[NameSpace.App].city).toEqual(nextCity);
  });
});
