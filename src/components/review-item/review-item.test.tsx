import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewItem from './review-item';
import { Review } from '@types';

describe('Component: ReviewItem', () => {
  it('Renders review content', () => {
    const review: Review = {
      id: 'r1',
      date: '2023-06-01T12:00:00.000Z',
      rating: 4,
      comment: 'Wonderful place',
      user: {
        name: 'Alice',
        avatarUrl: 'img/avatar.jpg',
        isPro: true,
        email: 'alice@example.com',
        token: 'token',
      },
    };

    render(
      <ul>
        <ReviewItem review={review} />
      </ul>
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Wonderful place')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText(/June\s+\d{4}/)).toBeInTheDocument();
  });
});
