import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { PropertyDetailContent } from './PropertyDetailContent';
import type { PropiedadPublica } from '../../integrations/backend/types';
import { useGetOwnPhotos, useGetPhotos } from '../../integrations/backend/hooks/useProperties';
vi.mock('../../integrations/backend/hooks/useProperties', () => ({
  useGetCatalog: () => ({ data: [] }),
  useGetPhotos: vi.fn(() => ({ data: [], isLoading: false })),
  useGetOwnPhotos: vi.fn(() => ({ data: [], isLoading: false })),
  useGetPhotoUrl: () => ({ data: undefined }), useGetOwnPhotoUrl: () => ({ data: undefined }),
}));
vi.mock('../molecules/PropertyMiniMap', () => ({ PropertyMiniMap: ({ position, privateLocation }: {position:unknown; privateLocation:boolean}) => <div data-testid="position">{JSON.stringify({ position, privateLocation })}</div> }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
const property: PropiedadPublica = { id: '8', asesor_id: '2', tipo_id: '1', operacion_id: '1', zona_id: '1', titulo: 'Casa pública', precio: '1000000', moneda: 'MXN' };
it('does not expose injected private coordinates or address in the public detail', () => {
  render(<PropertyDetailContent property={{ ...property, direccion: 'Calle privada 42', latitud: '21.123456', longitud: '-101.654321' } as PropiedadPublica} />);
  expect(screen.queryByText(/Calle privada/)).toBeNull();
  expect(screen.getByTestId('position').textContent).toBe('{"position":null,"privateLocation":false}');
  expect(useGetPhotos).toHaveBeenCalledWith('8', true);
  expect(useGetOwnPhotos).toHaveBeenCalledWith('8', false);
});
