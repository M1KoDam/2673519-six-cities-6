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
        if (offer && offer.city.location) {
          const marker = new Marker({
            lat: offer.city.location.latitude,
            lng: offer.city.location.longitude
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
    if (map && selectedOffer?.city.location) {
      map.setView(
        [selectedOffer.city.location.latitude, selectedOffer.city.location.longitude],
        map.getZoom(),
        { animate: true }
      );
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
