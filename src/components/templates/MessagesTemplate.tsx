import { useRef, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useGetConversations, useSendMessage } from '../../integrations/backend/hooks/useChat';
import { useGetMe } from '../../integrations/backend/hooks/useAuth';
import { useConversationStream } from '../../integrations/backend/hooks/useConversationStream';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Skeleton } from '../atoms/Skeleton';

export interface MessagesTemplateProps {}

export function MessagesTemplate(_props: MessagesTemplateProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [draft, setDraft] = useState('');
  const pendingMessageId = useRef<string | null>(null);
  const conversations = useGetConversations({ limit: 20 });
  const messages = useConversationStream(selectedId);
  const me = useGetMe();
  const sendMessage = useSendMessage();

  const send = async () => {
    if (!selectedId || !draft.trim() || sendMessage.isPending) return;
    const clientMessageId = pendingMessageId.current ?? crypto.randomUUID();
    pendingMessageId.current = clientMessageId;
    try {
      const committed = await sendMessage.mutateAsync({
        conversationId: selectedId,
        payload: { cliente_mensaje_id: clientMessageId, contenido: draft },
      });
      messages.includeCommitted(committed);
      pendingMessageId.current = null;
      setDraft('');
    } catch {
      // Keep the same UUID for a retry after an uncertain server response.
    }
  };

  return (
    <main className="px-4 md:px-6 py-2 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h1 className="font-montserrat font-bold text-2xl text-inmo-secondary dark:text-white mb-6">Chats</h1>
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 min-h-[520px]">
        <section className="bg-white dark:bg-inmo-darkcard rounded-card p-4 shadow-soft" aria-label="Conversaciones">
          <h2 className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white mb-3">Conversaciones</h2>
          {conversations.isLoading ? <div className="space-y-3" aria-label="Cargando conversaciones"><Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
            : conversations.isError ? <p role="alert" className="font-inter text-sm text-gray-500">No pudimos cargar tus conversaciones.</p>
            : !conversations.data?.items.length ? <p className="font-inter text-sm text-gray-500">Todavía no tienes conversaciones.</p>
            : conversations.data.items.map((conversation) => (
              <Button key={conversation.id} type="button" variant="ghost" onClick={() => { setSelectedId(conversation.id); setDraft(''); pendingMessageId.current = null; }}
                className={`w-full !justify-start text-left !rounded-2xl p-3 mb-2 ${selectedId === conversation.id ? '!bg-inmo-accent/10' : '!bg-gray-50 dark:!bg-inmo-darkbg'}`}
                icon={<span className="w-10 h-10 rounded-full bg-white dark:bg-inmo-darkcard flex items-center justify-center text-inmo-accent"><MessageCircle className="w-5 h-5" /></span>}>
                <span className="min-w-0"><span className="block font-inter font-semibold text-sm text-inmo-secondary dark:text-white">Conversación #{conversation.id}</span>
                  <span className="block font-inter text-xs text-gray-500">{conversation.tipo === 'CLIENTE_ASESOR' ? 'Cliente y asesor' : 'Entre asesores'}</span></span>
              </Button>
            ))}
          {conversations.data?.next_cursor && <p className="font-inter text-xs text-gray-500 mt-3">Hay más conversaciones disponibles.</p>}
        </section>

        <section className="bg-white dark:bg-inmo-darkcard rounded-card p-4 shadow-soft flex flex-col min-h-[520px]" aria-label="Mensajes">
          {selectedId ? <>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-inmo-darktertiary">
              <h2 className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Conversación #{selectedId}</h2>
              <span className="font-inter text-xs text-gray-500" aria-live="polite">{messages.status === 'conectado' ? 'En tiempo real' : 'Reconectando…'}</span>
            </div>
            <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[450px]">
              {messages.history.isLoading ? <div aria-label="Cargando mensajes" className="space-y-3"><Skeleton className="h-14 w-3/4" /><Skeleton className="h-14 w-2/3 ml-auto" /></div>
                : messages.history.isError ? <p role="alert" className="font-inter text-sm text-gray-500">No pudimos recuperar el historial.</p>
                : !messages.items.length ? <p className="font-inter text-sm text-gray-500">No hay mensajes aún.</p>
                : messages.items.map((message) => (
                  <div key={`${message.conversacion_id}:${message.secuencia}`} className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.emisor_id === me.data?.value.id ? 'bg-inmo-accent text-white ml-auto' : 'bg-gray-100 dark:bg-inmo-darkbg text-inmo-secondary dark:text-white'}`}>
                    <p className="font-inter text-sm whitespace-pre-wrap break-words">{message.contenido}</p>
                    <span className="font-inter text-[10px] opacity-70">{new Date(message.persistido_at).toLocaleString('es-MX')}</span>
                  </div>
                ))}
              {messages.history.data?.next_cursor && <p className="font-inter text-xs text-gray-500">Hay más mensajes en el historial.</p>}
            </div>
            <form onSubmit={(event) => { event.preventDefault(); void send(); }} className="flex gap-2 pt-3 border-t border-gray-100 dark:border-inmo-darktertiary">
              <Input value={draft} onChange={(event) => { pendingMessageId.current = null; setDraft(event.target.value); }} maxLength={4000} aria-label="Escribe un mensaje"
                wrapperClassName="!rounded-full !bg-gray-50 dark:!bg-inmo-darkbg !shadow-none min-w-0 flex-1" placeholder="Escribe un mensaje..." />
              <Button type="submit" disabled={!draft.trim()} isLoading={sendMessage.isPending} className="px-4" icon={<Send className="w-4 h-4" />}>Enviar</Button>
            </form>
            {sendMessage.isError && <p role="alert" className="font-inter text-xs text-inmo-accent mt-2">No se pudo enviar el mensaje. Puedes intentarlo de nuevo.</p>}
          </> : <div className="flex-1 flex items-center justify-center font-inter text-sm text-gray-500 text-center">Selecciona una conversación para ver su historial.</div>}
        </section>
      </div>
    </main>
  );
}
