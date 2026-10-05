import { useState, type ReactNode } from 'react';
import { Bath, Bed, Building2, MapPin, Maximize } from 'lucide-react';
import { useGetCatalog, useGetPhotos, useGetOwnPhotos, useGetPhotoUrl, useGetOwnPhotoUrl } from '../../integrations/backend/hooks/useProperties';
import type { Fotografia, Id, PropiedadPrivada, PropiedadPublica } from '../../integrations/backend/types';
import { approximateZoneCenter } from '../../integrations/backend/zoneGeometry';
import { Skeleton } from '../atoms/Skeleton';
import { PropertyMiniMap } from '../molecules/PropertyMiniMap';
import { useAppContext } from '../../context/AppContext';
import { useGetAdminPhotos, useGetAdminPhotoUrl } from '../../integrations/backend/hooks/useAdministration';

function Photo({ propertyId, photo, title, className, owned, moderation }: {
  propertyId: Id; photo?: Fotografia; title: string; className: string; owned: boolean; moderation: boolean;
}) {
  const publicUrl = useGetPhotoUrl(propertyId, photo?.id ?? '', !owned && !moderation);
  const privateUrl = useGetOwnPhotoUrl(propertyId, photo?.id ?? '', owned);
  const administrativeUrl = useGetAdminPhotoUrl(propertyId, photo?.id ?? '', moderation);
  const query = moderation ? administrativeUrl : owned ? privateUrl : publicUrl;
  if (photo && query.isPending) return <Skeleton className={className} />;
  return photo && query.data?.url ? <img src={query.data.url} alt={title} className={`${className} object-cover`} loading="lazy" />
    : <div className={`${className} bg-gray-100 dark:bg-inmo-darkbg flex flex-col items-center justify-center gap-2 text-gray-400`}>
      <Building2 className="w-12 h-12" strokeWidth={1.5} /><span className="font-inter text-sm">{query.isError ? 'No pudimos consultar la fotografía.' : 'Sin fotografía'}</span>{query.isError && <button className="text-inmo-accent text-sm" onClick={() => void query.refetch()}>Reintentar</button>}
    </div>;
}

