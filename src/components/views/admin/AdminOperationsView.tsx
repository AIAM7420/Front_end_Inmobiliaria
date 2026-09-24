import { useState } from 'react';
import { useGetAdminApplication, useGetAdminApplications, useDecideAdvisorApplication, useAdminDocumentUrl } from '../../../integrations/backend/hooks/useAdvisors';
import {
  useChangeAdminAccountState, useGetAdminAccount, useGetAdminAccounts, useGetAdminAudit,
  useGetAdminProperties, useGetAdminProperty, useGetAdminReports, useGetAdminSubscriptions,
  useModerateAdminProperty, useResolveAdminReport,
} from '../../../integrations/backend/hooks/useAdministration';
import { problemFromError } from '../../../integrations/backend/axios.config';
import { Button } from '../../atoms/Button';
import { Skeleton } from '../../atoms/Skeleton';

const surface = 'rounded-card bg-white dark:bg-inmo-darkcard p-5 md:p-6 shadow-soft';
const control = 'w-full rounded-xl border border-inmo-tertiary dark:border-inmo-darktertiary bg-white dark:bg-inmo-darkcard p-3 font-inter text-sm text-inmo-secondary dark:text-white';

function AdminPage({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-7xl px-4 md:px-6 pt-28 pb-32 text-inmo-secondary dark:text-white">
    <h1 className="font-montserrat text-3xl font-bold">{title}</h1>
    <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mt-2 mb-7">{subtitle}</p>
    {children}
  </main>;
}

function Failure({ error }: { error: unknown }) {
  if (!error) return null;
  return <p role="alert" className="font-inter text-sm text-inmo-danger mt-4">
    {problemFromError(error)?.detail ?? (error instanceof Error ? error.message : 'No se pudo completar la operación.')}
  </p>;
}

export function AdminApplicationsView() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [selectedId, setSelectedId] = useState('');
  const [reason, setReason] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [notice, setNotice] = useState('');
  const list = useGetAdminApplications({ limit: 20, cursor });
  const detail = useGetAdminApplication(selectedId);
  const decide = useDecideAdvisorApplication();
  const getUrl = useAdminDocumentUrl();

  async function decision(action: 'APROBAR' | 'RECHAZAR') {
    if (!detail.data || (action === 'RECHAZAR' && !reason.trim()) ||
        !window.confirm(`¿Confirmas ${action.toLowerCase()} esta solicitud?`)) return;
    try {
      await decide.mutateAsync({ id: selectedId, decision: action, motivo: reason.trim() || null, etag: detail.data.etag });
      setNotice(`Solicitud ${action.toLowerCase()} correctamente.`);
    } catch { /* shown below */ }
  }

  return <AdminPage title="Solicitudes de asesores" subtitle="Revisa evidencia privada antes de decidir; una aprobación no concede por sí sola un periodo pagado.">
    <div className="grid lg:grid-cols-2 gap-5">
      <section className={surface}><h2 className="font-montserrat font-bold mb-4">Expedientes</h2>
        {list.isLoading ? <Skeleton className="h-40" /> : list.isError ? <p role="alert">No pudimos cargar solicitudes.</p>
          : list.data?.items.length ? list.data.items.map((item) => <Button key={item.id} variant="ghost"
            className="w-full !justify-start !text-left p-3 mb-2" onClick={() => { setSelectedId(item.id); setDocumentUrl(''); }}>
            Solicitud #{item.id} · {item.estado} · {item.documentos.length} documentos
          </Button>) : <p className="font-inter text-sm text-gray-500">No hay solicitudes.</p>}
        {list.data?.next_cursor && <Button variant="secondary" className="px-4 py-2 mt-3" onClick={() => setCursor(list.data?.next_cursor ?? undefined)}>Página siguiente</Button>}
      </section>
      <section className={surface}>{!selectedId ? <p className="font-inter text-sm text-gray-500">Selecciona una solicitud.</p>
        : detail.isLoading ? <Skeleton className="h-44" /> : detail.isError ? <p role="alert">No pudimos cargar el expediente.</p>
          : detail.data && <div className="font-inter text-sm space-y-4">
            <h2 className="font-montserrat font-bold text-xl">Solicitud #{selectedId} · {detail.data.value.estado}</h2>
            <p>Asesor #{detail.data.value.asesor_id}</p>
            <ul className="space-y-2">{detail.data.value.documentos.map((document) => <li key={document.id} className="border-b border-inmo-tertiary dark:border-inmo-darktertiary pb-2">
              {document.nombre} · {document.estado}
              <Button variant="text" className="mt-1" onClick={async () => {
                try { const result = await getUrl.mutateAsync(document.id); setDocumentUrl(result.url); }
                catch { /* shown below */ }
              }}>Solicitar enlace privado</Button>
            </li>)}</ul>
            {documentUrl && <a className="text-inmo-accent underline" href={documentUrl} target="_blank" rel="noopener noreferrer">Abrir documento temporal</a>}
            {detail.data.value.estado === 'PENDIENTE' && <>
              <textarea className={`${control} min-h-20`} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motivo de rechazo o nota de decisión" />
              <div className="flex flex-wrap gap-2"><Button className="px-4 py-2" isLoading={decide.isPending} onClick={() => { void decision('APROBAR'); }}>Aprobar</Button>
                <Button variant="secondary" className="px-4 py-2" disabled={!reason.trim()} onClick={() => { void decision('RECHAZAR'); }}>Rechazar</Button></div>
            </>}
          </div>}
      </section>
    </div>
    {notice && <p role="status" className="font-inter text-sm text-inmo-success mt-4">{notice}</p>}
    <Failure error={decide.error ?? getUrl.error} />
  </AdminPage>;
}

