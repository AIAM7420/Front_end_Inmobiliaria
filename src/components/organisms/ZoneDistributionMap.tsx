import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppContext } from '../../context/AppContext';
import { approximateZoneCenter } from '../../integrations/backend/zoneGeometry';
import type { Estadisticas } from '../../integrations/backend/engagement.service';
import { Button } from '../atoms/Button';

export function ZoneDistributionMap({ data }: { data?: Estadisticas }) {
  const { isDarkMode, setGlobalFilters } = useAppContext(), navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null), [error, setError] = useState(false);
  const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN as string | undefined;
  const navigateTo = (id: string) => { setGlobalFilters({ zona_id: id, moneda: 'MXN' }); navigate('/map'); };
  const handler = useRef(navigateTo); useEffect(() => { handler.current = navigateTo; });
  useEffect(() => {
    if (!token || !container.current) return;
    const map = new mapboxgl.Map({ container: container.current, accessToken: token, style: isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11', center: [-101.680, 21.135], zoom: 12, attributionControl: true });
    const markers: mapboxgl.Marker[] = [];
    map.on('error', () => setError(true));
    map.on('load', () => { setError(false); data?.zonas.forEach(zone => {
      const position = approximateZoneCenter(zone.area_aproximada);
      if (!position) return;
      const button = document.createElement('button'); button.type = 'button'; button.textContent = String(zone.visitas); button.setAttribute('aria-label', `${zone.nombre}: ${zone.visitas} visitas. Abrir catálogo en mapa`); button.className = 'rounded-full bg-inmo-accent/80 text-white font-montserrat font-black text-2xl px-4 py-2 shadow-glow'; button.onclick = () => handler.current(zone.id); markers.push(new mapboxgl.Marker({ element: button }).setLngLat([position.lng, position.lat]).addTo(map));
    }); });
    return () => { markers.forEach(marker => marker.remove()); map.remove(); };
  }, [data, isDarkMode, token]);
  return <div className="relative flex-1 min-h-[280px] md:min-h-0 md:h-full bg-gray-200 dark:bg-inmo-darkbg rounded-card border-4 border-white dark:border-inmo-darkcard shadow-soft overflow-hidden group"><div ref={container} className="absolute inset-0" />{(!token || error) && <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-inter text-sm text-gray-500">{!token ? 'Configura Mapbox para consultar la distribución en el mapa.' : 'No pudimos cargar el mapa. Puedes consultar cada zona en la lista.'}</div>}
    <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-inmo-darkcard/80 backdrop-blur-xl rounded-2xl p-3 shadow-soft"><p className="font-montserrat font-bold text-sm">Distribución por zona</p><p className="text-[10px] text-gray-500">Visitas del periodo · ubicación aproximada</p></div>
    <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto rounded-2xl bg-white/80 dark:bg-inmo-darkcard/80 backdrop-blur-xl p-2">{data?.zonas.map(zone => <Button key={zone.id} variant="ghost" className="!h-auto shrink-0 !px-3 !py-2 !text-xs" onClick={() => navigateTo(zone.id)}>{zone.nombre} · {zone.propiedades} inmuebles · {zone.visitas} visitas</Button>)}{data?.zonas.length === 0 && <p className="text-xs text-gray-500 p-2">No hay propiedades por zona.</p>}</div>
  </div>;
}
