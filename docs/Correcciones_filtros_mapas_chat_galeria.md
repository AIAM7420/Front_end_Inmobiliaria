# Correcciones de filtros, mapas, chat y galería

Referencia visual: `angggsoft/inmo` commit `01295be`. Se conservan colores, tipografía y componentes de `estilo-inmo`; cambian los comportamientos solicitados y la posición de la galería. La misma entrega se publica en ambos repositorios de frontend.

| Problema | Corrección | Comprobación |
| --- | --- | --- |
| Los filtros deformaban la píldora del navbar | Panel mediante portal fuera del flujo y de sus contextos de transformación; ancho máximo 360 px limitado al viewport, scroll, Escape, cierre exterior y foco recuperado | Filtros desde Mensajes, catálogo y mapa en escritorio/tableta/móvil; altura constante y consulta real |
| Catálogo y mapa perdían criterios al navegar | Criterios únicos del contexto, incluyendo sector, tipo y precio; navbar abre `/inmuebles` | API y controles mantienen valores al cambiar de pantalla |
| Mapa blanco al cambiar el tema | Instancia persistente; `setStyle`, estado de carga, fuentes/capas tras `style.load`, eventos con instancia vigente y `ResizeObserver` | SDK real de Mapbox con estilos locales retrasados, alternancia y recuperación explícita |
| Distribución vacía dependía del primer inmueble de una zona | Cuatro sectores con inventario actual, visitas del periodo y cuadrículas aproximadas agrupadas | Estadísticas reales y navegación al mapa por sector |
| Dos cierres superpuestos en chat | El contenedor oculta sus cierres; se conserva «Cerrar conversación» | Un único cierre visible en escritorio y móvil; archivo/adjuntos conservados |
| Detalle sin mapa aunque la búsqueda tenía ubicación | El backend incorpora geometría pública coherente; durante la consulta se indica carga | Mapa aproximado en detalle; ausencia de coordenadas/dirección privadas |
| Galería al final de la descripción | Miniaturas justo debajo de la fotografía principal, antes de los datos, con selección y scroll | Cero, una y varias fotografías; selección de otra fotografía |

## Sectores y propiedades sin ubicación

Clasificación realizada exclusivamente por el backend desde 21.135, −101.680. Norte/Sur/Este/Oeste son sectores operativos, no límites oficiales. Se conserva `zona_id`. La distribución indica inmuebles actuales y visitas del periodo seleccionado; las visitas históricas pueden permanecer aunque el inmueble se retire. Se muestran los totales sin ubicación.

Si faltan coordenadas, la propiedad permanece publicada y el detalle muestra el mapa general de León con el aviso para completar su ubicación. Con ubicación, se usa únicamente la aproximación pública de aproximadamente 2 km. El propietario y la moderación conservan su ubicación privada en las vistas autorizadas.

## Evidencia local y proveedores

`playwright.maps.config.ts` ejecuta el SDK real de Mapbox y WebGL con estilos mínimos locales interceptados y un token deliberadamente sintético. Las propiedades, fotografías, filtros, conversaciones y estadísticas usan la API real y MySQL de pruebas; el transporte de archivos usa el proveedor en memoria del servidor E2E. Esto verifica el ciclo de vida del SDK, **no** el acceso remoto a Mapbox, R2, correo ni Stripe.

Las pruebas externas en Railway corresponden al usuario, con `APP_ENV=staging` y Stripe sandbox. Publicar/sincronizar primero el backend compatible. Esta entrega no accede a Railway ni cambia sus variables.

Resultados y capturas ejecutados se registran al completar la validación.
