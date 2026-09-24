import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Building2, CirclePause, House } from 'lucide-react';
import { useGetMe } from '../../../integrations/backend/hooks/useAuth';
import { useGetOwnProperties } from '../../../integrations/backend/hooks/useProperties';
import { useGetOwnApplication } from '../../../integrations/backend/hooks/useAdvisors';
import { useGetSubscription } from '../../../integrations/backend/hooks/useSubscriptions';
import { useGetNotifications, useMarkNotificationRead } from '../../../integrations/backend/hooks/useNotifications';
import { IconButton } from '../../atoms/IconButton';
import { Button } from '../../atoms/Button';
import { Skeleton } from '../../atoms/Skeleton';
import { BottomSheet } from '../../organisms/BottomSheet';
import { ConnectedPropertyCard } from '../../organisms/ConnectedPropertyCard';

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="bg-white dark:bg-inmo-darkcard rounded-card p-4 md:p-5 shadow-soft flex items-center justify-between min-h-[110px]">
      <div>
        <p className="font-inter text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-montserrat font-black text-3xl text-inmo-secondary dark:text-white mt-2">{value}</p>
      </div>
      <div className="w-11 h-11 rounded-full bg-inmo-accent/10 text-inmo-accent flex items-center justify-center">{icon}</div>
    </div>
  );
}

export function AsesorOverview() {
  const me = useGetMe();
  const properties = useGetOwnProperties({ limit: 20 });
  const application = useGetOwnApplication();
  const subscription = useGetSubscription();
  const notifications = useGetNotifications();
  const markRead = useMarkNotificationRead();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const items = properties.data?.items ?? [];
  const unread = notifications.data?.items.filter((item) => item.leida_at === null) ?? [];
  const greeting = me.data?.value.nombre?.split(' ')[0] ?? 'Asesor';

  const notificationList = notifications.isLoading ? (
    <div className="p-4 space-y-3" aria-label="Cargando notificaciones">
      <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
    </div>
  ) : notifications.isError ? (
    <p className="p-4 font-inter text-sm text-gray-500">No pudimos cargar tus notificaciones.</p>
  ) : notifications.data?.items.length ? (
    <div className="max-h-[360px] overflow-y-auto">
      {notifications.data.items.map((item) => (
        <Button key={item.id} type="button" variant="ghost" onClick={() => item.leida_at === null && markRead.mutate(item.id)}
          className="w-full !justify-start p-4 border-b border-gray-100 dark:border-inmo-darktertiary text-left !rounded-none">
          <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${item.leida_at === null ? 'bg-inmo-accent' : 'bg-gray-300'}`} />
          <span className="font-inter text-sm text-inmo-secondary dark:text-white">
            {item.tipo.replaceAll('_', ' ').toLowerCase()}
            <span className="block text-xs text-gray-500 mt-1">{new Date(item.creada_at).toLocaleString('es-MX')}</span>
          </span>
        </Button>
      ))}
    </div>
  ) : (
    <p className="p-4 font-inter text-sm text-gray-500">No tienes notificaciones.</p>
  );

  return (
    <div className="h-full w-full overflow-y-auto pt-[100px] pb-24 px-4 md:px-6 animate-in fade-in">
      <header className="flex items-center justify-between mb-6 px-2">
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-inmo-secondary dark:text-white">Hola, {greeting}</h1>
          <p className="font-inter text-sm text-gray-500 dark:text-gray-400">Tu portafolio actual</p>
        </div>
        <div className="relative">
          <IconButton icon={<Bell className="w-5 h-5" />} variant="secondary" onClick={() => setNotificationsOpen((open) => !open)}
            aria-label="Abrir notificaciones" className="shadow-soft" />
          {unread.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-inmo-accent rounded-full" />}
          {notificationsOpen && (
            <div className="hidden md:block absolute right-0 top-full mt-3 w-[340px] bg-white dark:bg-inmo-darkcard rounded-2xl shadow-xl z-30 overflow-hidden border border-gray-100 dark:border-inmo-darktertiary">
              <h2 className="font-montserrat font-bold p-4 border-b border-gray-100 dark:border-inmo-darktertiary">Notificaciones</h2>
              {notificationList}
            </div>
          )}
        </div>
      </header>

      <nav aria-label="Pasos para trabajar como asesor" className="rounded-card bg-white dark:bg-inmo-darkcard p-5 mb-6 shadow-soft font-inter text-sm text-inmo-secondary dark:text-white">
        <p className="font-montserrat font-bold mb-2">Tu siguiente paso</p>
        <p>Validación: {application.isLoading ? 'Consultando…' : application.data?.value.estado ?? 'Sin expediente'} · Suscripción: {subscription.isLoading ? 'Consultando…' : subscription.data?.value.estado ?? 'Sin periodo'}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-inmo-accent underline">
          <Link to="/asesor/validacion">Revisar expediente</Link>
          <Link to="/asesor/suscripcion">Elegir plan y pagar</Link>
          <Link to="/asesor/propiedades">Gestionar propiedades</Link>
        </div>
      </nav>

      <p className="font-inter text-xs text-gray-500 mb-3 px-2">Resumen de las propiedades cargadas en esta página; no representa el total histórico.</p>
      {properties.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8" aria-label="Cargando resumen">
          <Skeleton className="h-[110px]" /><Skeleton className="h-[110px]" /><Skeleton className="h-[110px]" />
        </div>
      ) : properties.isError ? (
        <div role="alert" className="bg-white dark:bg-inmo-darkcard rounded-card p-6 mb-8 font-inter text-sm text-gray-600 dark:text-gray-300">
          No pudimos cargar tu portafolio. Inténtalo de nuevo en unos momentos.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
          <SummaryCard label="En esta página" value={items.length} icon={<Building2 className="w-5 h-5" />} />
          <SummaryCard label="Publicadas" value={items.filter((item) => item.estado_publicacion === 'PUBLICADA').length} icon={<House className="w-5 h-5" />} />
          <SummaryCard label="Pausadas" value={items.filter((item) => item.estado_publicacion === 'PAUSADA').length} icon={<CirclePause className="w-5 h-5" />} />
        </div>
      )}

      <section>
        <h2 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white mb-4 px-2">Mis propiedades</h2>
        {properties.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" aria-label="Cargando propiedades">
            <Skeleton className="h-[340px]" /><Skeleton className="h-[340px]" /><Skeleton className="h-[340px]" />
          </div>
        ) : properties.isError ? null : items.length === 0 ? (
          <div className="bg-white dark:bg-inmo-darkcard rounded-card p-8 font-inter text-sm text-gray-500">Todavía no tienes propiedades registradas.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id}>
                <p className="font-inter text-xs font-semibold text-gray-500 mb-2 ml-2">{item.estado_publicacion.replaceAll('_', ' ')}</p>
                <ConnectedPropertyCard property={item} variant="asesor" />
              </div>
            ))}
          </div>
        )}
        {properties.data?.next_cursor && <p className="font-inter text-xs text-gray-500 mt-4 px-2">Hay más propiedades; la paginación estará disponible en esta vista próximamente.</p>}
      </section>

      <div className="md:hidden">
        <BottomSheet isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} title="Notificaciones">{notificationList}</BottomSheet>
      </div>
    </div>
  );
}
