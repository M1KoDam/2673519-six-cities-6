import { useEffect, useState, MutableRefObject, useRef } from 'react';
import { Map, TileLayer, Marker, LayerGroup } from 'leaflet';
import { City } from '@types';

export default function useMap(
  mapRef: MutableRefObject<HTMLElement | null>,
  city: City,
  points: { latitude: number; longitude: number }[] = []
): Map | null {
  const [map, setMap] = useState<Map | null>(null);
  const [markersLayer, setMarkersLayer] = useState<LayerGroup | null>(null);
  const isRenderedRef = useRef<boolean>(false);

  useEffect(() => {
    if (mapRef.current !== null && !isRenderedRef.current) {
      const instance = new Map(mapRef.current, {
        center: [city.location.latitude, city.location.longitude],
        zoom: city.location.zoom,
      });

      const layer = new TileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      );
      instance.addLayer(layer);

      const layerGroup = new LayerGroup().addTo(instance);
      setMarkersLayer(layerGroup);

      setMap(instance);
      isRenderedRef.current = true;
    }
  }, [mapRef, city]);

  useEffect(() => {
    if (map) {
      const center = map.getCenter();
      if (center.lat !== city.location.latitude || center.lng !== city.location.longitude) {
        map.setView([city.location.latitude, city.location.longitude], city.location.zoom);
      }
    }
  }, [map, city]);

  useEffect(() => {
    if (markersLayer) {
      markersLayer.clearLayers();
      points.forEach((point) => {
        const marker = new Marker([point.latitude, point.longitude]);
        markersLayer.addLayer(marker);
      });
    }
  }, [markersLayer, points]);

  return map;
}
