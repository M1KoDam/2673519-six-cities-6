import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortingOptions from './sorting-options';
import { SortType } from '@types';
import { Cities } from '@consts';
import type { StoreState } from '@store/types';
import { AuthStatus } from '@types';
import { sortTypeChecked } from '@store/app-data/app-data';

const storeHooksMock = vi.hoisted(() => {
  const dispatch = vi.fn();
  let state: StoreState;
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

describe('Component: SortingOptions', () => {
  it('Opens menu and dispatches sortTypeChecked on option click', async () => {
    const user = userEvent.setup();

    storeHooksMock.dispatch.mockClear();

    storeHooksMock.setState({
      APP: { city: Cities[0].city, sortType: SortType.Popular, error: null },
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(<SortingOptions />);

    await user.click(screen.getByText(SortType.Popular, { selector: 'span.places__sorting-type' }));
    await user.click(screen.getByText(SortType.TopRated, { selector: 'li.places__option' }));

    expect(storeHooksMock.dispatch).toHaveBeenCalledWith(sortTypeChecked(SortType.TopRated));
  });

  it('Supports Enter key on option', async () => {
    const user = userEvent.setup();

    storeHooksMock.dispatch.mockClear();
    storeHooksMock.setState({
      APP: { city: Cities[0].city, sortType: SortType.Popular, error: null },
      USER: { authorizationStatus: AuthStatus.NoAuth, user: null },
      OFFERS: { offers: [], isOffersDataLoading: false, favoritesCount: 0 },
      CURRENT_OFFER: { offerInfo: null, nearbyOffers: [], reviews: [], isOfferInDetailsDataLoading: false },
    });

    render(<SortingOptions />);

    await user.click(screen.getByText(SortType.Popular, { selector: 'span.places__sorting-type' }));

    const option = screen.getByText(SortType.TopRated, { selector: 'li.places__option' });
    option.focus();
    await user.keyboard('{Enter}');

    expect(storeHooksMock.dispatch).toHaveBeenCalledWith(sortTypeChecked(SortType.TopRated));
  });
});
