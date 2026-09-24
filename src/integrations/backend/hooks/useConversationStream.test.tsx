import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatServerFrame, Mensaje } from '../types';
import { useConversationStream } from './useConversationStream';

const mocked = vi.hoisted(() => ({
  onFrame: null as ((frame: ChatServerFrame) => void) | null,
  onAuthenticated: null as (() => void) | null,
  getMessages: vi.fn(),
}));

const original: Mensaje = {
  conversacion_id: '7', secuencia: '1', emisor_id: '2',
  cliente_mensaje_id: 'a', contenido: 'Primero', persistido_at: '2026-09-23T00:00:00Z',
};
const missed: Mensaje = { ...original, secuencia: '2', cliente_mensaje_id: 'b', contenido: 'Después' };

vi.mock('./useChat', () => ({
  useGetMessages: () => ({
    data: { items: [original], next_cursor: null },
    isLoading: false, isError: false, refetch: vi.fn(),
  }),
}));
vi.mock('./useChatWebSocket', () => ({
  useChatWebSocket: (_token: string | null, onFrame: (frame: ChatServerFrame) => void,
    onAuthenticated: () => void) => {
    mocked.onFrame = onFrame;
    mocked.onAuthenticated = onAuthenticated;
    return { status: 'conectado' };
  },
}));
vi.mock('../chat.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../chat.service')>();
  return { ...actual, getMessages: mocked.getMessages };
});

beforeEach(() => {
  mocked.getMessages.mockReset();
});

describe('conversation stream', () => {
  it('merges a committed REST response, socket replay and missed REST messages once', async () => {
    mocked.getMessages.mockResolvedValue({ items: [missed], next_cursor: null });
    const { result } = renderHook(() => useConversationStream('7'));

    act(() => {
      result.current.includeCommitted(missed);
      mocked.onFrame?.({ type: 'message.created', mensaje: missed });
    });
    expect(result.current.items.map((item) => item.secuencia)).toEqual(['1', '2']);

    act(() => mocked.onAuthenticated?.());
    await waitFor(() => expect(mocked.getMessages).toHaveBeenCalledWith('7', {
      after_sequence: '2', limit: 100,
    }));
    expect(result.current.items.map((item) => item.secuencia)).toEqual(['1', '2']);
  });
});
