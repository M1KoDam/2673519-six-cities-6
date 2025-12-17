import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RatingInput from './rating-input';

describe('Component: RatingInput', () => {
  it('renders radio input and label', () => {
    const onChange = vi.fn();
    render(<RatingInput value={5} title="perfect" checked={true} onChange={onChange} />);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('id', '5-stars');
    expect(radio).toHaveAttribute('name', 'rating');
    expect(radio).toBeChecked();

    const label = document.querySelector('label[for="5-stars"]');
    expect(label).not.toBeNull();
  });
});
