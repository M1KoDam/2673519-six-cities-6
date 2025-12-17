import { Helmet } from 'react-helmet-async';
import OffersList from '@components/offers-list/offers-list.tsx';
import Map from '@components/map/map';
import { useMemo, useState } from 'react';
import { MapClassName } from '@consts';
import CitiesList from '@components/cities-list/cities-list';
import { useStoreState } from '@store/hooks';
import SortingOptions from '@components/offers-sorting/sorting-options';
import HeaderNav from '@components/header-nav/header-nav';
import MainEmpty from '@components/main-empty/main-empty';
import { getCity } from '@store/app-data/selectors';
import { getOffers, getSortedOffersByActiveCity } from '@store/offers-data/selectors';

export default function MainPage(): JSX.Element {
  const stateCity = useStoreState(getCity);
  const offers = useStoreState(getOffers);
  const currentCityOffers = useStoreState(getSortedOffersByActiveCity);

  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === activeOfferId),
    [offers, activeOfferId]
  );

  const isEmpty = currentCityOffers.length === 0;

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
            <HeaderNav />
          </div>
        </div>
      </header>

      <main className={`page__main page__main--index${isEmpty ? ' page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CitiesList/>
          </section>
        </div>
        {isEmpty ? (
          <MainEmpty cityName={stateCity.name} />
        ) : (
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
                  city={stateCity}
                  offers={currentCityOffers}
                  selectedOffer={selectedOffer}
                  className={MapClassName.Main}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
