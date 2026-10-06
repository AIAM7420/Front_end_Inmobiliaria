# Integración de INMO hasta 3e6344e y navegación táctil

Entrega del 2026-10-05 en ambos frontends: `AIAM7420/Front_end_Inmobiliaria` y `angggsoft/inmo`. Sin modificaciones del backend, endpoints nuevos ni migraciones. No se accede a Railway ni se modifica EAM16.

## Procedencia y decisiones de integración

Nuestro punto de partida es `df19aed2e861c6a1b44e672ee56fb2f7bbff2e66` (PR #7). INMO copia parte de `3e6344ebcb93c0542d1c4b4c649419d4829e6ab7`. Se conserva la ascendencia completa del equipo mediante un commit de integración con ambos historiales como padres; no se sustituyen ni atribuyen sus commits a otra persona.

Los 13 commits incorporados desde `6a4c88e` son `55188a1`, `fd53687`, `f3b8031`, `f558662`, `31f14b2`, `8387f3e`, `6188d19`, `f1fd623`, `011439c`, `c737047`, `ab3925d`, `6453829` y `3e6344e`. [Comparación original](https://github.com/angggsoft/inmo/compare/6a4c88e...3e6344e).

Se aplica [estilo-inmo](../agent/skills/estilo-inmo/SKILL.md). Se conservan las píldoras, tarjetas, tipografías, tokens y distribución nuevos; los selectores nativos y las esperas artificiales del prototipo se sustituyen por controles compartidos y estados de consultas reales. Las adaptaciones autorizadas incluyen scroll, áreas táctiles, permisos, estados de API, ausencia de reseñas y mapas aproximados. Esta entrega no afirma una comparación automatizada píxel por píxel de todas las pantallas.

## Matriz de cambios y evidencia

| Pantalla / acción | Implementación y conexión real | Verificación |
| --- | --- | --- |
| Mapa / categorías | Tarjetas con fotografía/precio visibles inicialmente; seis categorías centradas en escritorio; selector compacto compartido en móvil. `/propiedades`, `/busquedas`, catálogos y fotografías existentes | SDK Mapbox real, marcadores por teclado, zoom y criterios reales |
| Mapa / búsqueda y filtros | Búsqueda inferior en escritorio; popover hacia arriba o abajo según el disparador. Sector, zona, tipo y precio conservados. Opciones personalizadas con teclado, Escape, cierre exterior y foco | Tres tamaños, ambos temas, viewport corto y comprobación de petición |
| Navbar / búsqueda | Sólo otra búsqueda de inmuebles visible oculta la del header. Las búsquedas de mensajes/usuarios no la eliminan. Los controles ocultos quedan inactivos para teclado | Filtros desde Mensajes y búsquedas de catálogo/portafolio |
| Perfil público del asesor | Panel lateral y portafolio del diseño nuevo; datos y validación reales; cliente/asesor contacta mediante una publicación concreta; administrador modera y no inicia contactos comerciales | Mapa → perfil → portafolio → volver al inmueble, móvil/tableta; permisos de regresión |
| Portafolio / filtros | Consulta todas las páginas necesarias. Progreso real y reintento explícito de una página fallida; no anuncia vacío mientras falten páginas | Página posterior y fallo 503 controlados; detalle y perfil servidos por API real aislada |
| Enlaces y navegación | `propiedad` en URL permite detalle directo aunque el inmueble no esté en la página actual. Historial atrás/adelante y retorno asesor → publicación | Enlaces directos desde catálogo/mapa y navegación de portafolio |
| Detalle / scroll táctil | Altura interna limitada; teléfono puede recorrer todo el contenido. Paneles estrechos de tableta utilizan una columna legible. Medir la caja exterior evita alternancias de distribución al añadir padding. Arrastre reservado al asa, sin capturar el scroll de la publicación | Gestos nativos Chrome en 390×844, 820×1180, 1024×768 y 1280×800, claro/oscuro |
| Galería / fotos | Miniaturas inmediatamente debajo de la foto. Swipe horizontal, selección táctil, botones de 44 px y flechas de teclado. El desplazamiento vertical y el pinch no activan cambios de foto | Swipe principal, scroll horizontal, selección y botones después de swipe |
| Catálogo dividido | Columnas y etiqueta de ubicación responden al ancho del panel, evitando tarjetas de unos 100 px en tableta | Anchura mínima de tarjeta comprobada durante el detalle abierto |
| Mapas / tema | Se retiene la instancia, cámara, selección y geometría aproximada; no se dibujan las áreas rojas retiradas por el diseño nuevo | Cuatro cambios de tema con estilos retrasados y recuperación explícita de error |
| Administración / chat | Pestañas uniformes conservadas y un único cierre de conversación. Archivo, mensajes y adjuntos existentes | Navegación protegida en ambos temas y tamaños; chat de ambos participantes |

Se conservan login único, JWT en memoria, `/me`, onboarding obligatorio, documentos privados, aprobación, pago confirmado por proveedor, ETags `"vN"`, recuperación manual de `412`, inventario y retirada con historial. Sin calificaciones, reseñas, Renta ni traspasos de propiedades. La PWA mantiene su caché de recursos estáticos.

## Validación y límites de la evidencia

Los comandos reproducibles son `npm test`, `npm run lint`, `npm run build`, `npx playwright test` y `npx playwright test --config playwright.maps.config.ts`, con `E2E_API_URL=http://127.0.0.1:8002/api/v1`.

La API E2E utiliza exclusivamente MySQL de pruebas y comprueba su identidad antes de los recorridos. Archivos, correo y Stripe utilizan proveedores de memoria. Los mapas ejecutan el SDK real de Mapbox/WebGL con estilos locales controlados, incluyendo cargas retrasadas y errores; no constituyen una prueba del proveedor remoto. La prueba adicional de paginación intercepta únicamente las páginas del portafolio para producir un fallo recuperable; las consultas de perfil, detalle y fotografías conservan la API real aislada.

Los gestos táctiles se envían mediante `Input.dispatchTouchEvent` de Chrome y `.tap()`, no sólo mediante clics de ratón. Las fotos sólidas y publicaciones mostradas en las capturas son fixtures de pruebas. Las capturas históricas regeneradas se archivan localmente y se restauran en Git; se añaden evidencias específicas de esta entrega.

Las comprobaciones remotas de Mapbox, R2, correo y Stripe quedan a cargo del usuario en Railway. Sincronizar EAM16 también corresponde al usuario; usar `APP_ENV=staging`, Stripe sandbox y un bucket aislado para esas comprobaciones.

## Capturas

- Galería móvil [claro](evidence/integracion-galeria-phone.png) / [oscuro](evidence/integracion-galeria-phone-dark.png).
- Galería tableta [claro](evidence/integracion-galeria-tablet.png) / [oscuro](evidence/integracion-galeria-tablet-dark.png).
- Galería tableta horizontal [claro](evidence/integracion-galeria-tablet-landscape.png) / [oscuro](evidence/integracion-galeria-tablet-landscape-dark.png).
- Galería en el ancho intermedio de 1280 px [claro](evidence/integracion-galeria-wide-tablet.png) / [oscuro](evidence/integracion-galeria-wide-tablet-dark.png).
- Scroll móvil [claro](evidence/integracion-touch-phone.png) / [oscuro](evidence/integracion-touch-phone-dark.png).
- Scroll tableta [claro](evidence/integracion-touch-tablet.png) / [oscuro](evidence/integracion-touch-tablet-dark.png).
- Portafolio [móvil](evidence/integracion-portafolio-phone.png) / [tableta](evidence/integracion-portafolio-tablet.png).
- [Mapa y detalle de escritorio](evidence/integracion-mapa-desktop.png), filtros [escritorio](evidence/integracion-filtros-desktop.png), [tableta](evidence/integracion-filtros-tablet.png) y [móvil oscuro](evidence/integracion-filtros-mobile-dark.png).
