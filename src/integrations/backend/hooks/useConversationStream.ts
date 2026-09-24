import { useCallback, useEffect, useRef, useState } from 'react';
import { getAccessToken } from '../axios.config';
import { getMessages, mergeMessages } from '../chat.service';
import type { ChatServerFrame, Id, Mensaje } from '../types';
import { useGetMessages } from './useChat';
import { useChatWebSocket } from './useChatWebSocket';

/** Combines REST history and committed socket events by (conversation, sequence). */
export function useConversationStream(conversationId: Id) {
  const history = useGetMessages(conversationId, { limit: 50 });
  const [recovered, setRecovered] = useState<Record<Id, Mensaje[]>>({});
  const items = mergeMessages(history.data?.items ?? [], recovered[conversationId] ?? []);
  const current = useRef({ conversationId, items });
  useEffect(() => {
    current.current = { conversationId, items };
  }, [conversationId, items]);

  const includeCommitted = useCallback((message: Mensaje) => {
    setRecovered((previous) => ({
      ...previous,
      [message.conversacion_id]: mergeMessages(previous[message.conversacion_id] ?? [], [message]),
    }));
  }, []);

  const onFrame = useCallback((frame: ChatServerFrame) => {
    if (frame.type === 'message.created' || frame.type === 'message.ack') {
      includeCommitted(frame.mensaje);
    }
  }, [includeCommitted]);

  const onAuthenticated = useCallback(() => {
    const snapshot = current.current;
    if (!snapshot.conversationId) return;
    // The socket is only a low-latency hint; REST is the durable recovery path.
    void (async () => {
      try {
        const known = snapshot.items.length ? snapshot.items : (await history.refetch()).data?.items ?? [];
        if (!known.length || current.current.conversationId !== snapshot.conversationId) return;
        let after = known[known.length - 1].secuencia;
        while (current.current.conversationId === snapshot.conversationId) {
          const page = await getMessages(snapshot.conversationId, { after_sequence: after, limit: 100 });
          if (!page.items.length) break;
          setRecovered((previous) => ({
            ...previous,
            [snapshot.conversationId]: mergeMessages(previous[snapshot.conversationId] ?? [], page.items),
          }));
          const last = page.items[page.items.length - 1].secuencia;
          if (BigInt(last) <= BigInt(after) || page.items.length < 100) break;
          after = last;
        }
      } catch {
        // The next reconnect or a manual history refresh can retry recovery.
      }
    })();
  }, [history]);

  const socket = useChatWebSocket(getAccessToken(), onFrame, onAuthenticated);
  return { history, items, status: socket.status, includeCommitted };
}
