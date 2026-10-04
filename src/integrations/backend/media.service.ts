import axios from 'axios';
import { api } from './axios.config';
export interface MediaFile { id: string; nombre: string; mime: string; tamano_bytes: number }
export async function uploadMedia(file: File, conversationId?: string): Promise<MediaFile> {
  if (!['application/pdf', 'image/jpeg', 'image/webp'].includes(file.type) || file.size < 1 || file.size > 5 * 1024 * 1024) throw new Error('Usa PDF, JPEG o WebP de hasta 5 MB.');
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  const sha256 = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  const path = conversationId ? `/conversaciones/${encodeURIComponent(conversationId)}/adjuntos/autorizaciones` : '/me/fotografia/autorizaciones';
  const { data } = await api.post<{ url: string; headers: Record<string, string>; comprobante: string }>(path, { nombre: file.name, mime: file.type, tamano_bytes: file.size, sha256 });
  // Object storage never receives the application's Authorization header.
  await axios.put(data.url, file, { headers: data.headers, timeout: 60_000 });
  return (await api.post<MediaFile>('/archivos/confirmaciones', { comprobante: data.comprobante })).data;
}
export async function mediaUrl(id: string): Promise<string> {
  return (await api.get<{ url: string }>(`/archivos/${encodeURIComponent(id)}/url`)).data.url;
}
export async function setAvatar(id: string, etag: string): Promise<void> {
  await api.put('/me/fotografia', { archivo_id: id }, { headers: { 'If-Match': etag } });
}
