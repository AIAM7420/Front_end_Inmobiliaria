import React from 'react';

export interface ChatDoodleBackgroundProps {
  className?: string;
  showCenterLogo?: boolean;
}

/**
 * WhatsApp-style real estate doodle wallpaper.
 * Contains hand-drawn style vector doodles representing properties, architecture,
 * keys, contracts, interior elements, and the central INMO logo watermark.
 * Styled with muted tones and low opacity to remain barely visible and non-distracting.
 */
export const ChatDoodleBackground: React.FC<ChatDoodleBackgroundProps> = ({
  className = '',
  showCenterLogo = true,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
    >
      {/* Tiled SVG Pattern with Real Estate Doodles */}
      <svg
        className="w-full h-full text-inmo-secondary dark:text-inmo-primary opacity-[0.055] dark:opacity-[0.14] transition-opacity duration-300"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="inmo-chat-doodles"
            width="460"
            height="460"
            patternUnits="userSpaceOnUse"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* 1. Casa clásica con chimenea y humo */}
              <g transform="translate(24, 20)">
                <path d="M 5 26 L 25 8 L 45 26" />
                <path d="M 12 26 V 44 H 38 V 26" />
                <path d="M 21 44 V 32 H 29 V 44" />
                <path d="M 34 16 V 10 H 39 V 20" />
                <path d="M 37 6 Q 39 4 37 2" strokeWidth="1" />
              </g>

              {/* 2. Llaves con llavero de casa */}
              <g transform="translate(115, 22) rotate(-8)">
                <circle cx="12" cy="12" r="7" />
                <path d="M 19 12 H 42" />
                <path d="M 34 12 V 17 M 39 12 V 16" />
                <path d="M 12 19 L 8 24 V 34 H 16 V 24 Z" />
              </g>

              {/* 3. Edificio / Rascacielos con antena */}
              <g transform="translate(225, 14)">
                <rect x="0" y="14" width="28" height="52" rx="2" />
                <path d="M 14 14 V 5" />
                <circle cx="14" cy="4" r="1.5" fill="currentColor" />
                <path d="M 6 22 H 11 M 17 22 H 22" />
                <path d="M 6 30 H 11 M 17 30 H 22" />
                <path d="M 6 38 H 11 M 17 38 H 22" />
                <path d="M 6 46 H 11 M 17 46 H 22" />
                <path d="M 10 66 V 58 H 18 V 66" />
              </g>

              {/* 4. Letrero 'SE VENDE' / For Sale */}
              <g transform="translate(325, 20) rotate(6)">
                <path d="M 18 10 V 55" />
                <rect x="2" y="16" width="32" height="20" rx="2" />
                <path d="M 7 23 H 29 M 10 29 H 26" />
              </g>

              {/* 5. Pino / Árbol de jardín */}
              <g transform="translate(415, 22)">
                <path d="M 16 46 V 56" />
                <path d="M 16 10 L 6 24 H 11 L 4 35 H 10 L 2 46 H 30 L 22 46 H 28 L 21 35 H 26 L 16 10 Z" />
              </g>

              {/* 6. Pin de ubicación con casa adentro */}
              <g transform="translate(420, 105) rotate(-10)">
                <path d="M 16 4 C 8 4 3 11 3 18 C 3 28 16 38 16 38 C 16 38 29 28 29 18 C 29 11 24 4 16 4 Z" />
                <path d="M 12 21 V 17 L 16 14 L 20 17 V 21 H 12 Z" />
              </g>

              {/* 7. Sofá acogedor de sala */}
              <g transform="translate(325, 110) rotate(-4)">
                <path d="M 4 12 C 4 6 9 4 18 4 H 36 C 45 4 50 6 50 12 V 22 H 4 Z" />
                <path d="M 8 22 H 46 V 28 H 8 Z" />
                <path d="M 11 28 L 9 34 M 43 28 L 45 34" />
              </g>

              {/* 8. Lámpara de piso / Luminaria */}
              <g transform="translate(255, 95) rotate(5)">
                <path d="M 10 6 L 4 18 H 22 L 16 6 Z" />
                <path d="M 13 18 V 50" />
                <path d="M 6 50 H 20" />
              </g>

              {/* 9. Contrato / Título de propiedad con sello */}
              <g transform="translate(170, 105) rotate(8)">
                <path d="M 4 4 H 24 L 32 12 V 42 H 4 Z" />
                <path d="M 24 4 V 12 H 32" />
                <path d="M 9 16 H 21 M 9 22 H 27 M 9 28 H 22" />
                <circle cx="24" cy="35" r="4" />
              </g>

              {/* 10. Plano arquitectónico / Blueprint */}
              <g transform="translate(85, 105)">
                <rect x="2" y="2" width="38" height="32" rx="2" />
                <path d="M 20 2 V 22 M 2 22 H 28 M 20 18 H 40" />
                <path d="M 20 22 A 8 8 0 0 1 28 30" strokeDasharray="2 2" />
              </g>

              {/* 11. Escuadra de arquitecto / Regla */}
              <g transform="translate(15, 115) rotate(-12)">
                <path d="M 4 44 L 4 4 L 44 44 Z" />
                <path d="M 10 38 L 10 18 L 30 38 Z" />
              </g>

              {/* 12. Apretón de manos / Trato cerrado */}
              <g transform="translate(20, 190) rotate(6)">
                <path d="M 4 14 L 14 20" />
                <path d="M 42 14 L 32 20" />
                <path d="M 14 20 L 22 15 L 28 19 L 24 26 L 18 23 Z" />
                <path d="M 22 24 L 26 28 L 32 20" />
              </g>

              {/* 13. Villa moderna con terraza */}
              <g transform="translate(100, 185)">
                <rect x="2" y="18" width="40" height="24" rx="1" />
                <rect x="8" y="2" width="28" height="18" rx="1" />
                <path d="M 2 14 H 8 M 4 14 V 18 M 6 14 V 18" />
                <rect x="13" y="7" width="8" height="8" />
                <rect x="26" y="26" width="10" height="16" />
              </g>

              {/* 14. Llave antigua */}
              <g transform="translate(205, 190) rotate(-6)">
                <circle cx="10" cy="10" r="7" />
                <circle cx="10" cy="10" r="2.5" />
                <path d="M 17 10 H 38" />
                <path d="M 32 10 V 17 H 38 V 13 H 35 V 10" />
              </g>

              {/* 15. Insignia porcentaje % (Hipoteca / Tasa) */}
              <g transform="translate(305, 185) rotate(12)">
                <circle cx="16" cy="16" r="14" />
                <path d="M 10 22 L 22 10" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
              </g>

              {/* 16. Escudo de propiedad verificada */}
              <g transform="translate(395, 185) rotate(-5)">
                <path d="M 4 8 L 18 3 L 32 8 C 32 22 18 31 18 31 C 18 31 4 22 4 8 Z" />
                <path d="M 11 16 L 16 21 L 25 11" />
              </g>

              {/* 17. Ventana con cortinas */}
              <g transform="translate(405, 265)">
                <rect x="4" y="4" width="28" height="32" rx="2" />
                <path d="M 18 4 V 36 M 4 20 H 32" />
                <path d="M 4 4 Q 12 14 7 24 M 32 4 Q 24 14 29 24" />
              </g>

              {/* 18. Puerta principal con manija y moldura */}
              <g transform="translate(315, 260) rotate(-4)">
                <rect x="4" y="2" width="24" height="42" rx="2" />
                <path d="M 4 12 H 28" />
                <circle cx="23" cy="25" r="1.5" fill="currentColor" />
                <rect x="8" y="16" width="6" height="9" />
                <rect x="18" y="16" width="6" height="9" />
                <rect x="8" y="29" width="6" height="11" />
                <rect x="18" y="29" width="6" height="11" />
              </g>

              {/* 19. Planta monstera en maceta */}
              <g transform="translate(230, 270) rotate(8)">
                <path d="M 8 22 L 11 36 H 23 L 26 22 Z" />
                <path d="M 17 22 Q 10 12 4 11 M 17 22 Q 17 5 19 2 M 17 22 Q 24 12 30 11" />
              </g>

              {/* 20. Brújula / Rosa de los vientos con Norte */}
              <g transform="translate(145, 270) rotate(-10)">
                <circle cx="16" cy="18" r="14" />
                <path d="M 16 6 L 19 18 L 16 30 L 13 18 Z" />
                <path d="M 4 18 L 16 21 L 28 18 L 16 15 Z" />
                <path d="M 14 4 V 0 L 18 4 V 0" strokeWidth="1" />
              </g>

              {/* 21. Casa con corazón en el centro (Hogar) */}
              <g transform="translate(65, 270) rotate(6)">
                <path d="M 3 16 L 19 3 L 35 16" />
                <path d="M 8 16 V 34 H 30 V 16" />
                <path d="M 19 22 C 18 20 15 20 15 23 C 15 26 19 29 19 29 C 19 29 23 26 23 23 C 23 20 20 20 19 22 Z" />
              </g>

              {/* 22. Etiqueta / Tag de precio o venta */}
              <g transform="translate(10, 275) rotate(-15)">
                <path d="M 4 14 L 14 4 H 32 V 24 H 14 L 4 14 Z" />
                <circle cx="10" cy="14" r="2" />
              </g>

              {/* 23. Casa adosada / Townhouse con ático */}
              <g transform="translate(20, 345)">
                <rect x="4" y="16" width="32" height="38" rx="1" />
                <path d="M 2 16 L 20 2 L 38 16 Z" />
                <circle cx="20" cy="10" r="3.5" />
                <rect x="15" y="36" width="10" height="18" />
                <path d="M 12 54 H 28" />
              </g>

              {/* 24. Cinta métrica / Flexómetro */}
              <g transform="translate(105, 350) rotate(10)">
                <path d="M 4 14 C 4 7 11 4 19 4 C 27 4 34 7 34 14 V 27 H 4 Z" />
                <path d="M 34 24 H 56 M 39 24 V 20 M 45 24 V 21 M 51 24 V 20" />
              </g>

              {/* 25. Sillón individual confortable */}
              <g transform="translate(190, 345) rotate(-8)">
                <path d="M 4 14 C 4 7 9 4 19 4 C 29 4 34 7 34 14 V 28 H 4 Z" />
                <rect x="6" y="21" width="26" height="8" rx="2" />
                <path d="M 8 29 L 5 36 M 30 29 L 33 36" />
              </g>

              {/* 26. Cerca de jardín / Piquetes de madera */}
              <g transform="translate(275, 355)">
                <path d="M 4 8 L 7 4 L 10 8 V 26 H 4 Z" />
                <path d="M 14 8 L 17 4 L 20 8 V 26 H 14 Z" />
                <path d="M 24 8 L 27 4 L 30 8 V 26 H 24 Z" />
                <path d="M 2 11 H 32 M 2 21 H 32" />
              </g>

              {/* 27. Farol colonial de calle */}
              <g transform="translate(350, 345) rotate(4)">
                <path d="M 4 11 L 8 5 H 16 L 20 11 L 16 19 H 8 Z" />
                <path d="M 12 5 V 1 M 12 19 V 48" />
                <path d="M 7 48 H 17" />
              </g>

              {/* 28. Globo de diálogo con icono de casita */}
              <g transform="translate(415, 350) rotate(-6)">
                <path d="M 4 10 C 4 4 9 0 19 0 H 32 C 42 0 47 4 47 10 V 22 C 47 28 42 32 32 32 H 20 L 12 37 V 32 H 19 C 9 32 4 28 4 22 Z" />
                <path d="M 21 23 V 17 L 25 14 L 29 17 V 23 H 21 Z" />
              </g>

              {/* 29. Edificio clásico con columnas (Banco / Notaría) */}
              <g transform="translate(395, 415)">
                <path d="M 4 12 L 28 2 L 52 12 Z" />
                <path d="M 10 12 V 32 M 22 12 V 32 M 34 12 V 32 M 46 12 V 32" />
                <path d="M 4 32 H 52 M 0 36 H 56" />
              </g>

              {/* 30. Par de llaves colgando */}
              <g transform="translate(310, 415) rotate(-10)">
                <circle cx="12" cy="7" r="6" />
                <path d="M 10 13 L 6 34 M 6 28 L 2 29 M 5 32 L 1 33" />
                <path d="M 15 13 L 21 34 M 20 29 L 24 30 M 21 33 L 25 34" />
              </g>

              {/* 31. Puerta corrediza / Ventanal moderno */}
              <g transform="translate(215, 415)">
                <rect x="2" y="2" width="38" height="34" rx="1" />
                <rect x="5" y="5" width="15" height="28" />
                <rect x="22" y="5" width="15" height="28" />
                <path d="M 18 16 V 22 M 24 16 V 22" />
              </g>

              {/* 32. Mapa doblado con pin */}
              <g transform="translate(125, 415) rotate(6)">
                <path d="M 2 17 L 16 12 L 30 17 L 44 12 V 34 L 30 39 L 16 34 L 2 39 Z" />
                <path d="M 16 12 V 34 M 30 17 V 39" />
                <circle cx="23" cy="8" r="4" />
                <path d="M 23 12 L 23 18" />
              </g>

              {/* 33. Lámpara de techo colgante */}
              <g transform="translate(30, 420)">
                <path d="M 16 0 V 14" />
                <path d="M 6 24 C 6 16 10 14 16 14 C 22 14 26 16 26 24 Z" />
                <path d="M 14 24 Q 16 27 18 24" />
              </g>

              {/* Chispas y destellos WhatsApp (estrellitas, puntos, cruces) */}
              <g strokeWidth="1.5">
                {/* Destellos de 4 puntas */}
                <path d="M 75 45 L 77 50 L 82 52 L 77 54 L 75 59 L 73 54 L 68 52 L 73 50 Z" />
                <path d="M 285 35 L 286 39 L 290 40 L 286 41 L 285 45 L 284 41 L 280 40 L 284 39 Z" />
                <path d="M 375 75 L 376 78 L 379 79 L 376 80 L 375 83 L 374 80 L 371 79 L 374 78 Z" />
                <path d="M 165 160 L 166 163 L 169 164 L 166 165 L 165 168 L 164 165 L 161 164 L 164 163 Z" />
                <path d="M 370 235 L 371 238 L 374 239 L 371 240 L 370 243 L 369 240 L 366 239 L 369 238 Z" />
                <path d="M 235 325 L 236 328 L 239 329 L 236 330 L 235 333 L 234 330 L 231 329 L 234 328 Z" />
                <path d="M 75 320 L 76 323 L 79 324 L 76 325 L 75 328 L 74 325 L 71 324 L 74 323 Z" />
                <path d="M 370 460 L 371 463 L 374 464 L 371 465 L 370 468 L 369 465 L 366 464 L 369 463 Z" />
                <path d="M 85 440 L 86 443 L 89 444 L 86 445 L 85 448 L 84 445 L 81 444 L 84 443 Z" />

                {/* Cruces pequeñas */}
                <path d="M 175 42 H 181 M 178 39 V 45" />
                <path d="M 278 158 H 284 M 281 155 V 161" />
                <path d="M 365 295 H 371 M 368 292 V 298" />
                <path d="M 60 232 H 66 M 63 229 V 235" />

                {/* Puntitos dispersos */}
                <circle cx="155" cy="65" r="1.5" fill="currentColor" />
                <circle cx="265" cy="70" r="1.5" fill="currentColor" />
                <circle cx="335" cy="155" r="1.5" fill="currentColor" />
                <circle cx="70" cy="155" r="1.5" fill="currentColor" />
                <circle cx="455" cy="225" r="1.5" fill="currentColor" />
                <circle cx="300" cy="235" r="1.5" fill="currentColor" />
                <circle cx="125" cy="305" r="1.5" fill="currentColor" />
                <circle cx="325" cy="315" r="1.5" fill="currentColor" />
                <circle cx="455" cy="395" r="1.5" fill="currentColor" />
                <circle cx="180" cy="390" r="1.5" fill="currentColor" />
                <circle cx="275" cy="460" r="1.5" fill="currentColor" />
              </g>
            </g>
          </pattern>
        </defs>

        {/* Rectángulo que llena todo el contenedor repitiendo el patrón de garabatos */}
        <rect width="100%" height="100%" fill="url(#inmo-chat-doodles)" />
      </svg>

      {/* Logo de INMO en el centro como marca de agua sutil (+300% de tamaño) */}
      {showCenterLogo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          {/* Suave degradado radial que desvanece los garabatos detrás del logo para máxima legibilidad */}
          <div className="relative flex flex-col items-center justify-center p-8">
            <div className="absolute -inset-20 rounded-full bg-radial from-gray-50/80 dark:from-inmo-darkbg/80 via-transparent to-transparent blur-2xl" />
            <img
              src="/inmo.png"
              alt="INMO"
              className="dark:hidden h-28 md:h-36 w-auto object-contain opacity-[0.09] filter grayscale"
            />
            <img
              src="/inmo white.png"
              alt="INMO"
              className="hidden dark:block h-28 md:h-36 w-auto object-contain opacity-[0.14] filter grayscale"
            />
          </div>
        </div>
      )}
    </div>
  );
};
