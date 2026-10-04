import axios from 'axios';
import { api } from './axios.config';
import type {
  AutorizacionFotografia,
  CatalogoItem,
  Fotografia,
  Id,
  Pagina,
  PaginaPropiedadPublica,
  PropiedadCrear,
  PropiedadEditar,
  PropiedadPrivada,
  PropiedadPublica,
  PropiedadComision,
} from './types';
import type { Versioned } from './auth.service';

export interface ListPropertiesParams {
  limit?: number;
  cursor?: string;
}

/** The property API's If-Match contract is the quoted body version, "vN". */
export function propertyVersion(value: PropiedadPrivada): Versioned<PropiedadPrivada> {
  if (!Number.isSafeInteger(value.version) || value.version < 1) {
    throw new Error('La ficha no tiene una versión válida. Actualiza la página.');
  }
  return { value, etag: `"v${value.version}"` };
}

export function sortInventory(items: PropiedadPrivada[]) {
  return [...items].sort((a, b) => (a.orden_inventario ?? Number.MAX_SAFE_INTEGER) - (b.orden_inventario ?? Number.MAX_SAFE_INTEGER));
}

export async function getProperties(params: ListPropertiesParams = {}): Promise<PaginaPropiedadPublica> {
  const { data } = await api.get<PaginaPropiedadPublica>('/propiedades', { params });
  return data;
}

export async function getProperty(id: Id): Promise<PropiedadPublica> {
  const { data } = await api.get<PropiedadPublica>(`/propiedades/${encodeURIComponent(id)}`);
  return data;
}

export async function getCatalog(catalog: string): Promise<CatalogoItem[]> {
  const { data } = await api.get<CatalogoItem[]>(`/catalogos/${encodeURIComponent(catalog)}`);
  return data;
}

export interface LocationSuggestion {
  latitud: number | null;
  longitud: number | null;
  descripcion: string;
  fuente: string;
  catalogo_confirmado: boolean;
  colonia_catalogo: string | null;
}

/** Deliberately invoked only by the Ubicar button, never on input changes. */
export async function lookupPropertyLocation(colonia: string, codigo_postal: string): Promise<LocationSuggestion> {
  const { data } = await api.post<LocationSuggestion>('/me/propiedades/ubicacion', { colonia, codigo_postal });
  return data;
}

export async function getOwnProperties(params: ListPropertiesParams = {}, signal?: AbortSignal): Promise<Pagina<PropiedadPrivada>> {
  const { data } = await api.get<Pagina<PropiedadPrivada>>('/me/propiedades', { params, signal });
  return data;
}

export async function getOwnProperty(id: Id): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.get<PropiedadPrivada>(`/me/propiedades/${encodeURIComponent(id)}`);
  return propertyVersion(response.data);
}

export async function createProperty(payload: PropiedadCrear): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.post<PropiedadPrivada>('/propiedades', payload);
  return propertyVersion(response.data);
}

export async function updateProperty(
  id: Id,
  payload: PropiedadEditar,
  etag: string,
): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.patch<PropiedadPrivada>(`/me/propiedades/${encodeURIComponent(id)}`, payload, {
    headers: { 'If-Match': etag },
  });
  return propertyVersion(response.data);
}

export async function changePublication(
  id: Id,
  accion: 'PUBLICAR' | 'PAUSAR' | 'ARCHIVAR' | 'RESTAURAR',
  etag: string,
  visible?: boolean,
): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.post<PropiedadPrivada>(
    `/me/propiedades/${encodeURIComponent(id)}/publicacion`,
    { accion, ...(visible === undefined ? {} : { visible }) },
    { headers: { 'If-Match': etag } },
  );
  return propertyVersion(response.data);
}

export async function changeAvailability(
  id: Id, disponible: boolean, motivo: string | null, etag: string,
): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.put<PropiedadPrivada>(
    `/me/propiedades/${encodeURIComponent(id)}/disponibilidad`,
    { disponible, motivo }, { headers: { 'If-Match': etag } },
  );
  return propertyVersion(response.data);
}

/** Move to the reversible trash, with the version reviewed by the user. */
export async function trashProperty(id: Id, etag: string): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.delete<PropiedadPrivada>(`/me/propiedades/${encodeURIComponent(id)}`, {
    headers: { 'If-Match': etag },
  });
  return propertyVersion(response.data);
}

export async function retireProperty(id: Id, etag: string): Promise<{ retirada: boolean; limpieza_pendiente: boolean }> {
  const { data } = await api.delete(`/me/propiedades/${encodeURIComponent(id)}/retiro`, { headers: { 'If-Match': etag } });
  return data;
}

