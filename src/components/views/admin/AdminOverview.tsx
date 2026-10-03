import { Users,Building2,ShieldAlert,UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAdminAccounts,useGetAdminProperties,useGetAdminReports } from '../../../integrations/backend/hooks/useAdministration';
import { useGetAdminApplications } from '../../../integrations/backend/hooks/useAdvisors';
import { ModuleLayout } from '../../templates/ModuleLayout';
import { MetricCard } from '../../molecules/MetricCard';
import { Skeleton } from '../../atoms/Skeleton';
export function AdminOverview() {
 const accounts=useGetAdminAccounts({limit:20}),properties=useGetAdminProperties({limit:20}),reports=useGetAdminReports({limit:20,estado:'PENDIENTE'}),applications=useGetAdminApplications({limit:20});
 const links=[['/admin/asesores','Cuentas'],['/admin/solicitudes','Solicitudes'],['/admin/moderacion','Publicaciones'],['/admin/reportes','Reportes'],['/admin/finanzas','Finanzas y auditoría']];
 return <ModuleLayout title="Administración" subtitle="Actividad y gestión de Excelencia Inmobiliaria" isFullScreen showSearch={false} showFilters={false}>
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6"><MetricCard label="Cuentas en esta página" value={accounts.data?.items.length} icon={<Users />} /><MetricCard label="Publicaciones en esta página" value={properties.data?.items.length} icon={<Building2 />} /><MetricCard label="Reportes pendientes cargados" value={reports.data?.items.length} icon={<ShieldAlert />} /><MetricCard label="Solicitudes cargadas" value={applications.data?.items.length} icon={<UserCheck />} /></div>
  <nav className="flex flex-wrap gap-3 mb-6">{links.map(([to,label])=><Link key={to} to={to} className="rounded-full bg-white dark:bg-inmo-darkcard shadow-soft px-5 py-3 font-bold text-sm">{label}</Link>)}</nav>
  <div className="grid lg:grid-cols-2 gap-5"><section className="bg-white dark:bg-inmo-darkcard rounded-card p-6 shadow-soft"><h2 className="font-montserrat font-bold text-xl mb-4">Cuentas</h2>{accounts.isLoading?<Skeleton className="h-40" />:accounts.isError?<p role="alert">No pudimos cargar cuentas.</p>:accounts.data?.items.length?accounts.data.items.slice(0,6).map(a=><div key={a.id} className="border-t border-gray-100 dark:border-inmo-darktertiary py-4 flex justify-between gap-3"><div><p className="font-bold text-sm">{a.nombre}</p><p className="text-xs text-gray-500">{a.rol}</p></div><span className="text-xs text-gray-500">{a.estado}</span></div>):<p>No hay cuentas.</p>}</section>
  <section className="bg-white dark:bg-inmo-darkcard rounded-card p-6 shadow-soft"><h2 className="font-montserrat font-bold text-xl mb-4">Reportes pendientes</h2>{reports.isLoading?<Skeleton className="h-40" />:reports.isError?<p role="alert">No pudimos cargar reportes.</p>:reports.data?.items.length?reports.data.items.slice(0,6).map(r=><Link key={r.id} to="/admin/reportes" className="block border-t border-gray-100 dark:border-inmo-darktertiary py-4 text-sm">{r.categoria} · {r.tipo_objetivo} #{r.objetivo_id}</Link>):<p>No hay reportes pendientes.</p>}</section></div>
  <div className="rounded-card bg-white dark:bg-inmo-darkcard p-6 shadow-soft mt-6"><h2 className="font-montserrat font-bold text-xl">Tráfico y conversiones</h2><p className="font-inter text-sm text-gray-500 mt-3">Estas métricas históricas todavía no están disponibles. Los contadores anteriores corresponden a la página cargada.</p></div>
 </ModuleLayout>;
}
