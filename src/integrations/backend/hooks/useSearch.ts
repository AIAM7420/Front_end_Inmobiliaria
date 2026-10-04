import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
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
export function useSearchQuery(criteria: CriteriosBusqueda, params: ListPropertiesParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['properties', 'search', criteria, params],
    queryFn: () => searchProperties(criteria, params),
    enabled,
    staleTime: 30_000,
  });
}

export function useSearchInfinite(criteria: CriteriosBusqueda, enabled = true) {
  return useInfiniteQuery({ queryKey: ['properties', 'search', 'infinite', criteria], queryFn: ({ pageParam }) => searchProperties(criteria, { limit: 100, cursor: pageParam }), initialPageParam: undefined as string | undefined, getNextPageParam: page => page.next_cursor ?? undefined, enabled, staleTime: 30_000 });
}
