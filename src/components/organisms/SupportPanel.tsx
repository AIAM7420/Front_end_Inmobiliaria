import { useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTicket, getHelp, getSupport, getTicket, replyTicket, type SolicitudSoporte } from '../../integrations/backend/operations.service';
import { isVersionConflict, operationError } from '../../integrations/backend/versioning';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Textarea } from '../atoms/Textarea';
import { ConflictNotice } from '../molecules/ConflictNotice';

export function SupportPanel({ admin = false }: { admin?: boolean }) {
  const cache = useQueryClient(), help = useQuery({ queryKey: ['help'], queryFn: getHelp });
  const tickets = useInfiniteQuery({ queryKey: ['support', admin], queryFn: ({ pageParam }) => getSupport(admin, pageParam), initialPageParam: undefined as string | undefined, getNextPageParam: page => page.next_cursor ?? undefined });
  const [selected, setSelected] = useState<string | null>(null), [subject, setSubject] = useState(''), [category, setCategory] = useState('CUENTA'), [body, setBody] = useState('');
  const requestId = useRef(crypto.randomUUID());
  const create = useMutation({ mutationFn: () => createTicket({ solicitud_id: requestId.current, asunto: subject.trim(), categoria: category, contenido: body.trim() }), onSuccess: value => { setSelected(value.id); setSubject(''); setBody(''); requestId.current = crypto.randomUUID(); void cache.invalidateQueries({ queryKey: ['support'] }); } });
  return <div className="px-6 py-8 space-y-6 font-inter text-sm">
    <h3 className="font-montserrat font-bold text-xl">{admin ? 'Solicitudes de soporte' : 'Ayuda y soporte'}</h3>
    {!admin && <section className="space-y-3">{help.isPending ? <p>Cargando ayuda…</p> : help.isError ? <p role="alert">{operationError(help.error)}</p> : help.data?.map(article => <details key={article.id} className="rounded-2xl bg-white dark:bg-inmo-darkcard shadow-soft p-4"><summary className="cursor-pointer font-bold">{article.titulo}</summary><p className="mt-3 text-gray-500 leading-relaxed">{article.contenido}</p></details>)}</section>}
    {selected ? <><Button variant="ghost" onClick={() => setSelected(null)}>Volver a solicitudes</Button><SupportThread key={selected} id={selected} admin={admin} /></> : <>
      <div className="space-y-3">{tickets.isPending ? <p>Cargando solicitudes…</p> : tickets.isError ? <p role="alert">{operationError(tickets.error)}</p> : tickets.data?.pages.flatMap(page => page.items).map(ticket => <button type="button" key={ticket.id} onClick={() => setSelected(ticket.id)} className="w-full text-left rounded-2xl bg-white dark:bg-inmo-darkcard shadow-soft p-4 space-y-2"><span className="block font-bold">{ticket.asunto}</span><span className="block text-xs text-gray-500">{admin ? ticket.nombre + ' · ' : ''}{ticket.estado.replaceAll('_', ' ')} · {new Date(ticket.actualizada_at).toLocaleString('es-MX')}</span></button>)}
      {tickets.data?.pages.every(page => page.items.length === 0) && <p className="text-gray-500">No hay solicitudes.</p>}
      {tickets.hasNextPage && <Button variant="secondary" isLoading={tickets.isFetchingNextPage} onClick={() => void tickets.fetchNextPage()}>Cargar más solicitudes</Button>}
      {tickets.isFetchNextPageError && <p role="alert">No pudimos consultar más solicitudes.</p>}</div>
      {!admin && <form className="bg-white dark:bg-inmo-darkcard rounded-2xl p-5 shadow-soft space-y-4" onSubmit={event => { event.preventDefault(); create.mutate(); }}><h4 className="font-montserrat font-bold text-lg">Nueva solicitud</h4><Input aria-label="Asunto" placeholder="Asunto" value={subject} onChange={event => setSubject(event.target.value)} required maxLength={160} /><Select aria-label="Categoría" value={category} onChange={event => setCategory(event.target.value)}>{['CUENTA', 'DOCUMENTOS', 'PUBLICACIONES', 'PAGOS', 'MENSAJES', 'OTRO'].map(value => <option key={value} value={value}>{value}</option>)}</Select><Textarea aria-label="Describe la solicitud" placeholder="Describe tu solicitud sin contraseñas ni datos de pago." value={body} onChange={event => setBody(event.target.value)} required maxLength={4000} /><Button type="submit" isLoading={create.isPending} disabled={!subject.trim() || !body.trim()}>Enviar solicitud</Button>{create.isError && <p role="alert">{operationError(create.error)}</p>}</form>}
    </>}
  </div>;
}

