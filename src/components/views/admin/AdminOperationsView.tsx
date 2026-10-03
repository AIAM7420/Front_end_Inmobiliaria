import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ModuleLayout } from '../../templates/ModuleLayout';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { useGetAdminApplication,useGetAdminApplications,useDecideAdvisorApplication,useAdminDocumentUrl } from '../../../integrations/backend/hooks/useAdvisors';
import { useChangeAdminAccountState,useGetAdminAccount,useGetAdminAccounts,useGetAdminAudit,useGetAdminProperties,useGetAdminProperty,useGetAdminReport,useGetAdminReports,useGetAdminSubscriptions,useModerateAdminProperty,useResolveAdminReport } from '../../../integrations/backend/hooks/useAdministration';
import { operationError,isVersionConflict } from '../../../integrations/backend/versioning';
import { Button } from '../../atoms/Button';
import { Textarea } from '../../atoms/Textarea';
import { Select } from '../../atoms/Select';
import { Skeleton } from '../../atoms/Skeleton';
import { ConflictNotice } from '../../molecules/ConflictNotice';
const surface='rounded-card bg-white dark:bg-inmo-darkcard shadow-soft p-5 space-y-4';
function Workspace({title,subtitle,list,detail,selected,onClose,tabs}:{title:string;subtitle:string;list:React.ReactNode;detail:React.ReactNode;selected:boolean;onClose:()=>void;tabs?:React.ReactNode}) {
 return <SplitViewLayout mainContent={<ModuleLayout title={title} subtitle={subtitle} isFullScreen showSearch={false} showFilters={false}>{tabs}{list}</ModuleLayout>} sideContent={<div className="overflow-y-auto h-full p-5 space-y-4">{detail}</div>} isOpen={selected} onClose={onClose} sideTitle={title} sidePosition="right" desktopNoPadding />;
}
function Pagination({next,onNext,onFirst}:{next?:string|null;onNext:(cursor:string)=>void;onFirst:()=>void}) {
 return <div className="flex gap-3 mt-5">{next && <Button variant="secondary" onClick={()=>onNext(next)}>Página siguiente</Button>}<Button variant="text" onClick={onFirst}>Primera página</Button></div>;
}
function Failure({error}:{error:unknown}) {return error?<p role="alert" className="text-sm text-inmo-danger">{operationError(error)}</p>:null;}
function UserTabs() {return <nav aria-label="Administración de usuarios" className="flex flex-wrap gap-3 mb-6"><Link className="rounded-full bg-white dark:bg-inmo-darkcard px-5 py-3 shadow-soft" to="/admin/asesores">Cuentas</Link><Link className="rounded-full bg-white dark:bg-inmo-darkcard px-5 py-3 shadow-soft" to="/admin/solicitudes">Solicitudes</Link></nav>;}
function useConflictReview() {
 const [conflict,setConflict]=useState(false);
 const [reviewed,setReviewed]=useState(false);
 return {conflict,setConflict,reviewed,setReviewed,failed:(error:unknown)=>{if(isVersionConflict(error)){setConflict(true);setReviewed(false);}}};
}
export function AdminApplicationsView() {
 const [cursor,setCursor]=useState<string|undefined>(),[id,setId]=useState(''),[reason,setReason]=useState(''),[url,setUrl]=useState('');
 const list=useGetAdminApplications({limit:20,cursor}),detail=useGetAdminApplication(id),decide=useDecideAdvisorApplication(),getUrl=useAdminDocumentUrl(),review=useConflictReview();
 async function decision(action:'APROBAR'|'RECHAZAR') {
  if(!detail.data || review.conflict || !window.confirm('¿Confirmas la decisión sobre esta solicitud?'))return;
  try{await decide.mutateAsync({id,decision:action,motivo:reason.trim() || null,etag:detail.data.etag});setReason('');}catch(error){review.failed(error);}
 }
 const listing=<>{list.isLoading?<Skeleton className="h-64" />:list.isError?<p role="alert">No pudimos cargar solicitudes.</p>:<div className={surface}>{!list.data?.items.length && <p>No hay solicitudes.</p>}{list.data?.items.map(item=><Button variant="ghost" className="w-full !justify-start p-4 border-b border-gray-100 dark:border-inmo-darktertiary" key={item.id} onClick={()=>{setId(item.id);setUrl('');setReason('');review.setConflict(false);decide.reset();}}>Solicitud #{item.id} · {item.estado} · {item.documentos.length} documentos</Button>)}</div>}<Pagination next={list.data?.next_cursor} onNext={setCursor} onFirst={()=>setCursor(undefined)} /></>;
 const content=detail.isLoading?<Skeleton className="h-40" />:detail.isError?<p role="alert">No pudimos cargar el expediente.</p>:detail.data && <div className={surface}>
  <h2 className="font-montserrat font-bold text-xl">Solicitud #{id} · {detail.data.value.estado}</h2><p>Asesor #{detail.data.value.asesor_id}</p>
  {detail.data.value.documentos.map(doc=><div key={doc.id} className="border-b border-gray-100 dark:border-inmo-darktertiary pb-4"><p>{doc.nombre} · {doc.estado}</p><Button variant="text" onClick={async()=>{try{setUrl((await getUrl.mutateAsync(doc.id)).url);}catch{/* Failure below */}}}>Solicitar enlace privado</Button></div>)}
  {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-inmo-accent underline">Abrir documento temporal</a>}
  {detail.data.value.estado==='PENDIENTE' && <><Textarea aria-label="Motivo de decisión" value={reason} onChange={event=>setReason(event.target.value)} /><div className="flex gap-3"><Button disabled={review.conflict || decide.isPending} isLoading={decide.isPending} onClick={()=>{void decision('APROBAR');}}>Aprobar</Button><Button variant="secondary" disabled={!reason.trim() || review.conflict || decide.isPending} onClick={()=>{void decision('RECHAZAR');}}>Rechazar</Button></div></>}
  {review.conflict && <ConflictNotice current={<p>Estado consultado: {detail.data.value.estado} · versión {detail.data.value.version}</p>} onReview={async()=>{const result=await detail.refetch();if(result.isError)throw result.error;}} onAccept={()=>{review.setConflict(false);decide.reset();}} />}
  {!review.conflict && <Failure error={decide.error ?? getUrl.error} />}{decide.isSuccess && <p role="status">Decisión aplicada y auditada.</p>}
 </div>;
 return <Workspace title="Solicitudes de asesores" subtitle="Revisa la evidencia privada antes de decidir." tabs={<UserTabs />} list={listing} detail={content} selected={Boolean(id)} onClose={()=>setId('')} />;
}
export function AdminAccountsView() {
 const [cursor,setCursor]=useState<string|undefined>(),[id,setId]=useState(''),[reason,setReason]=useState(''),[search,setSearch]=useState('');
 const list=useGetAdminAccounts({limit:20,cursor}),detail=useGetAdminAccount(id),change=useChangeAdminAccountState(),review=useConflictReview();
 const listing=<><div className={surface}><label htmlFor="account-search">Buscar en la página cargada</label><InputSearch id="account-search" value={search} onChange={setSearch} />
 {list.isLoading?<Skeleton className="h-40" />:list.isError?<p role="alert">No pudimos cargar cuentas.</p>:<div className="overflow-x-auto"><table className="w-full text-left font-inter text-sm"><thead><tr><th className="py-4">Nombre</th><th>Rol</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{list.data?.items.filter(a=>(a.nombre+' '+a.correo).toLowerCase().includes(search.toLowerCase())).map(a=><tr key={a.id} className="border-t border-gray-100 dark:border-inmo-darktertiary"><td className="py-4">{a.nombre}<span className="block text-xs text-gray-500">{a.correo}</span></td><td>{a.rol}</td><td>{a.estado}</td><td><Button variant="text" onClick={()=>{setId(a.id);setReason('');review.setConflict(false);change.reset();}}>Ver cuenta</Button></td></tr>)}</tbody></table>{!list.data?.items.length && <p>No hay cuentas.</p>}</div>}</div>
 <Pagination next={list.data?.next_cursor} onNext={setCursor} onFirst={()=>setCursor(undefined)} /></>;
 const content=detail.isLoading?<Skeleton className="h-40" />:detail.isError?<p role="alert">No pudimos cargar la cuenta.</p>:detail.data && <div className={surface}>
  <h2 className="font-montserrat font-bold text-xl">{detail.data.value.nombre}</h2><p>{detail.data.value.correo}</p><p>{detail.data.value.rol} · {detail.data.value.estado}</p>
  <Textarea aria-label="Motivo del cambio de cuenta" value={reason} onChange={event=>setReason(event.target.value)} placeholder="Motivo obligatorio" />
  <Button disabled={!reason.trim() || review.conflict || change.isPending} isLoading={change.isPending} onClick={async()=>{
    if(!detail.data || !window.confirm('¿Confirmas el cambio de estado de la cuenta?'))return;
    try{await change.mutateAsync({id,accion:detail.data.value.estado==='ACTIVA'?'INACTIVAR':'ACTIVAR',motivo:reason.trim(),etag:detail.data.etag});setReason('');}catch(error){review.failed(error);}
  }}>{detail.data.value.estado==='ACTIVA'?'Inactivar cuenta':'Activar cuenta'}</Button>
  {review.conflict && <ConflictNotice current={<p>Estado consultado: {detail.data.value.estado} · versión {detail.data.value.version}</p>} onReview={async()=>{const result=await detail.refetch();if(result.isError)throw result.error;}} onAccept={()=>{review.setConflict(false);change.reset();}} />}
  {!review.conflict && <Failure error={change.error} />}{change.isSuccess && <p role="status">Estado actualizado y auditado.</p>}
 </div>;
 return <Workspace title="Usuarios" subtitle="Gestiona cuentas y solicitudes; los cambios de estado revocan sesiones." tabs={<UserTabs />} list={listing} detail={content} selected={Boolean(id)} onClose={()=>setId('')} />;
}
import { Input } from '../../atoms/Input';
function InputSearch({id,value,onChange}:{id:string;value:string;onChange:(v:string)=>void}) {return <Input id={id} value={value} onChange={event=>onChange(event.target.value)} />;}
export function AdminPropertiesView() {
 const [cursor,setCursor]=useState<string|undefined>(),[id,setId]=useState(''),[reason,setReason]=useState(''),[state,setState]=useState('');
 const list=useGetAdminProperties({limit:20,cursor,...(state?{estado:state}:{})}),detail=useGetAdminProperty(id),moderate=useModerateAdminProperty(),review=useConflictReview();
 const listing=<><Select aria-label="Estado de publicación" value={state} onChange={event=>{setState(event.target.value);setCursor(undefined);}} wrapperClassName="mb-5"><option value="">Todos</option>{['REGISTRADA','PUBLICADA','PAUSADA','ARCHIVADA'].map(v=><option key={v}>{v}</option>)}</Select>
 <div className={surface}>{list.isLoading?<Skeleton className="h-40" />:list.isError?<p role="alert">No pudimos cargar publicaciones.</p>:list.data?.items.length ? list.data.items.map(p=><Button key={p.id} variant="ghost" className="w-full !justify-start p-4" onClick={()=>{setId(p.id);setReason('');review.setConflict(false);moderate.reset();}}>{p.titulo} · {p.estado_publicacion}</Button>):<p>No hay publicaciones con este estado.</p>}</div><Pagination next={list.data?.next_cursor} onNext={setCursor} onFirst={()=>setCursor(undefined)} /></>;
 const content=detail.isLoading?<Skeleton className="h-40" />:detail.isError?<p role="alert">No pudimos cargar la propiedad.</p>:detail.data && <div className={surface}>
  <h2 className="font-montserrat font-bold text-xl">{detail.data.value.titulo}</h2><p>{detail.data.value.estado_publicacion} · Asesor #{detail.data.value.asesor_id}</p><p className="whitespace-pre-wrap">{detail.data.value.descripcion}</p>
  <Textarea aria-label="Motivo de moderación" value={reason} onChange={event=>setReason(event.target.value)} placeholder="Motivo obligatorio" />
  <div className="flex gap-3">{(['PAUSAR','ARCHIVAR'] as const).map(accion=><Button variant="secondary" key={accion} disabled={!reason.trim() || review.conflict || moderate.isPending} isLoading={moderate.isPending} onClick={async()=>{
    if(!detail.data || !window.confirm('¿Confirmas la moderación de esta publicación?'))return;
    try{await moderate.mutateAsync({id,accion,motivo:reason.trim(),etag:detail.data.etag});setReason('');}catch(error){review.failed(error);}
  }}>{accion==='PAUSAR'?'Pausar':'Archivar'}</Button>)}</div>
  {review.conflict && <ConflictNotice current={<p>Estado consultado: {detail.data.value.estado_publicacion} · versión {detail.data.value.version}</p>} onReview={async()=>{const result=await detail.refetch();if(result.isError)throw result.error;}} onAccept={()=>{review.setConflict(false);moderate.reset();}} />}
  {!review.conflict && <Failure error={moderate.error} />}{moderate.isSuccess && <p role="status">Moderación aplicada y auditada.</p>}
 </div>;
 return <Workspace title="Publicaciones" subtitle="Revisa las publicaciones y aplica moderación con motivo." list={listing} detail={content} selected={Boolean(id)} onClose={()=>setId('')} />;
}
export function AdminReportsView() {
 const [cursor,setCursor]=useState<string|undefined>(),[id,setId]=useState(''),[reason,setReason]=useState(''),[state,setState]=useState('PENDIENTE');
 const reports=useGetAdminReports({limit:20,cursor,estado:state || undefined}),resolve=useResolveAdminReport();
 const detail=useGetAdminReport(id),report=detail.data;
 const listing=<><Select aria-label="Estado de reporte" value={state} onChange={event=>{setState(event.target.value);setCursor(undefined);setId('');}} wrapperClassName="mb-5"><option value="">Todos</option>{['PENDIENTE','EN_REVISION','CERRADO'].map(v=><option key={v}>{v}</option>)}</Select>
 <div className={surface}>{reports.isLoading?<Skeleton className="h-40" />:reports.isError?<p role="alert">No pudimos cargar reportes.</p>:reports.data?.items.length ? reports.data.items.map(item=><Button variant="ghost" className="w-full !justify-start p-4" key={item.id} onClick={()=>{setId(item.id);setReason('');resolve.reset();}}>#{item.id} · {item.categoria} · {item.estado}</Button>):<p>No hay reportes en esta vista.</p>}</div><Pagination next={reports.data?.next_cursor} onNext={setCursor} onFirst={()=>setCursor(undefined)} /></>;
 const content=detail.isLoading ? <Skeleton className="h-40" /> : detail.isError ? <p role="alert">No pudimos consultar el reporte.</p> : report && <div className={surface}><h2 className="font-montserrat font-bold text-xl">Reporte #{report.id}</h2><p>{report.tipo_objetivo} #{report.objetivo_id} · {report.estado}</p><p>{report.motivo}</p>
 {report.estado!=='CERRADO' && <><Textarea aria-label="Motivo de resolución" value={reason} onChange={event=>setReason(event.target.value)} /><div className="flex flex-wrap gap-2">
 {(['DESCARTAR',...(report.tipo_objetivo==='PROPIEDAD'?['PAUSAR_PROPIEDAD']:[]),...(report.tipo_objetivo==='CUENTA'?['DESACTIVAR_CUENTA']:[]),...(report.tipo_objetivo==='MENSAJE'?['OCULTAR_MENSAJE']:[])] as Array<'DESCARTAR'|'PAUSAR_PROPIEDAD'|'DESACTIVAR_CUENTA'|'OCULTAR_MENSAJE'>).map(accion=><Button key={accion} variant="secondary" disabled={!reason.trim() || resolve.isPending} isLoading={resolve.isPending} onClick={async()=>{if(!window.confirm('¿Confirmas resolver este reporte?'))return;try{await resolve.mutateAsync({id:report.id,accion,motivo:reason.trim()});setReason('');}catch{/* Failure below */}}}>{accion.replaceAll('_',' ')}</Button>)}</div></>}
 <Failure error={resolve.error} />{resolve.isSuccess && <p role="status">Reporte resuelto y auditado.</p>}</div>;
 return <Workspace title="Reportes" subtitle="Resuelve reportes con revisión humana y evidencia de auditoría." list={listing} detail={content} selected={Boolean(id)} onClose={()=>setId('')} />;
}
export function AdminFinanceView() {
 const [cursor,setCursor]=useState<string|undefined>(),[auditCursor,setAuditCursor]=useState<string|undefined>();
 const subscriptions=useGetAdminSubscriptions({limit:20,cursor}),audit=useGetAdminAudit({limit:20,cursor:auditCursor});
 return <ModuleLayout title="Finanzas y auditoría" subtitle="Periodos y evidencia real; V1 no proporciona ingresos agregados." isFullScreen showSearch={false} showFilters={false}>
 <div className="grid lg:grid-cols-2 gap-5"><section className={surface}><h2 className="font-montserrat font-bold text-xl">Suscripciones</h2>{subscriptions.isLoading?<Skeleton className="h-40" />:subscriptions.isError?<p role="alert">No pudimos cargar suscripciones.</p>:subscriptions.data?.items.length?subscriptions.data.items.map(s=><div key={s.asesor_id} className="py-3 border-b border-gray-100 dark:border-inmo-darktertiary">Asesor #{s.asesor_id} · {s.estado}<p className="text-xs text-gray-500">Cupo: {s.propiedades_en_cupo}/{s.limite_propiedades}</p></div>):<p>No hay suscripciones.</p>}<Pagination next={subscriptions.data?.next_cursor} onNext={setCursor} onFirst={()=>setCursor(undefined)} /></section>
 <section className={surface}><h2 className="font-montserrat font-bold text-xl">Auditoría</h2>{audit.isLoading?<Skeleton className="h-40" />:audit.isError?<p role="alert">No pudimos cargar auditoría.</p>:audit.data?.items.length?audit.data.items.map(a=><div key={a.id} className="py-3 border-b border-gray-100 dark:border-inmo-darktertiary">{a.modulo} · {a.accion} · {a.resultado}<p className="text-xs text-gray-500">{a.fecha}</p></div>):<p>No hay eventos.</p>}<Pagination next={audit.data?.next_cursor} onNext={setAuditCursor} onFirst={()=>setAuditCursor(undefined)} /></section></div>
 </ModuleLayout>;
}
