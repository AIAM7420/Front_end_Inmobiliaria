# Correcciones de filtros, mapas, chat y galería

Referencia visual: `angggsoft/inmo` commit `01295be`. Se conservan colores, tipografía y componentes de `estilo-inmo`; cambian los comportamientos solicitados y la posición de la galería. Por instrucción del usuario del 2026-10-05, esta entrega se publica únicamente en `AIAM7420/Front_end_Inmobiliaria`. La fusión con la nueva interfaz de INMO copia queda para una etapa posterior; no se publica una rama ni un PR en ese repositorio.

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

## Resultados ejecutados

Backend compatible: [PR #6 fusionado a main](https://github.com/AIAM7420/Back_end_Inmobiliaria/pull/6), 310 pruebas aprobadas, tres omitidas y cobertura 93,21 %. Ruff, mypy y contratos de arquitectura aprobados. Sin migraciones ni endpoints nuevos.

Frontend propio, 2026-10-05: 39 pruebas unitarias aprobadas; regresión completa de 42 pruebas de navegador aprobada contra API y MySQL aislados. Lint sin errores, con ocho advertencias existentes de efectos/Fast Refresh; build TypeScript/Vite/PWA aprobado, con advertencia existente por el tamaño del SDK Mapbox. La PWA mantiene caché estática sin respuestas de API ni documentos privados.

Ocho pruebas específicas de mapas aprobadas (50 pruebas de navegador en total): filtros en escritorio/tableta/móvil, conservación de cámara y selección después de cuatro cambios de tema, distribución real, cierre único del chat, recuperación del estilo fallido, scroll y ciclo de foco con viewport móvil de 320 px de alto, y mapa general para una propiedad publicada sin coordenadas. Se usan estilos locales retrasados con el SDK real; no se afirma haber probado el proveedor remoto.

Capturas sintéticas en `docs/evidence/bugs-filtros-{desktop,tablet,mobile}.png`, `bugs-distribucion.png`, `bugs-chat-{1440,390}.png` y `bugs-mapa-galeria.png`. Las capturas históricas de la integración anterior se conservan.

Para reproducir, iniciar el arnés de pruebas aislado del backend y ejecutar:

```powershell
$env:E2E_API_URL='http://127.0.0.1:8002/api/v1'
npm test
npm run lint
npm run build
npx playwright test
npx playwright test --config playwright.maps.config.ts
```

Sincronizar el backend a EAM16 antes del frontend propio. Mantener `APP_ENV=staging` y Stripe sandbox para la comprobación externa del usuario.
