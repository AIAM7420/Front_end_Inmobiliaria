import axios from 'axios';
import { api } from './axios.config';
import type { Id, RegistroCuenta } from './types';
import type { Versioned } from './auth.service';

export interface RegistroAsesor {
  cuenta: RegistroCuenta;
  nombre_comercial: string;
  telefono_profesional: string;
  descripcion?: string | null;
}

export interface AsesorRegistrado {
  id: Id;
  cuenta_id: Id;
  nombre_comercial: string;
  estado_validacion: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  version: number;
}

export async function registerAdvisor(payload: RegistroAsesor): Promise<AsesorRegistrado> {
  const { data } = await api.post<AsesorRegistrado>('/asesores', payload);
  return data;
}

export interface DocumentoAsesor {
  id: Id;
  nombre: string;
  mime: string;
  tamano_bytes: number;
  estado: 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO';
}

export interface SolicitudAsesor {
  id: Id;
  asesor_id: Id;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  documentos: DocumentoAsesor[];
  version: number;
}

export interface AutorizacionDocumento {
  url: string;
  metodo: 'PUT';
  headers: Record<string, string>;
  comprobante: string;
  expira_at: string;
}

export async function getOwnAdvisor(): Promise<AsesorRegistrado> {
  const { data } = await api.get<AsesorRegistrado>('/asesores/me');
  return data;
}

export async function getOwnApplication(): Promise<Versioned<SolicitudAsesor>> {
  const response = await api.get<SolicitudAsesor>('/asesores/me/solicitud');
  return { value: response.data, etag: response.headers.etag as string };
}

export async function authorizeAdvisorDocument(payload: {
  tipo: 'IDENTIFICACION_OFICIAL' | 'CONSTANCIA_ACTIVIDAD_INMOBILIARIA';
  nombre: string;
  mime: 'application/pdf' | 'image/jpeg' | 'image/webp';
  tamano_bytes: number;
  sha256: string;
}): Promise<AutorizacionDocumento> {
  const { data } = await api.post<AutorizacionDocumento>(
    '/asesores/me/solicitud/documentos/autorizaciones', payload,
  );
  return data;
}

export async function uploadAdvisorDocumentDirect(
  authorization: AutorizacionDocumento, file: Blob,
): Promise<void> {
  await axios.put(authorization.url, file, { headers: authorization.headers, timeout: 60_000 });
}

export async function confirmAdvisorDocument(comprobante: string): Promise<DocumentoAsesor> {
  const { data } = await api.post<DocumentoAsesor>(
    '/asesores/me/solicitud/documentos/confirmaciones', { comprobante },
  );
  return data;
}

export async function resubmitAdvisorApplication(): Promise<Versioned<SolicitudAsesor>> {
  const response = await api.post<SolicitudAsesor>('/asesores/me/solicitudes');
  return { value: response.data, etag: response.headers.etag as string };
}

export async function getAdminApplications(params: { limit?: number; cursor?: string } = {}): Promise<{
  items: SolicitudAsesor[];
  next_cursor: string | null;
}> {
  const { data } = await api.get('/admin/solicitudes', { params });
  return data;
}

export async function getAdminApplication(id: Id): Promise<Versioned<SolicitudAsesor>> {
  const response = await api.get<SolicitudAsesor>(`/admin/solicitudes/${encodeURIComponent(id)}`);
  return { value: response.data, etag: `"v${response.data.version}"` };
}

export async function getAdminDocumentUrl(id: Id): Promise<{ url: string; expires_at: string }> {
  const { data } = await api.get(`/admin/documentos/${encodeURIComponent(id)}/url`);
  return data;
}

export async function decideAdvisorApplication(
  id: Id, decision: 'APROBAR' | 'RECHAZAR', motivo: string | null, etag: string,
): Promise<Versioned<SolicitudAsesor>> {
  const response = await api.post<SolicitudAsesor>(
    `/admin/solicitudes/${encodeURIComponent(id)}/decision`,
    { decision, motivo },
    { headers: { 'If-Match': etag } },
  );
  return { value: response.data, etag: `"v${response.data.version}"` };
}
