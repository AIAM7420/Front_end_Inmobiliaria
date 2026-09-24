import { api } from './axios.config';
import type { Cuenta, Id, Pagina, PropiedadPrivada } from './types';
import type { Versioned } from './auth.service';
import type { Suscripcion } from './subscriptions.service';

export interface ReporteAdministrativo {
  id: Id;
  estado: string;
  reportante_id: Id;
  tipo_objetivo: string;
  objetivo_id: Id;
  conversacion_id: Id | null;
  categoria: string;
  motivo: string;
  resolucion: string | null;
  registrado_at: string;
  resuelto_at: string | null;
}

export interface PageParams {
  limit?: number;
  cursor?: string;
}

export async function getAdminAccounts(params: PageParams = {}): Promise<Pagina<Cuenta>> {
  const { data } = await api.get<Pagina<Cuenta>>('/admin/cuentas', { params });
  return data;
}

export async function getAdminReports(params: PageParams & { estado?: string } = {}): Promise<Pagina<ReporteAdministrativo>> {
  const { data } = await api.get<Pagina<ReporteAdministrativo>>('/admin/reportes', { params });
  return data;
}

export async function getAdminAccount(id: Id): Promise<Versioned<Cuenta>> {
  const response = await api.get<Cuenta>(`/admin/cuentas/${encodeURIComponent(id)}`);
  return { value: response.data, etag: response.headers.etag as string };
}

export async function changeAdminAccountState(
  id: Id, accion: 'ACTIVAR' | 'INACTIVAR', motivo: string, etag: string,
): Promise<Versioned<Cuenta>> {
  const response = await api.put<Cuenta>(
    `/admin/cuentas/${encodeURIComponent(id)}/estado`, { accion, motivo },
    { headers: { 'If-Match': etag } },
  );
  return { value: response.data, etag: response.headers.etag as string };
}

export async function resolveAdminReport(
  id: Id, accion: 'DESCARTAR' | 'PAUSAR_PROPIEDAD' | 'DESACTIVAR_CUENTA' | 'OCULTAR_MENSAJE',
  motivo: string,
): Promise<{ id: Id; estado: string }> {
  const { data } = await api.post<{ id: Id; estado: string }>(
    `/admin/reportes/${encodeURIComponent(id)}/resolver`, { accion, motivo },
  );
  return data;
}

export async function getAdminProperty(id: Id): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.get<PropiedadPrivada>(`/admin/propiedades/${encodeURIComponent(id)}`);
  return { value: response.data, etag: response.headers.etag as string };
}

export async function getAdminProperties(params: PageParams & { estado?: string } = {}): Promise<Pagina<PropiedadPrivada>> {
  const { data } = await api.get<Pagina<PropiedadPrivada>>('/admin/propiedades', { params });
  return data;
}

export async function moderateAdminProperty(
  id: Id, accion: 'PAUSAR' | 'ARCHIVAR', motivo: string, etag: string,
): Promise<Versioned<PropiedadPrivada>> {
  const response = await api.post<PropiedadPrivada>(
    `/admin/propiedades/${encodeURIComponent(id)}/moderacion`, { accion, motivo },
    { headers: { 'If-Match': etag } },
  );
  return { value: response.data, etag: response.headers.etag as string };
}

export interface AuditEntry {
  id: Id;
  modulo: string;
  accion: string;
  resultado: string;
  fecha: string;
  trace_id: string;
}

export async function getAdminSubscriptions(params: PageParams = {}): Promise<Pagina<Suscripcion>> {
  const { data } = await api.get<Pagina<Suscripcion>>('/admin/suscripciones', { params });
  return data;
}

export async function getAdminAudit(params: PageParams = {}): Promise<Pagina<AuditEntry>> {
  const { data } = await api.get<Pagina<AuditEntry>>('/admin/auditoria', { params });
  return data;
}
