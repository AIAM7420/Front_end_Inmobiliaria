import React from 'react';

export interface ChatDoodleBackgroundProps {
  className?: string;
  showCenterLogo?: boolean;
}

/**
 * WhatsApp-style real estate doodle wallpaper.
 * Contains dense, small hand-drawn vector doodles representing properties, architecture,
 * keys, blueprints, interior elements, moving boxes, and financial/notary symbols.
 * Features an SVG mask that ensures zero overlap with the central INMO logo watermark.
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
      {/* Tiled SVG Pattern with Real Estate Doodles & Center Cutout Mask */}
      <svg
        className="w-full h-full text-inmo-secondary dark:text-inmo-primary opacity-[0.055] dark:opacity-[0.14] transition-opacity duration-300"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Radial mask that completely carves out a clean space around the central INMO logo */}
          <radialGradient id="inmo-mask-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="65%" stopColor="#000000" />
            <stop offset="85%" stopColor="#666666" />
            <stop offset="100%" stopColor="#ffffff" />
          </radialGradient>

          <mask id="inmo-center-cutout" maskContentUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="#ffffff" />
            <circle cx="50%" cy="50%" r="160" fill="url(#inmo-mask-grad)" />
          </mask>

          {/* Densely populated real estate doodle pattern, scaled to 68% for compact, crisp visuals */}
          <pattern
            id="inmo-chat-doodles"
            width="460"
            height="460"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(0.68)"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* === FILA 1 === */}
              {/* 1. Casa clásica con chimenea y humo */}
              <g transform="translate(24, 18)">
                <path d="M 5 26 L 25 8 L 45 26" />
                <path d="M 12 26 V 44 H 38 V 26" />
                <path d="M 21 44 V 32 H 29 V 44" />
                <path d="M 34 16 V 10 H 39 V 20" />
                <path d="M 37 6 Q 39 4 37 2" strokeWidth="1.2" />
              </g>

              {/* 2. Maletín ejecutivo de asesor inmobiliario */}
              <g transform="translate(75, 42) rotate(-6)">
                <rect x="0" y="6" width="30" height="20" rx="3" />
                <path d="M 9 6 V 2 H 21 V 6 M 15 13 V 17 M 0 14 H 30" />
              </g>

              {/* 3. Llaves con llavero de casa */}
              <g transform="translate(122, 18) rotate(-8)">
                <circle cx="12" cy="12" r="7" />
                <path d="M 19 12 H 42" />
                <path d="M 34 12 V 17 M 39 12 V 16" />
                <path d="M 12 19 L 8 24 V 34 H 16 V 24 Z" />
              </g>

              {/* 4. Moneda de inversión / Plusvalía con $ */}
              <g transform="translate(180, 48)">
                <circle cx="12" cy="12" r="11" />
                <path d="M 12 5 V 19 M 9 8 H 14 C 15.5 8 16 9 16 10.5 C 16 12 15 12.5 12 12.5 C 9 12.5 8 13 8 14.5 C 8 16 9 16.5 14 16.5" />
              </g>

              {/* 5. Edificio / Rascacielos con antena */}
              <g transform="translate(230, 12)">
                <rect x="0" y="14" width="28" height="52" rx="2" />
                <path d="M 14 14 V 5" />
                <circle cx="14" cy="4" r="1.5" fill="currentColor" />
                <path d="M 6 22 H 11 M 17 22 H 22" />
                <path d="M 6 30 H 11 M 17 30 H 22" />
                <path d="M 6 38 H 11 M 17 38 H 22" />
                <path d="M 6 46 H 11 M 17 46 H 22" />
                <path d="M 10 66 V 58 H 18 V 66" />
              </g>

              {/* 6. Calculadora de hipotecas */}
              <g transform="translate(282, 45) rotate(6)">
                <rect x="0" y="0" width="22" height="30" rx="3" />
                <rect x="3" y="4" width="16" height="6" rx="1" />
                <circle cx="6" cy="15" r="1.5" fill="currentColor" />
                <circle cx="11" cy="15" r="1.5" fill="currentColor" />
                <circle cx="16" cy="15" r="1.5" fill="currentColor" />
                <circle cx="6" cy="22" r="1.5" fill="currentColor" />
                <circle cx="11" cy="22" r="1.5" fill="currentColor" />
                <circle cx="16" cy="22" r="1.5" fill="currentColor" />
              </g>

              {/* 7. Letrero 'SE VENDE' / For Sale */}
              <g transform="translate(330, 18) rotate(6)">
                <path d="M 18 10 V 55" />
                <rect x="2" y="16" width="32" height="20" rx="2" />
                <path d="M 7 23 H 29 M 10 29 H 26" />
              </g>

              {/* 8. Balcón moderno con barandal */}
              <g transform="translate(378, 48)">
                <rect x="2" y="8" width="28" height="14" rx="1" />
                <path d="M 6 8 V 22 M 11 8 V 22 M 16 8 V 22 M 21 8 V 22 M 26 8 V 22 M 0 22 H 32" />
              </g>

              {/* 9. Pino / Árbol de jardín */}
              <g transform="translate(420, 18)">
                <path d="M 16 46 V 56" />
                <path d="M 16 10 L 6 24 H 11 L 4 35 H 10 L 2 46 H 30 L 22 46 H 28 L 21 35 H 26 L 16 10 Z" />
              </g>

              {/* === FILA 2 === */}
              {/* 10. Escuadra de arquitecto / Regla */}
              <g transform="translate(15, 118) rotate(-12)">
                <path d="M 4 44 L 4 4 L 44 44 Z" />
                <path d="M 10 38 L 10 18 L 30 38 Z" />
              </g>

              {/* 11. Cactus en maceta geométrica */}
              <g transform="translate(52, 98) rotate(6)">
                <path d="M 6 18 H 22 L 20 30 H 8 Z" />
                <path d="M 14 4 V 18 M 8 10 H 14 M 8 7 V 10 M 14 12 H 20 M 20 9 V 12" />
              </g>

              {/* 12. Plano arquitectónico / Blueprint */}
              <g transform="translate(88, 105)">
                <rect x="2" y="2" width="38" height="32" rx="2" />
                <path d="M 20 2 V 22 M 2 22 H 28 M 20 18 H 40" />
                <path d="M 20 22 A 8 8 0 0 1 28 30" strokeDasharray="2 2" />
              </g>

              {/* 13. Bombilla de ideas / Diseño */}
              <g transform="translate(136, 140) rotate(10)">
                <path d="M 6 10 C 6 4 18 4 18 10 C 18 13 15 15 15 18 H 9 C 9 15 6 13 6 10 Z" />
                <path d="M 9 21 H 15 M 10 24 H 14" />
              </g>

              {/* 14. Contrato / Título de propiedad con sello */}
              <g transform="translate(172, 102) rotate(8)">
                <path d="M 4 4 H 24 L 32 12 V 42 H 4 Z" />
                <path d="M 24 4 V 12 H 32" />
                <path d="M 9 16 H 21 M 9 22 H 27 M 9 28 H 22" />
                <circle cx="24" cy="35" r="4" />
              </g>

              {/* 15. Cámara / Sensor de seguridad inteligente */}
              <g transform="translate(216, 140) rotate(-6)">
                <rect x="4" y="4" width="22" height="12" rx="2" />
                <path d="M 26 7 L 33 4 V 16 L 26 13 Z M 15 16 V 24 M 10 24 H 20" />
              </g>

              {/* 16. Lámpara de piso / Luminaria */}
              <g transform="translate(258, 92) rotate(5)">
                <path d="M 10 6 L 4 18 H 22 L 16 6 Z" />
                <path d="M 13 18 V 50" />
                <path d="M 6 50 H 20" />
              </g>

              {/* 17. Calificación 5 estrellas de asesor */}
              <g transform="translate(300, 140)">
                <path d="M 4 8 L 6 3 L 8 8 L 13 8 L 9 11 L 11 16 L 6 13 L 2 16 L 3 11 Z" />
                <path d="M 18 8 L 20 3 L 22 8 L 27 8 L 23 11 L 25 16 L 20 13 L 16 16 L 17 11 Z" />
              </g>

              {/* 18. Sofá acogedor de sala */}
              <g transform="translate(328, 105) rotate(-4)">
                <path d="M 4 12 C 4 6 9 4 18 4 H 36 C 45 4 50 6 50 12 V 22 H 4 Z" />
                <path d="M 8 22 H 46 V 28 H 8 Z" />
                <path d="M 11 28 L 9 34 M 43 28 L 45 34" />
              </g>

              {/* 19. Timbre / Campana de casa */}
              <g transform="translate(385, 140) rotate(-8)">
                <path d="M 4 18 C 4 18 6 16 6 10 C 6 5 18 5 18 10 C 18 16 20 18 20 18 H 4 Z" />
                <circle cx="12" cy="22" r="2" />
              </g>

              {/* 20. Pin de ubicación con casa adentro */}
              <g transform="translate(422, 102) rotate(-10)">
                <path d="M 16 4 C 8 4 3 11 3 18 C 3 28 16 38 16 38 C 16 38 29 28 29 18 C 29 11 24 4 16 4 Z" />
                <path d="M 12 21 V 17 L 16 14 L 20 17 V 21 H 12 Z" />
              </g>

              {/* === FILA 3 === */}
              {/* 21. Apretón de manos / Trato cerrado */}
              <g transform="translate(18, 190) rotate(6)">
                <path d="M 4 14 L 14 20" />
                <path d="M 42 14 L 32 20" />
                <path d="M 14 20 L 22 15 L 28 19 L 24 26 L 18 23 Z" />
                <path d="M 22 24 L 26 28 L 32 20" />
              </g>

              {/* 22. Reloj de pared para citas inmobiliarias */}
              <g transform="translate(62, 222)">
                <circle cx="12" cy="12" r="11" />
                <path d="M 12 5 V 12 L 17 12" />
              </g>

              {/* 23. Villa moderna con terraza */}
              <g transform="translate(102, 182)">
                <rect x="2" y="18" width="40" height="24" rx="1" />
                <rect x="8" y="2" width="28" height="18" rx="1" />
                <path d="M 2 14 H 8 M 4 14 V 18 M 6 14 V 18" />
                <rect x="13" y="7" width="8" height="8" />
                <rect x="26" y="26" width="10" height="16" />
              </g>

              {/* 24. Taza de café humeante para visitas */}
              <g transform="translate(152, 222) rotate(-6)">
                <path d="M 4 8 H 22 V 18 C 22 22 4 22 4 18 Z M 22 10 H 26 C 28 10 28 16 26 16 H 22 M 2 24 H 24" />
                <path d="M 9 2 Q 11 4 9 6 M 15 2 Q 17 4 15 6" strokeWidth="1.2" />
              </g>

              {/* 25. Llave antigua ornamental */}
              <g transform="translate(206, 188) rotate(-6)">
                <circle cx="10" cy="10" r="7" />
                <circle cx="10" cy="10" r="2.5" />
                <path d="M 17 10 H 38" />
                <path d="M 32 10 V 17 H 38 V 13 H 35 V 10" />
              </g>

              {/* 26. Herramientas cruzadas (Remodelación) */}
              <g transform="translate(256, 220)">
                <path d="M 4 4 L 20 20 M 16 4 L 4 16" />
                <path d="M 2 3 L 5 2 L 6 5 L 3 6 Z M 18 3 L 22 6 L 19 9 Z" />
              </g>

              {/* 27. Insignia porcentaje % (Hipoteca / Tasa) */}
              <g transform="translate(308, 182) rotate(12)">
                <circle cx="16" cy="16" r="14" />
                <path d="M 10 22 L 22 10" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
              </g>

              {/* 28. Caja de mudanza con flecha */}
              <g transform="translate(352, 220) rotate(5)">
                <rect x="3" y="6" width="22" height="18" rx="2" />
                <path d="M 3 11 H 25 M 14 14 V 20 M 11 17 L 14 14 L 17 17" />
              </g>

              {/* 29. Escudo de propiedad verificada */}
              <g transform="translate(396, 182) rotate(-5)">
                <path d="M 4 8 L 18 3 L 32 8 C 32 22 18 31 18 31 C 18 31 4 22 4 8 Z" />
                <path d="M 11 16 L 16 21 L 25 11" />
              </g>

              {/* 30. Candado de seguridad de propiedad */}
              <g transform="translate(440, 222)">
                <rect x="3" y="9" width="18" height="14" rx="2" />
                <path d="M 7 9 V 5 C 7 2 17 2 17 5 V 9" />
                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
              </g>

              {/* === FILA 4 === */}
              {/* 31. Etiqueta / Tag de precio o venta */}
              <g transform="translate(10, 272) rotate(-15)">
                <path d="M 4 14 L 14 4 H 32 V 24 H 14 L 4 14 Z" />
                <circle cx="10" cy="14" r="2" />
              </g>

              {/* 32. Maceta colgante con enredadera */}
              <g transform="translate(42, 308)">
                <path d="M 6 0 L 10 12 H 20 L 24 0 M 10 12 L 12 20 H 18 L 20 12" />
                <path d="M 12 20 Q 8 26 10 32 M 18 20 Q 22 25 19 32" strokeWidth="1.2" />
              </g>

              {/* 33. Casa con corazón en el centro (Hogar) */}
              <g transform="translate(68, 268) rotate(6)">
                <path d="M 3 16 L 19 3 L 35 16" />
                <path d="M 8 16 V 34 H 30 V 16" />
                <path d="M 19 22 C 18 20 15 20 15 23 C 15 26 19 29 19 29 C 19 29 23 26 23 23 C 23 20 20 20 19 22 Z" />
              </g>

              {/* 34. Termostato circular inteligente */}
              <g transform="translate(112, 308)">
                <circle cx="12" cy="12" r="11" />
                <circle cx="12" cy="12" r="6" />
                <path d="M 12 3 V 5 M 12 19 V 21 M 3 12 H 5 M 19 12 H 21" />
              </g>

              {/* 35. Brújula / Rosa de los vientos con Norte */}
              <g transform="translate(145, 268) rotate(-10)">
                <circle cx="16" cy="18" r="14" />
                <path d="M 16 6 L 19 18 L 16 30 L 13 18 Z" />
                <path d="M 4 18 L 16 21 L 28 18 L 16 15 Z" />
                <path d="M 14 4 V 0 L 18 4 V 0" strokeWidth="1.2" />
              </g>

              {/* 36. Panel solar en techo sustentable */}
              <g transform="translate(192, 308) rotate(4)">
                <path d="M 4 20 L 10 4 H 26 L 32 20 Z" />
                <path d="M 11 4 L 15 20 M 21 4 L 21 20 M 6 12 H 30" />
              </g>

              {/* 37. Planta monstera en maceta */}
              <g transform="translate(232, 268) rotate(8)">
                <path d="M 8 22 L 11 36 H 23 L 26 22 Z" />
                <path d="M 17 22 Q 10 12 4 11 M 17 22 Q 17 5 19 2 M 17 22 Q 24 12 30 11" />
              </g>

              {/* 38. Alberca con escalerilla / Amenidad */}
              <g transform="translate(276, 308)">
                <path d="M 2 14 Q 8 10 14 14 T 26 14 T 38 14 M 2 22 Q 8 18 14 22 T 26 22 T 38 22" />
                <path d="M 8 2 V 12 M 14 2 V 12 M 8 6 H 14 M 8 10 H 14" />
              </g>

              {/* 39. Puerta principal con manija y moldura */}
              <g transform="translate(318, 258) rotate(-4)">
                <rect x="4" y="2" width="24" height="42" rx="2" />
                <path d="M 4 12 H 28" />
                <circle cx="23" cy="25" r="1.5" fill="currentColor" />
                <rect x="8" y="16" width="6" height="9" />
                <rect x="18" y="16" width="6" height="9" />
                <rect x="8" y="29" width="6" height="11" />
                <rect x="18" y="29" width="6" height="11" />
              </g>

              {/* 40. Tarjeta electrónica / Smart access */}
              <g transform="translate(372, 305) rotate(-8)">
                <rect x="2" y="4" width="26" height="18" rx="2" />
                <rect x="5" y="8" width="8" height="6" rx="1" />
                <path d="M 16 11 H 24 M 16 15 H 22" />
              </g>

              {/* 41. Ventana con cortinas */}
              <g transform="translate(412, 262)">
                <rect x="4" y="4" width="28" height="32" rx="2" />
                <path d="M 18 4 V 36 M 4 20 H 32" />
                <path d="M 4 4 Q 12 14 7 24 M 32 4 Q 24 14 29 24" />
              </g>

              {/* === FILA 5 === */}
              {/* 42. Casa adosada / Townhouse con ático */}
              <g transform="translate(18, 342)">
                <rect x="4" y="16" width="32" height="38" rx="1" />
                <path d="M 2 16 L 20 2 L 38 16 Z" />
                <circle cx="20" cy="10" r="3.5" />
                <rect x="15" y="36" width="10" height="18" />
                <path d="M 12 54 H 28" />
              </g>

              {/* 43. Garage con portón levadizo */}
              <g transform="translate(65, 385)">
                <rect x="2" y="4" width="28" height="24" rx="2" />
                <path d="M 2 10 H 30 M 2 16 H 30 M 2 22 H 30" />
              </g>

              {/* 44. Cinta métrica / Flexómetro */}
              <g transform="translate(105, 348) rotate(10)">
                <path d="M 4 14 C 4 7 11 4 19 4 C 27 4 34 7 34 14 V 27 H 4 Z" />
                <path d="M 34 24 H 56 M 39 24 V 20 M 45 24 V 21 M 51 24 V 20" />
              </g>

              {/* 45. Chimenea rústica con leña */}
              <g transform="translate(150, 385)">
                <rect x="2" y="4" width="26" height="24" rx="2" />
                <path d="M 6 28 V 16 H 24 V 28" />
                <path d="M 11 25 L 19 21 M 11 21 L 19 25" />
              </g>

              {/* 46. Sillón individual confortable */}
              <g transform="translate(192, 342) rotate(-8)">
                <path d="M 4 14 C 4 7 9 4 19 4 C 29 4 34 7 34 14 V 28 H 4 Z" />
                <rect x="6" y="21" width="26" height="8" rx="2" />
                <path d="M 8 29 L 5 36 M 30 29 L 33 36" />
              </g>

              {/* 47. Elevador con flechas arriba-abajo */}
              <g transform="translate(238, 385)">
                <rect x="2" y="2" width="24" height="26" rx="2" />
                <path d="M 8 12 L 14 6 L 20 12 M 14 8 V 20 M 8 16 L 14 22 L 20 16" />
              </g>

              {/* 48. Cerca de jardín / Piquetes de madera */}
              <g transform="translate(278, 352)">
                <path d="M 4 8 L 7 4 L 10 8 V 26 H 4 Z" />
                <path d="M 14 8 L 17 4 L 20 8 V 26 H 14 Z" />
                <path d="M 24 8 L 27 4 L 30 8 V 26 H 24 Z" />
                <path d="M 2 11 H 32 M 2 21 H 32" />
              </g>

              {/* 49. Extintor de incendios / Seguridad */}
              <g transform="translate(322, 385) rotate(-6)">
                <rect x="6" y="8" width="12" height="20" rx="3" />
                <path d="M 12 8 V 4 M 9 4 H 15 M 12 4 L 18 7" />
              </g>

              {/* 50. Farol colonial de calle */}
              <g transform="translate(352, 342) rotate(4)">
                <path d="M 4 11 L 8 5 H 16 L 20 11 L 16 19 H 8 Z" />
                <path d="M 12 5 V 1 M 12 19 V 48" />
                <path d="M 7 48 H 17" />
              </g>

              {/* 51. Medidor de luz / Servicios */}
              <g transform="translate(400, 385)">
                <circle cx="12" cy="12" r="11" />
                <path d="M 12 12 L 17 8 M 6 12 A 6 6 0 0 1 18 12" />
              </g>

              {/* 52. Globo de diálogo con icono de casita */}
              <g transform="translate(422, 346) rotate(-6)">
                <path d="M 4 10 C 4 4 9 0 19 0 H 32 C 42 0 47 4 47 10 V 22 C 47 28 42 32 32 32 H 20 L 12 37 V 32 H 19 C 9 32 4 28 4 22 Z" />
                <path d="M 21 23 V 17 L 25 14 L 29 17 V 23 H 21 Z" />
              </g>

              {/* === FILA 6 === */}
              {/* 53. Lámpara de techo colgante */}
              <g transform="translate(28, 418)">
                <path d="M 16 0 V 14" />
                <path d="M 6 24 C 6 16 10 14 16 14 C 22 14 26 16 26 24 Z" />
                <path d="M 14 24 Q 16 27 18 24" />
              </g>

              {/* 54. Canasta de bienvenida / Casa nueva */}
              <g transform="translate(75, 432)">
                <path d="M 4 10 H 24 L 20 22 H 8 Z M 6 10 C 6 3 22 3 22 10" />
                <path d="M 11 10 V 5 M 17 10 V 7" />
              </g>

              {/* 55. Mapa doblado con pin */}
              <g transform="translate(122, 412) rotate(6)">
                <path d="M 2 17 L 16 12 L 30 17 L 44 12 V 34 L 30 39 L 16 34 L 2 39 Z" />
                <path d="M 16 12 V 34 M 30 17 V 39" />
                <circle cx="23" cy="8" r="4" />
                <path d="M 23 12 L 23 18" />
              </g>

              {/* 56. Señalética de calle */}
              <g transform="translate(172, 432) rotate(-4)">
                <path d="M 12 4 V 26" />
                <rect x="2" y="4" width="22" height="10" rx="1" />
                <path d="M 5 9 H 19" />
              </g>

              {/* 57. Puerta corrediza / Ventanal moderno */}
              <g transform="translate(215, 412)">
                <rect x="2" y="2" width="38" height="34" rx="1" />
                <rect x="5" y="5" width="15" height="28" />
                <rect x="22" y="5" width="15" height="28" />
                <path d="M 18 16 V 22 M 24 16 V 22" />
              </g>

              {/* 58. Llavero con número de casa */}
              <g transform="translate(268, 432) rotate(5)">
                <circle cx="8" cy="8" r="5" />
                <path d="M 12 11 L 22 21" />
                <rect x="18" y="16" width="10" height="12" rx="2" />
              </g>

              {/* 59. Par de llaves colgando */}
              <g transform="translate(312, 412) rotate(-10)">
                <circle cx="12" cy="7" r="6" />
                <path d="M 10 13 L 6 34 M 6 28 L 2 29 M 5 32 L 1 33" />
                <path d="M 15 13 L 21 34 M 20 29 L 24 30 M 21 33 L 25 34" />
              </g>

              {/* 60. Edificio clásico con columnas (Banco / Notaría) */}
              <g transform="translate(395, 412)">
                <path d="M 4 12 L 28 2 L 52 12 Z" />
                <path d="M 10 12 V 32 M 22 12 V 32 M 34 12 V 32 M 46 12 V 32" />
                <path d="M 4 32 H 52 M 0 36 H 56" />
              </g>

              {/* Chispas, destellos WhatsApp y rellenos densos */}
              <g strokeWidth="1.6">
                {/* Destellos de 4 puntas */}
                <path d="M 68 28 L 70 33 L 75 35 L 70 37 L 68 42 L 66 37 L 61 35 L 66 33 Z" />
                <path d="M 215 32 L 216 36 L 220 37 L 216 38 L 215 42 L 214 38 L 210 37 L 214 36 Z" />
                <path d="M 370 28 L 371 31 L 374 32 L 371 33 L 370 36 L 369 33 L 366 32 L 369 31 Z" />
                <path d="M 32 82 L 33 85 L 36 86 L 33 87 L 32 90 L 31 87 L 28 86 L 31 85 Z" />
                <path d="M 175 75 L 176 79 L 180 80 L 176 81 L 175 85 L 174 81 L 170 80 L 174 79 Z" />
                <path d="M 310 85 L 311 88 L 314 89 L 311 90 L 310 93 L 309 90 L 306 89 L 309 88 Z" />
                <path d="M 390 92 L 391 95 L 394 96 L 391 97 L 390 100 L 389 97 L 386 96 L 389 95 Z" />
                <path d="M 65 152 L 66 155 L 69 156 L 66 157 L 65 160 L 64 157 L 61 156 L 64 155 Z" />
                <path d="M 185 160 L 186 163 L 189 164 L 186 165 L 185 168 L 184 165 L 181 164 L 184 163 Z" />
                <path d="M 285 168 L 286 171 L 289 172 L 286 173 L 285 176 L 284 173 L 281 172 L 284 171 Z" />
                <path d="M 440 162 L 441 165 L 444 166 L 441 167 L 440 170 L 439 167 L 436 166 L 439 165 Z" />
                <path d="M 42 245 L 43 248 L 46 249 L 43 250 L 42 253 L 41 250 L 38 249 L 41 248 Z" />
                <path d="M 205 240 L 206 243 L 209 244 L 206 245 L 205 248 L 204 245 L 201 244 L 204 243 Z" />
                <path d="M 342 248 L 343 251 L 346 252 L 343 253 L 342 256 L 341 253 L 338 252 L 341 251 Z" />
                <path d="M 425 235 L 426 238 L 429 239 L 426 240 L 425 243 L 424 240 L 421 239 L 424 238 Z" />
                <path d="M 100 295 L 101 298 L 104 299 L 101 300 L 100 303 L 99 300 L 96 299 L 99 298 Z" />
                <path d="M 220 325 L 221 328 L 224 329 L 221 330 L 220 333 L 219 330 L 216 329 L 219 328 Z" />
                <path d="M 355 315 L 356 318 L 359 319 L 356 320 L 355 323 L 354 320 L 351 319 L 354 318 Z" />
                <path d="M 52 360 L 53 363 L 56 364 L 53 365 L 52 368 L 51 365 L 48 364 L 51 363 Z" />
                <path d="M 175 365 L 176 368 L 179 369 L 176 370 L 175 373 L 174 370 L 171 369 L 174 368 Z" />
                <path d="M 335 365 L 336 368 L 339 369 L 336 370 L 335 373 L 334 370 L 331 369 L 334 368 Z" />
                <path d="M 445 385 L 446 388 L 449 389 L 446 390 L 445 393 L 444 390 L 441 389 L 444 388 Z" />
                <path d="M 85 410 L 86 413 L 89 414 L 86 415 L 85 418 L 84 415 L 81 414 L 84 413 Z" />
                <path d="M 198 425 L 199 428 L 202 429 L 199 430 L 198 433 L 197 430 L 194 429 L 197 428 Z" />
                <path d="M 345 440 L 346 443 L 349 444 L 346 445 L 345 448 L 344 445 L 341 444 L 344 443 Z" />

                {/* Cruces pequeñas */}
                <path d="M 108 52 H 114 M 111 49 V 55" />
                <path d="M 215 88 H 221 M 218 85 V 91" />
                <path d="M 365 72 H 371 M 368 69 V 75" />
                <path d="M 12 165 H 18 M 15 162 V 168" />
                <path d="M 165 175 H 171 M 168 172 V 178" />
                <path d="M 292 205 H 298 M 295 202 V 208" />
                <path d="M 382 205 H 388 M 385 202 V 208" />
                <path d="M 82 248 H 88 M 85 245 V 251" />
                <path d="M 172 250 H 178 M 175 247 V 253" />
                <path d="M 268 250 H 274 M 271 247 V 253" />
                <path d="M 395 242 H 401 M 398 239 V 245" />
                <path d="M 22 312 H 28 M 25 309 V 315" />
                <path d="M 162 332 H 168 M 165 329 V 335" />
                <path d="M 252 338 H 258 M 255 335 V 341" />
                <path d="M 392 328 H 398 M 395 325 V 331" />
                <path d="M 125 375 H 131 M 128 372 V 378" />
                <path d="M 222 370 H 228 M 225 367 V 373" />
                <path d="M 295 400 H 301 M 298 397 V 403" />
                <path d="M 372 388 H 378 M 375 385 V 391" />
                <path d="M 48 440 H 54 M 51 437 V 443" />
                <path d="M 148 445 H 154 M 151 442 V 448" />

                {/* Puntitos dispersos de relleno denso */}
                <circle cx="48" cy="55" r="1.5" fill="currentColor" />
                <circle cx="152" cy="42" r="1.5" fill="currentColor" />
                <circle cx="262" cy="58" r="1.5" fill="currentColor" />
                <circle cx="410" cy="65" r="1.5" fill="currentColor" />
                <circle cx="445" cy="48" r="1.5" fill="currentColor" />
                <circle cx="72" cy="120" r="1.5" fill="currentColor" />
                <circle cx="122" cy="115" r="1.5" fill="currentColor" />
                <circle cx="160" cy="125" r="1.5" fill="currentColor" />
                <circle cx="205" cy="128" r="1.5" fill="currentColor" />
                <circle cx="282" cy="115" r="1.5" fill="currentColor" />
                <circle cx="362" cy="122" r="1.5" fill="currentColor" />
                <circle cx="448" cy="132" r="1.5" fill="currentColor" />
                <circle cx="45" cy="175" r="1.5" fill="currentColor" />
                <circle cx="85" cy="195" r="1.5" fill="currentColor" />
                <circle cx="132" cy="198" r="1.5" fill="currentColor" />
                <circle cx="192" cy="180" r="1.5" fill="currentColor" />
                <circle cx="242" cy="195" r="1.5" fill="currentColor" />
                <circle cx="288" cy="178" r="1.5" fill="currentColor" />
                <circle cx="340" cy="195" r="1.5" fill="currentColor" />
                <circle cx="375" cy="180" r="1.5" fill="currentColor" />
                <circle cx="435" cy="195" r="1.5" fill="currentColor" />
                <circle cx="35" cy="225" r="1.5" fill="currentColor" />
                <circle cx="128" cy="235" r="1.5" fill="currentColor" />
                <circle cx="178" cy="220" r="1.5" fill="currentColor" />
                <circle cx="225" cy="235" r="1.5" fill="currentColor" />
                <circle cx="325" cy="232" r="1.5" fill="currentColor" />
                <circle cx="415" cy="225" r="1.5" fill="currentColor" />
                <circle cx="58" cy="285" r="1.5" fill="currentColor" />
                <circle cx="132" cy="280" r="1.5" fill="currentColor" />
                <circle cx="218" cy="285" r="1.5" fill="currentColor" />
                <circle cx="265" cy="280" r="1.5" fill="currentColor" />
                <circle cx="352" cy="282" r="1.5" fill="currentColor" />
                <circle cx="442" cy="280" r="1.5" fill="currentColor" />
                <circle cx="88" cy="328" r="1.5" fill="currentColor" />
                <circle cx="178" cy="318" r="1.5" fill="currentColor" />
                <circle cx="312" cy="325" r="1.5" fill="currentColor" />
                <circle cx="405" cy="315" r="1.5" fill="currentColor" />
                <circle cx="448" cy="325" r="1.5" fill="currentColor" />
                <circle cx="95" cy="365" r="1.5" fill="currentColor" />
                <circle cx="140" cy="355" r="1.5" fill="currentColor" />
                <circle cx="228" cy="358" r="1.5" fill="currentColor" />
                <circle cx="268" cy="365" r="1.5" fill="currentColor" />
                <circle cx="312" cy="355" r="1.5" fill="currentColor" />
                <circle cx="395" cy="362" r="1.5" fill="currentColor" />
                <circle cx="448" cy="360" r="1.5" fill="currentColor" />
                <circle cx="48" cy="402" r="1.5" fill="currentColor" />
                <circle cx="108" cy="398" r="1.5" fill="currentColor" />
                <circle cx="188" cy="398" r="1.5" fill="currentColor" />
                <circle cx="282" cy="395" r="1.5" fill="currentColor" />
                <circle cx="372" cy="395" r="1.5" fill="currentColor" />
                <circle cx="442" cy="415" r="1.5" fill="currentColor" />
                <circle cx="18" cy="445" r="1.5" fill="currentColor" />
                <circle cx="108" cy="440" r="1.5" fill="currentColor" />
                <circle cx="152" cy="425" r="1.5" fill="currentColor" />
                <circle cx="252" cy="445" r="1.5" fill="currentColor" />
                <circle cx="362" cy="445" r="1.5" fill="currentColor" />
                <circle cx="445" cy="445" r="1.5" fill="currentColor" />
              </g>
            </g>
          </pattern>
        </defs>

        {/* Rectángulo que llena todo el contenedor repitiendo el patrón con máscara central */}
        <rect
          width="100%"
          height="100%"
          fill="url(#inmo-chat-doodles)"
          mask={showCenterLogo ? 'url(#inmo-center-cutout)' : undefined}
        />
      </svg>

      {/* Logo de INMO en el centro como marca de agua sutil (+300% de tamaño) */}
      {showCenterLogo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          {/* Suave degradado radial que desvanece suavemente cualquier borde cercano */}
          <div className="relative flex flex-col items-center justify-center p-8">
            <div className="absolute -inset-16 rounded-full bg-radial from-white/80 dark:from-inmo-darkcard/80 via-white/40 dark:via-inmo-darkcard/40 to-transparent blur-xl" />
            <img
              src="/inmo.png"
              alt="INMO"
              className="dark:hidden h-28 md:h-36 w-auto object-contain opacity-[0.09] filter grayscale relative z-10"
            />
            <img
              src="/inmo white.png"
              alt="INMO"
              className="hidden dark:block h-28 md:h-36 w-auto object-contain opacity-[0.14] filter grayscale relative z-10"
            />
          </div>
        </div>
      )}
    </div>
  );
};
