import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useMap from './use-map';
import type { City } from '@types';
import type { MutableRefObject } from 'react';

type LeafletLatLng = { lat: number; lng: number };
type LeafletMapMock = {
  options: { center: [number, number]; zoom: number };
  addLayer: ReturnType<typeof vi.fn>;
  setView: ReturnType<typeof vi.fn>;
  getCenter: ReturnType<typeof vi.fn>;
  removeLayer: ReturnType<typeof vi.fn>;
  panTo: ReturnType<typeof vi.fn>;
};

type LeafletLayerGroupMock = {
  addTo: ReturnType<typeof vi.fn>;
  clearLayers: ReturnType<typeof vi.fn>;
  addLayer: ReturnType<typeof vi.fn>;
};

type LeafletCreated = {
  maps: LeafletMapMock[];
  markers: unknown[];
  layerGroups: LeafletLayerGroupMock[];
  tileLayers: unknown[];
};

const leafletMock = vi.hoisted(() => {
  const created = {
    maps: [] as LeafletMapMock[],
    markers: [] as unknown[],
    layerGroups: [] as LeafletLayerGroupMock[],
    tileLayers: [] as unknown[],
  } satisfies LeafletCreated;

  class Map {
    public element: HTMLElement;
    public options: { center: [number, number]; zoom: number };
    public addLayer = vi.fn();
    public setView = vi.fn();
    public getCenter = vi.fn<[], LeafletLatLng>(() => ({ lat: 0, lng: 0 }));
    public removeLayer = vi.fn();
    public panTo = vi.fn();

    constructor(element: HTMLElement, options: { center: [number, number]; zoom: number }) {
      this.element = element;
      this.options = options;
      created.maps.push(this as unknown as LeafletMapMock);
    }
  }

  class TileLayer {
    public url: string;
    public options: unknown;
    constructor(url: string, options: unknown) {
      this.url = url;
      this.options = options;
      created.tileLayers.push(this);
    }
  }

  class LayerGroup {
    public addTo = vi.fn(() => this);
    public clearLayers = vi.fn();
    public addLayer = vi.fn();

    constructor() {
      created.layerGroups.push(this as unknown as LeafletLayerGroupMock);
    }
  }

  class Marker {
    public coords: unknown;
    constructor(coords: unknown) {
      this.coords = coords;
      created.markers.push(this);
    }
  }

  return { Map, TileLayer, LayerGroup, Marker, __mock: created };
});

vi.mock('leaflet', () => leafletMock);

const makeCity = (overrides?: Partial<City>): City => ({
  name: overrides?.name ?? 'Paris',
  location: overrides?.location ?? { latitude: 1, longitude: 2, zoom: 10 },
});

describe('Hook: useMap', () => {
  it('Creates Leaflet map once and updates view when city changes', async () => {
    const mapDiv = document.createElement('div');
    const mapRef: MutableRefObject<HTMLElement | null> = { current: mapDiv };

    const city1 = makeCity({ location: { latitude: 1, longitude: 2, zoom: 10 } });
    const city2 = makeCity({ location: { latitude: 9, longitude: 8, zoom: 12 } });

    const { result, rerender } = renderHook(
      ({ city }) => useMap(mapRef, city, []),
      { initialProps: { city: city1 } }
    );

    await waitFor(() => expect(result.current).not.toBeNull());

    const leaflet = (await import('leaflet')) as unknown as { __mock: LeafletCreated };
    expect(leaflet.__mock.maps).toHaveLength(1);

    const mapInstance = result.current as unknown as LeafletMapMock;
    expect(mapInstance.options).toEqual({
      center: [city1.location.latitude, city1.location.longitude],
      zoom: city1.location.zoom,
    });

    mapInstance.getCenter.mockReturnValue({ lat: city1.location.latitude, lng: city1.location.longitude });

    rerender({ city: city2 });

    expect(mapInstance.setView).toHaveBeenCalledWith(
      [city2.location.latitude, city2.location.longitude],
      city2.location.zoom
    );
    expect(leaflet.__mock.maps).toHaveLength(1);
  });

  it('Clears and re-adds markers when points change', async () => {
    const mapDiv = document.createElement('div');
    const mapRef: MutableRefObject<HTMLElement | null> = { current: mapDiv };

    const city = makeCity();

    const { result, rerender } = renderHook(
      ({ points }) => useMap(mapRef, city, points),
      { initialProps: { points: [] as { latitude: number; longitude: number }[] } }
    );

    await waitFor(() => expect(result.current).not.toBeNull());

    const leaflet = (await import('leaflet')) as unknown as { __mock: LeafletCreated };
    const created = leaflet.__mock;

    expect(created.layerGroups.length).toBeGreaterThan(0);
    const layerGroup = created.layerGroups[created.layerGroups.length - 1];

    const initialClearCalls = layerGroup.clearLayers.mock.calls.length;
    const initialAddLayerCalls = layerGroup.addLayer.mock.calls.length;
    const initialMarkersCreated = created.markers.length;

    rerender({ points: [{ latitude: 10, longitude: 20 }, { latitude: 30, longitude: 40 }] });

    await waitFor(() => {
      expect(layerGroup.clearLayers.mock.calls.length).toBeGreaterThanOrEqual(initialClearCalls + 1);
      expect(layerGroup.addLayer.mock.calls.length).toBeGreaterThanOrEqual(initialAddLayerCalls + 2);
      expect(created.markers.length).toBeGreaterThanOrEqual(initialMarkersCreated + 2);
    });
  });
});