export function AdminAccountsView() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [selectedId, setSelectedId] = useState('');
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState('');
  const list = useGetAdminAccounts({ limit: 20, cursor });
  const detail = useGetAdminAccount(selectedId);
  const change = useChangeAdminAccountState();
  return <AdminPage title="Cuentas" subtitle="Los cambios de estado revocan sesiones y quedan auditados.">
    <div className="grid lg:grid-cols-2 gap-5"><section className={surface}>
      {list.isLoading ? <Skeleton className="h-40" /> : list.isError ? <p role="alert">No pudimos cargar cuentas.</p>
        : list.data?.items.map((account) => <Button key={account.id} variant="ghost" className="w-full !justify-start !text-left p-3 mb-2"
          onClick={() => setSelectedId(account.id)}>{account.nombre} · {account.rol} · {account.estado}</Button>)}
      {list.data?.next_cursor && <Button variant="secondary" className="px-4 py-2 mt-3" onClick={() => setCursor(list.data?.next_cursor ?? undefined)}>Página siguiente</Button>}
    </section><section className={surface}>
      {!selectedId ? <p className="font-inter text-sm text-gray-500">Selecciona una cuenta.</p> : detail.isLoading ? <Skeleton className="h-28" />
        : detail.isError ? <p role="alert">No pudimos cargar la cuenta.</p>
          : detail.data && <div className="font-inter text-sm space-y-3">
            <h2 className="font-montserrat font-bold text-xl">{detail.data.value.nombre}</h2>
            <p>{detail.data.value.correo} · {detail.data.value.rol} · {detail.data.value.estado}</p>
            <textarea className={control} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motivo obligatorio" />
            <Button className="px-4 py-2" disabled={!reason.trim()} isLoading={change.isPending} onClick={async () => {
              if (!detail.data || !window.confirm('¿Confirmas el cambio de estado de esta cuenta?')) return;
              try {
                await change.mutateAsync({ id: selectedId, accion: detail.data.value.estado === 'ACTIVA' ? 'INACTIVAR' : 'ACTIVAR', motivo: reason.trim(), etag: detail.data.etag });
                setNotice('Estado de cuenta actualizado.'); setReason('');
              } catch { /* shown below */ }
            }}>{detail.data.value.estado === 'ACTIVA' ? 'Inactivar cuenta' : 'Activar cuenta'}</Button>
          </div>}
    </section></div>
    {notice && <p role="status" className="font-inter text-sm text-inmo-success mt-4">{notice}</p>}
    <Failure error={change.error} />
  </AdminPage>;
}

