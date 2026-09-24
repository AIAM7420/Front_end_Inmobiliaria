import { api } from './axios.config';
import type { ChatbotSalida } from './types';

export async function queryChatbot(texto: string): Promise<ChatbotSalida> {
  const { data } = await api.post<ChatbotSalida>('/chatbot/consultas', { texto });
  return data;
}
