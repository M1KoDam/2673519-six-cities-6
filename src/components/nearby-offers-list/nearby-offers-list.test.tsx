import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NearbyOffersList from './nearby-offers-list';
import { Cities } from '@consts';
import type { Offer } from '@types';

vi.mock('@components/place-card/place-card', () => ({
  default: ({ offer, onCursorEnter, onCursorLeave, onClickOffer }: { offer: Offer; onCursorEnter: () => void; onCursorLeave: () => void; onClickOffer: () => void }) => (
    <button type="button" onMouseEnter={onCursorEnter} onMouseLeave={onCursorLeave} onClick={onClickOffer}>
      {offer.title}
    </button>
  ),
}));

const makeOffer = (id: string, title: string): Offer => ({
  id,
  title,
  type: 'apartment',
  price: 100,
  city: Cities[0].city,
  location: { latitude: 1, longitude: 2, zoom: 10 },
  rating: 4,
});

describe('Component: NearbyOffersList', () => {
  it('Renders fallback when no offers', () => {
    render(<NearbyOffersList offers={[]} />);

    expect(screen.getByText('No places in the neighbourhood available')).toBeInTheDocument();
  });

  it('Calls hover/leave/click callbacks', async () => {
    const user = userEvent.setup();
    const onOfferHover = vi.fn();
    const onOfferLeave = vi.fn();
    const onOfferClick = vi.fn();

    const offer = makeOffer('1', 'First');

    render(
      <NearbyOffersList
        offers={[offer]}
        onOfferHover={onOfferHover}
        onOfferLeave={onOfferLeave}
        onOfferClick={onOfferClick}
      />
    );

    const button = screen.getByText('First');

    await user.hover(button);
    expect(onOfferHover).toHaveBeenCalledWith(offer);

    await user.unhover(button);
    expect(onOfferLeave).toHaveBeenCalled();

    await user.click(button);
    expect(onOfferClick).toHaveBeenCalled();
  });
});
