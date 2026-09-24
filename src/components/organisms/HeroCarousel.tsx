import React, { useState, useEffect } from 'react';

export interface HeroCarouselProps {
  images: string[];
  title?: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ images, title = "Encuentra tu espacio ideal" }) => {
  const carouselSlides = [
    images[images.length - 1],
    ...images,
    images[0]
  ];

  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
      setIsTransitioning(true);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentSlide === carouselSlides.length - 1) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1);
      }, 1000);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [currentSlide, carouselSlides.length]);

  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [isTransitioning]);

  const getRealSlideIndex = () => {
    if (currentSlide === 0) {
      return images.length - 1;
    }

    if (currentSlide === carouselSlides.length - 1) {
      return 0;
    }

    return currentSlide - 1;
  };

  const realSlideIndex = getRealSlideIndex();

  return (
    <div className="relative w-full h-[220px] rounded-[32px] overflow-hidden shadow-sm mt-2">
      {/* Track del carrusel */}
      <div
        className={`flex h-full transform-gpu will-change-transform ${
          isTransitioning
            ? 'transition-transform duration-1000 ease-in-out'
            : ''
        }`}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`
        }}
      >
        {carouselSlides.map((img, idx) => (
          <div
            key={`${img}-${idx}`}
            className="relative min-w-full h-full shrink-0"
          >
            <img
              src={img}
              alt="Propiedad"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
              fetchPriority={idx === 1 ? 'high' : 'auto'}
              loading={idx === 1 ? 'eager' : 'lazy'}
              decoding={idx === 1 ? 'sync' : 'async'}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-8 pointer-events-none">
        <h2 className="text-white text-hero font-montserrat text-center leading-tight drop-shadow-md">
          {title}
        </h2>

        {/* Indicadores */}
        <div className="absolute bottom-4 flex gap-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-atom transition-all duration-300 ${
                idx === realSlideIndex
                  ? 'bg-white w-4'
                  : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
