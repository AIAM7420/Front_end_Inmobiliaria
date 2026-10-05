import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import mapboxgl from 'mapbox-gl';

// State here mirrors an external WebGL instance and its asynchronous loading lifecycle.
/* oxlint-disable react/set-state-in-effect */

export const LEON_CENTER: [number, number] = [-101.680, 21.135];
const styleFor = (dark: boolean) => `mapbox://styles/mapbox/${dark ? 'dark' : 'light'}-v11`;

/** Keep the camera and DOM markers while styles load; rebuild style layers only when ready. */
export function useThemedMap(container: RefObject<HTMLDivElement | null>, token: string | undefined,
  dark: boolean, options: { center?: [number, number]; zoom?: number; interactive?: boolean } = {}) {
  const initial = useRef(options), currentTheme = useRef(dark), appliedTheme = useRef(dark);
  const generation = useRef(0), readyGeneration = useRef(-1);
  useEffect(() => { currentTheme.current = dark; }, [dark]);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [styleRevision, setStyleRevision] = useState(0);
  useEffect(() => {
    if (!container.current || !token) return;
    let active = true;
    let instance: mapboxgl.Map;
    try {
      appliedTheme.current = currentTheme.current;
      instance = new mapboxgl.Map({ container: container.current, accessToken: token,
        style: styleFor(currentTheme.current), center: LEON_CENTER, zoom: 12, ...initial.current });
    } catch { setStatus('error'); return; }
    setMap(instance); setStatus('loading');
    const ready = () => {
      if (!active || !instance.isStyleLoaded()) return;
      setStatus('ready');
      if (readyGeneration.current !== generation.current) {
        readyGeneration.current = generation.current;
        setStyleRevision(value => value + 1);
        instance.resize();
      }
    };
    const error = () => { if (active) setStatus('error'); };
    instance.on('style.load', ready); instance.on('load', ready); instance.on('idle', ready); instance.on('error', error);
    const resize = new ResizeObserver(() => { if (active) instance.resize(); });
    resize.observe(container.current);
    return () => {
      active = false; resize.disconnect(); instance.off('style.load', ready); instance.off('load', ready); instance.off('idle', ready); instance.off('error', error);
      instance.remove(); setMap(null);
    };
  }, [container, token]);
  useEffect(() => {
    if (!map || appliedTheme.current === dark) return;
    appliedTheme.current = dark; generation.current += 1; setStatus('loading');
    try { map.setStyle(styleFor(dark)); } catch { setStatus('error'); }
  }, [map, dark]);
  const retry = useCallback(() => {
    if (!map) return;
    generation.current += 1; setStatus('loading');
    try { map.setStyle(styleFor(currentTheme.current), { diff: false, localFontFamily: undefined, localIdeographFontFamily: undefined }); } catch { setStatus('error'); }
  }, [map]);
  return { map, status, styleRevision, retry };
}
