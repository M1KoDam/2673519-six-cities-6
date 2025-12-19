import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import type { StoreDispatch, StoreState } from './types';

import { SortType, AuthStatus } from '@types';

const mockState: StoreState = {
  APP: {
    city: { name: 'Paris', location: { latitude: 48.85661, longitude: 2.351499, zoom: 16 } },
    sortType: SortType.Popular,
    error: null,
  },
  USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
  OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
  CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
};

const mockDispatch: StoreDispatch = ((action: unknown) => action) as unknown as StoreDispatch;

const reactReduxMocks = vi.hoisted(() => ({
  useSelectorMock: vi.fn(),
  useDispatchMock: vi.fn(),
}));

vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>('react-redux');
  return {
    ...actual,
    useSelector: reactReduxMocks.useSelectorMock,
    useDispatch: reactReduxMocks.useDispatchMock,
  };
});

import { useStoreDispatch, useStoreState } from './hooks';

describe('Store hooks', () => {
  beforeEach(() => {
    reactReduxMocks.useSelectorMock.mockReset();
    reactReduxMocks.useDispatchMock.mockReset();

    reactReduxMocks.useSelectorMock.mockImplementation((selector: (state: StoreState) => unknown) => selector(mockState));
    reactReduxMocks.useDispatchMock.mockImplementation(() => mockDispatch);
  });

  it('UseStoreState proxies to useSelector', () => {
    const { result } = renderHook(() => useStoreState(() => 42));

    expect(reactReduxMocks.useSelectorMock).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(42);
  });

  it('UseStoreDispatch proxies to useDispatch', () => {
    const { result } = renderHook(() => useStoreDispatch());

    expect(reactReduxMocks.useDispatchMock).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(mockDispatch);
  });
});