/** Spacing and containers from 01295be; all displayed facts come from V1. */
export function PropertyDetailContent({ property, layout = 'vertical', owned = false, moderation = false, children, bottomBar, locationLoading = false }: {
  property: PropiedadPublica | PropiedadPrivada;
  layout?: 'vertical' | 'horizontal'; owned?: boolean; moderation?: boolean; children?: ReactNode; bottomBar?: ReactNode; locationLoading?: boolean;
}) {
  const { role } = useAppContext();
  const publicPhotos = useGetPhotos(property.id, !owned && !moderation);
  const privatePhotos = useGetOwnPhotos(property.id, owned);
  const administrativePhotos = useGetAdminPhotos(property.id, moderation);
  const photos = moderation ? administrativePhotos : owned ? privatePhotos : publicPhotos;
  const amenities = useGetCatalog('amenidades');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const cover = photos.data?.find(item => item.id === selectedPhoto) ?? photos.data?.[0];
  const horizontal = layout === 'horizontal';
  const privateProperty = owned || moderation ? property as PropiedadPrivada : null;
  const publicProperty = property as PropiedadPublica;
  const position = privateProperty ? (privateProperty.latitud && privateProperty.longitud
    ? { lat: Number(privateProperty.latitud), lng: Number(privateProperty.longitud) } : null)
    : approximateZoneCenter(publicProperty.zona_geojson);
  const location = privateProperty?.direccion ?? (publicProperty.colonia ? `${publicProperty.colonia}, León, Guanajuato` : 'León, Guanajuato');
  const photo = (className: string) => photos.isLoading ? <Skeleton className={className} /> : <Photo propertyId={property.id} photo={cover} title={property.titulo} className={className} owned={owned} moderation={moderation} />;
  const gallery = <div className="flex gap-3 overflow-x-auto overscroll-contain snap-x snap-mandatory pb-2 shrink-0" aria-label="Galería de fotografías">
    {photos.data?.map((item, index) => <button key={item.id} type="button" onClick={() => setSelectedPhoto(item.id)} aria-label={`Mostrar fotografía ${index + 1}`} aria-pressed={cover?.id === item.id}
      className="shrink-0 snap-center rounded-[20px] focus-visible:outline-2 focus-visible:outline-inmo-accent">
      <Photo propertyId={property.id} photo={item} title={`${property.titulo}, fotografía ${index + 1}`} className="w-[140px] h-[100px] rounded-[20px] shadow-sm" owned={owned} moderation={moderation} />
    </button>)}
    {photos.isError && <p role="alert" className="text-sm text-inmo-danger">No pudimos cargar las fotografías.</p>}
  </div>;
  const title = <div className={horizontal ? 'flex flex-col gap-2 mb-3' : ''}>
    <h2 className={`text-[22px] ${horizontal ? 'md:text-2xl' : 'mb-2'} font-bold font-montserrat text-inmo-secondary dark:text-white leading-tight`}>{property.titulo}</h2>
    <div className={horizontal ? 'flex justify-between items-end w-full gap-2' : ''}>
      <div className={`flex items-center text-gray-500 dark:text-gray-400 min-w-0 ${horizontal ? 'pb-1' : 'mb-4'}`}>
        <MapPin className="w-4 h-4 mr-1 shrink-0" /><span className="text-sm font-inter font-medium truncate">{location}</span>
      </div>
      <div className="flex items-baseline gap-1 shrink-0"><span className={`${horizontal ? 'text-lg' : 'text-xl'} font-bold font-montserrat text-inmo-accent`}>$</span>
        <span className={`${horizontal ? 'text-2xl md:text-[28px]' : 'text-[32px]'} font-black font-montserrat text-inmo-secondary dark:text-white tracking-tighter leading-none`}>{Number(property.precio).toLocaleString('es-MX')}</span>
      </div>
    </div>
  </div>;
  const description = <div className="space-y-3"><p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium whitespace-pre-wrap">{property.descripcion || 'El asesor aún no añadió una descripción pública.'}</p>{(role === 'asesor' || role === 'admin') && property.comparte_comision && <p className="text-inmo-accent font-bold text-sm rounded-xl bg-inmo-accent/5 px-3 py-2">Comisión compartida: {property.porcentaje_comision}%</p>}</div>;
  const features = <div className="flex flex-wrap gap-2 w-full">
    {[{ icon: <Bed className="w-4 h-4 text-gray-500 dark:text-gray-400" />, value: property.habitaciones, label: 'rec.' },
      { icon: <Bath className="w-4 h-4 text-gray-500 dark:text-gray-400" />, value: property.banos, label: 'baños' },
      { icon: <Maximize className="w-4 h-4 text-gray-500 dark:text-gray-400" />, value: property.superficie_construccion ?? property.superficie_terreno, label: 'm²' }]
      .filter(item => item.value != null).map(item => <div key={item.label} className={`flex-1 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 ${horizontal ? 'py-2' : 'py-2.5'} rounded-xl border border-gray-100 dark:border-inmo-darktertiary`}>
        {item.icon}<span className="text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300">{item.value} <span className="font-medium">{item.label}</span></span>
      </div>)}
  </div>;
  const highlights = (property.amenidad_ids?.length ?? 0) > 0 ? <div className={`flex flex-wrap gap-2 ${horizontal ? 'mb-3' : ''}`}>
    {amenities.data?.filter(item => property.amenidad_ids?.includes(item.id)).map(item => <div key={item.id} className={`flex items-center gap-1 bg-gray-100 dark:bg-inmo-darktertiary ${horizontal ? 'px-2.5 py-1.5 rounded-lg text-[10px]' : 'px-3 py-2 rounded-xl text-[11px]'} text-inmo-secondary dark:text-white font-bold tracking-wide uppercase`}>{item.nombre}</div>)}
  </div> : null;
  if (horizontal) return <div className="flex flex-col md:flex-row bg-white dark:bg-inmo-darkcard rounded-[32px] p-2 md:p-4 overflow-hidden w-full h-full gap-6">
    <div className="w-full md:w-[50%] flex flex-col gap-3 shrink-0 h-full"><div className="relative w-full flex-1 min-h-[200px] rounded-[24px] overflow-hidden">{photo('w-full h-full')}</div>{gallery}</div>
    <div className="w-full md:w-[50%] flex flex-col pt-2 md:pl-2 min-w-0 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">{title}<div className="mb-3">{description}</div>{highlights}
        <div className="flex flex-col gap-3 mb-3 w-full">{features}<div className="w-full h-[140px] bg-gray-100 dark:bg-inmo-darkbg rounded-[20px] overflow-hidden"><PropertyMiniMap loading={locationLoading} position={position} privateLocation={owned || moderation} /></div></div>{children}
      </div><div className="mt-auto pt-3 border-t border-gray-100 dark:border-inmo-darktertiary flex justify-center shrink-0">{bottomBar}</div>
    </div>
  </div>;
  return <div className="flex flex-col relative bg-white dark:bg-inmo-darkcard h-full w-full overflow-hidden">
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar pb-[100px]">
      <div className="w-full relative rounded-b-[32px] overflow-hidden bg-gray-100 dark:bg-inmo-darkbg shrink-0">{photo('w-full h-[300px]')}</div>
      <div className="p-6 flex flex-col gap-5 flex-1">{gallery}{title}<div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />{highlights}{features}
        <div className="w-full h-[140px] bg-gray-100 dark:bg-inmo-darkbg rounded-[20px] overflow-hidden relative shrink-0"><PropertyMiniMap loading={locationLoading} position={position} privateLocation={owned || moderation} /></div>
        <div><h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white mb-2">Descripción</h3>{description}</div>
        {children}{moderation && bottomBar}
      </div>
    </div>
    {bottomBar && !moderation && <div className="absolute bottom-0 left-0 right-0 w-full px-4 pb-4 pt-8 z-20 flex justify-center pointer-events-none"><div className="w-full max-w-[400px] pointer-events-auto">{bottomBar}</div></div>}
  </div>;
}
