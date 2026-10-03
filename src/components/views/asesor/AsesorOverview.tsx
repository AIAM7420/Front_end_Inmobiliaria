import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell,Building2,Eye,Pause,UserCheck } from 'lucide-react';
import { ModuleLayout } from '../../templates/ModuleLayout';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { useGetMe } from '../../../integrations/backend/hooks/useAuth';
import { useGetOwnProperties } from '../../../integrations/backend/hooks/useProperties';
import { useGetOwnApplication } from '../../../integrations/backend/hooks/useAdvisors';
import { useGetSubscription } from '../../../integrations/backend/hooks/useSubscriptions';
import { useGetNotifications,useMarkNotificationRead } from '../../../integrations/backend/hooks/useNotifications';
import { ConnectedPropertyCard } from '../../organisms/ConnectedPropertyCard';
import { MetricCard } from '../../molecules/MetricCard';
import { Button } from '../../atoms/Button';
import { IconButton } from '../../atoms/IconButton';
import { Skeleton } from '../../atoms/Skeleton';
export function AsesorOverview() {
 const me=useGetMe(),properties=useGetOwnProperties({limit:20}),application=useGetOwnApplication(),subscription=useGetSubscription(),notifications=useGetNotifications(),markRead=useMarkNotificationRead();
 const [panel,setPanel]=useState<'portfolio'|'notifications'|null>(null);
 const items=properties.data?.items;
 const main=<ModuleLayout title={'Hola, '+(me.data?.value.nombre.split(' ')[0] ?? 'Asesor')} subtitle="Tu resumen del día" isFullScreen showSearch={false} showFilters={false} headerEndContent={<IconButton aria-label="Abrir notificaciones" icon={<Bell className="w-5 h-5" />} onClick={()=>setPanel('notifications')} />}>
 <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
 <MetricCard label="Propiedades en esta página" value={items?.length} icon={<Building2 />} /><MetricCard label="Publicadas en esta página" value={items?.filter(p=>p.estado_publicacion==='PUBLICADA').length} icon={<Eye />} /><MetricCard label="Pausadas en esta página" value={items?.filter(p=>p.estado_publicacion==='PAUSADA').length} icon={<Pause />} /><MetricCard label="Cupo disponible" value={subscription.data?.value.capacidad_disponible} icon={<UserCheck />} /></div>
 <div className="grid lg:grid-cols-2 gap-5 mb-6">
  <section className="bg-white dark:bg-inmo-darkcard rounded-card p-6 border border-gray-100 dark:border-inmo-darktertiary shadow-soft"><h2 className="font-montserrat font-bold text-xl">Tu habilitación</h2><p className="font-inter text-sm mt-4">Validación: {application.data?.value.estado ?? 'Sin expediente'}</p><p className="font-inter text-sm mt-2">Suscripción: {subscription.data?.value.estado ?? 'Sin periodo'}</p><div className="flex flex-wrap gap-3 mt-5"><Link className="text-inmo-accent font-bold text-sm" to="/asesor/profile">Mi perfil</Link><Link className="text-inmo-accent font-bold text-sm" to="/asesor/validacion">Documentación</Link><Link className="text-inmo-accent font-bold text-sm" to="/asesor/suscripcion">Plan y pagos</Link></div></section>
  <section className="bg-white dark:bg-inmo-darkcard rounded-card p-6 border border-gray-100 dark:border-inmo-darktertiary shadow-soft"><h2 className="font-montserrat font-bold text-xl">Actividad de tu portafolio</h2><p className="font-inter text-sm text-gray-500 mt-4">El historial de visitas, conversiones y rankings todavía no está disponible.</p><Button variant="secondary" className="mt-5" onClick={()=>setPanel('portfolio')}>Ver portafolio</Button></section>
 </div>
 <div className="flex justify-between items-center mb-5"><h2 className="font-montserrat font-bold text-xl">Mis propiedades</h2><Link to="/asesor/propiedades" className="text-inmo-accent font-bold text-sm">Gestionar inventario</Link></div>
 {properties.isLoading?<Skeleton className="h-64" />:properties.isError?<p role="alert">No pudimos cargar tu portafolio.</p>:items?.length?<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{items.slice(0,6).map(p=><ConnectedPropertyCard key={p.id} property={p} variant="asesor" onClick={()=>setPanel('portfolio')} />)}</div>:<p role="status">Todavía no tienes propiedades.</p>}
 </ModuleLayout>;
 const side=panel==='notifications'?<div className="space-y-4 p-4">{notifications.isLoading?<Skeleton className="h-40" />:notifications.isError?<p role="alert">No pudimos cargar notificaciones.</p>:notifications.data?.items.length?notifications.data.items.map(n=><Button key={n.id} variant="ghost" className="w-full !justify-start !text-left p-4" disabled={markRead.isPending} onClick={()=>{if(!n.leida_at)markRead.mutate(n.id);}}>{n.tipo.replaceAll('_',' ')} · {new Date(n.creada_at).toLocaleString('es-MX')}{!n.leida_at?' · Nueva':''}</Button>):<p>No tienes notificaciones.</p>}{markRead.isError && <p role="alert">No pudimos marcar la notificación.</p>}</div>
 :<div className="grid gap-5 p-4">{items?.map(p=><ConnectedPropertyCard key={p.id} property={p} variant="asesor" />)}<Link to="/asesor/propiedades" className="text-inmo-accent">Abrir inventario completo</Link></div>;
 return <SplitViewLayout mainContent={main} sideContent={side} isOpen={Boolean(panel)} onClose={()=>setPanel(null)} sideTitle={panel==='notifications'?'Notificaciones':'Portafolio'} />;
}
