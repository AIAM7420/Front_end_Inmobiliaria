import { CheckCircle2, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublicAdvisor } from '../../integrations/backend/hooks/useEngagement';
import { Skeleton } from '../atoms/Skeleton';

export function AsesorInlineProfile({ advisorId }: { advisorId: string }) {
  const query = usePublicAdvisor(advisorId), advisor = query.data;
  if (query.isPending) return <Skeleton className="h-40" />;
  if (!advisor) return <p role="alert" className="text-sm text-gray-500">El perfil profesional no está disponible.</p>;
  return <section className="bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary p-5 flex flex-col gap-4"><div className="flex gap-4 items-center"><div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-inmo-darkbg overflow-hidden flex items-center justify-center shrink-0">{advisor.fotografia_url ? <img src={advisor.fotografia_url} alt="" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-gray-400" />}</div><div><h3 className="font-montserrat font-bold text-lg flex gap-2 items-center">{advisor.nombre_comercial}{advisor.validado && <CheckCircle2 aria-label="Asesor validado" className="w-5 h-5 text-inmo-accent" />}</h3><p className="text-sm text-gray-500">{advisor.propiedades_publicas} propiedades públicas</p></div></div>{advisor.descripcion && <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{advisor.descripcion}</p>}<Link className="text-inmo-accent font-bold text-sm flex gap-2 items-center" to={'/asesores/' + advisorId}>Ver perfil y portafolio<ExternalLink className="w-4 h-4" /></Link></section>;
}
