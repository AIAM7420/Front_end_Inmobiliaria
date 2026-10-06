import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Plus, Minus, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/** Public callers must pass the zone centre, never the property's private point. */
export function PropertyMiniMap({ position, privateLocation = false }: {
  position: { lat: number; lng: number } | null; privateLocation?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { isDarkMode } = useAppContext();
  const [failed, setFailed] = useState(false);
  const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
  const lat = position?.lat, lng = position?.lng;
  const initialZoom = privateLocation ? 14.5 : 12;

  useEffect(() => {
    if (!container.current || !token || lat === undefined || lng === undefined) return;

    let destroyed = false;
    const map = new mapboxgl.Map({
      container: container.current,
      accessToken: token,
      style: isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: initialZoom,
      minZoom: 6,
      maxZoom: 18,
      pitch: 0,
      bearing: 0,
      maxPitch: 0,
      minPitch: 0,
      projection: 'mercator',
      dragPan: true,
      cooperativeGestures: true,
      doubleClickZoom: true,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });
    mapRef.current = map;

    const marker = new mapboxgl.Marker({ color: '#FA003F' }).setLngLat([lng, lat]).addTo(map);

    const handleResize = () => {
      if (destroyed || !map) return;
      try {
        map.resize();
        if (lat !== undefined && lng !== undefined) {
          map.setCenter([lng, lat]);
          map.setPitch(0);
          map.setBearing(0);
        }
      } catch {
        // Safe catch if map is tearing down
      }
    };

    map.on('load', () => {
      map.setPitch(0);
      map.setBearing(0);
      handleResize();
    });
    map.on('error', () => {
      if (!destroyed) setFailed(true);
    });

    // Observe size changes of the container (e.g. during and after SplitView opening transitions)
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && container.current) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container.current);
    }

    // Staggered resizes to guarantee coverage across CSS opening transitions (500ms)
    const timers = [
      setTimeout(handleResize, 50),
      setTimeout(handleResize, 150),
      setTimeout(handleResize, 300),
      setTimeout(handleResize, 550),
      setTimeout(handleResize, 800),
    ];

    window.addEventListener('resize', handleResize);

    return () => {
      destroyed = true;
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      marker.remove();
      map.remove();
    };
  }, [lat, lng, token, isDarkMode, privateLocation, initialZoom]);

  const label = privateLocation ? 'Ubicación privada' : 'Ubicación aproximada';

  return (
    <div
      className="relative w-full h-full bg-gray-100 dark:bg-inmo-darkbg overflow-hidden rounded-[20px]"
      aria-label={label}
    >
      <div
        ref={container}
        className="absolute inset-0 w-full h-full [&_.mapboxgl-canvas]:!w-full [&_.mapboxgl-canvas]:!h-full"
      />

      {/* Indicador sutil de tipo de ubicación */}
      {token && position && !failed && (
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold font-inter bg-white/80 dark:bg-black/60 backdrop-blur-md text-inmo-secondary dark:text-white shadow-sm border border-white/50 dark:border-white/10">
            <MapPin className="w-3 h-3 text-inmo-accent" />
            {label}
          </span>
        </div>
      )}

      {/* Controles flotantes de zoom y recentrado */}
      {token && position && !failed && (
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-white/80 dark:bg-black/60 backdrop-blur-md p-1 rounded-full shadow-md border border-white/50 dark:border-white/10">
          <button
            type="button"
            aria-label="Acercar mapa (zoom in)"
            title="Acercar"
            onClick={(e) => {
              e.stopPropagation();
              mapRef.current?.zoomIn();
            }}
            className="w-7 h-7 flex items-center justify-center rounded-full text-inmo-secondary dark:text-white hover:bg-white/80 dark:hover:bg-white/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Alejar mapa (zoom out)"
            title="Alejar (zoom out)"
            onClick={(e) => {
              e.stopPropagation();
              mapRef.current?.zoomOut();
            }}
            className="w-7 h-7 flex items-center justify-center rounded-full text-inmo-secondary dark:text-white hover:bg-white/80 dark:hover:bg-white/20 active:scale-95 transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Recentrar ubicación"
            title="Recentrar"
            onClick={(e) => {
              e.stopPropagation();
              if (lat !== undefined && lng !== undefined) {
                mapRef.current?.flyTo({ center: [lng, lat], zoom: initialZoom, pitch: 0, bearing: 0, essential: true });
              }
            }}
            className="w-7 h-7 flex items-center justify-center rounded-full text-inmo-secondary dark:text-white hover:bg-white/80 dark:hover:bg-white/20 active:scale-95 transition-all border-l border-black/10 dark:border-white/10 pl-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>
      )}

      {(!token || !position || failed) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-gray-100/90 dark:bg-inmo-darkbg/90 text-gray-500 dark:text-gray-400 text-xs font-inter p-4 text-center">
          <div className="bg-inmo-accent/20 p-2.5 rounded-full">
            <MapPin className="w-5 h-5 text-inmo-accent" />
          </div>
          <span>{!position ? 'Ubicación sin registrar' : failed ? 'Mapa no disponible' : label}</span>
        </div>
      )}
    </div>
  );
}
