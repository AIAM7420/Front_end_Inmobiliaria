import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSystem, saveConfiguration, getEvents, getBackups, requestBackup, downloadBackup, type Configuracion } from '../../integrations/backend/operations.service';
import { isVersionConflict, operationError } from '../../integrations/backend/versioning';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { ConflictNotice } from '../molecules/ConflictNotice';

export function SystemPanel({ view }: { view: 'configuration' | 'diagnostics' | 'audit' | 'backups' }) {
  if (view === 'backups') return <BackupPanel />;
  if (view === 'audit') return <AuditPanel />;
  return <SystemConfiguration editable={view === 'configuration'} />;
}
function SystemConfiguration({ editable }: { editable: boolean }) {
  const query = useQuery({ queryKey: ['system'], queryFn: getSystem });
  return <div className="p-6 space-y-6 font-inter text-sm"><h3 className="font-montserrat font-bold text-xl">{editable ? 'Configuración del portal' : 'Estado de API y servicios'}</h3>
    {query.isPending ? <p>Cargando diagnóstico…</p> : query.isError ? <p role="alert">{operationError(query.error)}</p> : query.data && <><dl className="bg-white dark:bg-inmo-darkcard p-5 rounded-2xl shadow-soft space-y-3">{[['API', query.data.api], ['MySQL', query.data.base_datos], ['Entorno', query.data.entorno], ['Versión', query.data.version], ['Correo', query.data.correo_proveedor], ['Archivos', query.data.archivos_proveedor], ['Pagos', query.data.pagos_proveedor + ' · ' + query.data.pagos_modo]].map(([label, value]) => <div key={label} className="flex justify-between gap-4"><dt className="text-gray-500">{label}</dt><dd className="font-bold">{value}</dd></div>)}</dl><p className="text-xs text-gray-500">Consultado: {new Date(query.data.consultado_at).toLocaleString('es-MX')}. El diagnóstico de API y base de datos se ejecuta al consultar; los proveedores indican la configuración activa.</p>{editable && query.data.configuracion.map(item => <ConfigurationEditor key={item.clave} initial={item} />)}</>}
    <Button variant="secondary" onClick={() => void query.refetch()} isLoading={query.isFetching}>Actualizar diagnóstico</Button>
  </div>;
}
function ConfigurationEditor({ initial }: { initial: Configuracion }) {
  const cache = useQueryClient(), [snapshot, setSnapshot] = useState(initial), [value, setValue] = useState(initial.valor), [conflict, setConflict] = useState(false);
  const save = useMutation({ mutationFn: () => saveConfiguration(snapshot.clave, value, snapshot.version), onSuccess: data => { setSnapshot(data); void cache.invalidateQueries({ queryKey: ['system'] }); void cache.invalidateQueries({ queryKey: ['portal', 'configuration'] }); } });
  return <form className="rounded-2xl bg-white dark:bg-inmo-darkcard p-5 shadow-soft space-y-4" onSubmit={async event => { event.preventDefault(); if (conflict) return; try { await save.mutateAsync(); } catch (error) { if (isVersionConflict(error)) setConflict(true); } }}><label className="block space-y-2"><span className="font-bold">{snapshot.clave === 'nombre_portal' ? 'Nombre del portal' : 'Aviso público'}</span><Input value={value} onChange={event => setValue(event.target.value)} required={snapshot.clave === 'nombre_portal'} maxLength={snapshot.clave === 'nombre_portal' ? 80 : 500} /></label>
    {conflict && <ConflictNotice current={<p>Valor vigente: {snapshot.valor || 'Sin aviso'}</p>} onReview={async () => { const current = (await getSystem()).configuracion.find(item => item.clave === snapshot.clave); if (!current) throw new Error('Configuración no disponible'); setSnapshot(current); }} onAccept={() => { setConflict(false); save.reset(); }} />}
    <Button type="submit" disabled={conflict} isLoading={save.isPending}>Guardar</Button>{save.isSuccess && <p role="status">Configuración guardada.</p>}{save.isError && !conflict && <p role="alert">{operationError(save.error)}</p>}
  </form>;
}
function AuditPanel() {
  const query = useInfiniteQuery({ queryKey: ['system', 'events'], queryFn: ({ pageParam }) => getEvents(pageParam), initialPageParam: undefined as string | undefined, getNextPageParam: page => page.next_cursor ?? undefined });
  return <div className="p-6 space-y-4 font-inter text-sm"><h3 className="font-montserrat font-bold text-xl">Eventos auditados</h3>{query.isPending ? <p>Cargando eventos…</p> : query.isError ? <p role="alert">{operationError(query.error)}</p> : query.data?.pages.flatMap(page => page.items).map(item => <article key={item.id} className="rounded-2xl bg-white dark:bg-inmo-darkcard p-4 shadow-soft"><p className="font-bold">{item.accion.replaceAll('_', ' ')}</p><p className="text-gray-500 mt-2">{item.modulo} · {item.resultado} · {item.entidad} #{item.entidad_id}</p><time className="text-xs text-gray-400">{new Date(item.ocurrida_at).toLocaleString('es-MX')}</time></article>)}{query.data?.pages.every(page => page.items.length === 0) && <p>No hay eventos.</p>}{query.hasNextPage && <Button variant="secondary" isLoading={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>Cargar más eventos</Button>}{query.isFetchNextPageError && <p role="alert">No pudimos cargar la siguiente página.</p>}</div>;
}
function BackupPanel() {
  const cache = useQueryClient(), [password, setPassword] = useState(''), [requestId, setRequestId] = useState(crypto.randomUUID());
  const query = useInfiniteQuery({ queryKey: ['system', 'backups'], queryFn: ({ pageParam }) => getBackups(pageParam), initialPageParam: undefined as string | undefined, getNextPageParam: page => page.next_cursor ?? undefined, refetchInterval: data => data.state.data?.pages.some(page => page.items.some(item => item.estado === 'EN_COLA' || item.estado === 'EN_PROCESO')) ? 5000 : false });
  const create = useMutation({ mutationFn: () => requestBackup(password, requestId), onSuccess: () => { setRequestId(crypto.randomUUID()); void cache.invalidateQueries({ queryKey: ['system', 'backups'] }); } });
  const download = useMutation({ mutationFn: (id: string) => downloadBackup(id, password), onSuccess: result => { const anchor = document.createElement('a'); anchor.href = result.url; anchor.rel = 'noopener'; anchor.download = 'inmo-respaldo.json.gz'; anchor.click(); } });
  return <div className="p-6 space-y-5 font-inter text-sm"><h3 className="font-montserrat font-bold text-xl">Respaldos privados</h3><p className="text-gray-500">Respaldo lógico consistente de MySQL, comprimido, con manifiesto de archivos externos. Las fotografías y documentos externos requieren respaldo independiente. La recuperación se verifica exclusivamente en una base aislada.</p><form className="space-y-4" onSubmit={event => { event.preventDefault(); create.mutate(); }}><Input aria-label="Contraseña para respaldos" type="password" autoComplete="current-password" placeholder="Confirma tu contraseña" value={password} onChange={event => setPassword(event.target.value)} required maxLength={128} /><Button type="submit" isLoading={create.isPending} disabled={!password}>Crear respaldo</Button></form>
    {create.isSuccess && <p role="status">Trabajo de respaldo registrado.</p>}{(create.isError || download.isError) && <p role="alert">{operationError(create.error ?? download.error)}</p>}
    {query.isPending ? <p>Cargando respaldos…</p> : query.isError ? <p role="alert">{operationError(query.error)}</p> : query.data?.pages.flatMap(page => page.items).map(item => <article key={item.id} className="rounded-2xl bg-white dark:bg-inmo-darkcard shadow-soft p-5 space-y-3"><p className="font-bold">{new Date(item.creada_at).toLocaleString('es-MX')}</p><p className="text-gray-500">{item.estado.replaceAll('_', ' ')} · Intentos {item.intentos}</p>{item.error_codigo && <p className="text-inmo-danger">{item.error_codigo.replaceAll('_', ' ')}</p>}{item.estado === 'LISTO' && <Button variant="secondary" disabled={!password || download.isPending} onClick={() => download.mutate(item.id)}>Descargar con enlace temporal</Button>}</article>)}
    {query.data?.pages.every(page => page.items.length === 0) && <p>No se han solicitado respaldos.</p>}{query.hasNextPage && <Button variant="secondary" isLoading={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>Cargar más respaldos</Button>}{query.isFetchNextPageError && <p role="alert">No pudimos cargar la siguiente página.</p>}
    <Button variant="ghost" onClick={() => void query.refetch()}>Actualizar estado</Button>
  </div>;
}
