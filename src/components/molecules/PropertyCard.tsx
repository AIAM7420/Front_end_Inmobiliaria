import React from 'react';
import { Heart, MapPin, Bed, Bath, Maximize, Eye, MessageCircle } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { IconButton } from '../atoms/IconButton';

export interface PropertyCardProps {
  image?: string;
  imageLoading?: boolean;
  title: string;
  location: string;
  price: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  badgeText?: string;
  badgeVariant?: any;
  tags?: { text: string; variant: 'venta' | 'nuevo' | 'primary' | 'secondary' | 'success' | 'warning' }[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  favoritePending?: boolean;
  onClick?: () => void;
  variant?: 'standard' | 'asesor';
  hideFeaturesText?: boolean;
  views?: number;
  messages?: number;
}

export const PropertyCard = React.memo(({
  image,
  imageLoading = false,
  title,
  location,
  price,
  beds,
  baths,
  sqft,
  badgeText,
  badgeVariant = 'primary',
  tags,
  isFavorite = false,
  onToggleFavorite,
  favoritePending = false,
  onClick,
  variant = 'standard',
  hideFeaturesText = false,
  views,
  messages
}: PropertyCardProps) => {
  const favorite = isFavorite;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite();
  };


  return (
    <div
      className="@container h-full bg-white dark:bg-inmo-darkcard rounded-card p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-inmo-darktertiary/40 cursor-pointer transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.02] flex flex-col w-full"
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick?.(); } }}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] shrink-0">
        {image ? <img src={image} alt={title} className="object-cover w-full h-full transition-transform duration-700 hover:scale-105" loading="lazy" decoding="async" /> : <div className="w-full h-full bg-inmo-tertiary dark:bg-inmo-darktertiary flex items-center justify-center text-sm text-gray-500">{imageLoading ? "Cargando fotografía…" : "Sin fotografía"}</div>}

        {/* TAGS */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          {tags && tags.length > 0 ? (
            tags.map((tag, idx) => (
              <Badge key={idx} text={tag.text} variant={tag.variant} />
            ))
          ) : badgeText ? (
            <Badge text={badgeText} variant={badgeVariant} />
          ) : null}
        </div>

        {/* FAVORITE */}
        {variant === 'standard' && onToggleFavorite && (
          <div className="absolute top-3 right-3 z-10">
            <IconButton
              aria-label={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              aria-pressed={favorite}
              disabled={favoritePending}
              onClick={handleFavoriteClick}
              icon={<Heart className={`w-[20px] h-[20px] ${favorite ? 'fill-inmo-accent text-inmo-accent' : 'text-gray-700 dark:text-gray-300'}`} strokeWidth={2.5} />}
              variant="secondary"
              className={`!w-[40px] !h-[40px] !rounded-full shadow-sm ${
                favorite
                  ? '!bg-white dark:!bg-inmo-darkcard'
                  : '!bg-white/80 dark:!bg-inmo-darkcard/80 backdrop-blur-md hover:!bg-white dark:hover:!bg-inmo-darkcard'
              }`}
            />
          </div>
        )}
      </div>

      <div className="pt-3 @[300px]:pt-4 flex flex-col flex-1 gap-3 @[300px]:gap-4">
        {/* ROW 1 & 2: TITLE, PRICE & LOCATION */}
        <div className="flex flex-col @[300px]:flex-row @[300px]:justify-between @[300px]:items-start gap-1 @[300px]:gap-3">
          <div className="flex flex-col gap-1 @[300px]:flex-1 min-w-0">
            <h3 className="text-base @[300px]:text-lg font-bold font-montserrat text-inmo-secondary dark:text-white leading-tight line-clamp-2" title={title}>
              {title}
            </h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400 min-w-0">
              <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="text-[13px] font-inter truncate">{location}</span>
            </div>
          </div>
          <div className="flex flex-col @[300px]:items-end shrink-0 mt-1 @[300px]:mt-0">
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-bold font-montserrat text-inmo-accent">$</span>
              <span className="text-[20px] @[300px]:text-[22px] font-black font-montserrat text-inmo-secondary dark:text-white tracking-tighter leading-none">
                {price.toLocaleString('es-MX')}
              </span>
            </div>
          </div>
        </div>

        {/* ROW 3: FEATURES PILLS */}
        {variant === 'standard' || (views === undefined && messages === undefined) ? (
          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 @[250px]:px-3 py-1.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
              <Bed className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
              <span className="text-[13px] font-medium text-inmo-secondary dark:text-gray-300">
                {beds ?? "—"} {!hideFeaturesText && <span className="hidden @[250px]:inline">rec.</span>}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 @[250px]:px-3 py-1.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
              <Bath className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
              <span className="text-[13px] font-medium text-inmo-secondary dark:text-gray-300">
                {baths ?? "—"} {!hideFeaturesText && <span className="hidden @[250px]:inline">baños</span>}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 @[250px]:px-3 py-1.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
              <Maximize className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
              <span className="text-[13px] font-medium text-inmo-secondary dark:text-gray-300">
                {sqft ?? "—"} {!hideFeaturesText && <span className="hidden @[250px]:inline">m²</span>}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex space-x-2 text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 @[250px]:px-3 py-1.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
                <Eye className="w-4 h-4 text-inmo-accent" strokeWidth={2} />
                <span className="text-[13px] font-bold">
                  {views} <span className="hidden @[250px]:inline">Vistas</span>
                </span>
              </div>
              <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 @[250px]:px-3 py-1.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
                <MessageCircle className="w-4 h-4 text-inmo-accent" strokeWidth={2} />
                <span className="text-[13px] font-bold">
                  {messages} <span className="hidden @[250px]:inline">Mensajes</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
