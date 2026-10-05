import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { LEON_CENTER, useThemedMap } from './useThemedMap';
import { Skeleton } from '../atoms/Skeleton';

/** Public callers pass only the approximate zone centre, never private coordinates. */
export function PropertyMiniMap({ position, privateLocation = false, loading = false }: {
  position: { lat: number; lng: number } | null; privateLocation?: boolean; loading?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useAppContext();
  const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
  const { map, status, retry } = useThemedMap(container, token, isDarkMode, { interactive: false });
  const lat = position?.lat, lng = position?.lng;
  useEffect(() => {
    if (!map) return;
    map.jumpTo({ center: lat === undefined || lng === undefined ? LEON_CENTER : [lng, lat], zoom: privateLocation && lat !== undefined ? 15 : 12 });
    if (lat === undefined || lng === undefined) return;
    const marker = new mapboxgl.Marker({ color: '#FA003F' }).setLngLat([lng, lat]).addTo(map);
    return () => { marker.remove(); };
  }, [map, lat, lng, privateLocation]);
  const label = privateLocation ? 'Ubicación privada' : 'Ubicación aproximada';
  return <div className="relative w-full h-full bg-gray-100 dark:bg-inmo-darkbg" aria-label={label}>
    <div ref={container} className="w-full h-full" />
    {(loading || token && status === 'loading') && <Skeleton className="absolute inset-0" />}
    {!loading && (!token || status === 'error') && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-inter">
      <MapPin className="w-5 h-5 text-inmo-accent" />
      <span>{status === 'error' && token ? 'Mapa no disponible' : label}</span>
      {token && status === 'error' && <button type="button" onClick={retry} className="rounded-full px-3 py-1 bg-white dark:bg-inmo-darkcard">Reintentar mapa</button>}
    </div>}
    {!loading && !position && <p className="absolute bottom-1 left-2 right-2 rounded-xl bg-white/90 dark:bg-inmo-darkcard/90 px-2 py-1 text-[10px] text-center">
      Mapa general de León. El asesor debe completar la ubicación del inmueble.
    </p>}
  </div>;
}
