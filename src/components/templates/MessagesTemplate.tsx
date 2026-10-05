import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Send, X, Archive, CheckCircle2, Paperclip, CloudOff, RefreshCw, SearchX, CheckCheck, MessagesSquare, MessageCircle, Building2, Compass } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { EmptyState } from '../molecules/EmptyState';
import { uploadMedia } from '../../integrations/backend/media.service';
import type { MediaFile } from '../../integrations/backend/media.service';
import { FileDropZone } from '../atoms/FileDropZone';
import { BottomSheet } from '../organisms/BottomSheet';
import { MediaDownload } from '../molecules/MediaDownload';
import { useSendMessage } from '../../integrations/backend/hooks/useChat';
import { useChatInbox, useConversationDetails } from '../../integrations/backend/hooks/useChatInbox';
import { archiveConversation, markConversationRead } from '../../integrations/backend/chat.service';
import { useGetMe } from '../../integrations/backend/hooks/useAuth';
import { useConversationStream } from '../../integrations/backend/hooks/useConversationStream';
import { isVersionConflict, operationError } from '../../integrations/backend/versioning';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { Textarea } from '../atoms/Textarea';
import { Select } from '../atoms/Select';
import { Skeleton } from '../atoms/Skeleton';
import { ModuleLayout } from './ModuleLayout';
import { SplitViewLayout } from './SplitViewLayout';
import { ConflictNotice } from '../molecules/ConflictNotice';
export interface MessagesTemplateProps {}
export function MessagesTemplate(_props: MessagesTemplateProps) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { role } = useAppContext();
  const selectedId = params.get('conversation') ?? '';
  const [draft, setDraft] = useState(''), [filter, setFilter] = useState('active'), [search, setSearch] = useState('');
  const [failure, setFailure] = useState(''), [conflict, setConflict] = useState(false), [busy, setBusy] = useState(false);
  const [attachments, setAttachments] = useState<MediaFile[]>([]), [uploadOpen, setUploadOpen] = useState(false), [uploading, setUploading] = useState(false);
  const pending = useRef<{ id: string; content: string } | null>(null);
  const inbox = useChatInbox(), detail = useConversationDetails(selectedId), me = useGetMe(), sendMessage = useSendMessage();
  const stream = useConversationStream(selectedId), cache = useQueryClient();
  const ownId = me.data?.value.id;
  const other = detail.data?.participantes?.find(p => p.id !== ownId);
  const title = other?.nombre ?? 'Cargando interlocutor…';
  const lastLoaded = stream.items.at(-1)?.secuencia;
  useEffect(() => {
    if (!selectedId || !lastLoaded || document.visibilityState !== 'visible') return;
    let active = true;
    void markConversationRead(selectedId, lastLoaded).then(() => { if (active) void cache.invalidateQueries({ queryKey: ['chat', 'inbox'] }); }).catch(() => { if (active) setFailure('No pudimos actualizar la lectura.'); });
    return () => { active = false; };
  }, [selectedId, lastLoaded, cache]);
  const chats = inbox.data?.pages.flatMap(page => page.items).filter(c => {
    const name = c.participantes?.find(p => p.id !== ownId)?.nombre ?? '';
    return name.toLocaleLowerCase('es-MX').includes(search.toLocaleLowerCase('es-MX')) && (filter === 'archived' ? c.archivada : !c.archivada && (filter !== 'unread' || (c.no_leidos ?? 0) > 0));
  }) ?? [];
  const select = (id: string) => { setParams(id ? { conversation: id } : {}); setDraft(''); setAttachments([]); setUploadOpen(false); pending.current = null; setFailure(''); setConflict(false); };
  async function send() {
    if (!selectedId || !draft.trim() && !attachments.length || sendMessage.isPending || uploading) return;
    const content = draft.trim() ? draft : 'Archivo adjunto: ' + attachments.map(a => a.nombre).join(', ');
    if (!pending.current || pending.current.content !== content) pending.current = { id: crypto.randomUUID(), content };
    try { const result = await sendMessage.mutateAsync({ conversationId: selectedId, payload: { cliente_mensaje_id: pending.current.id, contenido: pending.current.content, adjunto_ids: attachments.map(a => a.id) } }); stream.includeCommitted(result); pending.current = null; setDraft(''); setAttachments([]); setFailure(''); void cache.invalidateQueries({ queryKey: ['chat'] }); }
    catch (error) { setFailure(operationError(error)); }
  }
  const chat = <div className="flex flex-col h-full w-full bg-transparent relative font-inter overflow-hidden">
    <div className="absolute top-2 left-4 right-4 md:top-4 md:left-6 md:right-6 z-20 md:h-16 border border-white/50 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl flex items-center justify-between px-3 py-2 md:px-4 shadow-sm rounded-full">
      <div className="flex items-center gap-3 min-w-0"><div className="w-10 h-10 rounded-full bg-inmo-accent/10 flex items-center justify-center relative text-inmo-accent shrink-0"><span className="font-bold">{other?.nombre.charAt(0) ?? '…'}</span>{other?.en_linea && <span aria-label="En línea" className="absolute bottom-0 right-0 w-3 h-3 bg-inmo-success rounded-full border-2 border-white dark:border-inmo-darkcard" />}</div><div className="min-w-0"><h2 className="font-bold text-sm truncate">{title}</h2><p className="text-[11px] text-gray-500">{other?.en_linea ? 'En línea' : 'Sin conexión'} · {stream.status === 'conectado' ? 'En tiempo real' : 'Reconectando…'}</p></div></div>
      <div className="flex gap-1"><IconButton aria-label={detail.data?.archivada ? 'Recuperar conversación' : 'Archivar conversación'} icon={<Archive className="w-5 h-5" />} disabled={busy || conflict || !detail.data} onClick={async () => { if (!detail.data) return; setBusy(true); try { await archiveConversation(selectedId, !detail.data.archivada, detail.data.version ?? 1); void cache.invalidateQueries({ queryKey: ['chat'] }); } catch (error) { setFailure(operationError(error)); if (isVersionConflict(error)) setConflict(true); } finally { setBusy(false); } }} /><IconButton aria-label="Cerrar conversación" icon={<X className="w-5 h-5" />} onClick={() => select('')} /></div>
    </div>
    <div aria-label="Historial de mensajes" className="flex-1 overflow-y-auto p-4 pt-24 md:p-6 md:pt-28 flex flex-col gap-4 custom-scrollbar" tabIndex={0}>
      {detail.isError || stream.history.isError ? <p role="alert">No pudimos recuperar esta conversación.</p> : stream.history.isLoading ? <Skeleton className="h-24" /> : !stream.items.length ? <EmptyState className="w-full h-full" icon={<MessageCircle />} title="Inicia la conversación" description={<>Aún no hay mensajes. Escribe tu duda sobre la propiedad y {other?.nombre ?? 'tu contacto'} te responderá aquí.</>} /> : stream.items.map(message => { const sent = message.emisor_id === ownId, author = detail.data?.participantes?.find(p => p.id === message.emisor_id); return <div key={message.secuencia} className={'flex flex-col gap-1 max-w-[80%] md:max-w-[70%] ' + (sent ? 'items-end self-end' : 'items-start')}><span className="text-[11px] text-gray-500">{author?.nombre ?? 'Cargando nombre…'}</span><div className={'p-3 sm:p-4 rounded-2xl shadow-sm ' + (sent ? 'bg-inmo-accent text-white rounded-tr-sm' : 'bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-tl-sm')}><p className="text-sm whitespace-pre-wrap break-words">{message.contenido}</p>{message.adjuntos?.map(a => <MediaDownload key={a.id} id={a.id} name={a.nombre} />)}</div><div className="flex items-center gap-1 text-[10px] text-gray-400"><time dateTime={message.persistido_at}>{new Date(message.persistido_at).toLocaleString('es-MX')}</time>{sent && other && BigInt(other.ultima_leida) >= BigInt(message.secuencia) && <CheckCircle2 aria-label="Leído" className="w-3 h-3 text-inmo-accent" />}</div></div>; })}
      {conflict && <ConflictNotice current={<p>Estado: {detail.data?.archivada ? 'Archivada' : 'Activa'} · versión {detail.data?.version}</p>} onReview={async () => { const result = await detail.refetch(); if (result.isError) throw result.error; }} onAccept={() => { setConflict(false); setFailure(''); }} />}
      {failure && <p role="alert" className="text-sm text-inmo-danger">{failure}</p>}
    </div>
    <div className="px-4 flex flex-wrap gap-2">{attachments.map(a => <Button variant="secondary" key={a.id} aria-label={"Quitar " + a.nombre} onClick={() => { setAttachments(items => items.filter(i => i.id !== a.id)); pending.current = null; }}>{a.nombre} ×</Button>)}</div><form className="p-4 pb-6 shrink-0 relative z-10" onSubmit={event => { event.preventDefault(); void send(); }}><div className="flex items-end gap-2 max-w-4xl mx-auto w-full"><IconButton aria-label="Adjuntar archivo" icon={<Paperclip className="w-5 h-5" />} disabled={uploading || sendMessage.isPending || attachments.length >= 4} onClick={() => setUploadOpen(true)} className="!w-[50px] !h-[50px] !rounded-full" /><Textarea aria-label="Escribe un mensaje" placeholder="Escribe un mensaje..." value={draft} onChange={event => setDraft(event.target.value)} maxLength={4000} rows={1} className="flex-1 !rounded-2xl max-h-[120px]" /><IconButton aria-label="Enviar mensaje" type="submit" icon={<Send className="w-5 h-5" />} variant="accent" disabled={!draft.trim() && !attachments.length || sendMessage.isPending || uploading || detail.isError} className="!w-[50px] !h-[50px] !rounded-full shrink-0 shadow-glow" /></div></form>
  </div>;
  const isAdvisor = role === 'asesor';
  const emptyInbox = search.trim()
    ? <EmptyState compact icon={<SearchX />} title="Sin resultados" description={<>No encontramos conversaciones con «{search.trim()}».</>}
        actions={<Button variant="secondary" onClick={() => setSearch('')}>Limpiar búsqueda</Button>} />
    : filter === 'unread'
      ? <EmptyState compact icon={<CheckCheck />} title="¡Estás al día!" description="No tienes mensajes sin leer. Te avisaremos cuando llegue uno nuevo."
          actions={<Button variant="secondary" onClick={() => setFilter('active')}>Ver todos los mensajes</Button>} />
      : filter === 'archived'
        ? <EmptyState compact icon={<Archive />} title="No hay conversaciones archivadas" description="Las conversaciones que archives se guardarán aquí para que puedas recuperarlas cuando quieras."
            actions={<Button variant="secondary" onClick={() => setFilter('active')}>Volver a mis chats</Button>} />
        : <EmptyState icon={<MessagesSquare />} title="Aún no tienes conversaciones"
            description={isAdvisor ? 'Cuando un cliente te escriba sobre alguna de tus propiedades, la conversación aparecerá aquí.' : 'Cuando contactes a un asesor desde el detalle de una propiedad, podrás continuar la conversación aquí.'}
            actions={isAdvisor
              ? <Button icon={<Building2 className="w-4 h-4" />} onClick={() => navigate('/asesor/propiedades')}>Ver mi inventario</Button>
              : <Button icon={<Compass className="w-4 h-4" />} onClick={() => navigate('/')}>Explorar propiedades</Button>} />;
  const main = <ModuleLayout title="Chats" isFullScreen showFilters={false} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Buscar conversaciones..." headerEndContent={<Select aria-label="Filtrar conversaciones" value={filter} onChange={event => setFilter(event.target.value)}><option value="active">Todos los mensajes</option><option value="unread">No leídos</option><option value="archived">Archivados</option></Select>}>
    {inbox.isLoading ? <Skeleton className="h-64" /> : inbox.isError ? <EmptyState tone="error" icon={<CloudOff />} title="No pudimos cargar tus conversaciones" description="Hubo un problema al conectar con el servidor de mensajes. Inténtalo de nuevo en unos momentos."
      actions={<Button icon={<RefreshCw className="w-4 h-4" />} onClick={() => void inbox.refetch()}>Reintentar</Button>} /> : <div className="space-y-3 flex-1 flex flex-col">{chats.map(c => { const person = c.participantes?.find(p => p.id !== ownId); return <Button key={c.id} variant="ghost" onClick={() => select(c.id)} className="w-full !h-auto !p-4 !rounded-2xl !justify-start !text-left bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary shadow-sm shrink-0"><span className="w-12 h-12 rounded-full bg-inmo-accent/10 text-inmo-accent flex items-center justify-center shrink-0">{person?.nombre.charAt(0) ?? '…'}</span><span className="min-w-0 flex-1"><span className="block font-bold text-sm truncate">{person?.nombre ?? 'Nombre no disponible'}</span><span className="block text-xs text-gray-500 truncate">{c.ultimo_mensaje?.contenido ?? 'Sin mensajes'}</span></span>{(c.no_leidos ?? 0) > 0 && <span className="bg-inmo-accent text-white text-xs px-2 py-1 rounded-full">{c.no_leidos}</span>}</Button>; })}{!chats.length && emptyInbox}</div>}
    {inbox.hasNextPage && <Button variant="secondary" onClick={() => void inbox.fetchNextPage()} disabled={inbox.isFetchingNextPage}>Cargar más conversaciones</Button>}
  </ModuleLayout>;
  return <><SplitViewLayout mainContent={main} sideContent={chat} isOpen={Boolean(selectedId)} onClose={() => select('')} sideTitle={title} desktopNoPadding />{uploadOpen && <BottomSheet isOpen onClose={uploading ? undefined : () => setUploadOpen(false)} title="Adjuntar archivo"><p className="text-sm text-gray-500 mb-4">PDF, JPEG o WebP · máximo 5 MB. Sólo los participantes podrán abrirlo.</p>{uploading ? <p role="status">Subiendo y comprobando…</p> : <FileDropZone accept="application/pdf,image/jpeg,image/webp" maxSizeMB={5} onFileSelect={async file => { setUploading(true); setFailure(''); try { const result = await uploadMedia(file, selectedId); setAttachments(items => [...items, result]); pending.current = null; setUploadOpen(false); } catch (error) { setFailure(operationError(error)); } finally { setUploading(false); } }} />}{failure && <p role="alert" className="text-inmo-danger text-sm mt-4">{failure}</p>}</BottomSheet>}</>;
}
