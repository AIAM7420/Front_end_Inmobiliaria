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
} from './types';
import type { Versioned } from './auth.service';

export interface ListPropertiesParams {
  limit?: number;
  cursor?: string;
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

export async function getOwnProperties(params: ListPropertiesParams = {}): Promise<Pagina<PropiedadPrivada>> {
  const { data } = await api.get<Pagina<PropiedadPrivada>>('/me/propiedades', { params });
  return data;
}

export async function getOwnProperty(id: Id): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.get<PropiedadPrivada>(`/me/propiedades/${encodeURIComponent(id)}`);
  return { value: response.data, etag: response.headers.etag as string };
}

export async function createProperty(payload: PropiedadCrear): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.post<PropiedadPrivada>('/propiedades', payload);
  return { value: response.data, etag: response.headers.etag as string };
}

export async function updateProperty(
  id: Id,
  payload: PropiedadEditar,
  etag: string,
): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.patch<PropiedadPrivada>(`/me/propiedades/${encodeURIComponent(id)}`, payload, {
    headers: { 'If-Match': etag },
  });
  return { value: response.data, etag: response.headers.etag as string };
}

export async function changePublication(
  id: Id,
  accion: 'PUBLICAR' | 'PAUSAR' | 'ARCHIVAR',
  etag: string,
  visible?: boolean,
): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.post<PropiedadPrivada>(
    `/me/propiedades/${encodeURIComponent(id)}/publicacion`,
    { accion, ...(visible === undefined ? {} : { visible }) },
    { headers: { 'If-Match': etag } },
  );
  return { value: response.data, etag: response.headers.etag as string };
}

export async function changeAvailability(
  id: Id, disponible: boolean, motivo: string | null, etag: string,
): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.put<PropiedadPrivada>(
    `/me/propiedades/${encodeURIComponent(id)}/disponibilidad`,
    { disponible, motivo }, { headers: { 'If-Match': etag } },
  );
  return { value: response.data, etag: response.headers.etag as string };
}

export async function changeCommission(
  id: Id, comparteComision: boolean, porcentaje: string | null, etag: string,
): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.put<PropiedadPrivada>(
    `/me/propiedades/${encodeURIComponent(id)}/comision`,
    { comparte_comision: comparteComision, porcentaje_comision: porcentaje },
    { headers: { 'If-Match': etag } },
  );
  return { value: response.data, etag: response.headers.etag as string };
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
