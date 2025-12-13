import { useRef, useEffect } from 'react';
import { Icon, Marker, layerGroup } from 'leaflet';
import useMap from '@hooks/use-map';
import { City } from '@types';
import { Offer } from '@types';
import { URL_MARKER_DEFAULT, URL_MARKER_CURRENT } from '@consts';
import 'leaflet/dist/leaflet.css';

type MapProps = {
    city: City;
    offers: Offer[];
    selectedOffer: Offer | undefined;
    className: string;
  };

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

export default function Map(props: MapProps): JSX.Element {
  const {city, offers, selectedOffer, className} = props;

  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);
      offers.forEach((offer) => {
        const location = offer?.location || offer?.city?.location;
        if (offer && location) {
          const marker = new Marker({
            lat: location.latitude,
            lng: location.longitude
          });

          marker
            .setIcon(
              selectedOffer !== undefined && offer.id === selectedOffer.id
                ? currentCustomIcon
                : defaultCustomIcon
            )
            .addTo(markerLayer);
        }
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, offers, selectedOffer]);

  useEffect(() => {
    if (map && selectedOffer) {
      const location = selectedOffer.location || selectedOffer.city?.location;
      if (location) {
        map.panTo(
          [location.latitude, location.longitude],
          {
            animate: true,
            duration: 0.5
          }
        );
      }
    }
  }, [map, selectedOffer]);

  return (
    <section
      className={className}
      style={{ height: '500px' }}
      ref={mapRef}
    />
  );
}
