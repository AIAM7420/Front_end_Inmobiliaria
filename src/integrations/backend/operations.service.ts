import { api } from './axios.config';
import type { Pagina } from './types';

export interface Preferencias { tema: 'CLARO' | 'OSCURO' | 'SISTEMA'; alertas_correo: boolean; idioma: string; zona_horaria: string; version: number }
export interface SolicitudSoporte { id: string; nombre: string; asunto: string; categoria: string; estado: 'ABIERTA' | 'EN_ATENCION' | 'CERRADA'; creada_at: string; actualizada_at: string; version: number; historial?: Array<{ id: string; nombre: string; administrador: boolean; contenido: string; estado_resultante: string; creada_at: string }> }
export interface Respaldo { id: string; tipo: string; estado: 'EN_COLA' | 'EN_PROCESO' | 'LISTO' | 'FALLIDO'; intentos: number; error_codigo: string | null; creada_at: string; terminada_at: string | null; version: number }
export interface Configuracion { clave: string; valor: string; version: number }
export interface Sistema { api: string; base_datos: string; entorno: string; version: string; correo_proveedor: string; archivos_proveedor: string; pagos_proveedor: string; pagos_modo: string; configuracion: Configuracion[]; consultado_at: string }
export interface EventoSistema { id: string; accion: string; modulo: string; resultado: string; entidad: string; entidad_id: string; ocurrida_at: string }
export interface Ayuda { id: string; titulo: string; contenido: string }

export async function getPreferences(): Promise<Preferencias> { return (await api.get<Preferencias>('/me/preferencias')).data; }
export async function savePreferences(value: Pick<Preferencias, 'tema' | 'alertas_correo'>, version: number): Promise<Preferencias> { return (await api.put<Preferencias>('/me/preferencias', value, { headers: { 'If-Match': `"v${version}"` } })).data; }
export async function changePassword(current: string, replacement: string, etag: string): Promise<void> { await api.put('/me/contrasena', { actual: current, nueva: replacement }, { headers: { 'If-Match': etag } }); }
export async function closeAccount(password: string, confirmation: string, etag: string): Promise<{ baja_permanente: boolean; limpieza_pendiente: boolean }> { return (await api.post('/me/baja-permanente', { contrasena: password, confirmacion: confirmation }, { headers: { 'If-Match': etag } })).data; }
export async function getHelp(): Promise<Ayuda[]> { return (await api.get<Ayuda[]>('/ayuda')).data; }
export async function getSupport(admin: boolean, cursor?: string): Promise<Pagina<SolicitudSoporte>> { return (await api.get<Pagina<SolicitudSoporte>>(admin ? '/admin/soporte' : '/me/soporte', { params: { limit: 20, cursor } })).data; }
export async function getTicket(admin: boolean, id: string): Promise<SolicitudSoporte> { return (await api.get<SolicitudSoporte>((admin ? '/admin/soporte/' : '/me/soporte/') + id)).data; }
export async function createTicket(payload: { solicitud_id: string; asunto: string; categoria: string; contenido: string }): Promise<SolicitudSoporte> { return (await api.post<SolicitudSoporte>('/me/soporte', payload)).data; }
export async function replyTicket(admin: boolean, id: string, payload: { mensaje_id: string; contenido: string; estado?: SolicitudSoporte['estado'] }, version: number): Promise<SolicitudSoporte> { return (await api.post<SolicitudSoporte>((admin ? '/admin/soporte/' : '/me/soporte/') + id + '/respuestas', payload, { headers: { 'If-Match': `"v${version}"` } })).data; }
export async function getSystem(): Promise<Sistema> { return (await api.get<Sistema>('/admin/sistema')).data; }
export async function saveConfiguration(key: string, value: string, version: number): Promise<Configuracion> { return (await api.put<Configuracion>('/admin/configuracion/' + key, { valor: value }, { headers: { 'If-Match': `"v${version}"` } })).data; }
export async function getEvents(cursor?: string): Promise<Pagina<EventoSistema>> { return (await api.get<Pagina<EventoSistema>>('/admin/sistema/eventos', { params: { limit: 50, cursor } })).data; }
export async function getBackups(cursor?: string): Promise<Pagina<Respaldo>> { return (await api.get<Pagina<Respaldo>>('/admin/respaldos', { params: { limit: 20, cursor } })).data; }
export async function requestBackup(password: string, requestId: string): Promise<Respaldo> { return (await api.post<Respaldo>('/admin/respaldos', { contrasena: password, solicitud_id: requestId })).data; }
export async function downloadBackup(id: string, password: string): Promise<{ url: string; expira_at: string }> { return (await api.post<{ url: string; expira_at: string }>(`/admin/respaldos/${id}/descarga`, { contrasena: password })).data; }
export async function downloadCSV(dataset: 'usuarios' | 'publicaciones' | 'pagos' | 'suscripciones' | 'reportes', filters: { texto?: string; estado?: string; asesor_id?: string; tipo?: string }): Promise<void> {
  const response = await api.get<Blob>(`/admin/exportaciones/${dataset}.csv`, { params: filters, responseType: 'blob' });
  const url = URL.createObjectURL(response.data), anchor = document.createElement('a'); anchor.href = url; anchor.download = `inmo-${dataset}.csv`; anchor.click(); URL.revokeObjectURL(url);
}
