import React from 'react';

export interface ChatDoodleBackgroundProps {
  className?: string;
  showCenterLogo?: boolean;
}

/**
 * WhatsApp-style real estate doodle wallpaper.
 * Contains organic, non-grid hand-drawn vector doodles representing properties, architecture,
 * keys, blueprints, interior elements, moving boxes, and financial/notary symbols.
 * Features an organic ellipse mask that hugs the logo silhouette with a subtle margin,
 * ensuring the red roof and brand text remain clearly visible without a giant empty void.
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
      {/* Tiled SVG Pattern with Real Estate Doodles & Integrated Logo Silhouette Mask */}
      <svg
        className="w-full h-full text-inmo-secondary dark:text-inmo-primary stroke-inmo-secondary dark:stroke-inmo-primary opacity-[0.06] dark:opacity-[0.28] transition-opacity duration-300"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Mascara suave y ultra-compacta que integra el logo con los doodles sin repelerlos */}
          <radialGradient id="inmo-mask-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#333333" />
            <stop offset="50%" stopColor="#777777" />
            <stop offset="80%" stopColor="#cccccc" />
            <stop offset="100%" stopColor="#ffffff" />
          </radialGradient>

          <mask id="inmo-center-cutout" maskContentUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="#ffffff" />
            <ellipse cx="50%" cy="50%" rx="48" ry="26" fill="url(#inmo-mask-grad)" />
          </mask>

          {/* Doodles con distribución orgánica dispersa (sin cuadrícula), rotaciones vivas y tamaños variados */}
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
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-inmo-secondary dark:text-inmo-primary stroke-inmo-secondary dark:stroke-inmo-primary"
            >
              {/* === SECTOR 1: ZONA SUPERIOR DISPERSA === */}
              {/* 1. Casa clásica con chimenea y humo */}
              <g transform="translate(18, 14) rotate(-10) scale(1.05)">
                <path d="M 5 26 L 25 8 L 45 26" />
                <path d="M 12 26 V 44 H 38 V 26" />
                <path d="M 21 44 V 32 H 29 V 44" />
                <path d="M 34 16 V 10 H 39 V 20" />
                <path d="M 37 6 Q 39 4 37 2" strokeWidth="1.2" />
              </g>

              {/* 2. Maletín ejecutivo de asesor inmobiliario */}
              <g transform="translate(85, 34) rotate(16) scale(0.92)">
                <rect x="0" y="6" width="30" height="20" rx="3" />
                <path d="M 9 6 V 2 H 21 V 6 M 15 13 V 17 M 0 14 H 30" />
              </g>

              {/* 3. Llaves con llavero de casa */}
              <g transform="translate(138, 12) rotate(-22) scale(0.9)">
                <circle cx="12" cy="12" r="7" />
                <path d="M 19 12 H 42" />
                <path d="M 34 12 V 17 M 39 12 V 16" />
                <path d="M 12 19 L 8 24 V 34 H 16 V 24 Z" />
              </g>

              {/* 4. Moneda de inversión / Plusvalía con $ */}
              <g transform="translate(192, 42) rotate(14) scale(0.85)">
                <circle cx="12" cy="12" r="11" />
                <path d="M 12 5 V 19 M 9 8 H 14 C 15.5 8 16 9 16 10.5 C 16 12 15 12.5 12 12.5 C 9 12.5 8 13 8 14.5 C 8 16 9 16.5 14 16.5" />
              </g>

              {/* 5. Edificio / Rascacielos con antena */}
              <g transform="translate(242, 10) rotate(-6) scale(1.1)">
                <rect x="0" y="14" width="28" height="52" rx="2" />
                <path d="M 14 14 V 5" />
                <circle cx="14" cy="4" r="1.5" fill="currentColor" />
                <path d="M 6 22 H 11 M 17 22 H 22" />
                <path d="M 6 30 H 11 M 17 30 H 22" />
                <path d="M 6 38 H 11 M 17 38 H 22" />
                <path d="M 6 46 H 11 M 17 46 H 22" />
                <path d="M 10 66 V 58 H 18 V 66" />
              </g>

              {/* 6. Balcón moderno con barandal */}
              <g transform="translate(305, 38) rotate(10) scale(0.95)">
                <rect x="2" y="8" width="28" height="14" rx="1" />
                <path d="M 6 8 V 22 M 11 8 V 22 M 16 8 V 22 M 21 8 V 22 M 26 8 V 22 M 0 22 H 32" />
              </g>

              {/* 7. Letrero 'SE VENDE' / For Sale */}
              <g transform="translate(365, 14) rotate(-12) scale(1.0)">
                <path d="M 18 10 V 55" />
                <rect x="2" y="16" width="32" height="20" rx="2" />
                <path d="M 7 23 H 29 M 10 29 H 26" />
              </g>

              {/* 8. Pino / Árbol de jardín */}
              <g transform="translate(422, 28) rotate(8) scale(0.95)">
                <path d="M 16 46 V 56" />
                <path d="M 16 10 L 6 24 H 11 L 4 35 H 10 L 2 46 H 30 L 22 46 H 28 L 21 35 H 26 L 16 10 Z" />
              </g>

              {/* === SECTOR 2: MEDIO SUPERIOR DESCENTRALIZADO === */}
              {/* 9. Escuadra de arquitecto / Regla */}
              <g transform="translate(12, 88) rotate(24) scale(0.9)">
                <path d="M 4 44 L 4 4 L 44 44 Z" />
                <path d="M 10 38 L 10 18 L 30 38 Z" />
              </g>

              {/* 10. Cactus en maceta geométrica */}
              <g transform="translate(62, 108) rotate(-14) scale(0.85)">
                <path d="M 6 18 H 22 L 20 30 H 8 Z" />
                <path d="M 14 4 V 18 M 8 10 H 14 M 8 7 V 10 M 14 12 H 20 M 20 9 V 12" />
              </g>

              {/* 11. Calculadora de hipotecas */}
              <g transform="translate(112, 75) rotate(12) scale(0.95)">
                <rect x="0" y="0" width="22" height="30" rx="3" />
                <rect x="3" y="4" width="16" height="6" rx="1" />
                <circle cx="6" cy="15" r="1.5" fill="currentColor" />
                <circle cx="11" cy="15" r="1.5" fill="currentColor" />
                <circle cx="16" cy="15" r="1.5" fill="currentColor" />
                <circle cx="6" cy="22" r="1.5" fill="currentColor" />
                <circle cx="11" cy="22" r="1.5" fill="currentColor" />
                <circle cx="16" cy="22" r="1.5" fill="currentColor" />
              </g>

              {/* 12. Plano arquitectónico / Blueprint */}
              <g transform="translate(160, 115) rotate(-8) scale(1.0)">
                <rect x="2" y="2" width="38" height="32" rx="2" />
                <path d="M 20 2 V 22 M 2 22 H 28 M 20 18 H 40" />
                <path d="M 20 22 A 8 8 0 0 1 28 30" strokeDasharray="2 2" />
              </g>

              {/* 13. Bombilla de ideas / Diseño */}
              <g transform="translate(218, 82) rotate(22) scale(0.85)">
                <path d="M 6 10 C 6 4 18 4 18 10 C 18 13 15 15 15 18 H 9 C 9 15 6 13 6 10 Z" />
                <path d="M 9 21 H 15 M 10 24 H 14" />
              </g>

              {/* 14. Contrato / Título de propiedad con sello */}
              <g transform="translate(268, 118) rotate(-15) scale(1.0)">
                <path d="M 4 4 H 24 L 32 12 V 42 H 4 Z" />
                <path d="M 24 4 V 12 H 32" />
                <path d="M 9 16 H 21 M 9 22 H 27 M 9 28 H 22" />
                <circle cx="24" cy="35" r="4" />
              </g>

              {/* 15. Lámpara de piso / Luminaria */}
              <g transform="translate(328, 78) rotate(14) scale(0.9)">
                <path d="M 10 6 L 4 18 H 22 L 16 6 Z" />
                <path d="M 13 18 V 50" />
                <path d="M 6 50 H 20" />
              </g>

              {/* 16. Sofá acogedor de sala */}
              <g transform="translate(382, 112) rotate(-8) scale(1.05)">
                <path d="M 4 12 C 4 6 9 4 18 4 H 36 C 45 4 50 6 50 12 V 22 H 4 Z" />
                <path d="M 8 22 H 46 V 28 H 8 Z" />
                <path d="M 11 28 L 9 34 M 43 28 L 45 34" />
              </g>

              {/* 17. Pin de ubicación con casa adentro */}
              <g transform="translate(432, 85) rotate(18) scale(0.95)">
                <path d="M 16 4 C 8 4 3 11 3 18 C 3 28 16 38 16 38 C 16 38 29 28 29 18 C 29 11 24 4 16 4 Z" />
                <path d="M 12 21 V 17 L 16 14 L 20 17 V 21 H 12 Z" />
              </g>

              {/* === SECTOR 3: FRANJA LATERAL MEDIA === */}
              {/* 18. Apretón de manos / Trato cerrado */}
              <g transform="translate(15, 168) rotate(-12) scale(0.95)">
                <path d="M 4 14 L 14 20" />
                <path d="M 42 14 L 32 20" />
                <path d="M 14 20 L 22 15 L 28 19 L 24 26 L 18 23 Z" />
                <path d="M 22 24 L 26 28 L 32 20" />
              </g>

              {/* 19. Reloj de pared para citas */}
              <g transform="translate(72, 162) rotate(15) scale(0.85)">
                <circle cx="12" cy="12" r="11" />
                <path d="M 12 5 V 12 L 17 12" />
              </g>

              {/* 20. Villa moderna con terraza */}
              <g transform="translate(122, 178) rotate(-6) scale(1.1)">
                <rect x="2" y="18" width="40" height="24" rx="1" />
                <rect x="8" y="2" width="28" height="18" rx="1" />
                <path d="M 2 14 H 8 M 4 14 V 18 M 6 14 V 18" />
                <rect x="13" y="7" width="8" height="8" />
                <rect x="26" y="26" width="10" height="16" />
              </g>

              {/* 21. Taza de café humeante para visitas */}
              <g transform="translate(175, 168) rotate(18) scale(0.85)">
                <path d="M 4 8 H 22 V 18 C 22 22 4 22 4 18 Z M 22 10 H 26 C 28 10 28 16 26 16 H 22 M 2 24 H 24" />
                <path d="M 9 2 Q 11 4 9 6 M 15 2 Q 17 4 15 6" strokeWidth="1.2" />
              </g>

              {/* 22. Cámara / Sensor de seguridad inteligente */}
              <g transform="translate(228, 162) rotate(-16) scale(0.9)">
                <rect x="4" y="4" width="22" height="12" rx="2" />
                <path d="M 26 7 L 33 4 V 16 L 26 13 Z M 15 16 V 24 M 10 24 H 20" />
              </g>

              {/* 23. Llave antigua ornamental */}
              <g transform="translate(278, 175) rotate(25) scale(0.9)">
                <circle cx="10" cy="10" r="7" />
                <circle cx="10" cy="10" r="2.5" />
                <path d="M 17 10 H 38" />
                <path d="M 32 10 V 17 H 38 V 13 H 35 V 10" />
              </g>

              {/* 24. Herramientas cruzadas (Remodelación) */}
              <g transform="translate(332, 158) rotate(-18) scale(0.85)">
                <path d="M 4 4 L 20 20 M 16 4 L 4 16" />
                <path d="M 2 3 L 5 2 L 6 5 L 3 6 Z M 18 3 L 22 6 L 19 9 Z" />
              </g>

              {/* 25. Insignia porcentaje % (Hipoteca / Tasa) */}
              <g transform="translate(388, 172) rotate(14) scale(0.95)">
                <circle cx="16" cy="16" r="14" />
                <path d="M 10 22 L 22 10" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
              </g>

              {/* 26. Escudo de propiedad verificada */}
              <g transform="translate(432, 165) rotate(-10) scale(0.95)">
                <path d="M 4 8 L 18 3 L 32 8 C 32 22 18 31 18 31 C 18 31 4 22 4 8 Z" />
                <path d="M 11 16 L 16 21 L 25 11" />
              </g>

              {/* === SECTOR 4: MEDIO INFERIOR ESCALONADO === */}
              {/* 27. Etiqueta / Tag de precio o venta */}
              <g transform="translate(14, 238) rotate(22) scale(0.85)">
                <path d="M 4 14 L 14 4 H 32 V 24 H 14 L 4 14 Z" />
                <circle cx="10" cy="14" r="2" />
              </g>

              {/* 28. Maceta colgante con enredadera */}
              <g transform="translate(60, 222) rotate(-10) scale(0.9)">
                <path d="M 6 0 L 10 12 H 20 L 24 0 M 10 12 L 12 20 H 18 L 20 12" />
                <path d="M 12 20 Q 8 26 10 32 M 18 20 Q 22 25 19 32" strokeWidth="1.2" />
              </g>

              {/* 29. Casa con corazón en el centro (Hogar) */}
              <g transform="translate(108, 245) rotate(12) scale(1.0)">
                <path d="M 3 16 L 19 3 L 35 16" />
                <path d="M 8 16 V 34 H 30 V 16" />
                <path d="M 19 22 C 18 20 15 20 15 23 C 15 26 19 29 19 29 C 19 29 23 26 23 23 C 23 20 20 20 19 22 Z" />
              </g>

              {/* 30. Termostato circular inteligente */}
              <g transform="translate(162, 228) rotate(-16) scale(0.85)">
                <circle cx="12" cy="12" r="11" />
                <circle cx="12" cy="12" r="6" />
                <path d="M 12 3 V 5 M 12 19 V 21 M 3 12 H 5 M 19 12 H 21" />
              </g>

              {/* 31. Brújula / Rosa de los vientos con Norte */}
              <g transform="translate(212, 242) rotate(20) scale(0.9)">
                <circle cx="16" cy="18" r="14" />
                <path d="M 16 6 L 19 18 L 16 30 L 13 18 Z" />
                <path d="M 4 18 L 16 21 L 28 18 L 16 15 Z" />
                <path d="M 14 4 V 0 L 18 4 V 0" strokeWidth="1.2" />
              </g>

              {/* 32. Panel solar en techo sustentable */}
              <g transform="translate(262, 225) rotate(-12) scale(0.95)">
                <path d="M 4 20 L 10 4 H 26 L 32 20 Z" />
                <path d="M 11 4 L 15 20 M 21 4 L 21 20 M 6 12 H 30" />
              </g>

              {/* 33. Planta monstera en maceta */}
              <g transform="translate(315, 242) rotate(15) scale(0.95)">
                <path d="M 8 22 L 11 36 H 23 L 26 22 Z" />
                <path d="M 17 22 Q 10 12 4 11 M 17 22 Q 17 5 19 2 M 17 22 Q 24 12 30 11" />
              </g>

              {/* 34. Alberca con escalerilla / Amenidad */}
              <g transform="translate(368, 222) rotate(-8) scale(1.0)">
                <path d="M 2 14 Q 8 10 14 14 T 26 14 T 38 14 M 2 22 Q 8 18 14 22 T 26 22 T 38 22" />
                <path d="M 8 2 V 12 M 14 2 V 12 M 8 6 H 14 M 8 10 H 14" />
              </g>

              {/* 35. Puerta principal con moldura */}
              <g transform="translate(424, 235) rotate(12) scale(1.0)">
                <rect x="4" y="2" width="24" height="42" rx="2" />
                <path d="M 4 12 H 28" />
                <circle cx="23" cy="25" r="1.5" fill="currentColor" />
                <rect x="8" y="16" width="6" height="9" />
                <rect x="18" y="16" width="6" height="9" />
                <rect x="8" y="29" width="6" height="11" />
                <rect x="18" y="29" width="6" height="11" />
              </g>

              {/* === SECTOR 5: ZONA INFERIOR DINÁMICA === */}
              {/* 36. Casa adosada / Townhouse con ático */}
              <g transform="translate(22, 312) rotate(-8) scale(1.05)">
                <rect x="4" y="16" width="32" height="38" rx="1" />
                <path d="M 2 16 L 20 2 L 38 16 Z" />
                <circle cx="20" cy="10" r="3.5" />
                <rect x="15" y="36" width="10" height="18" />
                <path d="M 12 54 H 28" />
              </g>

              {/* 37. Garage con portón levadizo */}
              <g transform="translate(75, 298) rotate(14) scale(0.95)">
                <rect x="2" y="4" width="28" height="24" rx="2" />
                <path d="M 2 10 H 30 M 2 16 H 30 M 2 22 H 30" />
              </g>

              {/* 38. Cinta métrica / Flexómetro */}
              <g transform="translate(128, 315) rotate(-22) scale(0.9)">
                <path d="M 4 14 C 4 7 11 4 19 4 C 27 4 34 7 34 14 V 27 H 4 Z" />
                <path d="M 34 24 H 56 M 39 24 V 20 M 45 24 V 21 M 51 24 V 20" />
              </g>

              {/* 39. Chimenea rústica con leña */}
              <g transform="translate(178, 292) rotate(8) scale(0.95)">
                <rect x="2" y="4" width="26" height="24" rx="2" />
                <path d="M 6 28 V 16 H 24 V 28" />
                <path d="M 11 25 L 19 21 M 11 21 L 19 25" />
              </g>

              {/* 40. Sillón individual confortable */}
              <g transform="translate(228, 315) rotate(-14) scale(0.95)">
                <path d="M 4 14 C 4 7 9 4 19 4 C 29 4 34 7 34 14 V 28 H 4 Z" />
                <rect x="6" y="21" width="26" height="8" rx="2" />
                <path d="M 8 29 L 5 36 M 30 29 L 33 36" />
              </g>

              {/* 41. Elevador con flechas */}
              <g transform="translate(282, 295) rotate(12) scale(0.9)">
                <rect x="2" y="2" width="24" height="26" rx="2" />
                <path d="M 8 12 L 14 6 L 20 12 M 14 8 V 20 M 8 16 L 14 22 L 20 16" />
              </g>

              {/* 42. Cerca de jardín / Piquetes de madera */}
              <g transform="translate(332, 318) rotate(-6) scale(0.95)">
                <path d="M 4 8 L 7 4 L 10 8 V 26 H 4 Z" />
                <path d="M 14 8 L 17 4 L 20 8 V 26 H 14 Z" />
                <path d="M 24 8 L 27 4 L 30 8 V 26 H 24 Z" />
                <path d="M 2 11 H 32 M 2 21 H 32" />
              </g>

              {/* 43. Tarjeta electrónica / Smart access */}
              <g transform="translate(385, 292) rotate(22) scale(0.85)">
                <rect x="2" y="4" width="26" height="18" rx="2" />
                <rect x="5" y="8" width="8" height="6" rx="1" />
                <path d="M 16 11 H 24 M 16 15 H 22" />
              </g>

              {/* 44. Ventana con cortinas */}
              <g transform="translate(430, 312) rotate(-12) scale(0.95)">
                <rect x="4" y="4" width="28" height="32" rx="2" />
                <path d="M 18 4 V 36 M 4 20 H 32" />
                <path d="M 4 4 Q 12 14 7 24 M 32 4 Q 24 14 29 24" />
              </g>

              {/* === SECTOR 6: FRANJA BASAL ASIMÉTRICA === */}
              {/* 45. Lámpara de techo colgante */}
              <g transform="translate(18, 395) rotate(14) scale(0.9)">
                <path d="M 16 0 V 14" />
                <path d="M 6 24 C 6 16 10 14 16 14 C 22 14 26 16 26 24 Z" />
                <path d="M 14 24 Q 16 27 18 24" />
              </g>

              {/* 46. Canasta de bienvenida / Casa nueva */}
              <g transform="translate(68, 375) rotate(-16) scale(0.85)">
                <path d="M 4 10 H 24 L 20 22 H 8 Z M 6 10 C 6 3 22 3 22 10" />
                <path d="M 11 10 V 5 M 17 10 V 7" />
              </g>

              {/* 47. Mapa doblado con pin */}
              <g transform="translate(118, 398) rotate(12) scale(1.0)">
                <path d="M 2 17 L 16 12 L 30 17 L 44 12 V 34 L 30 39 L 16 34 L 2 39 Z" />
                <path d="M 16 12 V 34 M 30 17 V 39" />
                <circle cx="23" cy="8" r="4" />
                <path d="M 23 12 L 23 18" />
              </g>

              {/* 48. Señalética de calle */}
              <g transform="translate(172, 372) rotate(-10) scale(0.9)">
                <path d="M 12 4 V 26" />
                <rect x="2" y="4" width="22" height="10" rx="1" />
                <path d="M 5 9 H 19" />
              </g>

              {/* 49. Puerta corrediza / Ventanal moderno */}
              <g transform="translate(222, 395) rotate(8) scale(1.0)">
                <rect x="2" y="2" width="38" height="34" rx="1" />
                <rect x="5" y="5" width="15" height="28" />
                <rect x="22" y="5" width="15" height="28" />
                <path d="M 18 16 V 22 M 24 16 V 22" />
              </g>

              {/* 50. Candado de seguridad */}
              <g transform="translate(276, 372) rotate(-20) scale(0.85)">
                <rect x="3" y="9" width="18" height="14" rx="2" />
                <path d="M 7 9 V 5 C 7 2 17 2 17 5 V 9" />
                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
              </g>

              {/* 51. Par de llaves colgando */}
              <g transform="translate(322, 398) rotate(18) scale(0.9)">
                <circle cx="12" cy="7" r="6" />
                <path d="M 10 13 L 6 34 M 6 28 L 2 29 M 5 32 L 1 33" />
                <path d="M 15 13 L 21 34 M 20 29 L 24 30 M 21 33 L 25 34" />
              </g>

              {/* 52. Extintor de incendios */}
              <g transform="translate(372, 370) rotate(-15) scale(0.85)">
                <rect x="6" y="8" width="12" height="20" rx="3" />
                <path d="M 12 8 V 4 M 9 4 H 15 M 12 4 L 18 7" />
              </g>

              {/* 53. Edificio clásico con columnas (Banco / Notaría) */}
              <g transform="translate(415, 395) rotate(6) scale(1.1)">
                <path d="M 4 12 L 28 2 L 52 12 Z" />
                <path d="M 10 12 V 32 M 22 12 V 32 M 34 12 V 32 M 46 12 V 32" />
                <path d="M 4 32 H 52 M 0 36 H 56" />
              </g>

              {/* === SECTOR 7: BORDES INFERIORES PARA CONTINUIDAD PERFECTA === */}
              {/* 54. Farol colonial de calle */}
              <g transform="translate(42, 435) rotate(-8) scale(0.9)">
                <path d="M 4 11 L 8 5 H 16 L 20 11 L 16 19 H 8 Z" />
                <path d="M 12 5 V 1 M 12 19 V 48" />
                <path d="M 7 48 H 17" />
              </g>

              {/* 55. Medidor de luz / Servicios */}
              <g transform="translate(145, 435) rotate(14) scale(0.85)">
                <circle cx="12" cy="12" r="11" />
                <path d="M 12 12 L 17 8 M 6 12 A 6 6 0 0 1 18 12" />
              </g>

              {/* 56. Llavero con número de casa */}
              <g transform="translate(252, 435) rotate(-18) scale(0.85)">
                <circle cx="8" cy="8" r="5" />
                <path d="M 12 11 L 22 21" />
                <rect x="18" y="16" width="10" height="12" rx="2" />
              </g>

              {/* 57. Globo de diálogo con casita */}
              <g transform="translate(355, 435) rotate(16) scale(0.9)">
                <path d="M 4 10 C 4 4 9 0 19 0 H 32 C 42 0 47 4 47 10 V 22 C 47 28 42 32 32 32 H 20 L 12 37 V 32 H 19 C 9 32 4 28 4 22 Z" />
                <path d="M 21 23 V 17 L 25 14 L 29 17 V 23 H 21 Z" />
              </g>

              {/* 58. Caja de mudanza con flecha */}
              <g transform="translate(202, 348) rotate(-10) scale(0.88)">
                <rect x="3" y="6" width="22" height="18" rx="2" />
                <path d="M 3 11 H 25 M 14 14 V 20 M 11 17 L 14 14 L 17 17" />
              </g>

              {/* 59. Timbre / Campana de casa */}
              <g transform="translate(305, 348) rotate(14) scale(0.85)">
                <path d="M 4 18 C 4 18 6 16 6 10 C 6 5 18 5 18 10 C 18 16 20 18 20 18 H 4 Z" />
                <circle cx="12" cy="22" r="2" />
              </g>

              {/* 60. Calificación 5 estrellas */}
              <g transform="translate(108, 142) rotate(-8) scale(0.85)">
                <path d="M 4 8 L 6 3 L 8 8 L 13 8 L 9 11 L 11 16 L 6 13 L 2 16 L 3 11 Z" />
                <path d="M 18 8 L 20 3 L 22 8 L 27 8 L 23 11 L 25 16 L 20 13 L 16 16 L 17 11 Z" />
              </g>

              {/* Chispas, destellos WhatsApp y rellenos orgánicos interconectados */}
              <g strokeWidth="1.5">
                {/* Destellos de 4 puntas distribuidos aleatoriamente */}
                <path d="M 62 25 L 64 30 L 69 32 L 64 34 L 62 39 L 60 34 L 55 32 L 60 30 Z" />
                <path d="M 172 26 L 173 30 L 177 31 L 173 32 L 172 36 L 171 32 L 167 31 L 171 30 Z" />
                <path d="M 285 24 L 286 27 L 289 28 L 286 29 L 285 32 L 284 29 L 281 28 L 284 27 Z" />
                <path d="M 345 52 L 346 55 L 349 56 L 346 57 L 345 60 L 344 57 L 341 56 L 344 55 Z" />
                <path d="M 405 62 L 406 65 L 409 66 L 406 67 L 405 70 L 404 67 L 401 66 L 404 65 Z" />
                <path d="M 38 72 L 39 76 L 43 77 L 39 78 L 38 82 L 37 78 L 33 77 L 37 76 Z" />
                <path d="M 142 98 L 143 101 L 146 102 L 143 103 L 142 106 L 141 103 L 138 102 L 141 101 Z" />
                <path d="M 245 105 L 246 108 L 249 109 L 246 110 L 245 113 L 244 110 L 241 109 L 244 108 Z" />
                <path d="M 360 88 L 361 91 L 364 92 L 361 93 L 360 96 L 359 93 L 356 92 L 359 91 Z" />
                <path d="M 412 135 L 413 138 L 416 139 L 413 140 L 412 143 L 411 140 L 408 139 L 411 138 Z" />
                <path d="M 52 145 L 53 148 L 56 149 L 53 150 L 52 153 L 51 150 L 48 149 L 51 148 Z" />
                <path d="M 152 148 L 153 151 L 156 152 L 153 153 L 152 156 L 151 153 L 148 152 L 151 151 Z" />
                <path d="M 205 142 L 206 145 L 209 146 L 206 147 L 205 150 L 204 147 L 201 146 L 204 145 Z" />
                <path d="M 312 145 L 313 148 L 316 149 L 313 150 L 312 153 L 311 150 L 308 149 L 311 148 Z" />
                <path d="M 42 205 L 43 208 L 46 209 L 43 210 L 42 213 L 41 210 L 38 209 L 41 208 Z" />
                <path d="M 145 210 L 146 213 L 149 214 L 146 215 L 145 218 L 144 215 L 141 214 L 144 213 Z" />
                <path d="M 245 205 L 246 208 L 249 209 L 246 210 L 245 213 L 244 210 L 241 209 L 244 208 Z" />
                <path d="M 345 200 L 346 203 L 349 204 L 346 205 L 345 208 L 344 205 L 341 204 L 344 203 Z" />
                <path d="M 415 202 L 416 205 L 419 206 L 416 207 L 415 210 L 414 207 L 411 206 L 414 205 Z" />
                <path d="M 88 268 L 89 271 L 92 272 L 89 273 L 88 276 L 87 273 L 84 272 L 87 271 Z" />
                <path d="M 192 268 L 193 271 L 196 272 L 193 273 L 192 276 L 191 273 L 188 272 L 191 271 Z" />
                <path d="M 295 265 L 296 268 L 299 269 L 296 270 L 295 273 L 294 270 L 291 269 L 294 268 Z" />
                <path d="M 395 268 L 396 271 L 399 272 L 396 273 L 395 276 L 394 273 L 391 272 L 394 271 Z" />
                <path d="M 52 335 L 53 338 L 56 339 L 53 340 L 52 343 L 51 340 L 48 339 L 51 338 Z" />
                <path d="M 162 338 L 163 341 L 166 342 L 163 343 L 162 346 L 161 343 L 158 342 L 161 341 Z" />
                <path d="M 262 345 L 263 348 L 266 349 L 263 350 L 262 353 L 261 350 L 258 349 L 261 348 Z" />
                <path d="M 368 342 L 369 345 L 372 346 L 369 347 L 368 350 L 367 347 L 364 346 L 367 345 Z" />
                <path d="M 445 352 L 446 355 L 449 356 L 446 357 L 445 360 L 444 357 L 441 356 L 444 355 Z" />
                <path d="M 98 425 L 99 428 L 102 429 L 99 430 L 98 433 L 97 430 L 94 429 L 97 428 Z" />
                <path d="M 205 425 L 206 428 L 209 429 L 206 430 L 205 433 L 204 430 L 201 429 L 204 428 Z" />
                <path d="M 305 428 L 306 431 L 309 432 L 306 433 L 305 436 L 304 433 L 301 432 L 304 431 Z" />

                {/* Cruces orgánicas */}
                <path d="M 115 48 H 121 M 118 45 V 51" />
                <path d="M 225 65 H 231 M 228 62 V 68" />
                <path d="M 338 35 H 344 M 341 32 V 38" />
                <path d="M 28 118 H 34 M 31 115 V 121" />
                <path d="M 195 105 H 201 M 198 102 V 108" />
                <path d="M 302 108 H 308 M 305 105 V 111" />
                <path d="M 412 110 H 418 M 415 107 V 113" />
                <path d="M 95 188 H 101 M 98 185 V 191" />
                <path d="M 208 192 H 214 M 211 189 V 195" />
                <path d="M 312 188 H 318 M 315 185 V 191" />
                <path d="M 418 185 H 424 M 421 182 V 188" />
                <path d="M 45 258 H 51 M 48 255 V 261" />
                <path d="M 148 252 H 154 M 151 249 V 255" />
                <path d="M 252 255 H 258 M 255 252 V 258" />
                <path d="M 352 250 H 358 M 355 247 V 253" />
                <path d="M 108 325 H 114 M 111 322 V 328" />
                <path d="M 208 322 H 214 M 211 319 V 325" />
                <path d="M 308 325 H 314 M 311 322 V 328" />
                <path d="M 408 335 H 414 M 411 332 V 338" />
                <path d="M 38 410 H 44 M 41 407 V 413" />
                <path d="M 142 415 H 148 M 145 412 V 418" />
                <path d="M 248 412 H 254 M 251 409 V 415" />
                <path d="M 342 415 H 348 M 345 412 V 418" />

                {/* Puntitos dispersos de relleno */}
                <circle cx="45" cy="42" r="1.5" fill="currentColor" />
                <circle cx="162" cy="42" r="1.5" fill="currentColor" />
                <circle cx="272" cy="52" r="1.5" fill="currentColor" />
                <circle cx="395" cy="42" r="1.5" fill="currentColor" />
                <circle cx="448" cy="58" r="1.5" fill="currentColor" />
                <circle cx="78" cy="92" r="1.5" fill="currentColor" />
                <circle cx="132" cy="85" r="1.5" fill="currentColor" />
                <circle cx="235" cy="88" r="1.5" fill="currentColor" />
                <circle cx="355" cy="72" r="1.5" fill="currentColor" />
                <circle cx="448" cy="115" r="1.5" fill="currentColor" />
                <circle cx="32" cy="155" r="1.5" fill="currentColor" />
                <circle cx="118" cy="152" r="1.5" fill="currentColor" />
                <circle cx="265" cy="155" r="1.5" fill="currentColor" />
                <circle cx="365" cy="152" r="1.5" fill="currentColor" />
                <circle cx="445" cy="148" r="1.5" fill="currentColor" />
                <circle cx="58" cy="195" r="1.5" fill="currentColor" />
                <circle cx="152" cy="195" r="1.5" fill="currentColor" />
                <circle cx="262" cy="198" r="1.5" fill="currentColor" />
                <circle cx="362" cy="192" r="1.5" fill="currentColor" />
                <circle cx="445" cy="212" r="1.5" fill="currentColor" />
                <circle cx="28" cy="275" r="1.5" fill="currentColor" />
                <circle cx="135" cy="275" r="1.5" fill="currentColor" />
                <circle cx="238" cy="272" r="1.5" fill="currentColor" />
                <circle cx="338" cy="275" r="1.5" fill="currentColor" />
                <circle cx="445" cy="268" r="1.5" fill="currentColor" />
                <circle cx="68" cy="342" r="1.5" fill="currentColor" />
                <circle cx="172" cy="348" r="1.5" fill="currentColor" />
                <circle cx="275" cy="342" r="1.5" fill="currentColor" />
                <circle cx="375" cy="348" r="1.5" fill="currentColor" />
                <circle cx="448" cy="345" r="1.5" fill="currentColor" />
                <circle cx="52" cy="382" r="1.5" fill="currentColor" />
                <circle cx="145" cy="378" r="1.5" fill="currentColor" />
                <circle cx="248" cy="378" r="1.5" fill="currentColor" />
                <circle cx="348" cy="375" r="1.5" fill="currentColor" />
                <circle cx="442" cy="382" r="1.5" fill="currentColor" />
                <circle cx="82" cy="442" r="1.5" fill="currentColor" />
                <circle cx="192" cy="440" r="1.5" fill="currentColor" />
                <circle cx="295" cy="442" r="1.5" fill="currentColor" />
                <circle cx="395" cy="440" r="1.5" fill="currentColor" />
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
          <div className="relative flex flex-col items-center justify-center p-2">
            <img
              src="/inmo.png"
              alt="INMO"
              className="dark:hidden h-24 md:h-32 w-auto object-contain opacity-[0.25] relative z-10 transition-opacity duration-300"
            />
            <img
              src="/inmo white.png"
              alt="INMO"
              className="hidden dark:block h-24 md:h-32 w-auto object-contain opacity-[0.32] relative z-10 transition-opacity duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};
