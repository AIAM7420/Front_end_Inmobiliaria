import { useState } from 'react';
import { useGetOwnProperty, useUpdateProperty } from '../../integrations/backend/hooks/useProperties';
import { getOwnProperty } from '../../integrations/backend/properties.service';
import type { Versioned } from '../../integrations/backend/auth.service';
import type { PropiedadPrivada } from '../../integrations/backend/types';
import { isVersionConflict } from '../../integrations/backend/versioning';
import { ConflictNotice } from '../molecules/ConflictNotice';
import { Skeleton } from '../atoms/Skeleton';
import { PropertyForm } from './PropertyForm';
export function PropertyInlineEditor({ propertyId,onSave,onCancel }: {propertyId:string;onSave:()=>void;onCancel:()=>void}) {
  const detail=useGetOwnProperty(propertyId);
  return detail.isLoading ? <Skeleton className="h-64" /> : detail.isError ? <p role="alert">No pudimos cargar la propiedad.</p>
    : detail.data ? <Editor key={propertyId} initial={detail.data} onSave={onSave} onCancel={onCancel} /> : null;
}
function Editor({initial,onSave,onCancel}:{initial:Versioned<PropiedadPrivada>;onSave:()=>void;onCancel:()=>void}) {
  const update=useUpdateProperty();
  const [snapshot,setSnapshot]=useState(initial);
  const [conflict,setConflict]=useState(false);
  return <PropertyForm initial={initial.value} pending={update.isPending} blocked={conflict} onCancel={onCancel}
    beforeActions={conflict ? <ConflictNotice current={<p>Versión actual consultada: {snapshot.value.titulo} · {snapshot.value.precio} MXN · {snapshot.etag}</p>} onReview={async()=>{setSnapshot(await getOwnProperty(initial.value.id));update.reset();}} onAccept={()=>setConflict(false)} /> : null}
    onSave={async payload=>{
      try {const result=await update.mutateAsync({id:initial.value.id,payload,etag:snapshot.etag});setSnapshot(result);onSave();}
      catch(error){if(isVersionConflict(error))setConflict(true);throw error;}
    }} />;
}
