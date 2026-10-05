import { useEffect } from 'react';
import { useGetProperty } from '../../integrations/backend/hooks/useProperties';
import { registerVisit } from '../../integrations/backend/engagement.service';
import type { Id, PropiedadPublica } from '../../integrations/backend/types';
import { Skeleton } from '../atoms/Skeleton';
import { PropertyDetailContent } from './PropertyDetailContent';
import { AdvisorContact } from './AdvisorContact';
import { AsesorInlineProfile } from './AsesorInlineProfile';
export interface PropertyDetailViewProps { propertyId: Id; preview?: PropiedadPublica; layout?: 'vertical' | 'horizontal' }
export function PropertyDetailView({ propertyId, preview, layout = 'vertical' }: PropertyDetailViewProps) {
  const query = useGetProperty(propertyId), property = query.data ?? preview;
  useEffect(() => { if (query.data?.id) void registerVisit(query.data.id).catch(() => { /* Measurement failure does not block a public view. */ }); }, [query.data?.id]);
  if (query.isPending && !property) return <Skeleton className="w-full h-[300px]" />;
  if (query.isError || !property) return <div role="alert" className="p-8 text-center text-gray-600 dark:text-gray-300 font-inter">No pudimos cargar esta propiedad. Inténtalo de nuevo más tarde.</div>;
  return <PropertyDetailContent key={property.id} locationLoading={query.isPending && !property.zona_geojson} property={{ ...preview, ...property }} layout={layout} bottomBar={<AdvisorContact propertyId={property.id} advisorId={property.asesor_id} />}><AsesorInlineProfile advisorId={property.asesor_id} /></PropertyDetailContent>;
}
