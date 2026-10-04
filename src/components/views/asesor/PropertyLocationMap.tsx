import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Position { lat: number; lng: number }

export function PropertyLocationMap({ position, onChange }: {
  position: Position | null;
  onChange: (position: Position) => void;
}) {
  const token: string | undefined = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const [error, setError] = useState(false);
  const lat = position?.lat;
  const lng = position?.lng;

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!token || !container.current) return;
    const instance = new mapboxgl.Map({
      container: container.current,
      accessToken: token,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-101.680, 21.135],
      zoom: 12,
      attributionControl: true,
    });
    map.current = instance;
    instance.addControl(new mapboxgl.NavigationControl(), 'top-right');
    instance.on('click', (event) => onChangeRef.current({ lat: event.lngLat.lat, lng: event.lngLat.lng }));
    instance.on('error', () => setError(true));
    return () => { marker.current?.remove(); marker.current = null; map.current = null; instance.remove(); };
  }, [token]);

  useEffect(() => {
    if (!map.current || lat === undefined || lng === undefined || !token) return;
    if (!marker.current) {
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([lng, lat]).addTo(map.current);
      marker.current.on('dragend', () => {
        const point = marker.current?.getLngLat();
        if (point) onChangeRef.current({ lat: point.lat, lng: point.lng });
      });
    } else {
      marker.current.setLngLat([lng, lat]);
    }
    map.current.flyTo({ center: [lng, lat], zoom: 15, essential: true });
  }, [lat, lng, token]);

  if (!token) return <p className="text-sm">Mapa no configurado. Puedes introducir latitud y longitud manualmente.</p>;
  return <div className="md:col-span-2">
    <p className="mb-2 text-sm">Haz clic en el mapa o arrastra el marcador para corregir la ubicación antes de registrar.</p>
    <div ref={container} className="h-72 w-full rounded-xl overflow-hidden" aria-label="Mapa para ajustar la ubicación" />
    {error && <p role="alert" className="text-sm text-inmo-danger">No se pudo cargar Mapbox. Puedes introducir las coordenadas manualmente.</p>}
    <p className="mt-2 text-xs text-gray-500">Mapa © Mapbox y © OpenStreetMap contributors. La sugerencia puede ser aproximada.</p>
  </div>;
}
