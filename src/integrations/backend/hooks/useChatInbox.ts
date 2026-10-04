import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getConversation, getConversations } from '../chat.service';
export function useChatInbox() {
  return useInfiniteQuery({ queryKey: ['chat', 'inbox'], queryFn: ({ pageParam }) => getConversations({ limit: 100, cursor: pageParam }), initialPageParam: undefined as string | undefined, getNextPageParam: page => page.next_cursor ?? undefined, refetchInterval: 30_000 });
}
export function useConversationDetails(id: string) {
  return useQuery({ queryKey: ['chat', 'details', id], queryFn: () => getConversation(id), enabled: Boolean(id), refetchInterval: 15_000 });
}
