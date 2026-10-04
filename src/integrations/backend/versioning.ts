import axios from 'axios';
import type { Versioned } from './auth.service';

/** V1 uses a quoted application version, never a random or weak transport ETag. */
export function versioned<T extends { version: number }>(value: T, { allowInitialZero = false }: { allowInitialZero?: boolean } = {}): Versioned<T> {
  if (!Number.isSafeInteger(value.version) || value.version < (allowInitialZero ? 0 : 1)) {
    throw new Error('La API no entregó una versión válida. Actualiza los datos antes de guardar.');
  }
  return { value, etag: '"v' + value.version + '"' };
}
export function isVersionConflict(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 412;
}
export function operationError(error: unknown): string {
  if (isVersionConflict(error)) return 'Los datos cambiaron. Conservamos tus cambios; revisa la versión actual antes de volver a guardar.';
  if (axios.isAxiosError(error)) {
    const body = error.response?.data;
    return body?.detail ?? body?.title ?? 'No fue posible completar la operación.';
  }
  return error instanceof Error ? error.message : 'No fue posible completar la operación.';
}
