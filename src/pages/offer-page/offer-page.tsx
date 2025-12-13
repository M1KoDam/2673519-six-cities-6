import { Helmet } from 'react-helmet-async';
import ReviewForm from '@components/review-form/review-form';
import { AppRoute } from '@consts';
import {useParams} from 'react-router-dom';
import NotFoundPage from '@pages/not-found-page/not-found-page';
import ReviewsList from '@components/review-list/review-list';
import Map from '@components/map/map';
import NearbyOffersList from '@components/nearby-offers-list/nearby-offers-list';
import { MapClassName } from '@consts';
import HeaderNav from '@components/header-nav/header-nav';
import { useStoreState, useStoreDispatch } from '@store/hooks';
import { addTokenToImageUrl } from '../../utils/image-url';
import { fetchOffer, fetchReviews } from '@store/api-actions';
import { useEffect, useState } from 'react';
import LoadingPage from '@pages/loading-page/loading-page';
import { Offer } from '@types';

export default function OfferPage(): JSX.Element {
  const params = useParams();
  const dispatch = useStoreDispatch();
  const offers = useStoreState((state) => state.offers);
  const reviews = useStoreState((state) => state.reviews);
  const isDataLoading = useStoreState((state) => state.isDataLoading);
  const [hoveredOffer, setHoveredOffer] = useState<Offer | null>(null);

  const curOffer = offers.find((item) => item.id === params.id);

  useEffect(() => {
    if (params.id) {
      if (!curOffer || !curOffer.description || !curOffer.images || curOffer.images.length === 0) {
        dispatch(fetchOffer(params.id));
      }
      dispatch(fetchReviews(params.id));
    }
  }, [params.id, dispatch, curOffer]);

  if (isDataLoading && !curOffer) {
    return <LoadingPage/>;
  }

  if (!curOffer) {
    return <NotFoundPage/>;
  }

  const nearbyOffers = offers.filter(
    (offer) => offer.city.name === curOffer.city.name && offer.id !== curOffer.id
  ).slice(0, 3);

  return (
    <div className="page">
      <Helmet>
        <title>6 cities: offer {curOffer.id}</title>
      </Helmet>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link" href={AppRoute.Root}>
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41"/>
              </a>
            </div>
            <HeaderNav offers={offers}/>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {
                (curOffer.images || []).map((image) => (
                  <div key={image} className="offer__image-wrapper">
                    <img
                      className="offer__image"
                      src={addTokenToImageUrl(image)}
                      alt="Photo studio"
                    />
                  </div>
                ))
              }
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {
                curOffer.isPremium && (
                  <div className="offer__mark">
                    <span>Premium</span>
                  </div>
                )
              }
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {curOffer.title}
                </h1>
                <button className={`offer__bookmark-button ${curOffer.isFavorite && 'offer__bookmark-button--active'} button`} type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">{curOffer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: `calc(100% / 5 * ${curOffer.rating})`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{curOffer.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">{curOffer.type || ''}</li>
                <li className="offer__feature offer__feature--bedrooms">{curOffer.bedrooms || 0} Bedrooms</li>
                <li className="offer__feature offer__feature--adults">Max {curOffer.maxAdults || 0} adults</li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{curOffer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {(curOffer.goods || []).map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                {curOffer.host && (
                  <div className="offer__host-user user">
                    <div className={`offer__avatar-wrapper ${curOffer.host.isPro && 'offer__avatar-wrapper--pro'} user__avatar-wrapper`}>
                      <img className="offer__avatar user__avatar" src={addTokenToImageUrl(curOffer.host.avatarUrl || '')} width="74" height="74" alt="Host avatar" />
                    </div>
                    <span className="offer__user-name">{curOffer.host.name || ''}</span>
                    {curOffer.host.isPro && <span className="offer__user-status">Pro</span>}
                  </div>
                )}
                <div className="offer__description">
                  <p className="offer__text">{curOffer.description || ''}</p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                {(() => {
                  const offerReviews = reviews?.filter((review) =>
                    !review.offerId || review.offerId === curOffer.id
                  ) || [];
                  return (
                    <>
                      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{offerReviews.length}</span></h2>
                      <ReviewsList reviews={offerReviews}/>
                      <ReviewForm/>
                    </>
                  );
                })()}
              </section>
            </div>
          </div>
          {curOffer.city && (
            <Map
              city={curOffer.city}
              offers={[curOffer, ...nearbyOffers]}
              selectedOffer={hoveredOffer || curOffer}
              className={MapClassName.Offer}
            />
          )}
        </section>
        <div className="container">
          <NearbyOffersList
            offers={nearbyOffers}
            onOfferHover={setHoveredOffer}
            onOfferLeave={() => setHoveredOffer(null)}
          />
        </div>
      </main>
    </div>
  );
}
