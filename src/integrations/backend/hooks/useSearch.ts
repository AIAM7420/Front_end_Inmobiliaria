import { useMutation, useQuery } from '@tanstack/react-query';
import { searchProperties } from '../search.service';
import type { ListPropertiesParams } from '../properties.service';
import type { CriteriosBusqueda } from '../types';

export function useSearchProperties() {
  return useMutation({
    mutationFn: ({ criteria, params }: {
      criteria: CriteriosBusqueda;
      params?: ListPropertiesParams;
    }) => searchProperties(criteria, params),
  });
}

/** API_033 is POST, but its behavior is a read and can be cached for map browsing. */
export function useSearchQuery(criteria: CriteriosBusqueda, params: ListPropertiesParams = {}) {
  return useQuery({
    queryKey: ['properties', 'search', criteria, params],
    queryFn: () => searchProperties(criteria, params),
    staleTime: 30_000,
  });
}
