import { useState } from 'react';
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import type { Fotografia, PropiedadPrivada } from '../../integrations/backend/types';
import { useGetOwnPhotoUrl, useGetOwnPhotos, useGetOwnProperty, usePropertyManagement } from '../../integrations/backend/hooks/useProperties';
import { isVersionConflict, operationError } from '../../integrations/backend/versioning';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { ConfirmModal } from '../molecules/ConfirmModal';
import { ConflictNotice } from '../molecules/ConflictNotice';

function PhotoTile({ propertyId, photo }: { propertyId: string; photo: Fotografia }) {
  const url = useGetOwnPhotoUrl(propertyId, photo.id);
  return url.data?.url ? <img src={url.data.url} alt={`Fotografía ${photo.posicion}`} className="w-full h-28 object-cover rounded-xl" /> : <div className="h-28 rounded-xl bg-inmo-tertiary dark:bg-inmo-darkbg" />;
}

/** A draft is seeded only when editing starts. A 412 never erases it. */
export function PropertyPhotoManager({ property, photos }: { property: PropiedadPrivada; photos: Fotografia[] }) {
  const [draft, setDraft] = useState<Fotografia[] | null>(null);
  const [version, setVersion] = useState(property.version);
  const [conflict, setConflict] = useState(false);
  const [failure, setFailure] = useState('');
  const [notice, setNotice] = useState('');
  const [deleting, setDeleting] = useState<{ photo: Fotografia; version: number } | null>(null);
  const actions = usePropertyManagement();
  const current = useGetOwnProperty(property.id), latestPhotos = useGetOwnPhotos(property.id);
  const busy = actions.photoOrder.isPending || actions.removePhoto.isPending;
  const items = draft ?? photos;
  const fail = (error: unknown) => { setFailure(operationError(error)); if (isVersionConflict(error)) setConflict(true); };
  function move(index: number, delta: number) {
    const next = [...items];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    if (!draft) setVersion(property.version);
    setDraft(next);
  }
  return <section aria-label="Gestionar fotografías" className="space-y-4">
    <h3 className="font-montserrat font-bold">Fotografías</h3>
    <p className="text-xs text-gray-500">La primera fotografía será la portada. Cambia el orden y guarda para confirmarlo.</p>
    <div className="flex gap-3 overflow-x-auto overscroll-contain pb-2">{items.map((photo, index) => <div key={photo.id} className="w-40 shrink-0 rounded-2xl border border-gray-100 dark:border-white/10 p-2">
      <PhotoTile propertyId={property.id} photo={photo} />
      <p className="text-xs mt-2">{index === 0 ? 'Portada' : `Fotografía ${index + 1}`}</p>
      <div className="flex justify-between">
        <IconButton size="sm" variant="ghost" icon={<ArrowLeft className="w-4 h-4" />} aria-label={`Mover foto ${index + 1} antes`} disabled={index === 0 || busy || conflict} onClick={() => move(index, -1)} />
        <IconButton size="sm" variant="ghost" icon={<ArrowRight className="w-4 h-4" />} aria-label={`Mover foto ${index + 1} después`} disabled={index === items.length - 1 || busy || conflict} onClick={() => move(index, 1)} />
        <IconButton size="sm" variant="ghost" icon={<Trash2 className="w-4 h-4 text-inmo-danger" />} aria-label={`Eliminar foto ${index + 1}`} disabled={busy || conflict || Boolean(draft)} onClick={() => setDeleting({ photo, version: property.version })} />
      </div>
    </div>)}</div>
    {draft && <div className="flex gap-2"><Button disabled={busy || conflict} isLoading={actions.photoOrder.isPending} onClick={async () => {
      setFailure(''); setNotice('');
      try { await actions.photoOrder.mutateAsync({ id: property.id, ids: draft.map(photo => photo.id), etag: `"v${version}"` }); setDraft(null); setNotice('Orden de fotografías guardado.'); } catch (error) { fail(error); }
    }}>Guardar orden de fotos</Button><Button variant="secondary" disabled={busy} onClick={() => { setDraft(null); setConflict(false); setFailure(''); }}>Descartar orden</Button></div>}
    {conflict && <ConflictNotice current={<p>Versión actual: {current.data?.value.version ?? '…'}. Fotografías actuales: {latestPhotos.data?.length ?? '…'}.</p>}
      onReview={async () => { const [resource, pictures] = await Promise.all([current.refetch(), latestPhotos.refetch()]); if (resource.isError || pictures.isError) throw new Error('No pudimos revisar la ficha.'); }}
      onAccept={() => {
        if (draft && latestPhotos.data) {
          const available = new Map(latestPhotos.data.map(photo => [photo.id, photo]));
          setDraft([...draft.filter(photo => available.has(photo.id)).map(photo => available.get(photo.id)!), ...latestPhotos.data.filter(photo => !draft.some(old => old.id === photo.id))]);
        }
        setVersion(current.data?.value.version ?? property.version); setConflict(false); setFailure(''); setDeleting(null);
      }} />}
    {failure && !conflict && <p role="alert" className="text-inmo-danger text-sm">{failure}</p>}
    {notice && <p role="status" className="text-sm text-inmo-success">{notice}</p>}
    <ConfirmModal isOpen={Boolean(deleting)} onClose={() => setDeleting(null)} title="Eliminar fotografía" confirmText="Eliminar fotografía" confirmVariant="danger"
      message="Se eliminará esta fotografía del almacenamiento. Esta acción no se puede deshacer. Si es la última fotografía publicada, primero pausa la publicación."
      onConfirm={async () => { if (!deleting) return; try {
        const result = await actions.removePhoto.mutateAsync({ id: property.id, photoId: deleting.photo.id, etag: `"v${deleting.version}"` });
        setNotice(result.limpieza_pendiente ? 'Fotografía retirada. Su limpieza se reintentará automáticamente.' : 'Fotografía eliminada.');
        setDeleting(null);
      } catch (error) { fail(error); if (isVersionConflict(error)) setDeleting(null); throw error; } }} />
  </section>;
}
