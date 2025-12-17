import { Offer } from '@types';
import PlaceCard from '@components/place-card/place-card.js';
import React, { useCallback, useState, useEffect } from 'react';
import { CardType } from '@consts';

type OffersListProps = {
    offers: Offer[];
    onActiveOfferChange: (offerId: string | null) => void;
};

function OffersList({offers, onActiveOfferChange}: OffersListProps): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  useEffect(() => {
    onActiveOfferChange(activeOfferId);
  }, [activeOfferId, onActiveOfferChange]);

  const handleCursorEnter = useCallback((offerId: string) => {
    setActiveOfferId(offerId);
  }, []);

  const handleCursorLeave = useCallback(() => {
    setActiveOfferId(null);
  }, []);

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <PlaceCard
          key={offer.id}
          offer={offer}
          onCursorEnter={() => handleCursorEnter(offer.id)}
          onCursorLeave={handleCursorLeave}
          cardType={CardType.Regular}
        />))}
    </div>
  );
}

const MemoizedOffersList = React.memo(OffersList);
MemoizedOffersList.displayName = 'OffersList';

export default MemoizedOffersList;
