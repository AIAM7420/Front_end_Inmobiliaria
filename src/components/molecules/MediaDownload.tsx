import { useQuery } from '@tanstack/react-query';
import { mediaUrl } from '../../integrations/backend/media.service';
export function MediaDownload({ id, name }: { id: string; name: string }) {
  const query = useQuery({ queryKey: ['chat', 'attachment-url', id], queryFn: () => mediaUrl(id), staleTime: 120_000, retry: false });
  return query.isPending ? <span className="block text-xs">Preparando enlace…</span> : query.isError ? <span role="alert" className="block text-xs">Archivo temporalmente no disponible</span> : <a href={query.data} target="_blank" rel="noopener noreferrer" className="block text-sm underline mt-2 break-words">{name}</a>;
}
