import { versioned } from './versioning';
import { api } from './axios.config';
import type { Cuenta, Id, Pagina, PropiedadPrivada, Fotografia } from './types';
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

export interface AccountSummary { id: Id; asesor_id: Id | null; perfil_publico: boolean; creada_at: string; ultimo_acceso_at: string | null; baja_permanente: boolean; propiedades: number; plan: string | null; inventario_reciente: Array<{ id: Id; titulo: string; precio: string; estado: string }> }
export async function getAccountSummary(id: Id): Promise<AccountSummary> { return (await api.get<AccountSummary>(`/admin/cuentas/${id}/resumen`)).data; }
export async function getAdminPhotos(id: Id): Promise<Fotografia[]> { return (await api.get<Fotografia[]>(`/admin/propiedades/${id}/fotografias`)).data; }
export async function getAdminPhotoUrl(id: Id, photo: Id): Promise<{ url: string; expira_at: string }> { return (await api.get<{ url: string; expira_at: string }>(`/admin/propiedades/${id}/fotografias/${photo}/url`)).data; }

export async function getAdminAccounts(params: PageParams & { texto?: string; estado?: string } = {}): Promise<Pagina<Cuenta>> {
  const { data } = await api.get<Pagina<Cuenta>>('/admin/cuentas', { params });
  return data;
}

export async function getAdminReports(params: PageParams & { estado?: string; texto?: string; tipo?: string } = {}): Promise<Pagina<ReporteAdministrativo>> {
  const { data } = await api.get<Pagina<ReporteAdministrativo>>('/admin/reportes', { params });
  return data;
}

export async function getAdminReport(id: Id): Promise<ReporteAdministrativo> {
  const { data } = await api.get<ReporteAdministrativo>(`/admin/reportes/${encodeURIComponent(id)}`);
  return data;
}

export async function getAdminAccount(id: Id): Promise<Versioned<Cuenta>> {
  const response = await api.get<Cuenta>(`/admin/cuentas/${encodeURIComponent(id)}`);
  return versioned(response.data);
}

export async function changeAdminAccountState(
  id: Id, accion: 'ACTIVAR' | 'INACTIVAR', motivo: string, etag: string,
): Promise<Versioned<Cuenta>> {
  const response = await api.put<Cuenta>(
    `/admin/cuentas/${encodeURIComponent(id)}/estado`, { accion, motivo },
    { headers: { 'If-Match': etag } },
  );
  return versioned(response.data);
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
  return versioned(response.data);
}

export async function getAdminProperties(params: PageParams & { estado?: string; texto?: string; asesor_id?: string } = {}): Promise<Pagina<PropiedadPrivada>> {
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
  return versioned(response.data);
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
