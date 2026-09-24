import axios from 'axios';
import type { ProblemDetails } from './types';

const configuredUrl: string | undefined = import.meta.env.VITE_API_BASE_URL;
if (!configuredUrl) {
  throw new Error('Falta VITE_API_BASE_URL');
}

export const apiBaseUrl = configuredUrl.replace(/\/$/, '');
const parsedUrl = new URL(apiBaseUrl);
if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.pathname.endsWith('/api/v1')) {
  throw new Error('VITE_API_BASE_URL debe terminar en /api/v1 y usar HTTP(S)');
}

export const api = axios.create({ baseURL: apiBaseUrl, timeout: 15_000 });

let accessToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (value: string | null) => {
  accessToken = value;
};
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

export function expireSession() {
  accessToken = null;
  unauthorizedHandler?.();
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

/** Returns an RFC 9457 body when the server supplied one. */
export function problemFromError(error: unknown): ProblemDetails | null {
  if (!axios.isAxiosError<ProblemDetails>(error)) return null;
  const body = error.response?.data;
  return body && typeof body === 'object' && typeof body.code === 'string' &&
    typeof body.trace_id === 'string' ? body : null;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        error.config?.url !== '/sesiones') {
      expireSession();
    }
    return Promise.reject(error);
  },
);
