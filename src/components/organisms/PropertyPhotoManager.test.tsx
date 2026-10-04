import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { PropiedadPrivada, Fotografia } from '../../integrations/backend/types';
import { PropertyPhotoManager } from './PropertyPhotoManager';

const mocks = vi.hoisted(() => ({ save: vi.fn(), review: vi.fn(), reviewPhotos: vi.fn() }));
const photos = [{ id: '1', posicion: 1 }, { id: '2', posicion: 2 }] as Fotografia[];
vi.mock('../../integrations/backend/hooks/useProperties', () => ({
  useGetOwnPhotoUrl: () => ({ data: undefined }),
  useGetOwnProperty: () => ({ data: { value: { version: 9 } }, refetch: mocks.review }),
  useGetOwnPhotos: () => ({ data: [...photos, { id: '3', posicion: 3 }], refetch: mocks.reviewPhotos }),
  usePropertyManagement: () => ({ photoOrder: { mutateAsync: mocks.save, isPending: false }, removePhoto: { isPending: false } }),
}));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

it('keeps photo order after 412, includes concurrent uploads only after review and requires an explicit save', async () => {
  mocks.save.mockRejectedValueOnce({ isAxiosError: true, response: { status: 412 } }).mockResolvedValue({});
  mocks.review.mockResolvedValue({ isError: false }); mocks.reviewPhotos.mockResolvedValue({ isError: false });
  render(<PropertyPhotoManager property={{ id: '9007199254740993', version: 1 } as PropiedadPrivada} photos={photos} />);
  fireEvent.click(screen.getByRole('button', { name: 'Mover foto 2 antes' }));
  fireEvent.click(screen.getByRole('button', { name: 'Guardar orden de fotos' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Guardar orden de fotos' }).hasAttribute('disabled')).toBe(true));
  expect(mocks.save).toHaveBeenCalledExactlyOnceWith({ id: '9007199254740993', ids: ['2', '1'], etag: '"v1"' });
  fireEvent.click(screen.getByRole('button', { name: 'Revisar versión actual' }));
  const accept = await screen.findByRole('button', { name: 'He revisado; conservar mis cambios' });
  fireEvent.click(accept);
  expect(mocks.save).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: 'Guardar orden de fotos' }));
  await waitFor(() => expect(mocks.save).toHaveBeenLastCalledWith({ id: '9007199254740993', ids: ['2', '1', '3'], etag: '"v9"' }));
});
