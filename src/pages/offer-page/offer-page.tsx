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
import { fetchOffer, fetchReviews, fetchNearbyOffers } from '@store/api-actions';
import { useEffect, useState, useMemo } from 'react';
import LoadingPage from '@pages/loading-page/loading-page';
import { AuthStatus, Offer } from '@types';

export default function OfferPage(): JSX.Element {
  const params = useParams();
  const dispatch = useStoreDispatch();
  const offers = useStoreState((state) => state.offers);
  const reviews = useStoreState((state) => state.reviews);
  const authStatus = useStoreState((state) => state.authStatus);
  const [hoveredOffer, setHoveredOffer] = useState<Offer | null>(null);
  const [isOfferLoading, setIsOfferLoading] = useState<boolean>(true);
  const [isOfferNotFound, setIsOfferNotFound] = useState<boolean>(false);

  const curOffer = offers.find((item) => item.id === params.id);

  useEffect(() => {
    let isMounted = true;

    const loadOfferData = async () => {
      if (!params.id) {
        return;
      }

      setIsOfferLoading(true);
      setIsOfferNotFound(false);

      try {
        await dispatch(fetchOffer(params.id)).unwrap();

        if (!isMounted) {
          return;
        }

        await Promise.all([
          dispatch(fetchNearbyOffers(params.id)),
          dispatch(fetchReviews(params.id)),
        ]);
      } catch {
        if (isMounted) {
          setIsOfferNotFound(true);
        }
      } finally {
        if (isMounted) {
          setIsOfferLoading(false);
        }
      }
    };

    loadOfferData();

    return () => {
      isMounted = false;
    };
  }, [params.id, dispatch]);

  const nearbyToShow = useMemo(() => {
    if (!curOffer) {
      return [];
    }

    const getDistance = (a: Offer, b: Offer): number => {
      const locA = a.location || a.city?.location;
      const locB = b.location || b.city?.location;
      if (!locA || !locB) {
        return Number.POSITIVE_INFINITY;
      }
      const dx = locA.latitude - locB.latitude;
      const dy = locA.longitude - locB.longitude;
      return dx * dx + dy * dy;
    };

    return offers
      .filter((offer) => offer.id !== curOffer.id)
      .sort((a, b) => getDistance(curOffer, a) - getDistance(curOffer, b))
      .slice(0, 3);
  }, [offers, curOffer]);

  if (isOfferLoading && !curOffer) {
    return <LoadingPage/>;
  }

  if (isOfferNotFound || !curOffer) {
    return <NotFoundPage/>;
  }

  const handleNearbyOfferClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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
                  const offerReviews = reviews ?? [];
                  return (
                    <>
                      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{offerReviews.length}</span></h2>
                      <ReviewsList reviews={offerReviews}/>
                      {authStatus === AuthStatus.Auth && <ReviewForm offerId={curOffer.id}/>}
                    </>
                  );
                })()}
              </section>
            </div>
          </div>
          {curOffer.city && (
            <Map
              city={curOffer.city}
              offers={[curOffer, ...nearbyToShow]}
              selectedOffer={hoveredOffer || curOffer}
              className={MapClassName.Offer}
            />
          )}
        </section>
        <div className="container">
          <NearbyOffersList
            offers={nearbyToShow}
            onOfferHover={setHoveredOffer}
            onOfferLeave={() => setHoveredOffer(null)}
            onOfferClick={handleNearbyOfferClick}
          />
        </div>
      </main>
    </div>
  );
}
