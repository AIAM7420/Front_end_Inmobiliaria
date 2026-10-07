import { useNavigate } from 'react-router-dom';
import { User, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useCreateConversation } from '../../integrations/backend/hooks/useChat';
import { useGetOwnAdvisor } from '../../integrations/backend/hooks/useAdvisors';
import { usePublicAdvisor } from '../../integrations/backend/hooks/useEngagement';
import { operationError } from '../../integrations/backend/versioning';
import { Button } from '../atoms/Button';

export function AdvisorContact({ advisorId, propertyId, onProfileClick }: { advisorId: string; propertyId?: string; onProfileClick?: () => void }) {
  const { isAuthenticated, role } = useAppContext(), navigate = useNavigate();
  const create = useCreateConversation(), advisor = usePublicAdvisor(advisorId), own = useGetOwnAdvisor(role === 'asesor');
  const self = own.data?.id === advisorId;
  return <div className="w-full space-y-3"><div className="bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] h-[64px] rounded-full flex items-center justify-between px-2 w-full max-w-[400px]">
    <button type="button" onClick={onProfileClick ?? (() => navigate('/asesores/' + advisorId))} className="flex items-center gap-2 pl-2 min-w-0 text-left cursor-pointer hover:opacity-80 transition-opacity" aria-label="Ver perfil del asesor"><span className="w-10 h-10 rounded-full bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center shrink-0 border border-gray-200 dark:border-inmo-darktertiary overflow-hidden">{advisor.data?.fotografia_url ? <img src={advisor.data.fotografia_url} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-gray-500" />}</span><span className="flex flex-col min-w-0"><span className="flex items-center gap-1 min-w-0"><span className="font-bold text-[13px] sm:text-sm text-inmo-secondary dark:text-white leading-tight truncate max-w-[110px] sm:max-w-[140px]">{advisor.data?.nombre_comercial ?? 'Asesor'}</span>{advisor.data?.validado && <CheckCircle2 aria-label="Asesor validado" className="w-3 h-3 text-inmo-accent shrink-0" />}</span><span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Ver Perfil</span></span></button>
    {self ? <Button variant="secondary" onClick={() => navigate('/asesor/propiedades')}>Mi inventario</Button> : role === 'admin' ? <Button variant="secondary" onClick={() => navigate('/admin/moderacion' + (propertyId ? '?property=' + propertyId : ''))}>Moderar</Button> : <Button className="!rounded-full !py-2.5 !px-5 sm:!px-6 shadow-glow font-inter font-bold text-[13px] sm:text-sm" disabled={role === 'asesor' && !own.data || role === 'public' && !propertyId} isLoading={create.isPending} onClick={async () => {
      if (!isAuthenticated) { navigate('/login'); return; }
      try { const conversation = await create.mutateAsync(role === 'asesor' ? { tipo: 'ASESOR_ASESOR', asesor_destino_id: advisorId } : { tipo: 'CLIENTE_ASESOR', propiedad_id: propertyId! }); navigate((role === 'asesor' ? '/asesor/mensajes' : '/messages') + '?conversation=' + encodeURIComponent(conversation.id)); } catch { /* The API error is displayed below. */ }
    }}>Contactar</Button>}
  </div>{role === 'public' && !propertyId && <p className="text-xs text-gray-500">Selecciona una propiedad del portafolio para contactar al asesor.</p>}{create.isError && <p role="alert" className="text-sm text-inmo-danger">{operationError(create.error)}</p>}</div>;
}
