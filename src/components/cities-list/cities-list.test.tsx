import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitiesList from './cities-list';
import type { StoreState } from '@store/types';
import { cityChanged } from '@store/app-data/app-data';
import type { City } from '@types';

const storeHooksMock = vi.hoisted(() => {
  const dispatch = vi.fn();
  let state = {
    APP: {
      city: {
        name: 'Paris',
        location: { latitude: 48.85661, longitude: 2.351499, zoom: 16 },
      },
      sortType: 'Popular',
      error: null,
    },
    USER: { authorizationStatus: 1, user: null },
    OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
    CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
  } as unknown as StoreState;
  return {
    dispatch,
    setState: (next: StoreState) => {
      state = next;
    },
    getState: () => state,
  };
});

vi.mock('@store/hooks', () => ({
  useStoreDispatch: () => storeHooksMock.dispatch,
  useStoreState: <T,>(selector: (state: StoreState) => T) => selector(storeHooksMock.getState()),
}));

describe('Component: CitiesList', () => {
  it('Renders all cities and dispatches cityChanged on click', async () => {
    const user = userEvent.setup();

    const cologne: City = {
      name: 'Cologne',
      location: { latitude: 50.938361, longitude: 6.959974, zoom: 16 },
    };

    render(<CitiesList />);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();

    await user.click(screen.getByText('Cologne'));

    expect(storeHooksMock.dispatch).toHaveBeenCalledTimes(1);
    expect(storeHooksMock.dispatch).toHaveBeenCalledWith(cityChanged(cologne));
  });
});
