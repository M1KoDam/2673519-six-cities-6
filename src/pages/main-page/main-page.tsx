import { Helmet } from 'react-helmet-async';
import OffersList from '@components/offers-list/offers-list.tsx';
import Map from '@components/map/map';
import { useState, useMemo } from 'react';
import { MapClassName } from '@consts';
import CitiesList from '@components/cities-list/cities-list';
import { useStoreState } from '@store/hooks';
import { SortType } from '@types';
import SortingOptions from '@components/offers-sorting/sorting-options';

export default function MainPage(): JSX.Element {
  const stateCity = useStoreState((state) => state.city);
  const offers = useStoreState((state) => state.offers);
  const sortType = useStoreState((state) => state.sortType);

  const currentCityOffers = useMemo(() => {
    const filtered = offers.filter((offer) => offer.city.name === stateCity.name);

    return [...filtered].sort((a, b) => {
      switch (sortType) {
        case SortType.PriceLowToHigh:
          return a.price - b.price;
        case SortType.PriceHighToLow:
          return b.price - a.price;
        case SortType.TopRated:
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [offers, stateCity.name, sortType]);

  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === activeOfferId),
    [offers, activeOfferId]
  );

  return (
    <div className="page page--gray page--main">
      <Helmet>
        <title>6 cities</title>
      </Helmet>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41"/>
              </a>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oleg.Gerasimov@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CitiesList/>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{`${currentCityOffers.length} places to stay in ${stateCity.name}`}</b>
              <SortingOptions/>
              <OffersList offers={currentCityOffers} onActiveOfferChange={setActiveOfferId}/>
            </section>
            <div className="cities__right-section">
              <Map
                city={offers[0].city}
                offers={currentCityOffers}
                selectedOffer={selectedOffer}
                className={MapClassName.Main}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