export function AdminPropertiesView() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [state, setState] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState('');
  const list = useGetAdminProperties({ limit: 20, cursor, ...(state ? { estado: state } : {}) });
  const detail = useGetAdminProperty(selectedId);
  const moderate = useModerateAdminProperty();
  return <AdminPage title="Publicaciones" subtitle="Bandeja privada. Pausar o archivar exige motivo y versión vigente.">
    <label className="font-inter text-sm">Filtrar estado<select className={`${control} max-w-xs mb-5 block`} value={state} onChange={(event) => { setState(event.target.value); setCursor(undefined); }}>
      <option value="">Todos</option>{['REGISTRADA', 'PUBLICADA', 'EN_REVISION', 'PAUSADA', 'ARCHIVADA'].map((value) => <option key={value}>{value}</option>)}
    </select></label>
    <div className="grid lg:grid-cols-2 gap-5"><section className={surface}>
      {list.isLoading ? <Skeleton className="h-40" /> : list.isError ? <p role="alert">No pudimos cargar publicaciones.</p>
        : list.data?.items.length ? list.data.items.map((property) => <Button key={property.id} variant="ghost" className="w-full !justify-start !text-left p-3 mb-2"
          onClick={() => setSelectedId(property.id)}>#{property.id} · {property.titulo} · {property.estado_publicacion}</Button>)
          : <p className="font-inter text-sm text-gray-500">No hay propiedades con este estado.</p>}
      {list.data?.next_cursor && <Button variant="secondary" className="px-4 py-2 mt-3" onClick={() => setCursor(list.data?.next_cursor ?? undefined)}>Página siguiente</Button>}
    </section><section className={surface}>
      {!selectedId ? <p className="font-inter text-sm text-gray-500">Selecciona una propiedad.</p> : detail.isLoading ? <Skeleton className="h-28" />
        : detail.isError ? <p role="alert">No pudimos cargar la ficha.</p>
          : detail.data && <div className="font-inter text-sm space-y-3">
            <h2 className="font-montserrat font-bold text-xl">{detail.data.value.titulo}</h2>
            <p>#{selectedId} · {detail.data.value.estado_publicacion} · Asesor #{detail.data.value.asesor_id}</p>
            <p>{detail.data.value.descripcion}</p>
            <textarea className={control} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motivo obligatorio de moderación" />
            <div className="flex gap-2">{(['PAUSAR', 'ARCHIVAR'] as const).map((action) => <Button key={action} variant={action === 'PAUSAR' ? 'secondary' : 'accent'}
              className="px-4 py-2" disabled={!reason.trim()} isLoading={moderate.isPending} onClick={async () => {
                if (!detail.data || !window.confirm(`¿Confirmas ${action.toLowerCase()} la propiedad?`)) return;
                try { await moderate.mutateAsync({ id: selectedId, accion: action, motivo: reason.trim(), etag: detail.data.etag }); setNotice('Moderación aplicada y auditada.'); setReason(''); }
                catch { /* shown below */ }
              }}>{action === 'PAUSAR' ? 'Pausar' : 'Archivar'}</Button>)}</div>
          </div>}
    </section></div>
    {notice && <p role="status" className="font-inter text-sm text-inmo-success mt-4">{notice}</p>}
    <Failure error={moderate.error} />
  </AdminPage>;
}

