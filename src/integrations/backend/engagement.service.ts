import { api } from './axios.config';
import type { Pagina, PropiedadPublica } from './types';

export interface Favorito { propiedad_id: string; publicacion_disponible: boolean; propiedad: PropiedadPublica | null }
export interface PerfilPublico { id: string; nombre_comercial: string; descripcion: string | null; validado: boolean; incorporado_at: string; propiedades_publicas: number; fotografia_url: string | null }
export interface PerfilProfesional { id: string; nombre_comercial: string | null; descripcion: string | null; telefono_profesional: string | null; creado_at: string; version: number }
export interface Estadisticas { desde: string; hasta: string; instrumentacion_desde: string; zona_horaria: string; propiedades: number; visitas: number; contactos: number; ingresos_confirmados_mxn: string; estados: Record<string, number>; ranking: Array<{ id: string; titulo: string; visitas: number; contactos: number; estado: string }>; zonas: Array<{ id: string; nombre: string; propiedades: number; visitas: number; area_aproximada: Record<string, unknown> | null }>; serie_visitas: Array<{ dia: string; visitas: number }> }
export interface Estadisticas { favoritos: number; mensajes_no_leidos?: number; valor_portafolio_mxn: string; tipos: Array<{ id: string; nombre: string; propiedades: number; valor_mxn: string }>; usuarios_por_rol?: Record<string, number>; usuarios_nuevos?: number; bajas_permanentes?: number }
export interface PagoReal { id: string; asesor: string; suscripcion_id: string; estado: string; monto_confirmado: string | null; moneda: string | null; proveedor: string; creado_at: string; confirmado_at: string | null }
export interface Estadisticas { serie_contactos: Array<{ dia: string; contactos: number }>; suscripciones_por_plan?: Record<string, number>; reportes_pendientes?: number; autorizaciones_pendientes?: number }

export async function getFavorites(cursor?: string): Promise<Pagina<Favorito>> { return (await api.get<Pagina<Favorito>>('/me/favoritos', { params: { limit: 100, cursor } })).data; }
export async function favoriteState(id: string): Promise<boolean> { return (await api.get<{ favorito: boolean }>('/me/favoritos/' + id)).data.favorito; }
export async function setFavorite(id: string, enabled: boolean): Promise<void> { if (enabled) await api.put('/me/favoritos/' + id); else await api.delete('/me/favoritos/' + id); }
export async function getPublicAdvisor(id: string): Promise<PerfilPublico> { return (await api.get<PerfilPublico>('/asesores/' + id)).data; }
export async function getAdvisorPortfolio(id: string, cursor?: string): Promise<Pagina<PropiedadPublica>> { return (await api.get<Pagina<PropiedadPublica>>(`/asesores/${id}/propiedades`, { params: { limit: 20, cursor } })).data; }
export async function getProfessionalProfile(): Promise<PerfilProfesional> { return (await api.get<PerfilProfesional>('/asesores/me/perfil')).data; }
export async function updateProfessionalProfile(payload: Pick<PerfilProfesional, 'nombre_comercial' | 'descripcion' | 'telefono_profesional'>, version: number): Promise<PerfilProfesional> { return (await api.patch<PerfilProfesional>('/asesores/me/perfil', payload, { headers: { 'If-Match': `"v${version}"` } })).data; }
export async function getStatistics(admin: boolean, days: number): Promise<Estadisticas> { return (await api.get<Estadisticas>(admin ? '/admin/estadisticas' : '/me/estadisticas', { params: { dias: days } })).data; }
export async function getPayments(admin: boolean, cursor?: string, filters: { texto?: string; estado?: string } = {}): Promise<Pagina<PagoReal>> { return (await api.get<Pagina<PagoReal>>(admin ? '/admin/pagos' : '/me/pagos', { params: { limit: 100, cursor, ...filters } })).data; }
export async function registerVisit(id: string): Promise<void> {
  let visitor = localStorage.getItem('inmo_visitor');
  if (!visitor || !/^[0-9a-f-]{36}$/i.test(visitor)) { visitor = crypto.randomUUID(); localStorage.setItem('inmo_visitor', visitor); }
  await api.post('/eventos/vistas', { propiedad_id: id, visitante_id: visitor });
}
