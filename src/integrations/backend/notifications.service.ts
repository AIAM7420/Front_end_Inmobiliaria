import { api } from './axios.config';
import type { Id, Pagina } from './types';

export interface Notificacion {
  id: Id;
  tipo: string;
  leida_at: string | null;
  creada_at: string;
}

export async function getNotifications(params: { limit?: number; cursor?: string } = {}): Promise<Pagina<Notificacion>> {
  const { data } = await api.get<Pagina<Notificacion>>('/me/notificaciones', { params });
  return data;
}

export async function markNotificationRead(id: Id): Promise<Notificacion> {
  const { data } = await api.patch<Notificacion>(`/me/notificaciones/${encodeURIComponent(id)}/leida`);
  return data;
}
