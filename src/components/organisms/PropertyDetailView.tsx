import { useEffect } from 'react';
import { useGetProperty } from '../../integrations/backend/hooks/useProperties';
import { registerVisit } from '../../integrations/backend/engagement.service';
import type { Id, PropiedadPublica } from '../../integrations/backend/types';
import { Skeleton } from '../atoms/Skeleton';
import { PropertyDetailContent } from './PropertyDetailContent';
import { AdvisorContact } from './AdvisorContact';
import { AsesorInlineProfile } from './AsesorInlineProfile';
export interface PropertyDetailViewProps {
  propertyId: Id;
  preview?: PropiedadPublica;
  layout?: 'vertical' | 'horizontal';
  /** Prototype flow: when controlled, the advisor profile replaces the detail inside the same panel. */
  showAsesorProfile?: boolean;
  onShowAsesorProfileChange?: (value: boolean) => void;
  /** Skip the inline advisor profile (e.g. when the detail is shown on the advisor's own page). */
  hideAdvisorProfile?: boolean;
}
export function PropertyDetailView({ propertyId, preview, layout = 'vertical', showAsesorProfile = false, onShowAsesorProfileChange, hideAdvisorProfile = false }: PropertyDetailViewProps) {
  const query = useGetProperty(propertyId), property = query.data ?? preview;
  useEffect(() => { if (query.data?.id) void registerVisit(query.data.id).catch(() => { /* Measurement failure does not block a public view. */ }); }, [query.data?.id]);
  if (query.isPending && !property) return <Skeleton className="w-full h-[300px]" />;
  if (query.isError || !property) return <div role="alert" className="p-8 text-center text-gray-600 dark:text-gray-300 font-inter">No pudimos cargar esta propiedad. Inténtalo de nuevo más tarde.</div>;
  const controlled = Boolean(onShowAsesorProfileChange);
  const contact = <AdvisorContact propertyId={property.id} advisorId={property.asesor_id} onProfileClick={controlled ? () => onShowAsesorProfileChange?.(true) : undefined} />;
  if (controlled && showAsesorProfile) return <div className="flex flex-col h-full w-full bg-white dark:bg-inmo-darkcard overflow-hidden">
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 pt-4"><AsesorInlineProfile advisorId={property.asesor_id} /></div>
    <div className="shrink-0 px-4 pb-4 pt-2 flex justify-center">{contact}</div>
  </div>;
  return <PropertyDetailContent key={property.id} property={{ ...preview, ...property }} layout={layout} bottomBar={contact}>
    {!controlled && !hideAdvisorProfile && <AsesorInlineProfile advisorId={property.asesor_id} />}
  </PropertyDetailContent>;
}
