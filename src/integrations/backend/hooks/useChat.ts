import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createConversation, getConversations, getMessages, sendMessage } from '../chat.service';
import type { MessagePageParams, PageParams } from '../chat.service';
import type { Id, MensajeCrear } from '../types';

export function useGetConversations(params: PageParams = {}) {
  return useQuery({
    queryKey: ['chat', 'conversations', params],
    queryFn: () => getConversations(params),
    staleTime: 5_000,
  });
}

export function useGetMessages(conversationId: Id, params: MessagePageParams = {}) {
  return useQuery({
    queryKey: ['chat', 'messages', conversationId, params],
    queryFn: () => getMessages(conversationId, params),
    enabled: Boolean(conversationId),
    staleTime: 0,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConversation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] }),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, payload }: { conversationId: Id; payload: MensajeCrear }) =>
      sendMessage(conversationId, payload),
    onSuccess: (_message, input) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', input.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });
}
