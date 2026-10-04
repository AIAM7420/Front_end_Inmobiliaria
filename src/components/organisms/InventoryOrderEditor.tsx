import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { PropiedadPrivada } from '../../integrations/backend/types';
import { useGetInventory, usePropertyManagement } from '../../integrations/backend/hooks/useProperties';
import { isVersionConflict, operationError } from '../../integrations/backend/versioning';
import { BottomSheet } from './BottomSheet';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { ConflictNotice } from '../molecules/ConflictNotice';
import { sortInventory } from '../../integrations/backend/properties.service';

export function InventoryOrderEditor({ items, onClose }: { items: PropiedadPrivada[]; onClose: () => void }) {
  const [draft, setDraft] = useState(() => sortInventory(items.filter(item => item.estado_publicacion !== 'ARCHIVADA')));
  const [conflict, setConflict] = useState(false), [failure, setFailure] = useState('');
  const list = useGetInventory(), { inventoryOrder } = usePropertyManagement();
  function move(index: number, delta: number) { const next = [...draft]; [next[index], next[index + delta]] = [next[index + delta], next[index]]; setDraft(next); }
  return <BottomSheet isOpen title="Ordenar inventario" onClose={() => { if (!inventoryOrder.isPending) onClose(); }} heightMode="fixed-85">
    <div className="space-y-4 font-inter"><p className="text-sm text-gray-500">Mueve tus propiedades y guarda el orden. Los filtros no modifican este orden.</p>
      <ol className="space-y-2">{draft.map((item, index) => <li key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-white/10">
        <span className="text-inmo-accent font-bold">{index + 1}</span><span className="flex-1 min-w-0 text-sm truncate">{item.titulo}</span>
        <IconButton size="sm" variant="ghost" icon={<ArrowUp className="w-4 h-4" />} aria-label={`Subir ${item.titulo}`} disabled={index === 0 || conflict || inventoryOrder.isPending} onClick={() => move(index, -1)} />
        <IconButton size="sm" variant="ghost" icon={<ArrowDown className="w-4 h-4" />} aria-label={`Bajar ${item.titulo}`} disabled={index === draft.length - 1 || conflict || inventoryOrder.isPending} onClick={() => move(index, 1)} />
      </li>)}</ol>
      {conflict && <ConflictNotice onReview={async () => { const result = await list.refetch(); if (result.isError) throw result.error; }}
        onAccept={() => { const latest = list.data?.items.filter(item => item.estado_publicacion !== 'ARCHIVADA') ?? []; const byId = new Map(latest.map(item => [item.id, item])); setDraft([...draft.filter(item => byId.has(item.id)).map(item => byId.get(item.id)!), ...latest.filter(item => !draft.some(old => old.id === item.id))]); setConflict(false); setFailure(''); }} />}
      {failure && !conflict && <p role="alert" className="text-inmo-danger text-sm">{failure}</p>}
      <div className="sticky bottom-0 bg-white/95 dark:bg-inmo-darkbg/95 py-3 flex gap-3"><Button variant="secondary" disabled={inventoryOrder.isPending} onClick={onClose}>Cancelar</Button>
        <Button disabled={!draft.length || conflict} isLoading={inventoryOrder.isPending} onClick={async () => { setFailure(''); try { await inventoryOrder.mutateAsync(draft); onClose(); } catch (error) { setFailure(operationError(error)); if (isVersionConflict(error)) setConflict(true); } }}>Guardar orden del inventario</Button></div>
    </div>
  </BottomSheet>;
}
