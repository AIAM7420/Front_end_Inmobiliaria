import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PropiedadPublica } from '../../integrations/backend/types';
import { ConnectedPropertyCard } from './ConnectedPropertyCard';

vi.mock('../../integrations/backend/hooks/useProperties', () => ({
  useGetPhotos: () => ({ data: [], isLoading: false }),
  useGetPhotoUrl: () => ({ data: undefined, isLoading: false }),
}));

const property: PropiedadPublica = {
  id: '9007199254740993', asesor_id: '8', tipo_id: '2', operacion_id: '1', zona_id: '3',
  titulo: 'Casa en León', precio: '1250000.00', moneda: 'MXN',
  habitaciones: 3, banos: '2.00', superficie_construccion: '150.00',
  colonia: 'Centro', codigo_postal: '37000',
};

describe('ConnectedPropertyCard', () => {
  it('maps API values and hides exact location and unsupported favorite controls', () => {
    const withPrivateFields = { ...property, direccion: 'Calle privada 99', latitud: '21.123456' };
    render(<ConnectedPropertyCard property={withPrivateFields} />);

    expect(screen.getByText('Casa en León')).toBeDefined();
    expect(screen.getByText('Centro, León, Guanajuato')).toBeDefined();
    expect(screen.getByText('Sin fotografía')).toBeDefined();
    expect(screen.queryByText('Calle privada 99')).toBeNull();
    expect(screen.queryByText('21.123456')).toBeNull();
    expect(screen.queryByRole('button', { name: /favorit/i })).toBeNull();
  });
});
