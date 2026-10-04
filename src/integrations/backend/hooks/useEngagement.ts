import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../../../context/AppContext';
import { favoriteState, getAdvisorPortfolio, getFavorites, getPublicAdvisor, getStatistics, setFavorite } from '../engagement.service';

export function useFavorites() {
  const { isAuthenticated } = useAppContext();
  return useInfiniteQuery({ queryKey: ['favorites', 'list'], queryFn: ({ pageParam }) => getFavorites(pageParam), initialPageParam: undefined as string | undefined, getNextPageParam: page => page.next_cursor ?? undefined, enabled: isAuthenticated });
}
export function useFavorite(id: string) {
  const { isAuthenticated } = useAppContext(), cache = useQueryClient();
  const query = useQuery({ queryKey: ['favorites', 'state', id], queryFn: () => favoriteState(id), enabled: isAuthenticated && !!id, staleTime: 30_000 });
  const mutation = useMutation({ mutationFn: (enabled: boolean) => setFavorite(id, enabled), onSuccess: (_, value) => { cache.setQueryData(['favorites', 'state', id], value); void cache.invalidateQueries({ queryKey: ['favorites', 'list'] }); } });
  return { query, mutation };
}
export function usePublicAdvisor(id: string) { return useQuery({ queryKey: ['advisor', 'public', id], queryFn: () => getPublicAdvisor(id), enabled: !!id, staleTime: 60_000 }); }
export function usePortfolio(id: string) { return useInfiniteQuery({ queryKey: ['advisor', 'portfolio', id], queryFn: ({ pageParam }) => getAdvisorPortfolio(id, pageParam), initialPageParam: undefined as string | undefined, getNextPageParam: page => page.next_cursor ?? undefined, enabled: !!id }); }
export function useStatistics(admin: boolean, days: number) { return useQuery({ queryKey: ['statistics', admin, days], queryFn: () => getStatistics(admin, days), staleTime: 15_000 }); }
