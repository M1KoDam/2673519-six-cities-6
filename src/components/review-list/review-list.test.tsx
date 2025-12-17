import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ReviewsList from './review-list';
import { Review } from '@types';

const makeReview = (id: string, date: string, comment: string): Review => ({
  id,
  date,
  rating: 4,
  comment,
  user: {
    name: 'User',
    avatarUrl: 'img/avatar.jpg',
    isPro: false,
    email: 'user@example.com',
    token: 'token',
  },
});

describe('Component: ReviewsList', () => {
  it('Renders placeholder when there are no reviews', () => {
    render(<ReviewsList reviews={undefined} />);

    expect(screen.getByText('No reviews available')).toBeInTheDocument();
  });

  it('Renders and sorts reviews by date desc', () => {
    const reviews: Review[] = [
      makeReview('r1', '2023-05-01T12:00:00.000Z', 'Older'),
      makeReview('r2', '2023-06-01T12:00:00.000Z', 'Newer'),
    ];

    render(<ReviewsList reviews={reviews} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText('Newer')).toBeInTheDocument();
    expect(within(items[1]).getByText('Older')).toBeInTheDocument();
  });
});
