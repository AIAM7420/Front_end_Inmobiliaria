import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useCreateConversation } from '../../integrations/backend/hooks/useChat';
import { useGetProperty } from '../../integrations/backend/hooks/useProperties';
import { operationError } from '../../integrations/backend/versioning';
import type { Id, PropiedadPublica } from '../../integrations/backend/types';
import { Button } from '../atoms/Button';
import { Skeleton } from '../atoms/Skeleton';
import { PropertyDetailContent } from './PropertyDetailContent';

export interface PropertyDetailViewProps {
  propertyId: Id;
  preview?: PropiedadPublica;
  layout?: 'vertical' | 'horizontal';
}
export function PropertyDetailView({ propertyId, preview, layout = 'vertical' }: PropertyDetailViewProps) {
  const query = useGetProperty(propertyId);
  const property = query.data ?? preview;
  if (query.isPending && !property) return <Skeleton className="w-full h-[300px]" />;
  if (query.isError || !property) return <div role="alert" className="p-8 text-center text-gray-600 dark:text-gray-300 font-inter">No pudimos cargar esta propiedad. Inténtalo de nuevo más tarde.</div>;
  return <PropertyDetailContent key={property.id} property={{ ...preview, ...property }} layout={layout} bottomBar={<ContactProperty propertyId={property.id} />} />;
}
function ContactProperty({ propertyId }: { propertyId: Id }) {
  const { isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const create = useCreateConversation();
  return <div className="w-full space-y-3"><div className="bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] h-[64px] rounded-full flex items-center justify-between px-2 w-full max-w-[400px]">
    <div className="flex items-center gap-2 pl-2"><div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center shrink-0 border border-gray-200 dark:border-inmo-darktertiary"><User className="w-5 h-5 text-gray-500" /></div>
      <span className="font-bold text-[13px] sm:text-sm text-inmo-secondary dark:text-white leading-tight">Asesor de la propiedad</span></div>
    <Button className="!rounded-full !py-2.5 !px-5 sm:!px-6 shadow-glow font-inter font-bold text-[13px] sm:text-sm" isLoading={create.isPending} onClick={async () => {
      if (!isAuthenticated) { navigate('/login'); return; }
      try { const conversation = await create.mutateAsync({ tipo: 'CLIENTE_ASESOR', propiedad_id: propertyId }); navigate('/messages?conversation=' + encodeURIComponent(conversation.id)); } catch { /* Error shown below. */ }
    }}>Contactar</Button>
  </div>{create.isError && <p role="alert" className="text-sm text-inmo-danger">{operationError(create.error)}</p>}</div>;
}
