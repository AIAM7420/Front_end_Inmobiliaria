# Integración de INMO hasta f0b5362 y navegación táctil

Entrega del 2026-10-06 en ambos frontends: `AIAM7420/Front_end_Inmobiliaria` y `angggsoft/inmo`. Sin modificaciones del backend, endpoints nuevos ni migraciones. No se accede a Railway ni se modifica EAM16.

## Procedencia y decisiones de integración

Nuestro punto de partida es `df19aed2e861c6a1b44e672ee56fb2f7bbff2e66` (PR #7). INMO copia parte de `3e6344ebcb93c0542d1c4b4c649419d4829e6ab7`. Se integran ambos historiales conservando la autoría del equipo. INMO copia mantiene sus commits originales y su main publicado no se reescribe.

GitHub rechazó la primera subida al frontend propio por un token de Figma en el archivo histórico `mcp_config.json`, commit `0715a9c`. No se eludió la protección. Se excluye esa configuración local de los dos frontends publicados y se añade a gitignore; los archivos locales se conservan. En el frontend propio se reconstruyen solamente los 62 commits de la ascendencia importada aún no publicada sin ese archivo, manteniendo autoría, fechas, mensajes y todos los archivos de la aplicación. Sus hashes cambian y las firmas antiguas de commits reconstruidos se retiran. [Mapa de procedencia](Procedencia_INMO_historial.json) registra los hashes originales y saneados. El propietario del token expuesto debe revocarlo; esta entrega no accede a Figma ni puede confirmar su revocación.

Los 13 commits incorporados desde `6a4c88e` son `55188a1`, `fd53687`, `f3b8031`, `f558662`, `31f14b2`, `8387f3e`, `6188d19`, `f1fd623`, `011439c`, `c737047`, `ab3925d`, `6453829` y `3e6344e`. [Comparación original](https://github.com/angggsoft/inmo/compare/6a4c88e...3e6344e).

Se aplica [estilo-inmo](../agent/skills/estilo-inmo/SKILL.md). Se conservan las píldoras, tarjetas, tipografías, tokens y distribución nuevos; los selectores nativos y las esperas artificiales del prototipo se sustituyen por controles compartidos y estados de consultas reales. Las adaptaciones autorizadas incluyen scroll, áreas táctiles, permisos, estados de API, ausencia de reseñas y mapas aproximados. Esta entrega no afirma una comparación automatizada píxel por píxel de todas las pantallas.

La revisión concurrente del 2026-10-06 incorporó también `aea21a8`, `5646955` y `d84fb75958c34b16d5a7e8a195fe332d5ecfc96f`: estilos de cristal uniformes, filtros compactos, coincidencias del mapa y la nueva distribución de Mensajes.

Se incorporaron los 17 commits posteriores hasta `ef8666abab5af32ce9a4e7c5e3e06aae1e92faee`: `950b3b0`, `a5d1001`, `8f046b2`, `9f22f74`, `cb95173`, `05ad2d0`, `d77a7b6`, `0ad3ba3`, `abacbb7`, `3ad1e88`, `48e286c`, `ce62bfb`, `8f3dc75`, `c817b5e`, `8931103`, `fb2d426` y `ef8666a`. Este bloque completa 33 commits originales; INMO copia conserva su historial y el frontend propio registra la correspondencia de hashes saneados. [Cambios posteriores](https://github.com/angggsoft/inmo/compare/d84fb75...ef8666a).

Se adopta el fondo inmobiliario ilustrado de Mensajes, sus transiciones, selección, estilos de cristal, estados vacíos y confirmaciones de archivo/recuperación. El asistente se oculta en Mensajes según el diseño nuevo. Se conservan los nombres de ambos participantes, adjuntos privados, lectura y reconexión reales. Las esperas artificiales se sustituyen por consultas; los filtros mantienen el desplegable compartido y un portal que recibe toques incluso dentro de paneles transformados. Ante un `412`, se revisa la conversación afectada sin reenviar la operación ni perder el borrador.

Los minimapas conservan cámara cenital y proyección Mercator, zoom y centrado, con controles de 44 px. Se utiliza nuestro ciclo de vida compartido en lugar de recrear el mapa al cambiar tema o recentrarlo en cada resize. La limpieza de nodos residuales del SDK permite reutilizar el contenedor sin avisos por contenido anterior. La navegación inferior dispone de espacio reservado en el perfil móvil: ya no cubre el botón Portafolio.


La última revisión incorpora `09a8ff5`, `db78673` y `f0b53627d382ebe439c67002225f068611be24f3`: 36 commits originales en total. Se adopta el avatar animado, el saludo centrado, el input inferior y las transiciones de apertura del asistente. Se descartan la espera artificial mínima de respuesta y el retraso artificial de error; el estado «pensando» depende de `/chatbot/consultas`. La sugerencia de Renta se sustituye por departamentos en venta. Los paneles y avatares ocultos quedan fuera del teclado; el diálogo enfoca la consulta, contiene el foco, cierra con Escape y devuelve el foco al disparador. Se conserva el selector compartido en lugar de incorporar el selector nativo del prototipo. [Últimos cambios originales](https://github.com/angggsoft/inmo/compare/ef8666a...f0b5362).

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
| Minimapa / interacción | Cámara cenital, proyección Mercator, zoom y centrado, controles de 44 px y gestos cooperativos que permiten recorrer el detalle | SDK real, tamaño del control y conservación del canvas tras cambios de tema |
| Mensajes / interfaz y archivo | Fondo ilustrado nuevo; lista con selección y acceso por teclado; archivo/recuperación confirmados con la versión real; filtros en portal y nombres de ambos participantes | Scroll y filtros táctiles en 390/820 px; adjuntos, lectura, archivo, 412 con borrador preservado y reconexión |
| Administración / chat | Pestañas uniformes conservadas y un único cierre de conversación. Archivo, mensajes y adjuntos existentes | Navegación protegida en ambos temas y tamaños; chat de ambos participantes |
| Asistente / interfaz nueva | Avatar animado y diálogo móvil/escritorio; sugerencias de Venta, envío real sin retardos ficticios, estado pendiente y botón deshabilitado durante la consulta; foco y Escape | Dos regresiones nuevas en 390/1440 px con respuesta real de API retenida sólo por la prueba, cierre y recuperación del foco |
| Inventario / guardar orden | La respuesta confirmada actualiza orden y versiones; conserva papelera y refresca fichas privadas sin volver a descargar todas las páginas y fotografías | Regresión unitaria de caché y recorridos de orden, fotografías, publicación y conflicto `412` |

Se conservan login único, JWT en memoria, `/me`, onboarding obligatorio, documentos privados, aprobación, pago confirmado por proveedor, ETags `"vN"`, recuperación manual de `412`, inventario y retirada con historial. Sin calificaciones, reseñas, Renta ni traspasos de propiedades. La PWA mantiene su caché de recursos estáticos.

## Validación y límites de la evidencia

Los comandos reproducibles son `npm test -- --maxWorkers=2`, `npm run lint`, `npm run build`, `npx playwright test` y `npx playwright test --config playwright.maps.config.ts`, con `E2E_API_URL=http://127.0.0.1:8002/api/v1`.

Resultados ejecutados en cada checkout:

| Control | Frontend propio | INMO copia |
| --- | --- | --- |
| Unitarias | 50 pruebas en 18 archivos | 50 pruebas en 18 archivos |
| Lint | 0 errores, 10 avisos | 0 errores, 10 avisos |
| Build | TypeScript, Vite y PWA correctos; 102 entradas de precaché | TypeScript, Vite y PWA correctos; 102 entradas de precaché |
| Navegador | 27 casos de mapas/touch y 42 de regresión | 27 casos de mapas/touch y 42 de regresión |
| Equivalencia | 101 archivos compilados comparados por SHA-256 con las mismas variables públicas | Sin diferencias con el build propio |

La ejecución completa de INMO copia detectó una espera excesiva al guardar el orden del inventario (41 casos correctos y uno fallido). Se corrigió la invalidación que recargaba páginas y fotografías sin cambios; se repitieron los tres recorridos afectados en ambos repositorios. Los recorridos táctiles se repitieron después de reservar espacio para el título y corregir el cierre tras scroll: un toque estacionario activa el botón una sola vez, mientras arrastres, pinch, cancelación y estado deshabilitado no lo activan. Estos reintentos se distinguen de las ejecuciones completas y no se contabilizan como casos adicionales.

Una repetición del recorrido completo de publicación alcanzó su límite de 60 segundos con cientos de fixtures acumulados en la papelera. Se hizo paginada la limpieza de propiedades sintéticas `Casa navegador` mediante archivo y retirada con historial, antes y después de esas pruebas. Con esa corrección de aislamiento, el mismo recorrido pasó en 19,1 segundos sin aumentar su límite. El servidor E2E comprueba que la base sea exclusiva de pruebas antes de ejecutar cualquier limpieza.

La nueva revisión detectó un selector de prueba con el texto antiguo de resultados y una comprobación que contaba también la vista previa del mensaje como duplicado del historial. Se corrigieron los selectores sin cambiar los contratos. También se detectó el solapamiento móvil del botón Portafolio con la navegación inferior y se reservó su espacio; la regresión mide ambos límites tras cargar el perfil real. Se distinguen las ejecuciones completas y los reintentos afectados: el frontend propio obtuvo 41/42 regresiones y después pasó el caso de chat corregido, y 24/25 mapas antes de pasar los dos recorridos de perfil móvil/tableta. INMO copia ejecutó de nuevo ambas suites completas: 25/25 mapas en 2,7 minutos y 42/42 regresiones en 3,4 minutos. No se cuentan reintentos como casos adicionales.


Tras los tres últimos commits se repiten, en ambos checkouts, los nueve casos afectados de perfil táctil, Mensajes, filtros y asistente, más la consulta de lenguaje natural contra la API aislada: todos pasan. El total de 69 casos distintos comprende las suites previas de 25 mapas y 42 regresiones, más dos casos nuevos del asistente; no se afirma que las 69 pruebas se hayan repetido juntas después de estos tres commits. La primera repetición detectó un avatar oculto todavía accesible y selectores que usaban el placeholder anterior: se corrigieron y se repitieron los casos afectados. Una ejecución unitaria simultánea con navegador agotó el límite de una prueba de editor (49/50); la suite completa pasó con dos workers, 50/50 en ambos repositorios, sin aumentar el límite ni alterar esa prueba.

Persisten diez avisos de lint relativos a efectos y exports de Fast Refresh, el aviso de tamaño del chunk del SDK de Mapbox y avisos de Recharts al medir paneles ocultos. No hubo excepciones de página en los recorridos táctiles. No se afirma una prueba en dispositivos físicos: se utilizaron Chrome, viewports y eventos táctiles nativos.

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
- Mensajes nuevos: [teléfono](evidence/integracion-mensajes-390.png) / [tableta](evidence/integracion-mensajes-820.png).
- [Mapa y detalle de escritorio](evidence/integracion-mapa-desktop.png), filtros [escritorio](evidence/integracion-filtros-desktop.png), [tableta](evidence/integracion-filtros-tablet.png) y [móvil oscuro](evidence/integracion-filtros-mobile-dark.png).

- Asistente nuevo: [teléfono](evidence/integracion-asistente-390.png) / [escritorio](evidence/integracion-asistente-1440.png).
