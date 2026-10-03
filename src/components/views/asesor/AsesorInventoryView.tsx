import { useState } from 'react';
import { Edit, Eye, EyeOff, Archive, Image } from 'lucide-react';
import { PropertyDetailContent } from '../../organisms/PropertyDetailContent';
import { PropertyInventory } from '../../organisms/PropertyInventory';
import { InventoryOrderEditor } from '../../organisms/InventoryOrderEditor';
import { sortInventory } from '../../../integrations/backend/properties.service';
import { PropertyPhotoManager } from '../../organisms/PropertyPhotoManager';
import { SharedCommissions } from '../../organisms/SharedCommissions';
import type { PropiedadPrivada } from '../../../integrations/backend/types';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { PropertyCreatorWizard } from '../../organisms/PropertyCreatorWizard';
import { PropertyInlineEditor } from '../../organisms/PropertyInlineEditor';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { FileDropZone } from '../../atoms/FileDropZone';
import { Skeleton } from '../../atoms/Skeleton';
import { ConfirmModal } from '../../molecules/ConfirmModal';
import { ConflictNotice } from '../../molecules/ConflictNotice';
import { useGetOwnApplication } from '../../../integrations/backend/hooks/useAdvisors';
import { useGetSubscription } from '../../../integrations/backend/hooks/useSubscriptions';
import { useChangeAvailability,useChangeCommission,useChangePublication,useCreateProperty,useGetInverseMatches,useGetInventory,useTrashProperty,useGetOwnProperty,useGetOwnPhotos,useUploadPropertyPhoto } from '../../../integrations/backend/hooks/useProperties';
import { isVersionConflict,operationError } from '../../../integrations/backend/versioning';
import { useToast } from '../../../context/ToastContext';
import { usePropertyManagement } from '../../../integrations/backend/hooks/useProperties';
export function AsesorInventoryView() {
 const {addToast}=useToast();
 const [search,setSearch]=useState(''),[status,setStatus]=useState(''),[trashView,setTrashView]=useState(false);
 const [selected,setSelected]=useState(''),[mode,setMode]=useState<'detail'|'create'|'edit'>('detail');
 const [reason,setReason]=useState(''),[commission,setCommission]=useState<string|null>(null),[notice,setNotice]=useState(''),[failure,setFailure]=useState(''),[conflict,setConflict]=useState(false);
 const [matchesOpen,setMatchesOpen]=useState(false);
 const [orderOpen,setOrderOpen]=useState(false),[sharedOpen,setSharedOpen]=useState(false);
 const management=usePropertyManagement();
 const [action,setAction]=useState<'PUBLICAR'|'PAUSAR'|'ARCHIVAR'|'RESTAURAR'|'RETIRAR'|null>(null);
 const [actionTarget,setActionTarget]=useState<PropiedadPrivada|null>(null);
 const trash=useTrashProperty();
 const application=useGetOwnApplication(),subscription=useGetSubscription();
 const list=useGetInventory(),detail=useGetOwnProperty(selected),photos=useGetOwnPhotos(selected,Boolean(selected));
 const create=useCreateProperty(),publish=useChangePublication(),upload=useUploadPropertyPhoto(),availability=useChangeAvailability(),sharing=useChangeCommission();
 const matches=useGetInverseMatches(selected,matchesOpen);
 const property=detail.data?.value;
 const publicationReady=Boolean(property?.codigo_postal && property.latitud && property.longitud && property.descripcion.trim().length>=50 && photos.data?.length);
 const eligible=application.data?.value.estado==='APROBADA' && subscription.data?.value.estado==='ACTIVA';
 const pending=trash.isPending || management.retire.isPending || publish.isPending || upload.isPending || availability.isPending || sharing.isPending;
 async function run(fn:()=>Promise<unknown>,success:string) {setFailure('');setNotice('');try{await fn();setNotice(success);}catch(error){if(isVersionConflict(error))setConflict(true);setFailure(operationError(error));throw error;}}
 function select(id:string) {setSelected(id);setMode('detail');setConflict(false);setFailure('');setNotice('');setReason('');setCommission(null);setMatchesOpen(false);}
 const main=<PropertyInventory items={sortInventory(list.data?.items ?? [])} loading={list.isLoading} error={list.isError} eligible={eligible} busy={pending} selected={selected} isOpen={mode==='create' || Boolean(selected)} trash={trashView}
   onOrder={()=>setOrderOpen(true)} onShared={()=>setSharedOpen(true)}
   search={search} status={status} onSearch={setSearch} onStatus={setStatus} onSelect={select}
   onEdit={id=>{select(id);setMode('edit');}} onCreate={()=>{setMode('create');setSelected('');}}
   onTrashView={()=>{setTrashView(!trashView);setSelected('');setMode('detail');setSearch('');setStatus('');}}
   onAction={(item,next)=>{setActionTarget(item);setAction(next);}} />;
 const side=mode==='create' ? <PropertyCreatorWizard pending={create.isPending} onCancel={()=>setMode('detail')} onSave={async (payload,files=[])=>{const result=await create.mutateAsync(payload);select(result.value.id);setNotice('Borrador creado. Añade una fotografía antes de publicar.');try{for(const file of files)await upload.mutateAsync({propertyId:result.value.id,file});if(files.length)setNotice('Borrador creado y fotografías confirmadas. Revisa la ficha antes de publicar.');}catch(error){setFailure('El borrador está guardado. '+operationError(error)+' Puedes volver a añadir las fotografías desde esta ficha.');}}} />
   : mode==='edit' ? <PropertyInlineEditor propertyId={selected} onCancel={()=>setMode('detail')} onSave={()=>{setMode('detail');setNotice('Cambios guardados.');}} />
   : detail.isLoading ? <Skeleton className="h-64" /> : detail.isError ? <p role="alert">No pudimos cargar la ficha.</p> : property && <PropertyDetailContent key={property.id} property={property} owned>
     <div className="space-y-5 font-inter text-sm"><p>{property.estado_publicacion}</p>
     <p className="flex gap-2"><Image className="w-4 h-4" />Fotografías confirmadas: {photos.data?.length ?? '…'}</p>
     {eligible && <>
       <div className="flex flex-wrap gap-2"><Button variant="secondary" icon={<Edit className="w-4 h-4" />} disabled={pending || conflict} onClick={()=>setMode('edit')}>Editar</Button>
         <Button icon={property.estado_publicacion==='PUBLICADA'?<EyeOff className="w-4 h-4" />:<Eye className="w-4 h-4" />} disabled={pending || conflict || property.estado_publicacion==='ARCHIVADA' || (property.estado_publicacion!=='PUBLICADA' && !publicationReady)} onClick={()=>{setActionTarget(property);setAction(property.estado_publicacion==='PUBLICADA'?'PAUSAR':'PUBLICAR');}}>{property.estado_publicacion==='PUBLICADA'?'Pausar':'Publicar'}</Button>
         <Button variant="secondary" icon={<Archive className="w-4 h-4" />} disabled={pending || conflict || property.estado_publicacion==='ARCHIVADA'} onClick={()=>{setActionTarget(property);setAction('ARCHIVAR');}}>Archivar</Button></div>
       {!publicationReady && property.estado_publicacion!=='PUBLICADA' && <p role="status">Antes de publicar completa el código postal, la ubicación privada, una descripción de al menos 50 caracteres y una fotografía confirmada. También se validarán los requisitos del tipo de inmueble.</p>}
       {photos.data && <PropertyPhotoManager key={property.id} property={property} photos={photos.data} />}
       {upload.isPending ? <p role="status">Cargando y confirmando fotografía…</p> : <FileDropZone accept="image/jpeg,image/webp" maxSizeMB={5} label="Añadir fotografía" hint="JPEG o WebP de hasta 5 MB" onFileSelect={file=>{void run(()=>upload.mutateAsync({propertyId:selected,file}),'Fotografía confirmada. Ficha actualizada.').catch(()=>{});}} />}
       <Input aria-label="Motivo de no disponibilidad" value={reason} onChange={event=>setReason(event.target.value)} placeholder="Motivo de no disponibilidad" />
       <Button variant="secondary" disabled={pending || conflict || (property.disponible && !reason.trim())} onClick={()=>{if(!detail.data)return;void run(()=>availability.mutateAsync({id:selected,disponible:!property.disponible,motivo:property.disponible?reason.trim():null,etag:detail.data!.etag}),'Disponibilidad actualizada.').catch(()=>{});}}>{property.disponible?'Marcar no disponible':'Marcar disponible'}</Button>
       <Input aria-label="Porcentaje de comisión" type="number" min="0.01" max="100" step="0.01" value={commission ?? property.porcentaje_comision ?? ''} onChange={event=>setCommission(event.target.value)} placeholder="Porcentaje de comisión" />
       <Button variant="secondary" disabled={pending || conflict} onClick={()=>{if(!detail.data)return;void run(()=>sharing.mutateAsync({id:selected,comparteComision:Boolean(commission ?? property.porcentaje_comision),porcentaje:(commission ?? property.porcentaje_comision) || null,etag:detail.data!.etag}),'Comisión actualizada.').catch(()=>{});}}>Guardar comisión</Button>
     </>}
     <Button variant="text" onClick={()=>setMatchesOpen(!matchesOpen)}>Ver coincidencias de clientes</Button>
     {matchesOpen && (matches.isLoading ? <Skeleton className="h-20" /> : matches.isError ? <p role="alert">No pudimos consultar coincidencias.</p> : matches.data?.items.length ? <ul>{matches.data.items.map(match=><li key={match.id}>Necesidad #{match.id}: {match.precio_min ?? 'Sin mínimo'}–{match.precio_max ?? 'Sin máximo'} MXN</li>)}</ul> : <p>Sin coincidencias.</p>)}
     {conflict && <ConflictNotice current={<p>Estado actual: {property.estado_publicacion} · versión {property.version}</p>} onReview={async()=>{const result=await detail.refetch();if(result.isError)throw result.error;setFailure('');}} onAccept={()=>setConflict(false)} />}
     {failure && !conflict && <p role="alert" className="text-inmo-danger">{failure}</p>}{notice && <p role="status" className="text-inmo-success">{notice}</p>}
   </div></PropertyDetailContent>;
 return <><SplitViewLayout mainContent={main} sideContent={side} isOpen={mode==='create' || Boolean(selected)} onClose={()=>{if(!pending && !create.isPending){setSelected('');setMode('detail');}}} bottomSheetHeightMode="fixed-85" sideTitle={mode==='create'?'Nueva propiedad':mode==='edit'?'Editar propiedad':'Detalle de propiedad'} desktopNoPadding />
   {orderOpen && <InventoryOrderEditor items={list.data?.items ?? []} onClose={()=>setOrderOpen(false)} />}
   {sharedOpen && <SharedCommissions ownAdvisorId={list.data?.items[0]?.asesor_id} onClose={()=>setSharedOpen(false)} />}
   <ConfirmModal isOpen={Boolean(action)} onClose={()=>{setAction(null);setActionTarget(null);}}
     title={action==='RETIRAR'?'Eliminar definitivamente':action==='ARCHIVAR'?'Eliminar propiedad':action==='RESTAURAR'?'Recuperar propiedad':action==='PAUSAR'?'Pausar propiedad':'Publicar propiedad'}
     confirmText={action==='RETIRAR'?'Retirar publicación y fotos':action==='ARCHIVAR'?'Mover a papelera':action==='RESTAURAR'?'Recuperar':'Confirmar'} confirmVariant={action==='RETIRAR' || action==='ARCHIVAR'?'danger':action==='PAUSAR'?'warning':'accent'}
     message={action==='RETIRAR'?'Se retirará definitivamente la publicación y se eliminarán sus fotografías. Se conservarán conversaciones, reportes e historial. No podrás recuperarla.':action==='ARCHIVAR'?'La propiedad dejará de mostrarse. Se conservarán fotografías e historial. Puedes recuperarla como borrador desde la papelera.':action==='RESTAURAR'?'La propiedad volverá al inventario como borrador. Revisa sus datos antes de publicarla.':'Se validarán el estado actual, tu habilitación y los requisitos de publicación.'}
     onConfirm={async()=>{
       if(!actionTarget || !action)return;
       const etag='"v'+actionTarget.version+'"';
       try {
         if(action==='RETIRAR') {
           setSelected('');setMode('detail');
           const result=await management.retire.mutateAsync({id:actionTarget.id,etag});
           addToast('delete','Publicación retirada',result.limpieza_pendiente?'La limpieza de fotos se reintentará automáticamente.':'Se eliminaron las fotos y se conservó el historial.');
           setSelected('');setMode('detail');return;
         }
         if(action==='ARCHIVAR') await trash.mutateAsync({id:actionTarget.id,etag});
         else await publish.mutateAsync({id:actionTarget.id,accion:action,etag,...(action==='PUBLICAR'?{visible:true}:{})});
         setNotice(action==='ARCHIVAR'?'Propiedad movida a la papelera.':action==='RESTAURAR'?'Propiedad recuperada como borrador.':'Estado actualizado.');
         addToast(action==='ARCHIVAR'?'delete':'success',action==='ARCHIVAR'?'Propiedad eliminada':action==='RESTAURAR'?'Propiedad recuperada':'Estado actualizado',action==='ARCHIVAR'?'Puedes recuperarla como borrador desde la papelera.':'El cambio se guardó en tu inventario.');
         if(action==='ARCHIVAR' || action==='RESTAURAR'){setSelected('');setMode('detail');}
       } catch(error) {
         if(isVersionConflict(error)){select(actionTarget.id);setConflict(true);setAction(null);setActionTarget(null);}
         throw error;
       }
     }} />
 </>;
}
