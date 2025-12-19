import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OffersList from './offers-list';
import { Cities } from '@consts';
import type { Offer } from '@types';

vi.mock('@components/place-card/place-card.js', () => ({
  default: ({ offer, onCursorEnter, onCursorLeave }: { offer: Offer; onCursorEnter: () => void; onCursorLeave: () => void }) => (
    <div>
      <button type="button" onMouseEnter={onCursorEnter} onMouseLeave={onCursorLeave}>
        {offer.title}
      </button>
    </div>
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

describe('Component: OffersList', () => {
  it('Calls onActiveOfferChange on hover and leave', async () => {
    const user = userEvent.setup();
    const onActiveOfferChange = vi.fn();

    render(
      <OffersList
        offers={[makeOffer('1', 'First'), makeOffer('2', 'Second')]}
        onActiveOfferChange={onActiveOfferChange}
      />
    );

    const first = screen.getByText('First');

    await user.hover(first);
    expect(onActiveOfferChange).toHaveBeenLastCalledWith('1');

    await user.unhover(first);
    expect(onActiveOfferChange).toHaveBeenLastCalledWith(null);
  });
});
