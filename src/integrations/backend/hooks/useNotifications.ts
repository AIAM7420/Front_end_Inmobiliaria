import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead } from '../notifications.service';
import type { Id } from '../types';

export function useGetNotifications() {
  return useQuery({
    queryKey: ['notifications', 'own'],
    queryFn: () => getNotifications({ limit: 20 }),
    staleTime: 10_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Id) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'own'] }),
  });
}
