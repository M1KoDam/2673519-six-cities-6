import React from 'react';
import RatingInput from './rating-input';
import { useStoreDispatch } from '@store/hooks';
import { sendReview } from '@store/api-actions';

type ReviewFormProps = {
  offerId: string;
};

export default function ReviewForm({ offerId }: ReviewFormProps): JSX.Element {
  const dispatch = useStoreDispatch();
  const [formData, setFormData] = React.useState({
    review: '',
    rating: 0
  });
  const [isSending, setIsSending] = React.useState(false);

  const handleFieldChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = evt.target;
    if (name === 'rating') {
      setFormData((prev) => ({ ...prev, rating: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, review: value }));
    }
  };

  const isSubmitDisabled = isSending || formData.rating === 0 || formData.review.length < 50 || formData.review.length > 300;

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>): void => {
    evt.preventDefault();
    if (isSubmitDisabled) {
      return;
    }

    setIsSending(true);

    void (async () => {
      try {
        await dispatch(sendReview({
          offerId,
          comment: formData.review,
          rating: formData.rating
        })).unwrap();

        setFormData({ review: '', rating: 0 });
      } finally {
        setIsSending(false);
      }
    })();
  };

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        <RatingInput value={5} title="perfect" onChange={handleFieldChange} checked={formData.rating === 5} />
        <RatingInput value={4} title="good" onChange={handleFieldChange} checked={formData.rating === 4} />
        <RatingInput value={3} title="not bad" onChange={handleFieldChange} checked={formData.rating === 3} />
        <RatingInput value={2} title="badly" onChange={handleFieldChange} checked={formData.rating === 2} />
        <RatingInput value={1} title="terribly" onChange={handleFieldChange} checked={formData.rating === 1} />
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        onChange={handleFieldChange}
        value={formData.review}
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        minLength={50}
        maxLength={300}
        disabled={isSending}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button className="reviews__submit form__submit button" type="submit" disabled={isSubmitDisabled}>{isSending ? 'Sending...' : 'Submit'}</button>
      </div>
    </form>
  );
}
