import { useState } from 'react';
import type { FormEvent } from 'react';
import { useGetOwnApplication } from '../../../integrations/backend/hooks/useAdvisors';
import { useGetSubscription } from '../../../integrations/backend/hooks/useSubscriptions';
import {
  useChangeAvailability, useChangeCommission, useChangePublication, useCreateProperty,
  useGetCatalog, useGetInverseMatches, useGetOwnProperties, useGetOwnProperty,
  useGetOwnPhotos, useUpdateProperty, useUploadPropertyPhoto,
} from '../../../integrations/backend/hooks/useProperties';
import type { PropiedadCrear } from '../../../integrations/backend/types';
import { problemFromError } from '../../../integrations/backend/axios.config';
import { getOwnProperty, lookupPropertyLocation } from '../../../integrations/backend/properties.service';
import { Button } from '../../atoms/Button';
import { Skeleton } from '../../atoms/Skeleton';
import { PropertyLocationMap } from './PropertyLocationMap';

const field = 'w-full rounded-xl border border-inmo-tertiary dark:border-inmo-darktertiary bg-white dark:bg-inmo-darkcard p-3 font-inter text-sm text-inmo-secondary dark:text-white';
const card = 'rounded-card bg-white dark:bg-inmo-darkcard p-5 md:p-6 shadow-soft';

