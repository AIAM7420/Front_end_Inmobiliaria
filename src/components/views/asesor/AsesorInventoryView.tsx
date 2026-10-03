import { useState } from 'react';
import { Plus, Edit, Eye, EyeOff, Archive, Image, Building2 } from 'lucide-react';
import { ModuleLayout } from '../../templates/ModuleLayout';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { PropertyCreatorWizard } from '../../organisms/PropertyCreatorWizard';
import { PropertyInlineEditor } from '../../organisms/PropertyInlineEditor';
import { ConnectedPropertyCard } from '../../organisms/ConnectedPropertyCard';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import { FileDropZone } from '../../atoms/FileDropZone';
import { Skeleton } from '../../atoms/Skeleton';
import { ConfirmModal } from '../../molecules/ConfirmModal';
import { ConflictNotice } from '../../molecules/ConflictNotice';
import { useGetOwnApplication } from '../../../integrations/backend/hooks/useAdvisors';
import { useGetSubscription } from '../../../integrations/backend/hooks/useSubscriptions';
import { useChangeAvailability,useChangeCommission,useChangePublication,useCreateProperty,useGetInverseMatches,useGetOwnProperties,useGetOwnProperty,useGetOwnPhotos,useUploadPropertyPhoto } from '../../../integrations/backend/hooks/useProperties';
import { isVersionConflict,operationError } from '../../../integrations/backend/versioning';
export function AsesorInventoryView() {
 const [cursor,setCursor]=useState<string|undefined>(),[search,setSearch]=useState(''),[status,setStatus]=useState('');
 const [selected,setSelected]=useState(''),[mode,setMode]=useState<'detail'|'create'|'edit'>('detail');
 const [reason,setReason]=useState(''),[commission,setCommission]=useState(''),[notice,setNotice]=useState(''),[failure,setFailure]=useState(''),[conflict,setConflict]=useState(false);
 const [matchesOpen,setMatchesOpen]=useState(false);
 const [action,setAction]=useState<'PUBLICAR'|'PAUSAR'|'ARCHIVAR'|null>(null);
 const application=useGetOwnApplication(),subscription=useGetSubscription();
 const list=useGetOwnProperties({limit:20,cursor}),detail=useGetOwnProperty(selected),photos=useGetOwnPhotos(selected,Boolean(selected));
 const create=useCreateProperty(),publish=useChangePublication(),upload=useUploadPropertyPhoto(),availability=useChangeAvailability(),sharing=useChangeCommission();
 const matches=useGetInverseMatches(selected,matchesOpen);
 const property=detail.data?.value;
 const publicationReady=Boolean(property?.codigo_postal && property.latitud && property.longitud && property.descripcion.trim().length>=50 && photos.data?.length);
 const eligible=application.data?.value.estado==='APROBADA' && subscription.data?.value.estado==='ACTIVA';
 const pending=publish.isPending || upload.isPending || availability.isPending || sharing.isPending;
 const items=(list.data?.items ?? []).filter(item=>(!status || item.estado_publicacion===status) && item.titulo.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
 async function run(fn:()=>Promise<unknown>,success:string) {setFailure('');setNotice('');try{await fn();setNotice(success);}catch(error){if(isVersionConflict(error))setConflict(true);setFailure(operationError(error));throw error;}}
 function select(id:string) {setSelected(id);setMode('detail');setConflict(false);setFailure('');setNotice('');setReason('');setCommission('');setMatchesOpen(false);}
 const main=<ModuleLayout title="Mis propiedades" subtitle="Consulta tu portafolio y gestiona publicaciones." isFullScreen searchValue={search} onSearchChange={setSearch} showFilters={false}
   actions={<Button icon={<Plus className="w-4 h-4" />} disabled={!eligible} onClick={()=>{setMode('create');setSelected('');}}>Nueva propiedad</Button>}>
   {!eligible && <div role="status" className="rounded-card bg-white dark:bg-inmo-darkcard p-5 mb-5 text-sm">Para crear, editar o publicar necesitas validación aprobada y suscripción vigente. Validación: {application.data?.value.estado ?? 'Sin expediente'} · Suscripción: {subscription.data?.value.estado ?? 'Sin periodo'}.</div>}
   <Select aria-label="Estado de publicación" value={status} onChange={event=>setStatus(event.target.value)} wrapperClassName="mb-5"><option value="">Todos los estados</option>{['REGISTRADA','PUBLICADA','PAUSADA','ARCHIVADA'].map(value=><option key={value}>{value}</option>)}</Select>
   <p className="text-xs text-gray-500 mb-4">Búsqueda y estado filtran la página cargada.</p>
   {list.isLoading ? <Skeleton className="h-64" /> : list.isError ? <p role="alert">No pudimos cargar tus propiedades.</p>
     : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{items.map(item=><div key={item.id} className="space-y-2"><ConnectedPropertyCard property={item} variant="asesor" onClick={()=>select(item.id)} /><div className="text-sm text-gray-500 px-3">{item.estado_publicacion} · {item.disponible?'Disponible':'No disponible'}</div></div>)}</div>}
   {!list.isLoading && !list.isError && !items.length && <div role="status" className="rounded-card bg-white dark:bg-inmo-darkcard p-8 text-center"><Building2 className="mx-auto mb-4 text-gray-400" />Todavía no tienes propiedades en esta vista.</div>}
   <div className="flex gap-3 mt-5">{list.data?.next_cursor && <Button variant="secondary" onClick={()=>setCursor(list.data?.next_cursor ?? undefined)}>Página siguiente</Button>}{cursor && <Button variant="text" onClick={()=>setCursor(undefined)}>Volver al inicio</Button>}</div>
 </ModuleLayout>;
 const side=mode==='create' ? <PropertyCreatorWizard pending={create.isPending} onCancel={()=>setMode('detail')} onSave={async payload=>{const result=await create.mutateAsync(payload);select(result.value.id);setNotice('Borrador creado. Añade una fotografía antes de publicar.');}} />
   : mode==='edit' ? <PropertyInlineEditor propertyId={selected} onCancel={()=>setMode('detail')} onSave={()=>{setMode('detail');setNotice('Cambios guardados.');}} />
   : detail.isLoading ? <Skeleton className="h-64" /> : detail.isError ? <p role="alert">No pudimos cargar la ficha.</p> : property && <div className="p-5 overflow-y-auto h-full space-y-5 font-inter text-sm">
     <h2 className="font-montserrat text-2xl font-bold">{property.titulo}</h2><p className="font-bold text-2xl">{Number(property.precio).toLocaleString('es-MX',{style:'currency',currency:property.moneda})}</p>
     <p>{property.estado_publicacion} · {property.disponible?'Disponible':'No disponible'}</p><p className="whitespace-pre-wrap">{property.descripcion}</p><p>Dirección privada: {property.direccion}</p>
     <p className="flex gap-2"><Image className="w-4 h-4" />Fotografías confirmadas: {photos.data?.length ?? '…'}</p>
     {eligible && <>
       <div className="flex flex-wrap gap-2"><Button variant="secondary" icon={<Edit className="w-4 h-4" />} disabled={pending || conflict} onClick={()=>setMode('edit')}>Editar</Button>
         <Button icon={property.estado_publicacion==='PUBLICADA'?<EyeOff className="w-4 h-4" />:<Eye className="w-4 h-4" />} disabled={pending || conflict || property.estado_publicacion==='ARCHIVADA' || (property.estado_publicacion!=='PUBLICADA' && !publicationReady)} onClick={()=>setAction(property.estado_publicacion==='PUBLICADA'?'PAUSAR':'PUBLICAR')}>{property.estado_publicacion==='PUBLICADA'?'Pausar':'Publicar'}</Button>
         <Button variant="secondary" icon={<Archive className="w-4 h-4" />} disabled={pending || conflict || property.estado_publicacion==='ARCHIVADA'} onClick={()=>setAction('ARCHIVAR')}>Archivar</Button></div>
       {!publicationReady && property.estado_publicacion!=='PUBLICADA' && <p role="status">Antes de publicar completa el código postal, la ubicación privada, una descripción de al menos 50 caracteres y una fotografía confirmada. También se validarán los requisitos del tipo de inmueble.</p>}
       {upload.isPending ? <p role="status">Cargando y confirmando fotografía…</p> : <FileDropZone accept="image/jpeg,image/webp" maxSizeMB={5} label="Añadir fotografía" hint="JPEG o WebP de hasta 5 MB" onFileSelect={file=>{void run(()=>upload.mutateAsync({propertyId:selected,file}),'Fotografía confirmada. Ficha actualizada.').catch(()=>{});}} />}
       <Input aria-label="Motivo de no disponibilidad" value={reason} onChange={event=>setReason(event.target.value)} placeholder="Motivo de no disponibilidad" />
       <Button variant="secondary" disabled={pending || conflict || (property.disponible && !reason.trim())} onClick={()=>{if(!detail.data)return;void run(()=>availability.mutateAsync({id:selected,disponible:!property.disponible,motivo:property.disponible?reason.trim():null,etag:detail.data!.etag}),'Disponibilidad actualizada.').catch(()=>{});}}>{property.disponible?'Marcar no disponible':'Marcar disponible'}</Button>
       <Input aria-label="Porcentaje de comisión" type="number" min="0.01" max="100" step="0.01" value={commission} onChange={event=>setCommission(event.target.value)} placeholder="Porcentaje de comisión" />
       <Button variant="secondary" disabled={pending || conflict} onClick={()=>{if(!detail.data)return;void run(()=>sharing.mutateAsync({id:selected,comparteComision:Boolean(commission),porcentaje:commission || null,etag:detail.data!.etag}),'Comisión actualizada.').catch(()=>{});}}>Guardar comisión</Button>
     </>}
     <Button variant="text" onClick={()=>setMatchesOpen(!matchesOpen)}>Ver coincidencias de clientes</Button>
     {matchesOpen && (matches.isLoading ? <Skeleton className="h-20" /> : matches.isError ? <p role="alert">No pudimos consultar coincidencias.</p> : matches.data?.items.length ? <ul>{matches.data.items.map(match=><li key={match.id}>Necesidad #{match.id}: {match.precio_min ?? 'Sin mínimo'}–{match.precio_max ?? 'Sin máximo'} MXN</li>)}</ul> : <p>Sin coincidencias.</p>)}
     {conflict && <ConflictNotice current={<p>Estado actual: {property.estado_publicacion} · versión {property.version}</p>} onReview={async()=>{const result=await detail.refetch();if(result.isError)throw result.error;setFailure('');}} onAccept={()=>setConflict(false)} />}
     {failure && !conflict && <p role="alert" className="text-inmo-danger">{failure}</p>}{notice && <p role="status" className="text-inmo-success">{notice}</p>}
   </div>;
 return <><SplitViewLayout mainContent={main} sideContent={side} isOpen={mode==='create' || Boolean(selected)} onClose={()=>{if(!pending && !create.isPending){setSelected('');setMode('detail');}}} sideTitle={mode==='create'?'Nueva propiedad':mode==='edit'?'Editar propiedad':'Detalle de propiedad'} desktopNoPadding />
   <ConfirmModal isOpen={Boolean(action)} onClose={()=>setAction(null)} title={action==='ARCHIVAR'?'Archivar propiedad':action==='PAUSAR'?'Pausar propiedad':'Publicar propiedad'} message={action==='ARCHIVAR'?'La propiedad dejará de mostrarse. Se conservará su historial.':'Se validarán el estado actual, tu habilitación y los requisitos de publicación.'} onConfirm={async()=>{if(!detail.data || !action)return;await run(()=>publish.mutateAsync({id:selected,accion:action,etag:detail.data!.etag,...(action==='PUBLICAR'?{visible:true}:{})}),'Estado actualizado.');}} />
 </>;
}
