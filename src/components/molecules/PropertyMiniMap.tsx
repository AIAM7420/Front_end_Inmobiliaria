import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Plus, Minus, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { LEON_CENTER, useThemedMap } from './useThemedMap';
import { Skeleton } from '../atoms/Skeleton';
import { IconButton } from '../atoms/IconButton';

/** Public callers pass only the approximate zone centre, never private coordinates. */
export function PropertyMiniMap({ position, privateLocation = false, loading = false }: {
  position: { lat: number; lng: number } | null; privateLocation?: boolean; loading?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useAppContext();
  const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
  const initialZoom = privateLocation ? 14.5 : 12;
  const { map, status, retry } = useThemedMap(container, token, isDarkMode, { interactive: true, zoom: initialZoom, pitch: 0, bearing: 0, maxPitch: 0, minPitch: 0, projection: 'mercator', dragRotate: false, pitchWithRotate: false, touchPitch: false, cooperativeGestures: true });
  const lat = position?.lat, lng = position?.lng;
  useEffect(() => {
    if (!map) return;
    map.jumpTo({ center: lat === undefined || lng === undefined ? LEON_CENTER : [lng, lat], zoom: initialZoom, pitch: 0, bearing: 0 });
    if (lat === undefined || lng === undefined) return;
    const marker = new mapboxgl.Marker({ color: '#FA003F' }).setLngLat([lng, lat]).addTo(map);
    return () => { marker.remove(); };
  }, [map, lat, lng, initialZoom]);
  const label = privateLocation ? 'Ubicación privada' : 'Ubicación aproximada';
  return <div className="relative w-full h-full overflow-hidden rounded-[20px] bg-gray-100 dark:bg-inmo-darkbg" aria-label={label}>
    <div ref={container} className="absolute inset-0 w-full h-full" />
    {token && position && status === 'ready' && <>
      {position && <span className="absolute top-2 left-2 pointer-events-none px-2 py-1 rounded-full text-[11px] font-semibold bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/50 dark:border-white/10">{label}</span>}
      <div className="absolute bottom-2 right-2 flex gap-1 p-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/50 dark:border-white/10">
        <IconButton aria-label="Acercar mapa (zoom in)" variant="ghost" icon={<Plus className="w-4 h-4" />} onClick={() => map?.zoomIn()} />
        <IconButton aria-label="Alejar mapa (zoom out)" variant="ghost" icon={<Minus className="w-4 h-4" />} onClick={() => map?.zoomOut()} />
        <IconButton aria-label="Recentrar ubicación" variant="ghost" icon={<RotateCcw className="w-4 h-4" />} onClick={() => map?.flyTo({ center: lat === undefined || lng === undefined ? LEON_CENTER : [lng, lat], zoom: initialZoom, pitch: 0, bearing: 0 })} />
      </div>
    </>}
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
