import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSharedCommissions } from '../../integrations/backend/hooks/useProperties';
import { useCreateConversation } from '../../integrations/backend/hooks/useChat';
import { operationError } from '../../integrations/backend/versioning';
import { BottomSheet } from './BottomSheet';
import { ConnectedPropertyCard } from './ConnectedPropertyCard';
import { PropertyDetailContent } from './PropertyDetailContent';
import { Button } from '../atoms/Button';

export function SharedCommissions({ onClose, ownAdvisorId }: { onClose: () => void; ownAdvisorId?: string }) {
  const query = useSharedCommissions(true), chat = useCreateConversation();
  const [selected, setSelected] = useState(''), [failure, setFailure] = useState('');
  const property = query.data?.find(item => item.id === selected);
  const navigate = useNavigate();
  return <BottomSheet isOpen title={property ? 'Comisión compartida' : 'Comisiones compartidas'} onClose={onClose} onBack={property ? () => setSelected('') : undefined} heightMode="fixed-85">
    {property ? <PropertyDetailContent property={property} bottomBar={<div className="space-y-3"><p className="font-montserrat font-bold text-inmo-accent">Comisión compartida: {property.porcentaje_comision}%</p>
      {property.asesor_id !== ownAdvisorId && <Button isLoading={chat.isPending} onClick={async () => { setFailure(''); try { const result = await chat.mutateAsync({ tipo: 'ASESOR_ASESOR', asesor_destino_id: property.asesor_id }); navigate('/messages?conversation=' + encodeURIComponent(result.id)); } catch (error) { setFailure(operationError(error)); } }}>Contactar al asesor</Button>}
      {failure && <p role="alert" className="text-inmo-danger text-sm">{failure}</p>}</div>} />
      : <div className="font-inter space-y-4"><p className="text-sm text-gray-500">Publicaciones disponibles cuyos asesores comparten comisión. Cada propiedad permanece con su asesor.</p>
        {query.isPending ? <p role="status">Cargando comisiones…</p> : query.isError ? <p role="alert">No pudimos consultar las comisiones. Intenta nuevamente.</p> : query.data?.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{query.data.map(item => <div key={item.id}><ConnectedPropertyCard property={item} onClick={() => setSelected(item.id)} /><p className="text-inmo-accent font-bold text-sm p-3">Comisión compartida: {item.porcentaje_comision}%</p></div>)}</div> : <p role="status">Todavía no hay publicaciones con comisión compartida.</p>}
      </div>}
  </BottomSheet>;
}
