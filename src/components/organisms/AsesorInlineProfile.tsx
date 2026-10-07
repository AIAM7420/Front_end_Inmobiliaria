import { CheckCircle2, MapPin, Grid, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetOwnAdvisor } from '../../integrations/backend/hooks/useAdvisors';
import { usePublicAdvisor } from '../../integrations/backend/hooks/useEngagement';
import { useCreateConversation } from '../../integrations/backend/hooks/useChat';
import { useAppContext } from '../../context/AppContext';
import { operationError } from '../../integrations/backend/versioning';
import { Skeleton } from '../atoms/Skeleton';
import { Button } from '../atoms/Button';

export interface AsesorInlineProfileProps {
  advisorId: string;
  propertyId?: string;
  onBack?: () => void;
  className?: string;
}

export function AsesorInlineProfile({ advisorId, propertyId, className = '' }: AsesorInlineProfileProps) {
  const query = usePublicAdvisor(advisorId);
  const advisor = query.data;
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role } = useAppContext();
  const create = useCreateConversation();
  const own = useGetOwnAdvisor(role === 'asesor');
  const self = own.data?.id === advisorId;

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-5 w-full p-2 animate-pulse">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-5 w-full">
          <Skeleton className="w-full md:w-2/3 aspect-[4/4] sm:aspect-[4/5] md:aspect-[3/4] rounded-[28px]" />
          <div className="hidden md:flex w-1/3 flex-col justify-around py-4">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-7 w-2/3 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
      </div>
    );
  }

  if (!advisor) {
    return <p role="alert" className="text-sm text-gray-500 p-4">El perfil profesional no está disponible.</p>;
  }

  const year = advisor.incorporado_at ? new Date(advisor.incorporado_at).getFullYear() : null;

  const goToPortfolio = () => {
    const fromPath = location.pathname;
    const params = new URLSearchParams();
    if (propertyId) params.set('fromProperty', propertyId);
    if (fromPath) params.set('fromPath', fromPath);
    navigate(`/asesores/${advisorId}?${params.toString()}`);
  };

  const handleContact = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (role === 'admin' || self) return;
    if (role !== 'asesor' && !propertyId) { goToPortfolio(); return; }
    try {
      const conversation = await create.mutateAsync(
        role === 'asesor'
          ? { tipo: 'ASESOR_ASESOR', asesor_destino_id: advisorId }
          : { tipo: 'CLIENTE_ASESOR', propiedad_id: propertyId || '' }
      );
      navigate((role === 'asesor' ? '/asesor/mensajes' : '/messages') + '?conversation=' + encodeURIComponent(conversation.id));
    } catch {
      // Error handled and shown below
    }
  };

  return (
    <div className={`w-full h-full bg-white dark:bg-inmo-darkcard flex flex-col justify-center overflow-y-auto ${className}`}>
      {/* Contenido del Perfil */}
      <div className="flex-1 flex flex-col p-2 sm:p-4 space-y-5 justify-center max-w-[460px] mx-auto w-full">
        {/* Top Section: Photo and KPIs (disposición front-only con foto más grande) */}
        <div className="flex flex-col md:flex-row w-full items-stretch gap-4 sm:gap-5">
          {/* Photo */}
          <div className="w-full md:w-2/3 aspect-[4/4] sm:aspect-[4/5] md:aspect-[3/4] min-h-[220px] max-h-[360px] rounded-[28px] overflow-hidden shadow-sm relative shrink-0 bg-gray-100 dark:bg-inmo-darkbg group">
            <img
              src={advisor.fotografia_url ?? '/avatar-placeholder.svg'}
              alt={advisor.nombre_comercial}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Vertical KPIs (Desktop Only) */}
          <div className="hidden md:flex w-1/3 flex-col justify-center">
            <div className="flex flex-col items-center text-center border-b border-gray-100 dark:border-inmo-darktertiary/50 pb-4">
              <span className="font-montserrat font-black text-2xl text-inmo-secondary dark:text-white leading-tight">
                {advisor.propiedades_publicas}
              </span>
              <span className="font-inter text-xs text-gray-500 dark:text-gray-400 mt-1">Propiedades</span>
            </div>

            {year && (
              <div className="flex flex-col items-center text-center pt-4">
                <span className="font-montserrat font-black text-2xl text-inmo-secondary dark:text-white leading-tight">
                  {year}
                </span>
                <span className="font-inter text-xs text-gray-500 dark:text-gray-400 mt-1">Miembro</span>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Stats Row (Mobile Only) */}
        <div className="flex md:hidden justify-between items-center py-3 border-y border-gray-100 dark:border-inmo-darktertiary/50">
          <div className="flex flex-col items-center flex-1">
            <span className="font-montserrat font-black text-lg text-inmo-secondary dark:text-white leading-tight">
              {advisor.propiedades_publicas}
            </span>
            <span className="font-inter text-[11px] text-gray-500 dark:text-gray-400 mt-1">Propiedades</span>
          </div>
          {year && (
            <>
              <div className="w-px h-6 bg-gray-200 dark:bg-inmo-darktertiary" />
              <div className="flex flex-col items-center flex-1">
                <span className="font-montserrat font-black text-lg text-inmo-secondary dark:text-white leading-tight">
                  {year}
                </span>
                <span className="font-inter text-[11px] text-gray-500 dark:text-gray-400 mt-1">Miembro</span>
              </div>
            </>
          )}
        </div>

        {/* Info & Bio */}
        <div className="flex flex-col space-y-3 text-left">
          <div>
            <h3 className="font-montserrat font-bold text-xl sm:text-2xl text-inmo-secondary dark:text-white flex items-center gap-2">
              {advisor.nombre_comercial}
              {advisor.validado && <CheckCircle2 aria-label="Asesor validado" className="w-5 h-5 text-inmo-accent shrink-0" />}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mt-1">
              <MapPin className="w-4 h-4 text-inmo-accent" />
              <span className="font-inter text-xs sm:text-sm">León, Guanajuato</span>
            </div>
          </div>

          <p className="font-inter text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
            {advisor.descripcion || 'Este asesor aún no ha añadido una descripción.'}
          </p>

          {/* Dos botones de acción en la parte inferior: Portafolio y Contacto */}
          <div className="pt-2 flex flex-row gap-3 w-full">
            <Button
              variant="secondary"
              icon={<Grid className="w-4 h-4 text-current shrink-0" />}
              className="flex-1 !rounded-full !py-3 !px-3 font-inter font-semibold text-sm flex flex-row items-center justify-center gap-2 shadow-sm whitespace-nowrap text-inmo-secondary dark:text-white"
              onClick={goToPortfolio}
            >
              Portafolio
            </Button>
            {role !== 'admin' && !self && <Button
              variant="accent"
              icon={<MessageCircle className="w-4 h-4 text-current shrink-0" />}
              isLoading={create.isPending}
              disabled={role === 'asesor' && !own.data}
              className="flex-1 !rounded-full !py-3 !px-3 font-inter font-bold text-sm shadow-glow flex flex-row items-center justify-center gap-2 whitespace-nowrap text-white"
              onClick={handleContact}
            >
              Contactar
            </Button>}
          </div>
          {create.isError && <p role="alert" className="text-xs text-inmo-danger text-center">{operationError(create.error)}</p>}
        </div>
      </div>
    </div>
  );
}
