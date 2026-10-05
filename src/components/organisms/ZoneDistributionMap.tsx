import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppContext } from '../../context/AppContext';
import { approximateZoneCenter } from '../../integrations/backend/zoneGeometry';
import type { Estadisticas } from '../../integrations/backend/engagement.service';
import type { Sector } from '../../integrations/backend/types';
import { Button } from '../atoms/Button';
import { Skeleton } from '../atoms/Skeleton';
import { useThemedMap } from '../molecules/useThemedMap';

export function ZoneDistributionMap({ data }: { data?: Estadisticas }) {
  const { isDarkMode, globalFilters, setGlobalFilters, setGlobalSearchQuery } = useAppContext(), navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null);
  const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN as string | undefined;
  const { map, status, retry } = useThemedMap(container, token, isDarkMode);
  const navigateTo = (sector: Sector) => { setGlobalSearchQuery(''); setGlobalFilters({ ...globalFilters, sector, moneda: 'MXN' }); navigate('/map'); };
  const handler = useRef(navigateTo);
  useEffect(() => { handler.current = navigateTo; });
  useEffect(() => {
    if (!map) return;
    const markers = data?.sectores?.flatMap(zone => zone.puntos_aproximados.flatMap(point => {
      const position = approximateZoneCenter(point.area_aproximada);
      if (!position || point.propiedades === 0 && point.visitas === 0) return [];
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = `${point.propiedades} · ${point.visitas}`;
      button.setAttribute('aria-label', `Zona ${zone.sector.toLowerCase()}: ${point.propiedades} inmuebles, ${point.visitas} visitas. Abrir mapa`);
      button.className = 'rounded-full bg-inmo-accent/90 text-white font-montserrat font-bold text-sm px-3 py-2 shadow-glow';
      button.onclick = () => handler.current(zone.sector);
      const marker = new mapboxgl.Marker({ element: button }).setLngLat([position.lng, position.lat]).addTo(map);
      button.setAttribute('role', 'button');
      return [marker];
    })) ?? [];
    if (markers.length) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach(marker => bounds.extend(marker.getLngLat()));
      map.fitBounds(bounds, { padding: { top: 80, bottom: 110, left: 30, right: 30 }, maxZoom: 12, duration: 0 });
    }
    return () => { markers.forEach(marker => marker.remove()); };
  }, [data, map]);
  return <div aria-label="Distribución de inmuebles por sector" aria-busy={Boolean(token) && status === 'loading'} className="relative flex-1 min-h-[350px] md:min-h-0 md:h-full bg-gray-200 dark:bg-inmo-darkbg rounded-card border-4 border-white dark:border-inmo-darkcard shadow-soft overflow-hidden">
    <div ref={container} className="w-full h-full" style={{ position: 'absolute', inset: 0 }} />
    {token && status === 'loading' && <Skeleton className="absolute inset-0" />}
    {(!token || status === 'error') && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 pb-28 text-center font-inter text-sm text-gray-500">
      <p>{!token ? 'Configura Mapbox para consultar la distribución en el mapa.' : 'No pudimos cargar el mapa. Consulta los sectores en la lista.'}</p>
      {token && <Button variant="secondary" onClick={retry}>Reintentar mapa</Button>}
    </div>}
    <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-inmo-darkcard/80 backdrop-blur-xl rounded-2xl p-3 shadow-soft"><p className="font-montserrat font-bold text-sm">Distribución por zona</p><p className="text-[10px] text-gray-500">Inmuebles actuales · visitas del periodo · ubicación aproximada</p></div>
    <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/90 dark:bg-inmo-darkcard/90 backdrop-blur-xl p-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{data?.sectores?.map(zone => <Button key={zone.sector} variant="ghost" className="!h-auto !px-2 !py-2 !text-xs !whitespace-normal" onClick={() => navigateTo(zone.sector)}><span><span className="block">Zona {zone.sector.toLowerCase()}</span><span className="block text-[10px]">{zone.propiedades} inmuebles · {zone.visitas} visitas</span></span></Button>)}</div>
      {data?.sin_ubicacion && <p className="text-[10px] text-gray-500 px-3 py-1">Sin ubicación: {data.sin_ubicacion.propiedades} inmuebles · {data.sin_ubicacion.visitas} visitas. Sectores operativos de INMO.</p>}
      {!data && <p role="status" className="text-xs text-gray-500 p-2">Consultando distribución…</p>}
    </div>
  </div>;
}
