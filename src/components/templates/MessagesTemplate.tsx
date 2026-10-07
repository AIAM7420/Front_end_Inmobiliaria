import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Send,
  X,
  Archive,
  ArchiveRestore,
  CheckCircle2,
  Paperclip,
  CloudOff,
  RefreshCw,
  SearchX,
  CheckCheck,
  MessagesSquare,
  Building2,
  Compass,
} from 'lucide-react';
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
import { DropdownSelect } from '../molecules/DropdownSelect';
import { Skeleton } from '../atoms/Skeleton';
import { ModuleLayout } from './ModuleLayout';
import { SplitViewLayout } from './SplitViewLayout';
import { ConflictNotice } from '../molecules/ConflictNotice';
import { ConfirmModal } from '../molecules/ConfirmModal';
import { ChatDoodleBackground } from '../atoms/ChatDoodleBackground';

export interface MessagesTemplateProps {}

function formatChatTime(dateStr?: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  if (isYesterday) {
    return 'Ayer';
  }
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return date.toLocaleDateString('es-MX', { weekday: 'short' });
  }
  return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

export function MessagesTemplate(_props: MessagesTemplateProps) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { role } = useAppContext();
  const selectedId = params.get('conversation') ?? '';

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('active');
  const [search, setSearch] = useState('');
  const [failure, setFailure] = useState('');
  const [conflict, setConflict] = useState(false);
  const [conflictTargetId, setConflictTargetId] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    version: number;
    archivada: boolean;
    name: string;
  } | null>(null);
  const [attachments, setAttachments] = useState<MediaFile[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pending = useRef<{ id: string; content: string } | null>(null);

  const inbox = useChatInbox();
  const detail = useConversationDetails(selectedId);
  const conflictResource = useConversationDetails(conflictTargetId);
  const me = useGetMe();
  const sendMessage = useSendMessage();
  const stream = useConversationStream(selectedId);
  const cache = useQueryClient();

  const isWireframeMode = inbox.isPending || me.isPending;
  useEffect(() => {
    if (!isFiltersOpen) return;
    const trigger = document.activeElement;
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !event.defaultPrevented) setIsFiltersOpen(false); };
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('keydown', escape); if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true }); };
  }, [isFiltersOpen]);

  const ownId = me.data?.value.id;
  const other = detail.data?.participantes?.find((p) => p.id !== ownId);
  const title = other?.nombre ?? 'Cargando interlocutor…';
  const lastLoaded = stream.items.at(-1)?.secuencia;

  useEffect(() => {
    if (!selectedId || !lastLoaded || document.visibilityState !== 'visible') return;
    let active = true;
    void markConversationRead(selectedId, lastLoaded)
      .then(() => {
        if (active) void cache.invalidateQueries({ queryKey: ['chat', 'inbox'] });
      })
      .catch(() => {
        if (active) setFailure('No pudimos actualizar la lectura.');
      });
    return () => {
      active = false;
    };
  }, [selectedId, lastLoaded, cache]);

  const chats =
    inbox.data?.pages
      .flatMap((page) => page.items)
      .filter((c) => {
        const name = c.participantes?.find((p) => p.id !== ownId)?.nombre ?? '';
        return (
          name.toLocaleLowerCase('es-MX').includes(search.toLocaleLowerCase('es-MX')) &&
          (filter === 'archived' ? c.archivada : !c.archivada && (filter !== 'unread' || (c.no_leidos ?? 0) > 0))
        );
      }) ?? [];

  const select = (id: string) => {
    setParams(id ? { conversation: id } : {});
    setDraft('');
    setAttachments([]);
    setUploadOpen(false);
    pending.current = null;
    setFailure('');
    setConflict(false);
    setConflictTargetId('');
  };

  const handleConfirmArchive = async () => {
    if (!confirmTarget) return;
    setBusy(true);
    try {
      await archiveConversation(
        confirmTarget.id,
        !confirmTarget.archivada,
        confirmTarget.version,
      );
      void cache.invalidateQueries({ queryKey: ['chat'] });
      void cache.invalidateQueries({ queryKey: ['chat', 'inbox'] });
    } catch (error) {
      setFailure(operationError(error));
      if (isVersionConflict(error)) {
        setConflictTargetId(confirmTarget.id);
        setConflict(true);
      }
      throw error;
    } finally {
      setBusy(false);
      setConfirmTarget(null);
    }
  };

  const conflictNotice = conflict ? (
    <ConflictNotice
      current={<p>Estado: {conflictResource.data?.archivada ? 'Archivada' : 'Activa'} · versión {conflictResource.data?.version}</p>}
      onReview={async () => {
        const result = await conflictResource.refetch();
        if (result.isError) throw result.error;
      }}
      onAccept={() => {
        setConflict(false);
        setConflictTargetId('');
        setFailure('');
        void cache.invalidateQueries({ queryKey: ['chat', 'inbox'] });
      }}
    />
  ) : null;

  async function send() {
    if (!selectedId || (!draft.trim() && !attachments.length) || sendMessage.isPending || uploading) return;
    const content = draft.trim() ? draft : 'Archivo adjunto: ' + attachments.map((a) => a.nombre).join(', ');
    if (!pending.current || pending.current.content !== content) {
      pending.current = { id: crypto.randomUUID(), content };
    }
    try {
      const result = await sendMessage.mutateAsync({
        conversationId: selectedId,
        payload: {
          cliente_mensaje_id: pending.current.id,
          contenido: pending.current.content,
          adjunto_ids: attachments.map((a) => a.id),
        },
      });
      stream.includeCommitted(result);
      pending.current = null;
      setDraft('');
      setAttachments([]);
      setFailure('');
      void cache.invalidateQueries({ queryKey: ['chat'] });
      void cache.invalidateQueries({ queryKey: ['chat', 'inbox'] });
    } catch (error) {
      setFailure(operationError(error));
    }
  }

  const layoutWidthClass = 'w-full md:max-w-xl lg:max-w-2xl mx-auto';

  const renderChatContent = () => {
    if (!selectedId) return null;

    return (
      <div role="region" aria-label="Conversación activa" className="flex flex-col h-full w-full bg-transparent relative font-inter overflow-hidden animate-in fade-in duration-300">
        {/* Fondo sutil tipo doodles estilo WhatsApp con elementos inmobiliarios */}
        <ChatDoodleBackground />

        {/* Header - Floating Pill */}
        <div className="absolute top-2 left-4 right-4 md:top-4 md:left-6 md:right-6 z-20 h-auto md:h-16 border border-white/50 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl flex items-center justify-between px-3 py-2 md:px-4 shrink-0 shadow-sm rounded-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-inmo-accent/10 flex items-center justify-center relative text-inmo-accent shrink-0 font-montserrat">
              <span className="font-bold">{other?.nombre.charAt(0) ?? '…'}</span>
              {other?.en_linea && (
                <div
                  aria-label="En línea"
                  className="absolute bottom-0 right-0 w-3 h-3 bg-inmo-success rounded-full border-2 border-white dark:border-inmo-darkcard"
                />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-bold text-sm text-inmo-secondary dark:text-white leading-tight truncate">
                {title}
              </h2>
              <span className="text-[11px] text-gray-500 font-medium truncate">
                {other?.en_linea ? 'En línea' : 'Sin conexión'} ·{' '}
                {stream.status === 'conectado' ? 'En tiempo real' : 'Reconectando…'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <IconButton
              aria-label={detail.data?.archivada ? 'Recuperar conversación' : 'Archivar conversación'}
              icon={
                detail.data?.archivada ? (
                  <ArchiveRestore className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Archive className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )
              }
              disabled={busy || conflict || !detail.data?.version}
              onClick={() => {
                if (detail.data?.version) {
                  setConfirmTarget({
                    id: selectedId,
                    version: detail.data.version,
                    archivada: Boolean(detail.data.archivada),
                    name: other?.nombre ?? 'esta conversación',
                  });
                }
              }}
              variant="ghost"
              className="!w-11 !h-11 !rounded-full hover:!bg-white/50 dark:hover:!bg-white/10"
            />
            <IconButton
              aria-label="Cerrar conversación"
              icon={<X className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />}
              variant="ghost"
              className="!w-11 !h-11 !rounded-full hover:!bg-white/50 dark:hover:!bg-white/10"
              onClick={() => select('')}
            />
          </div>
        </div>

        {/* Messages Area */}
        <div
          aria-label="Historial de mensajes"
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 pt-20 md:p-6 md:pt-24 flex flex-col gap-4 relative z-10 custom-scrollbar"
          tabIndex={0}
        >
          <div className="flex justify-center mb-2">
            <span className="bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary px-3 py-1 rounded-full text-[11px] font-bold text-gray-500 uppercase tracking-widest shadow-sm">
              Conversación
            </span>
          </div>

          {detail.isError || stream.history.isError ? (
            <p role="alert" className="text-sm text-inmo-danger text-center">
              No pudimos recuperar esta conversación.
            </p>
          ) : stream.history.isLoading ? (
            <div className="space-y-4 py-6">
              <Skeleton className="h-16 w-3/4 rounded-2xl" />
              <Skeleton className="h-16 w-2/3 ml-auto rounded-2xl" />
              <Skeleton className="h-20 w-3/4 rounded-2xl" />
            </div>
          ) : !stream.items.length ? (
            <div className="w-full flex-1 flex items-center justify-center p-4">
              <EmptyState
                solid
                icon={<MessagesSquare />}
                title="Inicia la conversación"
                description={
                  <>
                    Aún no hay mensajes. Escribe tu duda sobre la propiedad y{' '}
                    <span className="font-semibold text-inmo-secondary dark:text-white">
                      {other?.nombre ?? 'tu contacto'}
                    </span>{' '}
                    te responderá aquí.
                  </>
                }
              />
            </div>
          ) : (
            stream.items.map((message) => {
              const sent = message.emisor_id === ownId;
              const author = detail.data?.participantes?.find((p) => p.id === message.emisor_id);
              return (
                <div
                  key={message.secuencia}
                  className={`flex flex-col gap-1 max-w-[80%] md:max-w-[70%] ${
                    sent ? 'items-end self-end' : 'items-start'
                  }`}
                >
                  {(
                    <span className="text-[11px] text-gray-500 ml-1">
                      {author?.nombre ?? 'Cargando nombre…'}
                    </span>
                  )}
                  <div
                    className={`p-3 sm:p-4 rounded-2xl shadow-sm ${
                      sent
                        ? 'bg-inmo-accent text-white rounded-tr-sm'
                        : 'bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary text-gray-700 dark:text-gray-300 rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.contenido}</p>
                    {message.adjuntos?.map((a) => (
                      <MediaDownload key={a.id} id={a.id} name={a.nombre} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mr-1 ml-1">
                    <time dateTime={message.persistido_at}>
                      {new Date(message.persistido_at).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                    {sent && other && BigInt(other.ultima_leida) >= BigInt(message.secuencia) && (
                      <CheckCircle2 aria-label="Leído" className="w-3.5 h-3.5 text-inmo-accent" />
                    )}
                  </div>
                </div>
              );
            })
          )}

          {conflictTargetId === selectedId && conflictNotice}

          {failure && (
            <p role="alert" className="text-sm text-inmo-danger text-center">
              {failure}
            </p>
          )}
        </div>

        {/* Input Area (Transparent) */}
        <div className="p-4 bg-transparent shrink-0 relative z-10 pb-6">
          {attachments.length > 0 && (
            <div className="px-2 mb-2 flex flex-wrap gap-2">
              {attachments.map((a) => (
                <Button
                  variant="secondary"
                  key={a.id}
                  aria-label={'Quitar ' + a.nombre}
                  onClick={() => {
                    setAttachments((items) => items.filter((i) => i.id !== a.id));
                    pending.current = null;
                  }}
                  className="!text-xs !py-1 !px-2.5 !rounded-full"
                >
                  {a.nombre} ×
                </Button>
              ))}
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
            className="flex items-end gap-2 max-w-4xl mx-auto w-full"
          >
            <IconButton
              aria-label="Adjuntar archivo"
              icon={<Paperclip className="w-[22px] h-[22px]" />}
              variant="secondary"
              disabled={uploading || sendMessage.isPending || attachments.length >= 4}
              onClick={() => setUploadOpen(true)}
              className="!w-[50px] !h-[50px] !rounded-full shrink-0 text-gray-500 dark:text-gray-400 hover:text-inmo-accent dark:hover:text-inmo-accent"
            />
            <div className="flex-1 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm rounded-full min-h-[50px] px-3 py-1 flex items-end transition-colors focus-within:ring-2 focus-within:ring-inmo-accent/20">
              <textarea
                aria-label="Escribe un mensaje"
                placeholder="Escribe un mensaje..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={4000}
                className="flex-1 bg-transparent border-none outline-none resize-none px-3 py-2.5 text-sm max-h-[120px] custom-scrollbar text-inmo-secondary dark:text-white"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
              />
            </div>
            <IconButton
              aria-label="Enviar mensaje"
              type="submit"
              icon={<Send className="w-5 h-5 ml-0.5" />}
              variant="accent"
              disabled={
                (!draft.trim() && !attachments.length) || sendMessage.isPending || uploading || detail.isError
              }
              className="!w-[50px] !h-[50px] !rounded-full shrink-0 shadow-glow"
            />
          </form>
        </div>
      </div>
    );
  };

  const filtersContent = (
    <>
      <div className="flex items-center bg-gray-50 dark:bg-inmo-darkbg rounded-2xl">
        <DropdownSelect compact label="Filtrar conversaciones" value={filter} onChange={setFilter} options={[{ value: "active", label: "Todos los mensajes" }, { value: "unread", label: "No leídos" }, { value: "archived", label: "Archivados" }]} />
      </div>
      <Button onClick={() => setIsFiltersOpen(false)} className="w-full h-12 mt-1">
        Aplicar Filtros
      </Button>
    </>
  );

  const isAdvisor = role === 'asesor';

  const emptyInbox = search.trim() ? (
    <EmptyState
      solid
      compact
      icon={<SearchX />}
      title="Sin resultados"
      description={<>No encontramos conversaciones con «{search.trim()}».</>}
      actions={
        <Button variant="secondary" onClick={() => setSearch('')}>
          Limpiar búsqueda
        </Button>
      }
    />
  ) : filter === 'unread' ? (
    <EmptyState
      solid
      compact
      icon={<CheckCheck />}
      title="¡Estás al día!"
      description="No tienes mensajes sin leer. Te avisaremos cuando llegue uno nuevo."
      actions={
        <Button variant="secondary" onClick={() => setFilter('active')}>
          Ver todos los mensajes
        </Button>
      }
    />
  ) : filter === 'archived' ? (
    <EmptyState
      solid
      compact
      icon={<Archive />}
      title="No hay conversaciones archivadas"
      description="Las conversaciones que archives se guardarán aquí para que puedas recuperarlas cuando quieras."
      actions={
        <Button variant="secondary" onClick={() => setFilter('active')}>
          Volver a mis chats
        </Button>
      }
    />
  ) : (
    <EmptyState
      solid
      icon={<MessagesSquare />}
      title="Aún no tienes conversaciones"
      description={
        isAdvisor
          ? 'Cuando un cliente te escriba sobre alguna de tus propiedades, la conversación aparecerá aquí.'
          : 'Cuando contactes a un asesor desde el detalle de una propiedad, podrás continuar la conversación aquí.'
      }
      actions={
        isAdvisor ? (
          <Button icon={<Building2 className="w-4 h-4" />} onClick={() => navigate('/asesor/propiedades')}>
            Ver mi inventario
          </Button>
        ) : (
          <Button icon={<Compass className="w-4 h-4" />} onClick={() => navigate('/')}>
            Explorar propiedades
          </Button>
        )
      }
    />
  );

  const renderChatListItems = () => {
    if (isWireframeMode || inbox.isLoading) {
      return Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="w-full h-[76px] rounded-[20px] bg-gray-50 dark:bg-inmo-darkcard flex items-center px-4 shadow-sm animate-pulse"
        >
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-inmo-darkbg shrink-0" />
          <div className="flex flex-col flex-1 min-w-0 ml-4 gap-2">
            <div className="flex justify-between items-center">
              <div className="w-1/2 h-4 bg-gray-200 dark:bg-inmo-darkbg rounded" />
              <div className="w-8 h-3 bg-gray-200 dark:bg-inmo-darkbg rounded" />
            </div>
            <div className="w-3/4 h-3 bg-gray-200 dark:bg-inmo-darkbg rounded" />
          </div>
        </div>
      ));
    }

    if (inbox.isError) {
      return (
        <EmptyState
          tone="error"
          icon={<CloudOff />}
          title="No pudimos cargar tus conversaciones"
          description="Hubo un problema al conectar con el servidor de mensajes. Inténtalo de nuevo en unos momentos."
          actions={
            <Button icon={<RefreshCw className="w-4 h-4" />} onClick={() => void inbox.refetch()}>
              Reintentar
            </Button>
          }
        />
      );
    }

    if (chats.length === 0) {
      return emptyInbox;
    }

    return (
      <>
        {chats.map((c) => {
          const person = c.participantes?.find((p) => p.id !== ownId);
          const isSelected = selectedId === c.id;
          return (
            <div
              key={c.id}
              role="button" tabIndex={0} aria-label={person?.nombre ?? "Nombre no disponible"} onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); select(c.id); } }} onClick={() => select(c.id)}
              className={`w-full h-[76px] rounded-[20px] flex items-center px-4 cursor-pointer transition-all border shrink-0 ${
                isSelected
                  ? 'bg-inmo-accent border-inmo-accent text-white shadow-[0_8px_25px_-6px_rgba(250,0,63,0.45)]'
                  : 'bg-white dark:bg-inmo-darkcard border-gray-100 dark:border-inmo-darktertiary shadow-sm hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-bold font-montserrat shadow-sm relative transition-colors ${
                  isSelected
                    ? 'bg-white text-inmo-accent'
                    : 'bg-inmo-accent/10 dark:bg-inmo-darktertiary text-inmo-accent dark:text-white'
                }`}
              >
                {person?.nombre.charAt(0) ?? '…'}
                {person?.en_linea && (
                  <div
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-inmo-success rounded-full border-2 ${
                      isSelected ? 'border-inmo-accent' : 'border-white dark:border-inmo-darkcard'
                    }`}
                  />
                )}
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline mb-1">
                  <h3
                    className={`font-montserrat font-bold text-[13px] md:text-sm truncate ${
                      isSelected ? 'text-white' : 'text-inmo-secondary dark:text-white'
                    }`}
                  >
                    {person?.nombre ?? 'Nombre no disponible'}
                  </h3>
                  <span
                    className={`text-[10px] md:text-[11px] font-bold font-inter whitespace-nowrap ml-2 uppercase tracking-wide ${
                      isSelected ? 'text-white/80' : 'text-gray-400'
                    }`}
                  >
                    {formatChatTime(c.ultimo_mensaje?.persistido_at)}
                  </span>
                </div>
                <p
                  className={`text-[12px] md:text-[13px] font-inter font-medium truncate ${
                    isSelected ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {c.ultimo_mensaje?.contenido ?? 'Sin mensajes'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {(c.no_leidos ?? 0) > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-white text-inmo-accent' : 'bg-inmo-accent text-white'
                    }`}
                  >
                    {c.no_leidos}
                  </span>
                )}
                <button
                  type="button"
                  aria-label={c.archivada ? 'Recuperar conversación' : 'Archivar conversación'}
                  title={c.archivada ? 'Recuperar conversación' : 'Archivar conversación'}
                  disabled={busy || conflict || !c.version}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!c.version) return;
                    setConfirmTarget({
                      id: c.id,
                      version: c.version,
                      archivada: Boolean(c.archivada),
                      name: person?.nombre ?? 'esta conversación',
                    });
                  }}
                  className={`min-w-11 min-h-11 flex items-center justify-center rounded-full transition-colors disabled:opacity-50 ${
                    isSelected
                      ? 'text-white/80 hover:text-white hover:bg-white/20'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {c.archivada ? (
                    <ArchiveRestore className="w-4 h-4" />
                  ) : (
                    <Archive className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {inbox.hasNextPage && (
          <Button
            variant="secondary"
            onClick={() => void inbox.fetchNextPage()}
            disabled={inbox.isFetchingNextPage}
            className="w-full mt-2"
          >
            Cargar más conversaciones
          </Button>
        )}
      </>
    );
  };

  const renderMainContent = () => (
    <ModuleLayout
      title="Mensajes"
      subtitle={
        chats.length === 1
          ? 'Tienes 1 conversación activa.'
          : `Tienes ${chats.length} conversaciones activas.`
      }
      isFullScreen={true}
      searchPlaceholder="¿Qué estás buscando?"
      searchValue={search}
      onSearchChange={setSearch}
      isFiltersOpen={isFiltersOpen}
      onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      onCloseFilters={() => setIsFiltersOpen(false)}
      filtersContent={filtersContent}
      titleMaxWidthClass={layoutWidthClass}
      controlsMaxWidthClass={layoutWidthClass}
      noScroll={true}
    >
      <div
        className={`w-full flex-1 min-h-0 overflow-y-auto max-md:hide-scrollbar flex flex-col gap-3 pb-32 md:pb-6 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${layoutWidthClass}`}
      >
        {conflictTargetId !== selectedId && conflictNotice}
        {!selectedId && failure && <p role="alert" className="text-inmo-danger text-sm">{failure}</p>}
        {renderChatListItems()}
      </div>
    </ModuleLayout>
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-inmo-darkbg">
      <SplitViewLayout
        isOpen={Boolean(selectedId)}
        onClose={() => select('')}
        sideTitle=""
        sidePosition="right"
        sidePanelWidthClass="w-full md:w-[68%] lg:w-[70%]"
        mainPanelWidthClass="md:w-[32%] lg:w-[30%]"
        sideContent={renderChatContent()}
        mainContent={renderMainContent()}
        bottomSheetNoPadding={true}
        bottomSheetFullHeight={true}
        desktopNoPadding={true}
        sidePanelTransparent={false}
        hideDesktopCloseButton={true}
        hideMobileCloseButton={true}
        bottomSheetIsHero={false}
        bottomSheetHeightMode="fixed-85"
        wrapperClassName="bg-transparent"
        mainPanelNoScroll={true}
      />

      {uploadOpen && (
        <BottomSheet
          isOpen
          onClose={uploading ? undefined : () => setUploadOpen(false)}
          title="Adjuntar archivo"
        >
          <p className="text-sm text-gray-500 mb-4">
            PDF, JPEG o WebP · máximo 5 MB. Sólo los participantes podrán abrirlo.
          </p>
          {uploading ? (
            <p role="status">Subiendo y comprobando…</p>
          ) : (
            <FileDropZone
              accept="application/pdf,image/jpeg,image/webp"
              maxSizeMB={5}
              onFileSelect={async (file) => {
                setUploading(true);
                setFailure('');
                try {
                  const result = await uploadMedia(file, selectedId);
                  setAttachments((items) => [...items, result]);
                  pending.current = null;
                  setUploadOpen(false);
                } catch (error) {
                  setFailure(operationError(error));
                } finally {
                  setUploading(false);
                }
              }}
            />
          )}
          {failure && (
            <p role="alert" className="text-inmo-danger text-sm mt-4">
              {failure}
            </p>
          )}
        </BottomSheet>
      )}

      <ConfirmModal
        isOpen={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirmArchive}
        title={
          confirmTarget?.archivada
            ? '¿Recuperar conversación?'
            : '¿Archivar conversación?'
        }
        message={
          confirmTarget?.archivada
            ? `¿Deseas desarchivar la conversación con ${confirmTarget?.name ?? 'este usuario'}? Volverá a aparecer en tu bandeja de mensajes activos.`
            : `¿Estás seguro de que deseas archivar la conversación con ${confirmTarget?.name ?? 'este usuario'}? Se moverá a tu sección de archivados y dejará de mostrarse en la bandeja principal.`
        }
        confirmText={confirmTarget?.archivada ? 'Recuperar' : 'Archivar'}
        cancelText="Cancelar"
        confirmVariant={confirmTarget?.archivada ? 'accent' : 'warning'}
      />
    </div>
  );
}
