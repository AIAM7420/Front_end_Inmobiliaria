import { useMutation } from '@tanstack/react-query';
import { queryChatbot } from '../nlp.service';

/** Do not cache raw user text or NLP results in persistent storage. */
export function useChatbotQuery() {
  return useMutation({ mutationFn: queryChatbot });
}
