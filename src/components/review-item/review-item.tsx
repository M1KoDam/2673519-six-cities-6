import { Review } from '@types';

type ReviewItemProps = {
  review: Review;
};

export default function ReviewItem({ review }: ReviewItemProps): JSX.Element {
  const formattedDate = new Date(review.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img className="reviews__avatar user__avatar" src={review.author.avatarUrl} width="54" height="54" alt="User avatar"/>
        </div>
        <span className="reviews__user-name">{review.author.name}</span>
        {review.author.isPro && <span className="offer__user-status">Pro</span>}
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{width: `calc(100% / 5 * ${review.rating})`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">{review.comment}</p>
        <time className="reviews__time" dateTime={new Date(review.date).toISOString()}>{formattedDate}</time>
      </div>
    </li>
  );
}
