import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import Map from './map';
import { Cities } from '@consts';
import type { Offer } from '@types';
import type { City } from '@types';

type UseMapMock = {
  map: {
    removeLayer: ReturnType<typeof vi.fn>;
    panTo: ReturnType<typeof vi.fn>;
  };
};

const useMapMock = vi.hoisted(() => ({
  map: {
    removeLayer: vi.fn(),
    panTo: vi.fn(),
  },
} satisfies UseMapMock));

vi.mock('@hooks/use-map', () => ({
  default: () => useMapMock.map,
}));

type LayerGroupInstance = { addTo: ReturnType<typeof vi.fn> };
type LeafletMock = {
  Icon: new (...args: unknown[]) => unknown;
  Marker: new (...args: unknown[]) => { setIcon: ReturnType<typeof vi.fn>; addTo: ReturnType<typeof vi.fn> };
  layerGroup: () => LayerGroupInstance;
  __mock: { markerInstances: unknown[]; layerGroupInstance: LayerGroupInstance };
};

const leafletMock = vi.hoisted(() => {
  const markerInstances: unknown[] = [];
  const layerGroupInstance: LayerGroupInstance = {
    addTo: vi.fn<[], LayerGroupInstance>(() => layerGroupInstance),
  };

  class Icon {
    constructor(...args: unknown[]) {
      void args;
    }
  }

  class Marker {
    public setIcon = vi.fn(() => this);
    public addTo = vi.fn(() => this);

    constructor(...args: unknown[]) {
      void args;
      markerInstances.push(this);
    }
  }

  const layerGroup = (): LayerGroupInstance => layerGroupInstance;

  return { Icon, Marker, layerGroup, __mock: { markerInstances, layerGroupInstance } } satisfies LeafletMock;
});

vi.mock('leaflet', () => leafletMock);

const makeOffer = (id: string): Offer => ({
  id,
  title: `Offer ${id}`,
  type: 'apartment',
  price: 100,
  city: Cities[0].city,
  location: { latitude: 1, longitude: 2, zoom: 10 },
  rating: 4,
});

describe('Component: Map', () => {
  it('Creates markers for offers and pans on selected offer', () => {
    const offer1 = makeOffer('1');
    const offer2 = makeOffer('2');

    const { rerender } = render(
      <Map
        city={Cities[0].city as City}
        offers={[offer1, offer2]}
        selectedOffer={undefined}
        className="map"
      />
    );

    const created = leafletMock.__mock;

    expect(created.markerInstances).toHaveLength(2);

    rerender(
      <Map
        city={Cities[0].city as City}
        offers={[offer1, offer2]}
        selectedOffer={offer2}
        className="map"
      />
    );

    expect(useMapMock.map.panTo).toHaveBeenCalled();
  });
});
