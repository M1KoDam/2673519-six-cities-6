import { Helmet } from 'react-helmet-async';
import ReviewForm from '@components/review-form/review-form';
import { AppRoute, MapClassName } from '@consts';
import {useParams, useNavigate} from 'react-router-dom';
import NotFoundPage from '@pages/not-found-page/not-found-page';
import ReviewsList from '@components/review-list/review-list';
import Map from '@components/map/map';
import NearbyOffersList from '@components/nearby-offers-list/nearby-offers-list';
import HeaderNav from '@components/header-nav/header-nav';
import { useStoreState, useStoreDispatch } from '@store/hooks';
import { addTokenToImageUrl } from '@utils/image-url';
import { fetchOfferDetails, toggleFavorite } from '@store/api-actions';
import { useEffect, useState, useMemo } from 'react';
import LoadingPage from '@pages/loading-page/loading-page';
import { AuthStatus } from '@types';
import { getOfferInDetails, getNearbyOffers, getOfferInDetailsDataLoadingStatus, getReviews } from '@store/current-offer-data/selectors';
import { getAuthorizationStatus } from '@store/user-data/selectors';

export default function OfferPage(): JSX.Element {
  const params = useParams();
  const dispatch = useStoreDispatch();
  const navigate = useNavigate();
  const authStatus = useStoreState(getAuthorizationStatus);
  const addTokenToImageUrlSafe = addTokenToImageUrl as (url: string) => string;
  const toggleFavoriteSafe = toggleFavorite as (args: { offerId: string; status: 0 | 1 }) => unknown;
  const curOffer = useStoreState(getOfferInDetails);
  const reviews = useStoreState(getReviews);
  const nearbyOffers = useStoreState(getNearbyOffers);
  const isOfferLoading = useStoreState(getOfferInDetailsDataLoadingStatus);
  const [isOfferNotFound, setIsOfferNotFound] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadOfferData = async () => {
      if (!params.id) {
        return;
      }
      setIsOfferNotFound(false);

      try {
        await dispatch(fetchOfferDetails(params.id)).unwrap();
      } catch {
        if (isMounted) {
          setIsOfferNotFound(true);
        }
      }
    };

    loadOfferData();

    return () => {
      isMounted = false;
    };
  }, [params.id, dispatch]);

  const nearbyToShow = useMemo(() => {
    const current = curOffer;
    if (!current) {
      return [];
    }
    return (nearbyOffers ?? []).filter((offer) => offer.id !== current.id).slice(0, 3);
  }, [nearbyOffers, curOffer]);

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

  const handleBookmarkClick = () => {
    if (authStatus !== AuthStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }

    const nextStatus: 0 | 1 = curOffer.isFavorite ? 0 : 1;
    dispatch(toggleFavoriteSafe({ offerId: curOffer.id, status: nextStatus }) as never);
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
            <HeaderNav/>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {
                (curOffer.images || []).map((image: string) => (
                  <div key={image} className="offer__image-wrapper">
                    <img
                      className="offer__image"
                      src={addTokenToImageUrlSafe(image)}
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
                <button
                  className={`offer__bookmark-button ${curOffer.isFavorite ? 'offer__bookmark-button--active' : ''} button`}
                  type="button"
                  onClick={handleBookmarkClick}
                >
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
                      <img className="offer__avatar user__avatar" src={addTokenToImageUrlSafe(curOffer.host.avatarUrl || '')} width="74" height="74" alt="Host avatar" />
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
              selectedOffer={curOffer}
              className={MapClassName.Offer}
            />
          )}
        </section>
        <div className="container">
          <NearbyOffersList
            offers={nearbyToShow}
            onOfferClick={handleNearbyOfferClick}
          />
        </div>
      </main>
    </div>
  );
}
