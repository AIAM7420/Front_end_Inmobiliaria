import { api } from './axios.config';
import type { Aceptada, Cuenta, InicioSesion, RegistroCuenta, Sesion } from './types';

export interface Versioned<T> {
  value: T;
  etag: string;
}

export async function registerAccount(payload: RegistroCuenta): Promise<Versioned<Cuenta>> {
  const response = await api.post<Cuenta>('/cuentas', payload);
  return { value: response.data, etag: response.headers.etag as string };
}

export async function login(payload: InicioSesion): Promise<Sesion> {
  const { data } = await api.post<Sesion>('/sesiones', payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.delete('/sesiones/actual');
}

export async function getMe(): Promise<Versioned<Cuenta>> {
  const response = await api.get<Cuenta>('/me');
  return { value: response.data, etag: response.headers.etag as string };
}

export async function updateMe(
  payload: { nombre?: string; telefono?: string | null },
  etag: string,
): Promise<Versioned<Cuenta>> {
  const response = await api.patch<Cuenta>('/me', payload, { headers: { 'If-Match': etag } });
  return { value: response.data, etag: response.headers.etag as string };
}

export async function confirmEmail(token: string): Promise<Aceptada> {
  const { data } = await api.post<Aceptada>('/auth/correo/confirmar', { token });
  return data;
}

export async function requestPasswordRecovery(correo: string): Promise<Aceptada> {
  const { data } = await api.post<Aceptada>('/auth/contrasena/recuperacion', { correo });
  return data;
}

export async function resetPassword(token: string, nueva_contrasena: string): Promise<Aceptada> {
  const { data } = await api.post<Aceptada>('/auth/contrasena/restablecer', {
    token,
    nueva_contrasena,
  });
  return data;
}