export function AdminReportsView() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [state, setState] = useState('PENDIENTE');
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState('');
  const reports = useGetAdminReports({ limit: 20, cursor, estado: state || undefined });
  const resolve = useResolveAdminReport();
  return <AdminPage title="Reportes" subtitle="Cada resolución se confirma con el objetivo y la auditoría en una sola transacción.">
    <label className="font-inter text-sm">Estado<select className={`${control} max-w-xs mb-5 block`} value={state} onChange={(event) => { setState(event.target.value); setCursor(undefined); }}>
      <option value="">Todos</option>{['PENDIENTE', 'EN_REVISION', 'CERRADO'].map((value) => <option key={value}>{value}</option>)}
    </select></label>
    {reports.isLoading ? <Skeleton className="h-40" /> : reports.isError ? <p role="alert">No pudimos cargar reportes.</p>
      : reports.data?.items.length ? <div className="grid md:grid-cols-2 gap-4">{reports.data.items.map((report) => <section key={report.id} className={surface}>
        <h2 className="font-montserrat font-bold">#{report.id} · {report.categoria.replaceAll('_', ' ')}</h2>
        <p className="font-inter text-sm mt-2">{report.tipo_objetivo} #{report.objetivo_id} · {report.estado}</p>
        <p className="font-inter text-sm mt-2">{report.motivo}</p>
        {report.estado !== 'CERRADO' && <><textarea className={`${control} mt-4`} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motivo de la resolución" />
          <div className="flex flex-wrap gap-2 mt-3">{([
            'DESCARTAR',
            ...(report.tipo_objetivo === 'PROPIEDAD' ? ['PAUSAR_PROPIEDAD'] : []),
            ...(report.tipo_objetivo === 'CUENTA' ? ['DESACTIVAR_CUENTA'] : []),
            ...(report.tipo_objetivo === 'MENSAJE' ? ['OCULTAR_MENSAJE'] : []),
          ] as Array<'DESCARTAR' | 'PAUSAR_PROPIEDAD' | 'DESACTIVAR_CUENTA' | 'OCULTAR_MENSAJE'>).map((action) => <Button key={action} className="px-3 py-2" variant="secondary" disabled={!reason.trim()}
            isLoading={resolve.isPending} onClick={async () => {
              if (!window.confirm(`¿Confirmas ${action.replaceAll('_', ' ').toLowerCase()}?`)) return;
              try { await resolve.mutateAsync({ id: report.id, accion: action, motivo: reason.trim() }); setNotice('Reporte resuelto.'); setReason(''); }
              catch { /* shown below */ }
            }}>{action.replaceAll('_', ' ')}</Button>)}</div></>}
      </section>)}</div> : <p className={`${surface} font-inter text-sm text-gray-500`}>No hay reportes con este estado.</p>}
    {reports.data?.next_cursor && <Button variant="secondary" className="px-4 py-2 mt-4" onClick={() => setCursor(reports.data?.next_cursor ?? undefined)}>Página siguiente</Button>}
    {notice && <p role="status" className="font-inter text-sm text-inmo-success mt-4">{notice}</p>}
    <Failure error={resolve.error} />
  </AdminPage>;
}

export function AdminFinanceView() {
  const [subscriptionCursor, setSubscriptionCursor] = useState<string | undefined>();
  const [auditCursor, setAuditCursor] = useState<string | undefined>();
  const subscriptions = useGetAdminSubscriptions({ limit: 20, cursor: subscriptionCursor });
  const audit = useGetAdminAudit({ limit: 20, cursor: auditCursor });
  return <AdminPage title="Suscripciones y auditoría" subtitle="Consulta paginada de estados efectivos y acciones registradas; no se editan pagos desde administración.">
    <div className="grid lg:grid-cols-2 gap-5"><section className={surface}>
      <h2 className="font-montserrat font-bold mb-4">Suscripciones</h2>
      {subscriptions.isLoading ? <Skeleton className="h-32" /> : subscriptions.isError ? <p role="alert">No pudimos cargar suscripciones.</p>
        : subscriptions.data?.items.length ? subscriptions.data.items.map((item) => <p key={item.asesor_id} className="font-inter text-sm py-2 border-b border-inmo-tertiary dark:border-inmo-darktertiary">Asesor #{item.asesor_id} · {item.estado} · Cupo {item.propiedades_en_cupo}/{item.limite_propiedades}</p>)
          : <p className="font-inter text-sm text-gray-500">Sin suscripciones.</p>}
      {subscriptions.data?.next_cursor && <Button variant="secondary" className="px-4 py-2 mt-3" onClick={() => setSubscriptionCursor(subscriptions.data?.next_cursor ?? undefined)}>Página siguiente</Button>}
    </section><section className={surface}>
      <h2 className="font-montserrat font-bold mb-4">Auditoría</h2>
      {audit.isLoading ? <Skeleton className="h-32" /> : audit.isError ? <p role="alert">No pudimos cargar auditoría.</p>
        : audit.data?.items.length ? audit.data.items.map((item) => <p key={item.id} className="font-inter text-sm py-2 border-b border-inmo-tertiary dark:border-inmo-darktertiary">{item.modulo} · {item.accion} · {item.resultado} · {new Date(item.fecha).toLocaleString('es-MX')}</p>)
          : <p className="font-inter text-sm text-gray-500">Sin eventos.</p>}
      {audit.data?.next_cursor && <Button variant="secondary" className="px-4 py-2 mt-3" onClick={() => setAuditCursor(audit.data?.next_cursor ?? undefined)}>Página siguiente</Button>}
    </section></div>
  </AdminPage>;
}
