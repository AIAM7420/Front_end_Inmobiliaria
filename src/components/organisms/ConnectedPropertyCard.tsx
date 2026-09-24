import type { PropiedadPrivada, PropiedadPublica } from '../../integrations/backend/types';
import { useGetPhotos, useGetPhotoUrl } from '../../integrations/backend/hooks/useProperties';
import { PropertyCard } from '../molecules/PropertyCard';

type CardProperty = PropiedadPublica | PropiedadPrivada;

export interface ConnectedPropertyCardProps {
  property: CardProperty;
  onClick?: () => void;
  variant?: 'standard' | 'asesor';
}

/** No address or exact coordinates are projected into a public card. */
export function ConnectedPropertyCard({ property, onClick, variant = 'standard' }: ConnectedPropertyCardProps) {
  const eligible = variant === 'standard' ||
    (property.estado_publicacion === 'PUBLICADA' && property.visible && property.disponible);
  const photos = useGetPhotos(property.id, eligible);
  const firstPhotoId = photos.data?.[0]?.id ?? '';
  const cover = useGetPhotoUrl(property.id, firstPhotoId, eligible);
  const area = property.superficie_construccion ?? property.superficie_terreno;

  return (
    <PropertyCard
      image={cover.data?.url}
      imageLoading={photos.isLoading || (Boolean(firstPhotoId) && cover.isLoading)}
      title={property.titulo}
      location={
        'colonia' in property && property.colonia
          ? `${property.colonia}, León, Guanajuato`
          : 'León, Guanajuato'
      }
      price={Number(property.precio)}
      beds={property.habitaciones}
      baths={property.banos === undefined ? undefined : Number(property.banos)}
      sqft={area === undefined || area === null ? undefined : Number(area)}
      tags={variant === 'standard' ? [{ text: 'Venta', variant: 'venta' }] : undefined}
      onClick={onClick}
      variant={variant}
    />
  );
}
