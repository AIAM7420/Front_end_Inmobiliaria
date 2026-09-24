import { ShieldAlert, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAdminAccounts, useGetAdminReports } from '../../../integrations/backend/hooks/useAdministration';
import { Skeleton } from '../../atoms/Skeleton';

export function AdminOverview() {
  const accounts = useGetAdminAccounts({ limit: 20 });
  const reports = useGetAdminReports({ limit: 20, estado: 'PENDIENTE' });

  return (
    <div className="h-full w-full overflow-y-auto pt-[100px] pb-24 px-4 md:px-6 animate-in fade-in">
      <header className="px-2 mb-6">
        <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-inmo-secondary dark:text-white">Administración</h1>
        <p className="font-inter text-sm text-gray-500 dark:text-gray-400">Cuentas y reportes pendientes obtenidos de la API.</p>
      </header>

      <nav aria-label="Operaciones administrativas" className="flex flex-wrap gap-3 mb-6 px-2 font-inter text-sm">
        {[
          ['/admin/solicitudes', 'Revisar solicitudes'],
          ['/admin/cuentas', 'Gestionar cuentas'],
          ['/admin/propiedades', 'Moderar publicaciones'],
          ['/admin/reportes', 'Resolver reportes'],
          ['/admin/finanzas', 'Ver suscripciones y auditoría'],
        ].map(([path, label]) => <Link key={path} to={path} className="rounded-xl bg-white dark:bg-inmo-darkcard px-4 py-3 shadow-soft text-inmo-accent hover:underline">{label}</Link>)}
      </nav>

      <p className="font-inter text-xs text-gray-500 mb-3 px-2">Los indicadores muestran sólo los elementos de esta página, no totales globales.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
        <section className="bg-white dark:bg-inmo-darkcard rounded-3xl p-5 shadow-soft min-h-[120px]">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Users className="w-5 h-5" /><h2 className="font-inter text-sm">Cuentas en esta página</h2></div>
          {accounts.isLoading ? <Skeleton className="h-9 w-20 mt-4" variant="text" /> : accounts.isError
            ? <p role="alert" className="font-inter text-sm text-gray-500 mt-4">No se pudieron cargar las cuentas.</p>
            : <p className="font-montserrat font-bold text-3xl text-inmo-secondary dark:text-white mt-3">{accounts.data?.items.length ?? 0}</p>}
        </section>
        <section className="bg-white dark:bg-inmo-darkcard rounded-3xl p-5 shadow-soft min-h-[120px]">
          <div className="flex items-center gap-2 text-inmo-accent"><ShieldAlert className="w-5 h-5" /><h2 className="font-inter text-sm">Reportes pendientes en esta página</h2></div>
          {reports.isLoading ? <Skeleton className="h-9 w-20 mt-4" variant="text" /> : reports.isError
            ? <p role="alert" className="font-inter text-sm text-gray-500 mt-4">No se pudieron cargar los reportes.</p>
            : <p className="font-montserrat font-bold text-3xl text-inmo-secondary dark:text-white mt-3">{reports.data?.items.length ?? 0}</p>}
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white dark:bg-inmo-darkcard rounded-3xl p-5 shadow-soft">
          <h2 className="font-montserrat font-bold text-inmo-secondary dark:text-white mb-4">Cuentas recientes</h2>
          {accounts.isLoading ? <div className="space-y-3"><Skeleton className="h-14" /><Skeleton className="h-14" /></div>
            : accounts.isError ? <p role="alert" className="font-inter text-sm text-gray-500">Inténtalo de nuevo más tarde.</p>
            : accounts.data?.items.length ? accounts.data.items.map((account) => (
              <div key={account.id} className="py-3 border-b border-gray-100 dark:border-inmo-darktertiary flex items-center justify-between gap-3">
                <div className="min-w-0"><p className="font-inter font-semibold text-sm text-inmo-secondary dark:text-white truncate">{account.nombre}</p><p className="font-inter text-xs text-gray-500 truncate">{account.correo}</p></div>
                <span className="font-inter text-xs text-gray-500 shrink-0">{account.estado}</span>
              </div>
            )) : <p className="font-inter text-sm text-gray-500">No hay cuentas en esta página.</p>}
          {accounts.data?.next_cursor && <p className="font-inter text-xs text-gray-500 mt-3">Hay más cuentas disponibles.</p>}
        </section>

        <section className="bg-white dark:bg-inmo-darkcard rounded-3xl p-5 shadow-soft">
          <h2 className="font-montserrat font-bold text-inmo-secondary dark:text-white mb-4">Reportes pendientes</h2>
          {reports.isLoading ? <div className="space-y-3"><Skeleton className="h-14" /><Skeleton className="h-14" /></div>
            : reports.isError ? <p role="alert" className="font-inter text-sm text-gray-500">Inténtalo de nuevo más tarde.</p>
            : reports.data?.items.length ? reports.data.items.map((report) => (
              <div key={report.id} className="py-3 border-b border-gray-100 dark:border-inmo-darktertiary flex items-center justify-between gap-3">
                <div className="min-w-0"><p className="font-inter font-semibold text-sm text-inmo-secondary dark:text-white">{report.categoria.replaceAll('_', ' ')}</p><p className="font-inter text-xs text-gray-500">Objetivo: {report.tipo_objetivo}</p></div>
                <span className="font-inter text-xs text-gray-500 shrink-0">#{report.id}</span>
              </div>
            )) : <p className="font-inter text-sm text-gray-500">No hay reportes pendientes.</p>}
          {reports.data?.next_cursor && <p className="font-inter text-xs text-gray-500 mt-3">Hay más reportes disponibles.</p>}
        </section>
      </div>
      <p className="font-inter text-xs text-gray-500 mt-6 px-2">La API V1 no ofrece ingresos agregados ni tráfico semanal; no se muestran estimaciones.</p>
    </div>
  );
}
