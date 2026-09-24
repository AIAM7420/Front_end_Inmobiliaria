import { api } from './axios.config';
import type { Versioned } from './auth.service';
import type { Id } from './types';

export interface Plan {
  id: Id;
  codigo: string;
  nombre: string;
  precio: string;
  moneda: string;
  limite_propiedades: number;
  duracion_cantidad: number;
  duracion_unidad: string;
  beneficios: string[];
}

export interface Suscripcion {
  id: Id | null;
  asesor_id: Id;
  version_plan_id: Id | null;
  version_plan_siguiente_id: Id | null;
  estado: string;
  periodo: { inicio_at: string; fin_at: string } | null;
  limite_propiedades: number;
  propiedades_en_cupo: number;
  capacidad_disponible: number;
  renovacion_automatica: boolean;
  version: number;
}

export interface Pago {
  id: Id;
  solicitud_id: string;
  estado: string;
  version_plan_id: Id;
  checkout_url: string | null;
  confirmado_at: string | null;
}

export async function getPlans(): Promise<Plan[]> {
  const { data } = await api.get<Plan[]>('/planes');
  return data;
}

export async function getSubscription(): Promise<Versioned<Suscripcion>> {
  const response = await api.get<Suscripcion>('/me/suscripcion');
  return { value: response.data, etag: response.headers.etag as string };
}

export async function selectPlan(versionPlanId: Id, etag: string): Promise<Versioned<Suscripcion>> {
  const response = await api.put<Suscripcion>(
    '/me/seleccion-plan', { version_plan_id: Number(versionPlanId) },
    { headers: { 'If-Match': etag } },
  );
  return { value: response.data, etag: response.headers.etag as string };
}

export async function createPayment(versionPlanId: Id, requestId: string): Promise<Pago> {
  const { data } = await api.post<Pago>('/me/pagos', {
    solicitud_id: requestId, version_plan_id: Number(versionPlanId),
  });
  return data;
}

export async function createPortalSession(): Promise<{ url: string }> {
  const { data } = await api.post<{ url: string }>('/me/pagos/portal');
  return data;
}
