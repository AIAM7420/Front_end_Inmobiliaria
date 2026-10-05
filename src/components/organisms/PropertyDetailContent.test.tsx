import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
const context = vi.hoisted(() => ({ role: 'public' }));
vi.mock('../../context/AppContext', () => ({ useAppContext: () => context }));
vi.mock('../../integrations/backend/hooks/useAdministration', () => ({
  useGetAdminPhotos: vi.fn(() => ({ data: [], isLoading: false })),
  useGetAdminPhotoUrl: () => ({ data: undefined }),
}));
vi.mock('../molecules/PropertyMiniMap', () => ({ PropertyMiniMap: ({ position, privateLocation }: {position:unknown; privateLocation:boolean}) => <div data-testid="position">{JSON.stringify({ position, privateLocation })}</div> }));
afterEach(() => { cleanup(); vi.clearAllMocks(); context.role = 'public'; });
const property: PropiedadPublica = { id: '8', asesor_id: '2', tipo_id: '1', operacion_id: '1', zona_id: '1', titulo: 'Casa pública', precio: '1000000', moneda: 'MXN' };
it('does not expose injected private coordinates or address in the public detail', () => {
  render(<PropertyDetailContent property={{ ...property, direccion: 'Calle privada 42', latitud: '21.123456', longitud: '-101.654321' } as PropiedadPublica} />);
  expect(screen.queryByText(/Calle privada/)).toBeNull();
  expect(screen.getByTestId('position').textContent).toBe('{"position":null,"privateLocation":false}');
  expect(useGetPhotos).toHaveBeenCalledWith('8', true);
  expect(useGetOwnPhotos).toHaveBeenCalledWith('8', false);
});
it('only professionals see commission even if injected into a public response', () => {
  const shared = { ...property, comparte_comision: true, porcentaje_comision: '2.5' };
  const result = render(<PropertyDetailContent property={shared} />);
  expect(screen.queryByText(/Comisión compartida/)).toBeNull();
  context.role = 'asesor';
  result.rerender(<PropertyDetailContent property={shared} />);
  expect(screen.getByText('Comisión compartida: 2.5%')).toBeTruthy();
});

for (const count of [0, 1, 3]) it(`gallery with ${count} photos stays above property facts`, () => {
  vi.mocked(useGetPhotos).mockReturnValueOnce({ data: Array.from({ length: count }, (_, index) => ({ id: String(index + 1), posicion: index, mime: 'image/jpeg', tamano_bytes: 42 })), isLoading: false } as unknown as ReturnType<typeof useGetPhotos>);
  render(<PropertyDetailContent property={property} />);
  const gallery = screen.getByLabelText('Galería de fotografías');
  expect(gallery.compareDocumentPosition(screen.getByRole('heading', { name: property.titulo }))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(screen.queryAllByRole('button', { name: /Mostrar fotografía/ })).toHaveLength(count);
});

it('selects another gallery image without moving the gallery below the description', () => {
  const photos = { data: [{ id: '1', posicion: 0 }, { id: '2', posicion: 1 }], isLoading: false };
  vi.mocked(useGetPhotos).mockReturnValue(photos as unknown as ReturnType<typeof useGetPhotos>);
  render(<PropertyDetailContent property={property} />);
  fireEvent.click(screen.getByRole('button', { name: 'Mostrar fotografía 2' }));
  expect(screen.getByRole('button', { name: 'Mostrar fotografía 2' }).getAttribute('aria-pressed')).toBe('true');
  vi.mocked(useGetPhotos).mockReturnValue({ data: [], isLoading: false } as unknown as ReturnType<typeof useGetPhotos>);
});
