import { api } from './axios.config';
import type { CriteriosBusqueda, PaginaPropiedadPublica } from './types';
import type { ListPropertiesParams } from './properties.service';

/** API_033 is a read operation whose HTTP method is POST. Empty criteria are valid. */
export async function searchProperties(
  criteria: CriteriosBusqueda,
  params: ListPropertiesParams = {},
): Promise<PaginaPropiedadPublica> {
  const { data } = await api.post<PaginaPropiedadPublica>('/busquedas', criteria, { params });
  return data;
}
