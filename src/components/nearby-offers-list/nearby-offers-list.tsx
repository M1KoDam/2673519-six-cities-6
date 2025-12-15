import { Offer } from '@types';
import PlaceCard from '@components/place-card/place-card';
import { CardType } from '@consts';

type NearbyOffersListProps = {
  offers: Offer[] | undefined;
  onOfferHover?: (offer: Offer) => void;
  onOfferLeave?: () => void;
  onOfferClick?: () => void;
};

export default function NearbyOffersList({ offers, onOfferHover, onOfferLeave, onOfferClick }: NearbyOffersListProps): JSX.Element {
  return (
    <section className="near-places places">
      <h2 className="near-places__title">Other places in the neighbourhood</h2>
      <div className="near-places__list places__list">
        {offers && offers.length > 0 ? (
          offers.map((offer) => (
            <PlaceCard
              key={offer.id}
              offer={offer}
              onCursorEnter={() => onOfferHover?.(offer)}
              onCursorLeave={() => onOfferLeave?.()}
              onClickOffer={onOfferClick}
              cardType={CardType.Nearest}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', fontSize: '32px' }}>No places in the neighbourhood available</p>
        )}
      </div>
    </section>
  );
}