function SupportThread({ id, admin }: { id: string; admin: boolean }) {
  const query = useQuery({ queryKey: ['support', 'ticket', admin, id], queryFn: () => getTicket(admin, id), gcTime: 0 });
  if (query.isPending) return <p role="status">Cargando conversación de soporte…</p>;
  if (query.isError) return <p role="alert">{operationError(query.error)}</p>;
  return <SupportThreadEditor key={id} id={id} admin={admin} initial={query.data} />;
}

function SupportThreadEditor({ id, admin, initial }: { id: string; admin: boolean; initial: SolicitudSoporte }) {
  const cache = useQueryClient();
  const [snapshot, setSnapshot] = useState(initial), [body, setBody] = useState(''), [state, setState] = useState<SolicitudSoporte['estado']>('EN_ATENCION'), [conflict, setConflict] = useState(false);
  const messageId = useRef(crypto.randomUUID());
  const reply = useMutation({ mutationFn: () => replyTicket(admin, id, { mensaje_id: messageId.current, contenido: body.trim(), ...(admin ? { estado: state } : {}) }, snapshot!.version), onSuccess: value => { setSnapshot(value); setBody(''); messageId.current = crypto.randomUUID(); cache.setQueryData(['support', 'ticket', admin, id], value); void cache.invalidateQueries({ queryKey: ['support', admin] }); } });
  return <div className="space-y-4"><h4 className="font-montserrat font-bold text-lg">{snapshot.asunto}</h4><p className="text-gray-500">{snapshot.estado.replaceAll('_', ' ')}</p><div className="space-y-3 max-h-[50dvh] overflow-y-auto overscroll-contain">{snapshot.historial?.map(message => <article key={message.id} className={`rounded-2xl p-4 ${message.administrador ? 'bg-inmo-accent/5 border border-inmo-accent/10' : 'bg-white dark:bg-inmo-darkcard shadow-soft'}`}><p className="font-bold">{message.nombre}{message.administrador ? ' · Administración' : ''}</p><p className="whitespace-pre-wrap break-words mt-2">{message.contenido}</p><time className="text-xs text-gray-400 block mt-2">{new Date(message.creada_at).toLocaleString('es-MX')}</time></article>)}</div>
    <form className="space-y-4" onSubmit={async event => { event.preventDefault(); if (conflict) return; try { await reply.mutateAsync(); } catch (error) { if (isVersionConflict(error)) setConflict(true); } }}><Textarea aria-label="Respuesta de soporte" value={body} onChange={event => setBody(event.target.value)} placeholder="Escribe tu respuesta" required maxLength={4000} />{admin && <Select aria-label="Estado de soporte" value={state} onChange={event => setState(event.target.value as SolicitudSoporte['estado'])}><option value="ABIERTA">Abierta</option><option value="EN_ATENCION">En atención</option><option value="CERRADA">Cerrada</option></Select>}
    {conflict && <ConflictNotice current={<p>Estado vigente: {snapshot.estado}</p>} onReview={async () => setSnapshot(await getTicket(admin, id))} onAccept={() => { setConflict(false); reply.reset(); }} />}
    <Button type="submit" disabled={conflict || !body.trim()} isLoading={reply.isPending}>Enviar respuesta</Button>{reply.isError && !conflict && <p role="alert">{operationError(reply.error)}</p>}</form>
  </div>;
}
