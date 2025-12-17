import { Offer } from '@types';
import { Link } from 'react-router-dom';
import { AppRoute, CardImageWrapperClass, CardType } from '@consts';
import { addTokenToImageUrl } from '@utils/image-url';

type PlaceCardProps = {
  offer: Offer;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
  cardType: CardType;
  onClickOffer?: () => void;
}

export default function PlaceCard({offer, onCursorEnter, onCursorLeave, cardType, onClickOffer}: PlaceCardProps): JSX.Element {
  return (
    <article className={`${cardType} place-card`}
      onMouseEnter={onCursorEnter}
      onMouseLeave={onCursorLeave}
    >
      {offer.isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>}
      <div className={`${CardImageWrapperClass[cardType]} place-card__image-wrapper`}>
        <Link to={`${AppRoute.Offer}/${offer.id}`} onClick={onClickOffer}>
          <img
            className="place-card__image"
            src={addTokenToImageUrl(offer.previewImage || offer.preview || (offer.images && offer.images[0]) || '')}
            width={cardType === CardType.Favorites ? 150 : 260}
            height={cardType === CardType.Favorites ? 110 : 200}
            alt="Place image"
          />
        </Link>
      </div>
      <div className={`${cardType === CardType.Favorites ? 'favorites__card-info' : ''} place-card__info`}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={`place-card__bookmark-button ${offer.isFavorite && 'place-card__bookmark-button--active'} button`} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">{offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `calc(100% / 5 * ${offer.rating})`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`${AppRoute.Offer}/${offer.id}`} onClick={onClickOffer}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.type[0].toUpperCase() + offer.type.substring(1)}</p>
      </div>
    </article>
  );
}
