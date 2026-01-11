import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingPage from './loading-page';

describe('Page: LoadingPage', () => {
  it('Renders loading text', () => {
    render(<LoadingPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
