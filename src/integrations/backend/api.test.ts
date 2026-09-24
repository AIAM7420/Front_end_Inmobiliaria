import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  api,
  getAccessToken,
  problemFromError,
  setAccessToken,
  setUnauthorizedHandler,
} from './axios.config';
import { getProperties, uploadPhotoDirect } from './properties.service';
import { getMessages, mergeMessages } from './chat.service';

const originalAdapter = api.defaults.adapter;

function response(config: InternalAxiosRequestConfig, data: unknown, status = 200): AxiosResponse {
  return { config, data, status, statusText: 'OK', headers: {} };
}

beforeEach(() => {
  setAccessToken(null);
  history.replaceState(null, '', '/login');
});

afterEach(() => {
  api.defaults.adapter = originalAdapter;
  setUnauthorizedHandler(null);
  setAccessToken(null);
  vi.restoreAllMocks();
});

describe('API transport', () => {
  it('injects the in-memory Bearer token and preserves the cursor', async () => {
    setAccessToken('test.jwt.value');
    let observed: InternalAxiosRequestConfig | undefined;
    api.defaults.adapter = async (config) => {
      observed = config;
      return response(config, { items: [], next_cursor: 'next' });
    };

    const page = await getProperties({ limit: 10, cursor: 'previous' });

    expect(observed?.headers.get('Authorization')).toBe('Bearer test.jwt.value');
    expect(observed?.url).toBe('/propiedades');
    expect(observed?.params).toEqual({ limit: 10, cursor: 'previous' });
    expect(page.next_cursor).toBe('next');
  });

  it('keeps login 401 for the form and expires a protected session on 401', async () => {
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    setAccessToken('test.jwt.value');
    api.defaults.adapter = async (config) => {
      throw new AxiosError(
        'Unauthorized', 'ERR_BAD_REQUEST', config, undefined,
        response(config, {
          type: 'urn:excelencia:problem:credenciales-invalidas',
          title: 'No autorizado', status: 401, code: 'CREDENCIALES_INVALIDAS',
          trace_id: 'trace-test', instance: config.url,
        }, 401),
      );
    };

    await expect(api.post('/sesiones', {})).rejects.toBeInstanceOf(AxiosError);
    expect(getAccessToken()).toBe('test.jwt.value');
    await expect(api.get('/me')).rejects.toBeInstanceOf(AxiosError);
    expect(getAccessToken()).toBeNull();
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it('recognizes an RFC 9457 problem response', () => {
    const error = new AxiosError('bad');
    error.response = response({ url: '/me' } as InternalAxiosRequestConfig, {
      type: 'urn:excelencia:problem:solicitud-invalida', title: 'Solicitud inválida',
      status: 422, code: 'SOLICITUD_INVALIDA', trace_id: 'trace-test', instance: '/me',
    }, 422);
    expect(problemFromError(error)?.code).toBe('SOLICITUD_INVALIDA');
  });

  it('rejects cursor plus after_sequence before requesting chat history', async () => {
    await expect(getMessages('1', { cursor: 'a', after_sequence: '2' }))
      .rejects.toThrow('excluyentes');
  });

  it('uploads to R2 without the API Bearer interceptor', async () => {
    setAccessToken('test.jwt.value');
    const put = vi.spyOn(axios, 'put').mockResolvedValue(response({} as InternalAxiosRequestConfig, null));
    const blob = new Blob(['photo'], { type: 'image/jpeg' });
    await uploadPhotoDirect({
      url: 'https://example.com/signed', metodo: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' }, comprobante: 'receipt', expira_at: '2026-09-23T00:00:00Z',
    }, blob);
    expect(put).toHaveBeenCalledWith('https://example.com/signed', blob, {
      headers: { 'Content-Type': 'image/jpeg' }, timeout: 60_000,
    });
  });

  it('deduplicates REST recovery and socket events by composite message identity', () => {
    const message = {
      conversacion_id: '7', secuencia: '9007199254740993', emisor_id: '1',
      cliente_mensaje_id: '00000000-0000-0000-0000-000000000001',
      contenido: 'Hola', persistido_at: '2026-09-23T00:00:00Z',
    };
    const earlier = { ...message, secuencia: '9007199254740992' };
    expect(mergeMessages([message], [message, earlier]).map((item) => item.secuencia))
      .toEqual(['9007199254740992', '9007199254740993']);
  });
});
