import { useGetPhotos, useGetPhotoUrl } from '../../integrations/backend/hooks/useProperties';
import { Skeleton } from '../atoms/Skeleton';

export function ConnectedHero({ propertyId }: { propertyId?: string }) {
  const photos = useGetPhotos(propertyId ?? '', Boolean(propertyId));
  const firstPhotoId = photos.data?.[0]?.id ?? '';
  const cover = useGetPhotoUrl(propertyId ?? '', firstPhotoId, Boolean(propertyId));
  const imageUrl = cover.data?.url;
  const loading = Boolean(propertyId) && (photos.isLoading || (Boolean(firstPhotoId) && cover.isLoading));

  return (
    <div className="relative w-full h-[220px] rounded-[32px] overflow-hidden shadow-sm mt-2 bg-inmo-secondary">
      {loading ? <Skeleton className="absolute inset-0 !rounded-none" /> : imageUrl ? (
        <img src={imageUrl} alt="Fotografía de una propiedad del catálogo" className="absolute inset-0 w-full h-full object-cover" />
      ) : <div className="absolute inset-0 bg-gradient-to-br from-inmo-secondary via-inmo-secondary to-inmo-accent/70" />}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-8">
        <h2 className="text-white text-hero font-montserrat text-center leading-tight drop-shadow-md">
          Encuentra tu espacio ideal
        </h2>
      </div>
    </div>
  );
}
