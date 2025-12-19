import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainEmpty from './main-empty';

describe('Component: MainEmpty', () => {
  it('Renders city name in empty state', () => {
    render(<MainEmpty cityName="Paris" />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(screen.getByText(/We could not find.*property available.*Paris/)).toBeInTheDocument();
  });
});
