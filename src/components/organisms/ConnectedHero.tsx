import { useState } from 'react';
import { useGetPhotos, useGetPhotoUrl } from '../../integrations/backend/hooks/useProperties';
import { Skeleton } from '../atoms/Skeleton';
import { HeroCarousel } from './HeroCarousel';

/**
 * Imágenes ilustrativas gratuitas (Unsplash License) que se muestran cuando el
 * backend no responde o el catálogo aún no tiene fotografías publicadas.
 */
const FALLBACK_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600',
];

export function ConnectedHero({ propertyId, catalogLoading = false }: { propertyId?: string; catalogLoading?: boolean }) {
  const photos = useGetPhotos(propertyId ?? '', Boolean(propertyId));
  const firstPhotoId = photos.data?.[0]?.id ?? '';
  const cover = useGetPhotoUrl(propertyId ?? '', firstPhotoId, Boolean(propertyId));
  const [brokenUrl, setBrokenUrl] = useState('');
  const imageUrl = cover.data?.url && cover.data.url !== brokenUrl ? cover.data.url : undefined;
  const loading = catalogLoading || (Boolean(propertyId) && (photos.isLoading || (Boolean(firstPhotoId) && cover.isLoading)));

  // Sin fotografía real disponible (error del backend, catálogo vacío o imagen rota): carrusel ilustrativo.
  if (!loading && !imageUrl) return <HeroCarousel images={FALLBACK_HERO_IMAGES} />;

  return (
    <div className="relative w-full h-[180px] md:h-[220px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm mt-1 md:mt-2 bg-inmo-secondary">
      {loading ? <Skeleton className="absolute inset-0 !rounded-none" /> : (
        <img src={imageUrl} alt="Fotografía de una propiedad del catálogo" className="absolute inset-0 w-full h-full object-cover" onError={() => setBrokenUrl(imageUrl ?? '')} />
      )}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-5 md:px-8 pointer-events-none">
        <h2 className="text-white text-hero font-montserrat text-center leading-tight drop-shadow-md">
          Encuentra tu espacio ideal
        </h2>
      </div>
    </div>
  );
}
