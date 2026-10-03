import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/** Public callers must pass the zone centre, never the property's private point. */
export function PropertyMiniMap({ position, privateLocation = false }: {
  position: { lat: number; lng: number } | null; privateLocation?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useAppContext();
  const [failed, setFailed] = useState(false);
  const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
  const lat = position?.lat, lng = position?.lng;
  useEffect(() => {
    if (!container.current || !token || lat === undefined || lng === undefined) return;
    const map = new mapboxgl.Map({ container: container.current, accessToken: token,
      style: isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat], zoom: privateLocation ? 15 : 12, interactive: false });
    const marker = new mapboxgl.Marker({ color: '#FA003F' }).setLngLat([lng, lat]).addTo(map);
    map.on('error', () => setFailed(true));
    return () => { marker.remove(); map.remove(); };
  }, [lat, lng, token, isDarkMode, privateLocation]);
  const label = privateLocation ? 'Ubicación privada' : 'Ubicación aproximada';
  return <div className="relative w-full h-full bg-gray-100 dark:bg-inmo-darkbg" aria-label={label}>
    <div ref={container} className="w-full h-full" />
    {(!token || !position || failed) && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-inter">
      <div className="bg-inmo-accent/20 p-2.5 rounded-full"><MapPin className="w-5 h-5 text-inmo-accent" /></div>
      <span>{!position ? 'Ubicación sin registrar' : failed ? 'Mapa no disponible' : label}</span>
    </div>}
  </div>;
}