export function AdvisorPropertiesView() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [selectedId, setSelectedId] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [reason, setReason] = useState('');
  const [commission, setCommission] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showMatches, setShowMatches] = useState(false);
  const [locationPending, setLocationPending] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [locationDescription, setLocationDescription] = useState('');
  const [catalogConfirmed, setCatalogConfirmed] = useState(false);
  const [form, setForm] = useState({
    tipo_id: '', zona_id: '', colonia: '', titulo: '', descripcion: '', direccion: '', codigo_postal: '',
    latitud: '', longitud: '', precio: '', habitaciones: '0', banos: '0',
    superficie_terreno: '', superficie_construccion: '',
  });
  const application = useGetOwnApplication();
  const subscription = useGetSubscription();
  const properties = useGetOwnProperties({ limit: 20, cursor });
  const types = useGetCatalog('tipos');
  const zones = useGetCatalog('zonas');
  const operations = useGetCatalog('operaciones');
  const create = useCreateProperty();
  const update = useUpdateProperty();
  const publish = useChangePublication();
  const availability = useChangeAvailability();
  const sharing = useChangeCommission();
  const upload = useUploadPropertyPhoto();
  const activeId = selectedId || properties.data?.items[0]?.id || '';
  const detail = useGetOwnProperty(activeId);
  const photos = useGetOwnPhotos(activeId, Boolean(activeId));
  const matches = useGetInverseMatches(activeId, showMatches);
  const property = detail.data?.value;
  const canManage = application.data?.value.estado === 'APROBADA' && subscription.data?.value.estado === 'ACTIVA';
  const sale = operations.data?.find((item) => item.codigo === 'VENTA');
  const selectedZoneId = form.zona_id || zones.data?.find((item) => item.codigo === 'LEON_GENERAL')?.id || '';
  const mutationError = create.error ?? update.error ?? availability.error ?? sharing.error ?? upload.error;

  async function createProperty(event: FormEvent) {
    event.preventDefault();
    if (!sale || !canManage || !selectedZoneId) return;
    setNotice('');
    const payload: PropiedadCrear = {
      tipo_id: form.tipo_id, operacion_id: sale.id, zona_id: selectedZoneId,
      titulo: form.titulo.trim(), descripcion: form.descripcion.trim(),
      direccion: `${form.direccion.trim()}, Col. ${form.colonia.trim()}`,
      codigo_postal: form.codigo_postal.trim() || null,
      latitud: form.latitud.trim() || null, longitud: form.longitud.trim() || null,
      precio: form.precio, moneda: 'MXN', habitaciones: Number(form.habitaciones), banos: form.banos,
      superficie_terreno: form.superficie_terreno || null,
      superficie_construccion: form.superficie_construccion || null,
    };
    try {
      const result = await create.mutateAsync(payload);
      setSelectedId(result.value.id);
      setShowCreate(false);
      setNotice('Propiedad registrada. Carga una fotografía antes de publicarla.');
    } catch { /* RFC 9457 is shown below. */ }
  }

  async function locateColony() {
    setLocationError('');
    setLocationDescription('');
    setCatalogConfirmed(false);
    setLocationPending(true);
    try {
      const result = await lookupPropertyLocation(form.colonia.trim(), form.codigo_postal.trim());
      if (result.latitud !== null && result.longitud !== null) {
        setForm((current) => ({ ...current, latitud: String(result.latitud), longitud: String(result.longitud) }));
      }
      setLocationDescription(result.descripcion);
      setCatalogConfirmed(result.catalogo_confirmado);
    } catch (error) {
      const problem = problemFromError(error);
      setLocationError(problem?.detail ?? problem?.title ?? (error instanceof Error ? error.message : 'No encontramos la ubicación. Coloca el punto manualmente.'));
    } finally {
      setLocationPending(false);
    }
  }

  async function editProperty() {
    if (!detail.data || (!editTitle.trim() && !editDescription.trim())) return;
    try {
      await update.mutateAsync({
        id: activeId, etag: detail.data.etag,
        payload: { ...(editTitle.trim() ? { titulo: editTitle.trim() } : {}),
          ...(editDescription.trim() ? { descripcion: editDescription.trim() } : {}) },
      });
      setEditTitle(''); setEditDescription(''); setNotice('Propiedad actualizada.');
    } catch { /* shown below */ }
  }

  async function changeState(accion: 'PUBLICAR' | 'PAUSAR' | 'ARCHIVAR') {
    if (!detail.data || !window.confirm(`¿Confirmas ${accion.toLowerCase()} esta propiedad?`)) return;
    setActionError('');
    setNotice('');
    try {
      const latest = await getOwnProperty(activeId);
      await publish.mutateAsync({
        id: activeId, accion, etag: latest.etag,
        ...(accion === 'PUBLICAR' ? { visible: true } : {}),
      });
      setNotice(`Propiedad ${accion.toLowerCase()} correctamente.`);
    } catch (error) {
      const problem = problemFromError(error);
      setActionError(problem?.detail ?? problem?.title ?? (error instanceof Error ? error.message : 'No fue posible cambiar el estado.'));
      void detail.refetch();
    }
  }

  return <main className="mx-auto w-full max-w-7xl px-4 md:px-6 pt-28 pb-32 text-inmo-secondary dark:text-white">
    <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div><h1 className="font-montserrat text-3xl font-bold">Mis propiedades</h1>
        <p className="font-inter text-sm text-gray-500 mt-1">Consulta tu portafolio y gestiona publicaciones.</p></div>
      <Button className="px-5 py-3" disabled={!canManage} onClick={() => setShowCreate((value) => !value)}>Nueva propiedad</Button>
    </header>
    {!canManage && <div role="status" className={`${card} mb-6 font-inter text-sm`}>
      Puedes consultar tus propiedades, pero para crear, editar o publicar necesitas solicitud aprobada y suscripción pagada vigente.
      <span className="block mt-2">Validación: {application.data?.value.estado ?? 'Sin expediente'} · Suscripción: {subscription.data?.value.estado ?? 'Sin periodo'}</span>
    </div>}
    {showCreate && <form onSubmit={(event) => { void createProperty(event); }} className={`${card} mb-6 grid md:grid-cols-2 gap-4`}>
      <h2 className="font-montserrat text-xl font-bold md:col-span-2">Registrar propiedad en León</h2>
      <label className="font-inter text-sm">Tipo<select required className={field} value={form.tipo_id} onChange={(event) => setForm({ ...form, tipo_id: event.target.value })}>
        <option value="">Seleccionar</option>{types.data?.map((item) => <option value={item.id} key={item.id}>{item.nombre}</option>)}
      </select></label>
      <label className="font-inter text-sm">Zona de catálogo<select required className={field} value={selectedZoneId} onChange={(event) => setForm({ ...form, zona_id: event.target.value })}>
        <option value="">Seleccionar</option>{zones.data?.map((item) => <option value={item.id} key={item.id}>{item.nombre}</option>)}
      </select></label>
      {(!types.isLoading && !types.data?.length || !zones.isLoading && !zones.data?.length) &&
        <p role="alert" className="md:col-span-2 text-sm text-inmo-danger">Faltan catálogos en la base de datos. Ejecuta la migración 0018 antes de registrar propiedades.</p>}
      {(['titulo', 'direccion', 'colonia', 'codigo_postal', 'precio'] as const).map((name) =>
        <label key={name} className="font-inter text-sm capitalize">{name.replaceAll('_', ' ')}
          <input className={field} value={form[name]} required
            type={name === 'precio' ? 'number' : 'text'}
            pattern={name === 'codigo_postal' ? '[0-9]{5}' : undefined}
            min={name === 'precio' ? '0.01' : undefined} step={name === 'precio' ? '0.01' : undefined}
            onChange={(event) => {
              if (name === 'colonia' || name === 'codigo_postal') {
                setLocationDescription(''); setLocationError(''); setCatalogConfirmed(false);
                setForm((current) => ({ ...current, [name]: event.target.value, latitud: '', longitud: '' }));
              } else setForm((current) => ({ ...current, [name]: event.target.value }));
            }} />
        </label>)}
      <div className="md:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" className="px-5 py-3" disabled={locationPending || !form.colonia.trim() || !/^[0-9]{5}$/.test(form.codigo_postal.trim())}
          onClick={() => { void locateColony(); }}>{locationPending ? 'Buscando…' : 'Ubicar colonia y CP'}</Button>
        <span className="text-xs text-gray-500">Una consulta al pulsar el botón; no busca mientras escribes.</span>
      </div>
      {locationDescription && <p role="status" className="md:col-span-2 text-sm">Sugerencia aproximada: {locationDescription}. Confirma el punto en el mapa. © OpenStreetMap contributors.</p>}
      {catalogConfirmed && <p role="status" className="md:col-span-2 text-sm text-inmo-success">Colonia y CP confirmados en el catálogo local.</p>}
      {locationError && <p role="alert" className="md:col-span-2 text-sm text-inmo-danger">{locationError}</p>}
      <PropertyLocationMap position={form.latitud && form.longitud ? { lat: Number(form.latitud), lng: Number(form.longitud) } : null}
        onChange={(position) => setForm((current) => ({ ...current, latitud: position.lat.toFixed(6), longitud: position.lng.toFixed(6) }))} />
      {(['latitud', 'longitud', 'habitaciones', 'banos', 'superficie_terreno', 'superficie_construccion'] as const).map((name) =>
        <label key={name} className="font-inter text-sm capitalize">{name.replaceAll('_', ' ')}
          <input className={field} value={form[name]} required={name === 'latitud' || name === 'longitud'}
            type="number" step={name === 'habitaciones' ? '1' : 'any'}
            min={name === 'latitud' ? '-90' : name === 'longitud' ? '-180' : undefined}
            max={name === 'latitud' ? '90' : name === 'longitud' ? '180' : undefined}
            onChange={(event) => setForm({ ...form, [name]: event.target.value })} />
        </label>)}
      <label className="font-inter text-sm md:col-span-2">Descripción (mínimo 50 caracteres para publicar)
        <textarea required className={`${field} min-h-28`} value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} />
      </label>
      <Button type="submit" className="px-5 py-3" disabled={!sale || !selectedZoneId || !types.data?.length || types.isLoading || zones.isLoading} isLoading={create.isPending}>Registrar</Button>
    </form>}
    <div className="grid lg:grid-cols-[minmax(250px,1fr)_minmax(0,2fr)] gap-5">
      <section className={card}>
        <h2 className="font-montserrat font-bold text-lg mb-4">Portafolio</h2>
        {properties.isLoading ? <Skeleton className="h-24" /> : properties.isError ? <p role="alert" className="font-inter text-sm">No pudimos cargar tus propiedades.</p>
          : properties.data?.items.length ? properties.data.items.map((item) => <Button key={item.id} variant="ghost"
            className={`w-full !justify-start !text-left p-3 mb-2 ${activeId === item.id ? '!bg-inmo-accent/10' : ''}`}
            onClick={() => { setSelectedId(item.id); setShowMatches(false); }}>
            {item.titulo} · {item.estado_publicacion}
          </Button>) : <p className="font-inter text-sm text-gray-500">Todavía no tienes propiedades registradas.</p>}
        {properties.data?.next_cursor && <Button variant="secondary" className="mt-3 px-4 py-2" onClick={() => setCursor(properties.data?.next_cursor ?? undefined)}>Página siguiente</Button>}
      </section>
      <section className={card}>
        {!activeId ? <p className="font-inter text-sm text-gray-500">Selecciona o registra una propiedad.</p>
          : detail.isLoading ? <Skeleton className="h-64" /> : detail.isError ? <p role="alert" className="font-inter text-sm">No pudimos cargar la ficha privada.</p>
            : property && <div className="space-y-5 font-inter text-sm">
              <div><h2 className="font-montserrat font-bold text-xl">{property.titulo}</h2>
                <p className="text-gray-500">#{property.id} · {property.estado_publicacion} · ${Number(property.precio).toLocaleString('es-MX')} MXN</p></div>
              <p>Disponible: {property.disponible ? 'Sí' : 'No'} · Visible: {property.visible ? 'Sí' : 'No'} · Fotografías: {photos.data?.length ?? 0}</p>
              {photos.isError && <p role="alert" className="text-inmo-danger">No se pudo consultar las fotografías de esta propiedad.</p>}
              {!photos.isLoading && !photos.isError && !photos.data?.length && <p>Carga una fotografía confirmada antes de publicar.</p>}
              {canManage && <>
                <div className="flex flex-wrap gap-2">
                  {property.estado_publicacion !== 'PUBLICADA' && property.estado_publicacion !== 'ARCHIVADA' && <Button className="px-4 py-2" disabled={photos.isLoading || !photos.data?.length || publish.isPending} onClick={() => { void changeState('PUBLICAR'); }}>Publicar</Button>}
                  {property.estado_publicacion === 'PUBLICADA' && <Button variant="secondary" className="px-4 py-2" onClick={() => { void changeState('PAUSAR'); }}>Pausar</Button>}
                  {property.estado_publicacion !== 'ARCHIVADA' && <Button variant="secondary" className="px-4 py-2" onClick={() => { void changeState('ARCHIVAR'); }}>Archivar</Button>}
                </div>
                <label className="block">Añadir fotografía JPEG/WebP (máximo 5 MB)
                  <input type="file" accept="image/jpeg,image/webp" className="block mt-2" disabled={upload.isPending}
                    onChange={async (event) => {
                      const file = event.target.files?.[0]; event.target.value = '';
                      if (!file) return;
                      try { await upload.mutateAsync({ propertyId: activeId, file }); setNotice('Fotografía confirmada.'); }
                      catch { /* shown below */ }
                    }} />
                </label>
                <div className="grid md:grid-cols-2 gap-2"><input className={field} placeholder="Nuevo título" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                  <input className={field} placeholder="Nueva descripción" value={editDescription} onChange={(event) => setEditDescription(event.target.value)} /></div>
                <Button variant="secondary" className="px-4 py-2" disabled={!editTitle.trim() && !editDescription.trim()} onClick={() => { void editProperty(); }}>Guardar edición</Button>
                <div className="flex flex-wrap gap-2 items-center"><input className={field} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motivo si no está disponible" />
                  <Button variant="secondary" className="px-4 py-2" onClick={async () => {
                    if (!detail.data) return;
                    try { await availability.mutateAsync({ id: activeId, disponible: !property.disponible, motivo: property.disponible ? reason.trim() || null : null, etag: detail.data.etag }); setNotice('Disponibilidad actualizada.'); }
                    catch { /* shown below */ }
                  }}>{property.disponible ? 'Marcar no disponible' : 'Marcar disponible'}</Button></div>
                <div className="flex flex-wrap gap-2 items-center"><input className={field} type="number" min="0.01" max="100" step="0.01" value={commission} onChange={(event) => setCommission(event.target.value)} placeholder="Porcentaje de comisión" />
                  <Button variant="secondary" className="px-4 py-2" onClick={async () => {
                    if (!detail.data) return;
                    try { await sharing.mutateAsync({ id: activeId, comparteComision: Boolean(commission), porcentaje: commission || null, etag: detail.data.etag }); setNotice('Comisión actualizada.'); }
                    catch { /* shown below */ }
                  }}>Guardar comisión</Button></div>
              </>}
              <Button variant="text" className="!justify-start" onClick={() => setShowMatches((value) => !value)}>Ver coincidencias de clientes</Button>
              {showMatches && (matches.isLoading ? <Skeleton className="h-20" /> : matches.isError
                ? <p role="alert">No fue posible consultar coincidencias. Requiere habilitación vigente.</p>
                : matches.data?.items.length ? <ul className="space-y-2">{matches.data.items.map((match) => <li key={match.id}>Necesidad #{match.id} · Presupuesto {match.precio_min ?? 'sin mínimo'}–{match.precio_max ?? 'sin máximo'} MXN</li>)}</ul>
                  : <p>No hay coincidencias disponibles.</p>)}
            </div>}
      </section>
    </div>
    {notice && <p role="status" className="font-inter text-sm text-inmo-success mt-5">{notice}</p>}
    {actionError && <p role="alert" className="font-inter text-sm text-inmo-danger mt-5">{actionError}</p>}
    {mutationError && <p role="alert" className="font-inter text-sm text-inmo-danger mt-5">{(() => {
      const problem = problemFromError(mutationError);
      return problem?.detail ?? problem?.title ?? (mutationError instanceof Error ? mutationError.message : 'No fue posible completar la operación.');
    })()}</p>}
  </main>;
}
