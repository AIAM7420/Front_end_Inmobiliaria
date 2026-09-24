import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAccessToken, setAccessToken } from '../axios.config';
import { useChatWebSocket } from './useChatWebSocket';

class FakeWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 3;
  static sockets: FakeWebSocket[] = [];

  readonly url: URL;
  readyState = FakeWebSocket.CONNECTING;
  sent: string[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: ((event: { code: number }) => void) | null = null;

  constructor(url: URL) {
    this.url = url;
    FakeWebSocket.sockets.push(this);
  }

  open() {
    this.readyState = FakeWebSocket.OPEN;
    this.onopen?.();
  }

  receive(value: unknown) {
    this.onmessage?.({ data: JSON.stringify(value) });
  }

  send(value: string) {
    this.sent.push(value);
  }

  close(code = 1000) {
    this.readyState = FakeWebSocket.CLOSED;
    this.onclose?.({ code });
  }
}

const realWebSocket = globalThis.WebSocket;

beforeEach(() => {
  FakeWebSocket.sockets = [];
  globalThis.WebSocket = FakeWebSocket as unknown as typeof WebSocket;
  history.replaceState(null, '', '/login');
});

afterEach(() => {
  globalThis.WebSocket = realWebSocket;
  setAccessToken(null);
  vi.useRealTimers();
});

describe('chat WebSocket', () => {
  it('sends auth first, without JWT in the URL, and waits for auth.ok', () => {
    const onFrame = vi.fn();
    const onAuthenticated = vi.fn();
    const { result, unmount } = renderHook(() =>
      useChatWebSocket('test.jwt.value', onFrame, onAuthenticated));
    const socket = FakeWebSocket.sockets[0];

    expect(socket.url.pathname).toBe('/api/v1/ws/chat');
    expect(socket.url.search).toBe('');
    expect(result.current.status).toBe('conectando');
    act(() => socket.open());
    expect(JSON.parse(socket.sent[0])).toEqual({ type: 'auth', access_token: 'test.jwt.value' });
    expect(result.current.status).toBe('conectando');
    act(() => socket.receive({ type: 'auth.ok', cuenta_id: '1', expires_at: '2026-09-23T00:00:00Z' }));
    expect(result.current.status).toBe('conectado');
    expect(onAuthenticated).toHaveBeenCalledOnce();
    expect(result.current.send({ type: 'ping', nonce: 'n1' })).toBe(true);
    unmount();
  });

  it('does not retry a 1008 policy close with the same token', () => {
    vi.useFakeTimers();
    setAccessToken('test.jwt.value');
    const { result, unmount } = renderHook(() =>
      useChatWebSocket('test.jwt.value', vi.fn(), vi.fn()));
    act(() => FakeWebSocket.sockets[0].close(1008));
    expect(getAccessToken()).toBeNull();
    expect(result.current.status).toBe('desconectado');
    act(() => vi.advanceTimersByTime(60_000));
    expect(FakeWebSocket.sockets).toHaveLength(1);
    unmount();
  });

  it('reconnects after a transient loss and requests history again', () => {
    vi.useFakeTimers();
    const onAuthenticated = vi.fn();
    const { unmount } = renderHook(() =>
      useChatWebSocket('test.jwt.value', vi.fn(), onAuthenticated));
    act(() => {
      FakeWebSocket.sockets[0].open();
      FakeWebSocket.sockets[0].receive({ type: 'auth.ok', cuenta_id: '1', expires_at: 'later' });
      FakeWebSocket.sockets[0].close(1006);
    });
    act(() => vi.advanceTimersByTime(2_000));
    expect(FakeWebSocket.sockets).toHaveLength(2);
    act(() => {
      FakeWebSocket.sockets[1].open();
      FakeWebSocket.sockets[1].receive({ type: 'auth.ok', cuenta_id: '1', expires_at: 'later' });
    });
    expect(onAuthenticated).toHaveBeenCalledTimes(2);
    unmount();
  });
});
