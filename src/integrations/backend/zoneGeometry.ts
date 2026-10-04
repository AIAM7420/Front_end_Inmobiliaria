/** A public zone's bounding-box center is approximate; never use private property coordinates. */
export function approximateZoneCenter(geojson: Record<string, unknown> | null | undefined): {
  lat: number;
  lng: number;
} | null {
  if (!geojson) return null;
  const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson;
  if (typeof geometry !== 'object' || geometry === null) return null;
  const object = geometry as Record<string, unknown>;
  const rings = object.type === 'Polygon'
    ? (object.coordinates as unknown[])?.[0]
    : object.type === 'MultiPolygon'
      ? ((object.coordinates as unknown[])?.[0] as unknown[])?.[0]
      : null;
  if (!Array.isArray(rings)) return null;
  const points = rings.filter((value): value is [number, number] =>
    Array.isArray(value) && value.length >= 2 &&
    typeof value[0] === 'number' && typeof value[1] === 'number' &&
    Number.isFinite(value[0]) && Number.isFinite(value[1]));
  if (!points.length) return null;
  const lngs = points.map(([lng]) => lng);
  const lats = points.map(([, lat]) => lat);
  return {
    lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
  };
}
