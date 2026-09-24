import React, { useState } from 'react';
import { Heart, MapPin, Bed, Bath, Maximize, Eye, MessageCircle } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { IconButton } from '../atoms/IconButton';
import { Button } from '../atoms/Button';

export interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  badgeText?: string;
  badgeVariant?: any;
  tags?: { text: string; variant: 'venta' | 'renta' | 'nuevo' | 'primary' | 'secondary' | 'success' | 'warning' }[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
  variant?: 'standard' | 'asesor';
  views?: number;
  messages?: number;
}

export const PropertyCard = React.memo(({
  image,
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
  onClick,
  variant = 'standard',
  views = 0,
  messages = 0
}: PropertyCardProps) => {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    if (onToggleFavorite) onToggleFavorite();
  };

  const isRenta = tags?.some(t => t.text.toLowerCase() === 'renta') || badgeText?.toLowerCase() === 'renta';

  return (
    <div 
      className="@container bg-white dark:bg-inmo-darkcard rounded-card p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-inmo-darktertiary/40 cursor-pointer transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.02] flex flex-col w-full"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px]">
        <img src={image} alt={title} className="object-cover w-full h-full" loading="lazy" decoding="async" />
        
        {/* TAGS */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags.map((tag, idx) => (
              <Badge key={idx} text={tag.text} variant={tag.variant} />
            ))
          ) : badgeText ? (
            <Badge text={badgeText} variant={badgeVariant} />
          ) : null}
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-4">
        {/* ROW 1 & 2: TITLE, PRICE & LOCATION */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-lg font-bold font-montserrat text-inmo-secondary dark:text-white leading-tight line-clamp-2" title={title}>
              {title}
            </h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="text-[13px] font-inter line-clamp-1">{location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-bold font-montserrat text-inmo-accent">$</span>
              <span className="text-[22px] font-black font-montserrat text-inmo-secondary dark:text-white tracking-tighter leading-none">
                {price.toLocaleString('es-MX')}
              </span>
            </div>
            {isRenta && (
              <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mt-1">/Mes</span>
            )}
          </div>
        </div>
        
        {/* ROW 3: FEATURES PILLS */}
        {variant === 'standard' ? (
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 @[250px]:px-3 py-1.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
              <Bed className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
              <span className="text-[13px] font-medium text-inmo-secondary dark:text-gray-300">
                {beds} <span className="hidden @[250px]:inline">Beds</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 @[250px]:px-3 py-1.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
              <Bath className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
              <span className="text-[13px] font-medium text-inmo-secondary dark:text-gray-300">
                {baths} <span className="hidden @[250px]:inline">Baths</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 @[250px]:px-3 py-1.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
              <Maximize className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
              <span className="text-[13px] font-medium text-inmo-secondary dark:text-gray-300">
                {sqft} <span className="hidden @[250px]:inline">m²</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
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

        {/* ROW 4: ACTIONS */}
        <div className="flex items-center gap-3 pt-1">
          <Button className="flex-1 !rounded-full !py-3.5 !text-[15px]">
            Ver Detalles
          </Button>
          {variant === 'standard' && (
            <IconButton 
              onClick={handleFavoriteClick}
              icon={<Heart className={`w-[22px] h-[22px] ${favorite ? 'fill-inmo-accent text-inmo-accent' : 'text-gray-900 dark:text-gray-300'}`} strokeWidth={2.5} />}
              variant="secondary"
              className={`!w-[52px] !h-[52px] !rounded-full shrink-0 ${
                favorite 
                  ? '!bg-inmo-accent/10 dark:!bg-inmo-accent/20 border border-inmo-accent/20' 
                  : '!bg-gray-50 dark:!bg-inmo-darkbg hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary border border-gray-100 dark:border-inmo-darktertiary'
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
});
