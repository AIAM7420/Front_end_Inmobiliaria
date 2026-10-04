import type { PropiedadPrivada, PropiedadPublica } from '../../integrations/backend/types';
import { useGetPhotos, useGetPhotoUrl, useGetOwnPhotos, useGetOwnPhotoUrl } from '../../integrations/backend/hooks/useProperties';
import { PropertyCard } from '../molecules/PropertyCard';
import { useFavorite } from '../../integrations/backend/hooks/useEngagement';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { operationError } from '../../integrations/backend/versioning';

type CardProperty = PropiedadPublica | PropiedadPrivada;

export interface ConnectedPropertyCardProps {
  property: CardProperty;
  onClick?: () => void;
  variant?: 'standard' | 'asesor';
}

/** No address or exact coordinates are projected into a public card. */
export function ConnectedPropertyCard({ property, onClick, variant = 'standard' }: ConnectedPropertyCardProps) {
  const favorite = useFavorite(property.id), navigate = useNavigate(), { isAuthenticated, role } = useAppContext();
  const eligible = variant === 'standard' ||
    (property.estado_publicacion === 'PUBLICADA' && property.visible && property.disponible);
  const publicPhotos = useGetPhotos(property.id, variant === 'standard' && eligible);
  const ownPhotos = useGetOwnPhotos(property.id, variant === 'asesor');
  const photos = variant === 'asesor' ? ownPhotos : publicPhotos;
  const firstPhotoId = photos.data?.[0]?.id ?? '';
  const publicCover = useGetPhotoUrl(property.id, firstPhotoId, variant === 'standard' && eligible);
  const ownCover = useGetOwnPhotoUrl(property.id, firstPhotoId, variant === 'asesor');
  const cover = variant === 'asesor' ? ownCover : publicCover;
  const area = property.superficie_construccion ?? property.superficie_terreno;

  return (
    <div className="h-full flex flex-col gap-2"><PropertyCard
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
      isFavorite={favorite.query.data ?? false}
      favoritePending={favorite.mutation.isPending || isAuthenticated && (favorite.query.isPending || favorite.query.isError)}
      onToggleFavorite={variant === 'standard' ? () => { if (!isAuthenticated) navigate('/login'); else favorite.mutation.mutate(!favorite.query.data); } : undefined}
    />
    {(role === 'asesor' || role === 'admin') && property.comparte_comision && <p className="font-inter text-xs font-bold text-inmo-accent px-4">Comisión compartida: {property.porcentaje_comision}%</p>}
    {favorite.query.isError && variant === 'standard' && <p role="alert" className="text-xs text-inmo-danger">No pudimos consultar favoritos. <button onClick={() => void favorite.query.refetch()} className="font-bold underline">Reintentar</button></p>}
    {favorite.mutation.isError && <p role="alert" className="text-xs text-inmo-danger">{operationError(favorite.mutation.error)}</p>}</div>
  );
}
