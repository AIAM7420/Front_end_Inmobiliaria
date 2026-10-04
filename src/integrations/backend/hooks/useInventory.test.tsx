import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getOwnProperties } from '../properties.service';
import type { PropiedadPrivada } from '../types';
import { useGetInventory } from './useProperties';

vi.mock('../properties.service');
afterEach(() => { cleanup(); vi.clearAllMocks(); });
function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return renderHook(() => useGetInventory(), { wrapper: ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider> });
}
const property = (id: string, version = 1) => ({ id, version }) as PropiedadPrivada;
describe('complete inventory', () => {
  it('loads every cursor, preserves BIGINT string IDs, and uses the latest duplicate', async () => {
    vi.mocked(getOwnProperties).mockResolvedValueOnce({ items: Array.from({ length: 100 }, (_, i) => property(String(i))), next_cursor: 'second' })
      .mockResolvedValueOnce({ items: [property('9007199254740993'), property('3', 2)], next_cursor: 'third' })
      .mockResolvedValueOnce({ items: [property('9007199254740994')], next_cursor: null });
    const { result } = setup();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(102);
    expect(result.current.data?.items.find(item => item.id === '3')?.version).toBe(2);
    expect(result.current.data?.items.at(-1)?.id).toBe('9007199254740994');
    expect(getOwnProperties).toHaveBeenNthCalledWith(2, { limit: 100, cursor: 'second' }, expect.any(AbortSignal));
  });
  it('reports a broken cursor instead of looping forever or showing partial counts', async () => {
    vi.mocked(getOwnProperties).mockResolvedValue({ items: [property('1')], next_cursor: 'repeated' });
    const { result } = setup();
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getOwnProperties).toHaveBeenCalledTimes(2);
    expect(result.current.data).toBeUndefined();
  });
});
