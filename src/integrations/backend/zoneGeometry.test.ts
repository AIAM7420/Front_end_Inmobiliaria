import { describe, expect, it } from 'vitest';
import { approximateZoneCenter } from './zoneGeometry';

describe('approximateZoneCenter', () => {
  it('uses only public zone geometry for an approximate marker', () => {
    expect(approximateZoneCenter({ type: 'Polygon', coordinates: [[[-102, 21], [-101, 21], [-101, 22], [-102, 21]]] }))
      .toEqual({ lng: -101.5, lat: 21.5 });
  });

  it('omits markers when public geometry is unavailable or malformed', () => {
    expect(approximateZoneCenter(null)).toBeNull();
    expect(approximateZoneCenter({ type: 'Point', coordinates: [-101, 21] })).toBeNull();
  });
});
