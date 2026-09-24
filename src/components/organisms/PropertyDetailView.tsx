import type { ReactNode } from 'react';
import { Bath, Bed, Building2, MapPin, Maximize, User } from 'lucide-react';
import type { Id, PropiedadPublica } from '../../integrations/backend/types';
import { useGetPhotos, useGetPhotoUrl, useGetProperty } from '../../integrations/backend/hooks/useProperties';
import { Skeleton } from '../atoms/Skeleton';

export interface PropertyDetailViewProps {
  propertyId: Id;
  preview?: PropiedadPublica;
  layout?: 'vertical' | 'horizontal';
}

function PropertyPhoto({ propertyId, photoId, title, className }: {
  propertyId: Id;
  photoId: Id;
  title: string;
  className: string;
}) {
  const photo = useGetPhotoUrl(propertyId, photoId);
  if (photo.isPending) return <Skeleton className={className} />;
  if (!photo.data?.url) {
    return <div className={`${className} bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center text-gray-400`}>
      <Building2 className="w-8 h-8" strokeWidth={1.5} />
    </div>;
  }
  return <img src={photo.data.url} alt={title} className={`${className} object-cover`} loading="lazy" />;
}

function PropertyGallery({ propertyId, title, horizontal }: {
  propertyId: Id;
  title: string;
  horizontal: boolean;
}) {
  const photos = useGetPhotos(propertyId);
  const first = photos.data?.[0];

  return <div className={`${horizontal ? 'w-full md:w-1/2 h-full' : 'w-full'} flex flex-col gap-3 shrink-0`}>
    <div className={`relative w-full overflow-hidden rounded-[24px] bg-gray-100 dark:bg-inmo-darkbg ${horizontal ? 'flex-1 min-h-[220px]' : 'h-[300px]'}`}>
      {photos.isPending ? <Skeleton className="w-full h-full" /> : first ? (
        <PropertyPhoto propertyId={propertyId} photoId={first.id} title={title} className="w-full h-full" />
      ) : <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400">
        <Building2 className="w-12 h-12" strokeWidth={1.5} />
        <span className="font-inter text-sm">Sin fotografía</span>
      </div>}
    </div>
    {photos.data && photos.data.length > 1 && <div className="flex gap-3 overflow-x-auto pb-2 shrink-0">
      {photos.data.slice(1).map((photo, index) => <PropertyPhoto
        key={photo.id}
        propertyId={propertyId}
        photoId={photo.id}
        title={`${title}, fotografía ${index + 2}`}
        className="w-[140px] h-[100px] rounded-[20px] shrink-0"
      />)}
    </div>}
  </div>;
}

function Feature({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return <div className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-3 py-2.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
    {icon}<span className="text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300">{value} <span className="font-medium">{label}</span></span>
  </div>;
}

export function PropertyDetailView({ propertyId, preview, layout = 'vertical' }: PropertyDetailViewProps) {
  const query = useGetProperty(propertyId);
  const property = query.data ?? preview;
  const horizontal = layout === 'horizontal';

  if (query.isPending && !property) {
    return <div className="flex flex-col md:flex-row gap-6 p-4 bg-white dark:bg-inmo-darkcard rounded-[32px] h-full">
      <Skeleton className="w-full md:w-1/2 h-[260px] md:h-full" />
      <div className="flex-1 flex flex-col gap-4"><Skeleton className="w-3/4 h-7" variant="text" /><Skeleton className="w-1/2 h-5" variant="text" /><Skeleton className="w-full h-24" /></div>
    </div>;
  }
  if (query.isError || !property) {
    return <div role="alert" className="p-8 text-center text-gray-600 dark:text-gray-300 font-inter">
      No pudimos cargar esta propiedad. Inténtalo de nuevo más tarde.
    </div>;
  }

  const area = property.superficie_construccion ?? property.superficie_terreno;
  const location = preview?.colonia ? `${preview.colonia}, León, Guanajuato` : 'León, Guanajuato';

  return <div className={`bg-white dark:bg-inmo-darkcard rounded-[32px] overflow-hidden w-full h-full ${horizontal ? 'flex flex-col md:flex-row p-2 md:p-4 gap-6' : 'flex flex-col pb-20'}`}>
    <PropertyGallery propertyId={property.id} title={property.titulo} horizontal={horizontal} />
    <div className={`flex flex-col gap-5 min-w-0 ${horizontal ? 'w-full md:w-1/2 p-3 md:p-2' : 'p-6'}`}>
      <div>
        <h2 className="text-[22px] md:text-2xl font-bold font-montserrat text-inmo-secondary dark:text-white leading-tight">{property.titulo}</h2>
        <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
          <MapPin className="w-4 h-4 mr-1 shrink-0" strokeWidth={1.5} />
          <span className="text-sm font-inter">{location}</span>
        </div>
        <div className="mt-3 font-montserrat font-black text-3xl text-inmo-secondary dark:text-white">
          <span className="text-inmo-accent">$</span>{Number(property.precio).toLocaleString('es-MX')} <span className="text-sm font-medium">{property.moneda}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {property.habitaciones !== undefined && <Feature icon={<Bed className="w-4 h-4 text-gray-500" />} value={String(property.habitaciones)} label="rec." />}
        {property.banos !== undefined && <Feature icon={<Bath className="w-4 h-4 text-gray-500" />} value={property.banos} label="baños" />}
        {area && <Feature icon={<Maximize className="w-4 h-4 text-gray-500" />} value={area} label="m²" />}
      </div>
      <div className="border-t border-gray-100 dark:border-inmo-darktertiary pt-4">
        <h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white mb-2">Descripción</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-inter whitespace-pre-wrap">
          {property.descripcion || 'El asesor aún no añadió una descripción pública.'}
        </p>
      </div>
      <div className="mt-auto bg-gray-50 dark:bg-inmo-darkbg rounded-full px-4 py-3 flex items-center gap-3 border border-gray-100 dark:border-inmo-darktertiary">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-inmo-darkcard flex items-center justify-center"><User className="w-5 h-5 text-gray-500" strokeWidth={1.5} /></div>
        <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">Asesor de la propiedad</span>
      </div>
    </div>
  </div>;
}
