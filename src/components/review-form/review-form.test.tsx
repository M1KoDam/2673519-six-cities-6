import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from './review-form';

type SendReviewPayload = { offerId: string; comment: string; rating: number };
type SendReviewAction = { type: 'sendReview'; payload: SendReviewPayload };

const apiActionsMock = vi.hoisted(() => ({
  sendReview: vi.fn<[SendReviewPayload], SendReviewAction>((payload) => ({ type: 'sendReview', payload })),
}));

vi.mock('@store/api-actions', () => ({
  sendReview: apiActionsMock.sendReview,
}));

const storeHooksMock = vi.hoisted(() => {
  const dispatch = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
  return { dispatch };
});

vi.mock('@store/hooks', () => ({
  useStoreDispatch: () => storeHooksMock.dispatch,
  useStoreState: () => undefined,
}));

describe('Component: ReviewForm', () => {
  it('Enables submit only with rating and valid review length and dispatches sendReview', async () => {
    const user = userEvent.setup({ delay: 0 });

    render(<ReviewForm offerId="123" />);

    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submit = screen.getByRole('button', { name: 'Submit' });

    expect(submit).toBeDisabled();

    await user.click(screen.getByTitle('perfect'));
    const comment = 'a'.repeat(50);
    textarea.focus();
    await user.paste(comment);

    expect(submit).toBeEnabled();

    await user.click(submit);

    const expectedAction = { type: 'sendReview', payload: { offerId: '123', comment, rating: 5 } } as const;

    expect(apiActionsMock.sendReview).toHaveBeenCalledWith({
      offerId: '123',
      comment,
      rating: 5,
    });

    expect(storeHooksMock.dispatch).toHaveBeenCalledWith(expectedAction);

    await waitFor(
      () => expect(textarea).toHaveValue(''),
      { timeout: 1000 }
    );
  });
});
