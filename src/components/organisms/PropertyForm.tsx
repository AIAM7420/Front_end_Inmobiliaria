import { useState } from 'react';
import { Building2, Home, MapPin } from 'lucide-react';
import { useGetCatalog } from '../../integrations/backend/hooks/useProperties';
import { lookupPropertyLocation } from '../../integrations/backend/properties.service';
import { operationError } from '../../integrations/backend/versioning';
import type { PropiedadCrear, PropiedadPrivada } from '../../integrations/backend/types';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Textarea } from '../atoms/Textarea';
import { AccountTypeCard } from '../molecules/AccountTypeCard';
import { PropertyLocationMap } from '../views/asesor/PropertyLocationMap';
type Draft = { titulo:string; descripcion:string; direccion:string; colonia:string; codigo_postal:string; precio:string; tipo_id:string; zona_id:string; latitud:string; longitud:string; habitaciones:string; banos:string; superficie_terreno:string; superficie_construccion:string; amenidad_ids:string[] };
export function PropertyForm({ initial, onSave, onCancel, pending, blocked = false, beforeActions, wizard = false }: {
  initial?: PropiedadPrivada; onSave: (payload: PropiedadCrear) => Promise<void>; onCancel: () => void; pending:boolean; blocked?:boolean; beforeActions?:React.ReactNode; wizard?:boolean;
}) {
  const [step,setStep] = useState(0);
  // Seed once: background refetches must not erase a user's draft, including after 412.
  const [draft,setDraft] = useState<Draft>(()=>({
    titulo:initial?.titulo ?? '',descripcion:initial?.descripcion ?? '',direccion:initial?.direccion ?? '',colonia:'',codigo_postal:initial?.codigo_postal ?? '',
    precio:initial?.precio ?? '',tipo_id:initial?.tipo_id ?? '',zona_id:initial?.zona_id ?? '',latitud:initial?.latitud ?? '',longitud:initial?.longitud ?? '',
    habitaciones:String(initial?.habitaciones ?? 0),banos:initial?.banos ?? '0',superficie_terreno:initial?.superficie_terreno ?? '',superficie_construccion:initial?.superficie_construccion ?? '',amenidad_ids:initial?.amenidad_ids ?? []
  }));
  const types=useGetCatalog('tipos'), zones=useGetCatalog('zonas'), operations=useGetCatalog('operaciones'), amenities=useGetCatalog('amenidades');
  const sale=operations.data?.find(item=>item.codigo==='VENTA');
  const [locationPending,setLocationPending]=useState(false);
  const [locationNotice,setLocationNotice]=useState('');
  const [failure,setFailure]=useState('');
  function set<K extends keyof Draft>(key:K,value:Draft[K]) { setDraft(old=>({...old,[key]:value})); }
  const fields = (names:(keyof Omit<Draft,'amenidad_ids'>)[], numeric=false) => names.map(name=><div key={name} className="space-y-2">
    <label htmlFor={'property-'+name} className="font-inter text-xs font-bold uppercase text-gray-500">{({titulo:'Título',direccion:'Calle y número (privado)',colonia:'Colonia',codigo_postal:'Código postal',precio:'Precio MXN',latitud:'Latitud privada',longitud:'Longitud privada',habitaciones:'Habitaciones',banos:'Baños',superficie_terreno:'Terreno m²',superficie_construccion:'Construcción m²'} as Record<string,string>)[name] ?? name}</label>
    <Input id={'property-'+name} value={draft[name]} onChange={event=>set(name,event.target.value)} type={numeric || name==='precio' ? 'number':'text'}
      required={['titulo','direccion','precio','latitud','longitud'].includes(name)} min={name==='precio' ? '0.01' : name==='latitud' ? '-90' : name==='longitud' ? '-180' : numeric ? '0' : undefined}
      max={name==='latitud' ? '90' : name==='longitud' ? '180' : undefined} step={name==='habitaciones' ? '1':'any'} pattern={name==='codigo_postal' ? '[0-9]{5}' : undefined} />
  </div>);
  const stages=['Tipo de propiedad','Información y ubicación','Características'];
  return <form className="h-full flex flex-col bg-white dark:bg-inmo-darkcard text-inmo-secondary dark:text-white" onSubmit={async event=>{
    event.preventDefault(); setFailure('');
    if(wizard && step<2) {setStep(step+1);return;}
    if(!sale || !draft.zona_id || blocked) return;
    const payload:PropiedadCrear={
      titulo:draft.titulo.trim(),descripcion:draft.descripcion.trim(),direccion:draft.direccion.trim() + (draft.colonia.trim() ? ', Col. '+draft.colonia.trim(): ''),
      tipo_id:draft.tipo_id,operacion_id:sale.id,zona_id:draft.zona_id,precio:draft.precio,moneda:'MXN',
      codigo_postal:draft.codigo_postal || null,latitud:draft.latitud || null,longitud:draft.longitud || null,habitaciones:Number(draft.habitaciones),banos:draft.banos,
      superficie_terreno:draft.superficie_terreno || null,superficie_construccion:draft.superficie_construccion || null,amenidad_ids:draft.amenidad_ids
    };
    try { await onSave(payload); } catch(error) {setFailure(operationError(error));}
  }}>
    {wizard && <div className="px-6 py-4 border-b border-gray-100 dark:border-inmo-darktertiary"><p className="text-xs text-gray-500 mb-2">Paso {step+1} de 3</p><h2 className="font-montserrat font-bold text-xl">{stages[step]}</h2><div className="flex gap-2 mt-4">{stages.map((_,i)=><div key={i} className={'h-1.5 rounded-full flex-1 '+(i<=step?'bg-inmo-accent':'bg-inmo-tertiary')} />)}</div></div>}
    <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
      {(!wizard || step===0) && <>
        <div className="rounded-card bg-inmo-accent/5 p-5"><h3 className="font-montserrat font-bold">Venta en MXN</h3><p className="text-sm text-gray-500 mt-2">Operación disponible en esta versión de INMO.</p></div>
        <Select aria-label="Tipo de propiedad" required value={draft.tipo_id} onChange={event=>set('tipo_id',event.target.value)}><option value="">Selecciona el tipo</option>{types.data?.map(item=><option key={item.id} value={item.id}>{item.nombre}</option>)}</Select>
        <div className="grid grid-cols-2 gap-3">{types.data?.map(item=><AccountTypeCard key={item.id} title={item.nombre} description="" icon={item.codigo.includes('CASA') ? <Home />:<Building2 />} isSelected={draft.tipo_id===item.id} onClick={()=>set('tipo_id',item.id)} />)}</div>
      </>}
      {(!wizard || step===1) && <>
        <div className="grid md:grid-cols-2 gap-5">{fields(['titulo','precio','direccion','colonia','codigo_postal'])}</div>
        <Select aria-label="Zona de catálogo" required value={draft.zona_id} onChange={event=>set('zona_id',event.target.value)}><option value="">Selecciona la zona</option>{zones.data?.map(item=><option key={item.id} value={item.id}>{item.nombre}</option>)}</Select>
        <Button type="button" variant="secondary" icon={<MapPin className="w-4 h-4" />} disabled={locationPending || !draft.colonia.trim() || !/^[0-9]{5}$/.test(draft.codigo_postal)} isLoading={locationPending} onClick={async()=>{
          setLocationPending(true);setFailure('');
          try { const result=await lookupPropertyLocation(draft.colonia.trim(),draft.codigo_postal);setLocationNotice(result.descripcion); if(result.latitud!==null && result.longitud!==null) setDraft(old=>({...old,latitud:String(result.latitud),longitud:String(result.longitud)})); }
          catch(error){setFailure(operationError(error));} finally{setLocationPending(false);}
        }}>Ubicar colonia y CP</Button>
        {locationNotice && <p role="status" className="text-sm">{locationNotice}. Confirma el punto. © OpenStreetMap contributors.</p>}
        <PropertyLocationMap position={draft.latitud && draft.longitud ? {lat:Number(draft.latitud),lng:Number(draft.longitud)}:null} onChange={point=>setDraft(old=>({...old,latitud:point.lat.toFixed(6),longitud:point.lng.toFixed(6)}))} />
        <div className="grid grid-cols-2 gap-4">{fields(['latitud','longitud'],true)}</div>
        <p className="text-xs text-gray-500">La dirección y el punto exacto son privados. El catálogo muestra sólo la zona aproximada.</p>
      </>}
      {(!wizard || step===2) && <>
        <div className="grid grid-cols-2 gap-4">{fields(['habitaciones','banos','superficie_terreno','superficie_construccion'],true)}</div>
        <label htmlFor="property-description" className="block text-sm font-bold">Descripción</label>
        <Textarea id="property-description" required value={draft.descripcion} onChange={event=>set('descripcion',event.target.value)} rows={5} />
        <p className="text-xs text-gray-500">Para publicar necesitas una descripción de al menos 50 caracteres y una fotografía confirmada.</p>
        <div className="flex flex-wrap gap-2">{amenities.data?.map(item=><Button type="button" key={item.id} variant={draft.amenidad_ids.includes(item.id)?'accent':'secondary'} aria-pressed={draft.amenidad_ids.includes(item.id)} onClick={()=>set('amenidad_ids',draft.amenidad_ids.includes(item.id)?draft.amenidad_ids.filter(id=>id!==item.id):[...draft.amenidad_ids,item.id])}>{item.nombre}</Button>)}</div>
      </>}
      {(types.isError || zones.isError || operations.isError || amenities.isError) && <p role="alert">No pudimos cargar los catálogos. Intenta nuevamente.</p>}
      {!types.isLoading && !types.data?.length && <p role="alert">No hay tipos disponibles en el catálogo.</p>}
      {!wizard && beforeActions}
      {failure && <p role="alert" className="text-inmo-danger text-sm">{failure}</p>}
    </div>
    <div className="p-4 border-t border-gray-100 dark:border-inmo-darktertiary flex gap-3 shrink-0">
      <Button type="button" variant="secondary" disabled={pending} onClick={()=>wizard && step>0 ? setStep(step-1):onCancel()}>{wizard && step>0 ? 'Atrás':'Cancelar'}</Button>
      <Button type="submit" disabled={blocked || pending || !sale || !draft.tipo_id} isLoading={pending}>{wizard && step<2 ? 'Continuar' : initial ? 'Guardar cambios':'Crear borrador'}</Button>
    </div>
  </form>;
}