export async function reorderInventory(items: PropiedadPrivada[]): Promise<Pagina<PropiedadPrivada>> {
  const { data } = await api.put<Pagina<PropiedadPrivada>>('/me/inventario/orden', {
    propiedades: items.map(item => ({ id: item.id, version: item.version })),
  });
  return data;
}

export async function reorderPhotos(id: Id, photos: Id[], etag: string): Promise<Versioned<PropiedadPrivada>> {
  const { data } = await api.put<PropiedadPrivada>(`/me/propiedades/${encodeURIComponent(id)}/fotografias/orden`, { fotografia_ids: photos }, { headers: { 'If-Match': etag } });
  return propertyVersion(data);
}

export async function deletePhoto(id: Id, photoId: Id, etag: string): Promise<{ propiedad: PropiedadPrivada; limpieza_pendiente: boolean }> {
  const { data } = await api.delete(`/me/propiedades/${encodeURIComponent(id)}/fotografias/${encodeURIComponent(photoId)}`, { headers: { 'If-Match': etag } });
  return data;
}

export async function getSharedCommissions(params: ListPropertiesParams = {}): Promise<Pagina<PropiedadComision>> {
  const { data } = await api.get<Pagina<PropiedadComision>>('/colaboracion/propiedades', { params });
  return data;
}

export async function getOwnPhotoUrl(propertyId: Id, photoId: Id): Promise<{ url: string; expira_at: string }> {
  const { data } = await api.get<{ url: string; expira_at: string }>(
    `/me/propiedades/${encodeURIComponent(propertyId)}/fotografias/${encodeURIComponent(photoId)}/url`,
  );
  return data;
}

export async function changeCommission(
  id: Id, comparteComision: boolean, porcentaje: string | null, etag: string,
): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.put<PropiedadPrivada>(
    `/me/propiedades/${encodeURIComponent(id)}/comision`,
    { comparte_comision: comparteComision, porcentaje_comision: porcentaje },
    { headers: { 'If-Match': etag } },
  );
  return propertyVersion(response.data);
}

export async function authorizePhoto(
  propertyId: Id,
  payload: { nombre: string; mime: 'image/jpeg' | 'image/webp'; tamano_bytes: number; sha256: string },
): Promise<AutorizacionFotografia> {
  const { data } = await api.post<AutorizacionFotografia>(
    `/me/propiedades/${encodeURIComponent(propertyId)}/fotografias`, payload,
  );
  return data;
}

/** Direct R2 PUT: never use the API instance, which injects the Bearer JWT. */
export async function uploadPhotoDirect(
  authorization: AutorizacionFotografia,
  file: Blob,
): Promise<void> {
  await axios.put(authorization.url, file, {
    headers: authorization.headers,
    timeout: 60_000,
  });
}

export async function confirmPhoto(propertyId: Id, comprobante: string): Promise<Fotografia> {
  const { data } = await api.post<Fotografia>(
    `/me/propiedades/${encodeURIComponent(propertyId)}/fotografias/confirmaciones`,
    { comprobante },
  );
  return data;
}

export async function getPhotos(propertyId: Id): Promise<Fotografia[]> {
  const { data } = await api.get<Fotografia[]>(`/propiedades/${encodeURIComponent(propertyId)}/fotografias`);
  return data;
}

export async function getOwnPhotos(propertyId: Id): Promise<Fotografia[]> {
  const { data } = await api.get<Fotografia[]>(`/me/propiedades/${encodeURIComponent(propertyId)}/fotografias`);
  return data;
}

export async function getPhotoUrl(propertyId: Id, photoId: Id): Promise<{ url: string; expira_at: string }> {
  const { data } = await api.get<{ url: string; expira_at: string }>(
    `/propiedades/${encodeURIComponent(propertyId)}/fotografias/${encodeURIComponent(photoId)}/url`,
  );
  return data;
}

export interface CoincidenciaInversa {
  id: Id;
  tipo_id: Id | null;
  zona_id: Id | null;
  precio_min: string | null;
  precio_max: string | null;
  habitaciones_min: number | null;
  estado: string;
}

export async function getInverseMatches(propertyId: Id, params: ListPropertiesParams = {}): Promise<Pagina<CoincidenciaInversa>> {
  const { data } = await api.get<Pagina<CoincidenciaInversa>>(
    `/me/propiedades/${encodeURIComponent(propertyId)}/coincidencias`, { params },
  );
  return data;
}
