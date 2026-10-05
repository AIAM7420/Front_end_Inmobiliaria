import { useEffect, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '../atoms/Button';

export function ApplicationUpdateNotice() {
  const registration = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const { needRefresh: [available, setAvailable] } = useRegisterSW({
    immediate: true,
    onRegisteredSW: (_url, value) => { registration.current = value; },
  });
  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
    let existing = navigator.serviceWorker.controller;
    const changed = () => { if (existing) setAvailable(true); existing = navigator.serviceWorker.controller; };
    const check = () => { if (document.visibilityState === 'visible') void registration.current?.update().catch(() => { /* Keep working when offline; next check retries. */ }); };
    navigator.serviceWorker.addEventListener('controllerchange', changed);
    document.addEventListener('visibilitychange', check);
    const timer = window.setInterval(check, 120_000);
    return () => { navigator.serviceWorker.removeEventListener('controllerchange', changed); document.removeEventListener('visibilitychange', check); window.clearInterval(timer); };
  }, [setAvailable]);
  if (!available) return null;
  return <aside role="status" aria-label="Actualización de aplicación" className="fixed bottom-6 left-4 right-4 sm:left-auto sm:max-w-sm z-[100] rounded-card bg-white dark:bg-inmo-darkcard shadow-soft border border-inmo-accent/20 p-5 text-inmo-secondary dark:text-white font-inter space-y-3">
    <p className="font-bold">Hay una nueva versión de INMO</p>
    <p className="text-sm">Guarda tus cambios antes de actualizar. Se recargará la página y tendrás que iniciar sesión nuevamente.</p>
    <Button className="w-full h-12" onClick={() => window.location.reload()}>Actualizar aplicación</Button>
  </aside>;
}
