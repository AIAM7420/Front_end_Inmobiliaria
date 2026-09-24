import { api } from './axios.config';
import type {
  Conversacion,
  ConversacionCrear,
  Id,
  Mensaje,
  MensajeCrear,
  Pagina,
} from './types';

export interface PageParams {
  limit?: number;
  cursor?: string;
}

export async function createConversation(payload: ConversacionCrear): Promise<Conversacion> {
  const { data } = await api.post<Conversacion>('/conversaciones', payload);
  return data;
}

export async function getConversations(params: PageParams = {}): Promise<Pagina<Conversacion>> {
  const { data } = await api.get<Pagina<Conversacion>>('/conversaciones', { params });
  return data;
}

export type MessagePageParams = PageParams & { after_sequence?: string };

export async function getMessages(
  conversationId: Id,
  params: MessagePageParams = {},
): Promise<Pagina<Mensaje>> {
  if (params.cursor !== undefined && params.after_sequence !== undefined) {
    throw new Error('cursor y after_sequence son excluyentes');
  }
  const { data } = await api.get<Pagina<Mensaje>>(
    `/conversaciones/${encodeURIComponent(conversationId)}/mensajes`, { params },
  );
  return data;
}

/** A replay with the same UUID/content returns the original message (HTTP 200). */
export async function sendMessage(conversationId: Id, payload: MensajeCrear): Promise<Mensaje> {
  const { data } = await api.post<Mensaje>(
    `/conversaciones/${encodeURIComponent(conversationId)}/mensajes`, payload,
  );
  return data;
}

/** Combine REST recovery, message.ack and message.created without duplicate rows. */
export function mergeMessages(current: Mensaje[], incoming: Mensaje[]): Mensaje[] {
  const byIdentity = new Map<string, Mensaje>();
  for (const message of [...current, ...incoming]) {
    byIdentity.set(`${message.conversacion_id}:${message.secuencia}`, message);
  }
  return [...byIdentity.values()].sort((left, right) => {
    const a = BigInt(left.secuencia);
    const b = BigInt(right.secuencia);
    return a < b ? -1 : a > b ? 1 : 0;
  });
}
