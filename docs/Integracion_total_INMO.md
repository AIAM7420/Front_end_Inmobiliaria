# Integración total de la interfaz INMO

Referencia visual: [angggsoft/inmo, 01295be](https://github.com/angggsoft/inmo/tree/01295bee792791081933a936c51d820f0b6877d3). Se usa la skill [estilo-inmo](../agent/skills/estilo-inmo/SKILL.md), sus recursos y Atomic Design. Código de aplicación único para `AIAM7420/Front_end_Inmobiliaria` y `angggsoft/inmo`; backend `AIAM7420/Back_end_Inmobiliaria`. Las entregas anteriores se conservan como documentos históricos, no como estado de esta ampliación.

## Matriz pantalla → acción → endpoint → evidencia

Todos los endpoints pertenecen a `/api/v1`. `UI` refiere a Playwright contra FastAPI/MySQL reales y proveedores de memoria; `SQL` a regresiones aisladas del backend. Los nombres de pruebas corresponden a archivos versionados, no a llamadas a proveedores externos.

| Pantalla / panel / control | Función real y endpoint | Evidencia ejecutada |
| --- | --- | --- |
| `NavHeader`, `FloatingNavBar`, menú de usuario | Rutas por rol obtenido de `GET /me`; catálogo general separado de inventario propio; perfil y cierre de sesión | UI `inmo-screens`, `real-api`, 3 roles, 3 tamaños, 2 temas |
| Desbordamiento administrativo móvil/escritorio | Usuarios, Publicaciones, Finanzas, Autorizaciones, Reportes y Sistema; sin colisión con el logotipo | UI `inmo-screens`; menú móvil operado con botones accesibles |
| Login | Correo/contraseña reales, `POST /sesiones`, `GET /me`, JWT sólo en memoria; un botón autorizado | UI `real-api`; unitarias `auth`; regiones estáticas en `reference-audit.json` |
| Registro / tipo de cuenta | Cliente `POST /cuentas`, asesor `POST /asesores`; confirmación requerida | UI `real-api`; SQL identidad y asesores |
| Alta profesional `/registro-asesor` | Datos → documentos → autorización → plan/Checkout → periodo confirmado; guarda del panel, reanudación y rechazo con expediente nuevo | UI `advisor-onboarding`, escritorio claro/móvil oscuro, `412` real y enlaces directos; [contratos y capturas](Alta_asesor_verificacion.md) |
| Confirmación / recuperación / nueva contraseña | `/auth/correo/confirmar`, `/auth/password/recuperar`, `/auth/password/restablecer`; tokens reales y mensajes seguros | SQL identidad; unitarias de autenticación. Entrega de correo externa a cargo del usuario |
| Landing `/`, catálogo `/inmuebles` | Hero con inmueble real o estado vacío; tarjetas, fotos, tipos, filtros, paginación: `/propiedades`, `/busquedas`, `/catalogos/*` | UI `real-api`, `interface-review`, `integrated-flows`; SQL engagement |
| Búsqueda libre / chatbot | `/chatbot/consultas` → criterios estructurados → búsqueda paginada completa; no resultados ficticios ni Renta | UI `real-api`; unitarias `chatbotCriteria` |
| Detalle de propiedad | Ficha, amenidades, fotos y URLs reales `/propiedades/{id}`; visita `/eventos/vistas`; ubicación pública aproximada | UI inventario/contacto; SQL engagement y propiedades |
| Perfil del asesor / portafolio | `/asesores/{id}`, `/asesores/{id}/propiedades`; nombre comercial, validación, incorporación, foto y contacto | SQL engagement/privacidad; componentes conectados y estilos de la referencia |
| Mapa `/map`, lista, tarjetas, filtros y mini mapa | Mapbox con distribución responsive; resultados paginados y selección; mismas fichas/contacto. Alternativa de lista sin token | UI 3 tamaños/2 temas y filtros; Mapbox remoto a cargo del usuario |
| Comisión compartida | Sólo asesores/admin; `PUT /me/propiedades/{id}/comision`, consulta profesional; ocultación en respuestas de visitante/cliente | UI `property-workflow`; SQL permisos/engagement/inventario |
| Contacto cliente → asesor | `POST /conversaciones` con `CLIENTE_ASESOR` y propiedad; navegación directa protegida | UI `integrated-flows`, contacto desde catálogo → chat |
| Contacto asesor → asesor | `ASESOR_ASESOR` con asesor destino; autocontacto bloqueado; admin ofrece moderación | SQL chat/engagement; `AdvisorContact` comparte el flujo del catálogo/mapa |
| Favoritos `/favorites`, botones de corazón | GET/PUT/DELETE `/me/favoritos/{id}`, listado paginado `/me/favoritos`; persistencia por cuenta | UI `integrated-flows`; SQL favoritos idempotentes y retirada |
| Chats `/messages`, `/asesor/mensajes` | `/conversaciones`, `/conversaciones/{id}`; nombres reales, búsqueda, filtros y páginas | UI `integrated-flows`, `real-api`; SQL aislamiento de participantes |
| Historial / envío / reconexión | `/conversaciones/{id}/mensajes`, UUID, secuencia, WebSocket autenticado, heartbeat y recuperación REST | UI envío entre dos sesiones y mensaje perdido recuperado una sola vez; unitarias stream/socket; SQL chat |
| Lectura / archivo / recuperación | `/conversaciones/{id}/lectura`, `/estado`; lectura monotónica, archivo personal con versión, sin borrar historial | UI `integrated-flows`; SQL chat y CAS |
| Adjuntos y descarga | `/conversaciones/{id}/adjuntos/autorizaciones`, `/archivos/confirmaciones`, `/archivos/{id}/url`; PUT directo sin JWT, PDF/JPEG/WebP ≤5 MB | UI adjunto privado entre dos participantes, admin denegado; SQL y unitarias medios |
| Panel asesor `/asesor`, periodos, Ranking y Portafolio | `/me/estadisticas`, `/me/propiedades/ranking`; visitas, contactos, favoritos, mensajes, estados, tipos, valor anunciado y zonas reales | UI `inmo-screens`; SQL engagement; no ventas cerradas ni cifras de demostración |
| Notificaciones asesor/admin | `/me/notificaciones` y lectura por ID; contador de recibidas sin leer y errores reales | UI `real-api`; SQL matching, trabajos de correo y preferencias |
| Mi inventario `/asesor/propiedades` | `/me/propiedades`, páginas completas, búsqueda, scroll propio, orden manual; nunca propiedades de otros asesores | UI inventario largo en escritorio/móvil; SQL permisos y cursor |
| Asistente de nueva propiedad | Catálogos reales, dirección/CP privados, Venta MXN, `POST /propiedades` | UI creación completa en `property-workflow` |
| Editor / disponibilidad / estados | PATCH propio, disponibilidad, `/publicacion`; reglas reales, versión vigente y conflicto con revisión | UI guardar → foto → publicar y `412`; SQL inventario |
| Fotografías / orden / eliminación | Autorización → PUT sin JWT → confirmación; consulta de versión nueva; `/fotografias/orden` y DELETE con versión | UI dos fotos, reordenación y eliminación; SQL estado publicado/foto mínima |
| Papelera / recuperar / retirar definitivamente | DELETE propio, recuperación como borrador, `/retiro`; fotos retiradas y conversaciones/reportes conservados | UI flujo completo y cancelación; SQL limpieza física/reintentos/historial |
| Perfil personal, foto y perfil público profesional | PATCH `/me`, avatar autorizado/confirmado y PUT `/me/fotografia`; PATCH `/asesores/me/perfil` | UI borrador conservado tras `412`; SQL avatar, sustitución y limpieza |
| Expediente asesor | Solicitud propia, carga/confirmación directa privada y nueva solicitud tras rechazo; V2 ID+fiscal obligatorios, licencia opcional | SQL `test_inmo_security_media_mysql`; UI panel en 6 configuraciones; contratos V1 conservados |
| Suscripción / planes / confirmación / pagos | `/planes`, `/me/seleccion-plan`, `/me/pagos`, suscripción actual, Checkout y Portal; versión e idempotencia real | SQL fase 4 y engagement; UI pantalla en 6 configuraciones; Stripe externo a cargo del usuario |
| General | GET/PUT `/me/preferencias`, tema y alertas persistidas; español/CDMX | UI preferencias claras/oscuras y CAS; SQL operaciones |
| Seguridad / baja permanente | PUT `/me/contrasena`, POST `/me/baja-permanente`; contraseña actual, revocación y baja terminal con conservación de historial | SQL operaciones/retirement; paneles conectados, confirmación y revisión de conflicto |
| Ayuda / soporte | `/ayuda`, `/me/soporte`, respuestas e historial con UUID y versión; nombres reales | UI solicitud → respuesta administrativa persistida → consulta; SQL soporte y conflictos |
| Panel admin `/admin`, métricas y periodos | `/admin/estadisticas`; ingresos confirmados MXN, usuarios, suscripciones, tráfico/contactos y pendientes reales | UI 6 configuraciones; SQL engagement/finanzas |
| Usuarios `/admin/asesores`, Activos/Suspendidos, detalle | `/admin/cuentas`, resumen real, filtros de texto/estado, detalle y cambio de estado con motivo/versión | UI pantallas y CSV filtrado; SQL operaciones/permisos/baja terminal |
| Autorizaciones `/admin/solicitudes`, pestaña en Usuarios y acceso principal | Solicitudes, expediente privado, URLs temporales y decisión con motivo/versión; sin tocar aprobaciones V1 | SQL expediente → autorización/rechazo → nueva solicitud; UI pestaña/menú independiente |
| Publicaciones `/admin/moderacion`, filtros, ficha y moderación | `/admin/propiedades`, fotografías administrativas protegidas, decisiones versionadas y motivo | UI pantallas; SQL administración y privacidad de fotos pausadas |
| Finanzas `/admin/finanzas` | Pagos confirmados y suscripciones paginados; ingresos reales, filtros y CSV | SQL engagement/operaciones; UI 6 configuraciones |
| Reportes `/admin/reportes`, filtros, detalle y decisión | `/admin/reportes`, filtros texto/tipo/estado, revisión con versión; CSV de resultados | SQL administración/operaciones; UI 6 configuraciones |
| Perfil admin / configuración | Credenciales reales; `/admin/sistema`, `/admin/configuracion/{clave}`; nombre/aviso permitidos | SQL configuración, CAS y sanitización; UI perfiles/paneles |
| Logs/API y auditoría | Diagnóstico actual API/MySQL y proveedores configurados; `/admin/sistema/eventos` paginado y sin secretos | SQL operaciones; UI paneles, errores y actualización |
| Respaldos privados | POST/GET `/admin/respaldos`, descarga temporal con contraseña; estado de trabajo persistido | UI creación de trabajo `202`; SQL creación, fallo/reintento, lease y recuperación en base aislada |
| Soporte administrativo | `/admin/soporte`, respuestas y transición de estado con historial | UI respuesta recuperada por cliente; SQL soporte |
| Exportaciones | `/admin/exportaciones/{usuarios,publicaciones,pagos,suscripciones,reportes}.csv`, mismos filtros y protección de fórmulas | UI descarga CSV con filtro comprobado; SQL exportación y permisos |
| Modales, paneles, filtros y errores | Confirmación cancelable, scroll independiente, foco/teclado, estados vacíos reales; conflictos no reenvían mutaciones | UI `interface-review`, `profile-settings`, `property-workflow`; unitarias modal/editor |
| PWA | Caché de recursos estáticos, exclusión API/documentos/respuestas autenticadas | Build PWA y configuración versionada; JWT no persistido comprobado en navegador |
| UI Kit | Referencia de desarrollo; ruta y acceso ocultos en build productivo | Guardas `import.meta.env.DEV`; no se publica como flujo de negocio |

## Fidelidad y diferencias deliberadas

Se conservan contenedores, tipografías, colores, tarjetas, paneles, píldoras, sombras y estructuras del commit de referencia. Se corrigieron la altura del selector de periodo, la superposición de enlaces/logotipo del administrador y el buscador (fondo oscuro, estructura, botón de búsqueda y limpieza), conservando valor controlado y consultas reales.

`evidence/fidelity/reference-audit.json` registra **12 comparaciones con cero píxeles distintos y mismas coordenadas**: logo y campo de contraseña en 1440×900, 820×1180 y 390×844, claro/oscuro. Se generaron **96 capturas de referencia** (16 rutas × 6 configuraciones) y **186 de rutas/paneles integrados** (31 × 6), además de evidencia de los flujos. Se revisan las regiones comparables; no se afirma una certificación automática de igualdad píxel por píxel para toda la aplicación.

Cambios acordados respecto al prototipo: login único real; sin Google simulado; eliminación de reseñas/estrellas/calificaciones y Renta; datos, fechas, contadores y gráficas reales; estados vacíos/errores; navegación adicional y desbordamiento; autorizaciones independientes; nuevas capacidades persistidas; ubicación aproximada y Mapbox; medios privados; controles nuevos con áreas táctiles accesibles. Las cifras ficticias, fotografías externas de demostración y tiempos artificiales de carga no se reproducen. En vistas sin token del mapa se muestra la lista y un estado explícito; las pruebas no acreditan tiles externos.

Las capturas de referencia incluyen exclusivamente datos del prototipo para compararlo, no están importadas en la aplicación. Todas las capturas de la integración contienen datos sintéticos de una base de pruebas. No hay clientes reales ni documentos personales en la evidencia.

## Comprobaciones y límites reales

Entrega base del 2026-10-04: **24 pruebas unitarias** en 12 archivos; lint sin errores, ocho advertencias de efectos/Fast Refresh; TypeScript/Vite/PWA aprobados. **39 pruebas de navegador** aprobadas conjuntamente contra API real y MySQL aislado. Backend: **297 aprobadas, 3 omitidas, cobertura 93,15 %**, Ruff/mypy/arquitectura aprobados. Contratos y migraciones en `docs/Integracion_total_INMO.md` del backend.

Corrección posterior del alta de asesores, 2026-10-04: **32 unitarias y 42 pruebas de navegador aprobadas en cada frontend**, lint/build/PWA aprobados; **245 unitarias del backend** y Ruff del arnés aprobados. [Recorrido, contratos iniciales y nueva evidencia](Alta_asesor_verificacion.md). Las capturas de fidelidad de la entrega base se conservan como evidencia histórica; las seis nuevas capturas documentan documentos, revisión y planes del alta real.

Las pruebas de medios redirigen únicamente el transporte externo `objects.test` al almacenamiento del arnés local; autorización, hashes, confirmación, permisos, versiones, publicación, conversación y persistencia utilizan el backend real. Se comprobó explícitamente que no se manda JWT al PUT de objetos. El arnés no se registra en la aplicación productiva.

Advertencias visibles: chunk Mapbox de aproximadamente 1,84 MB minificado, cargado por vistas de mapa; Recharts puede avisar tamaño cero al cerrar/montar un panel oculto en móvil. No hubo excepciones de página en la matriz de pantallas y los flujos de inventario comprueban ausencia de errores de consola. Los rechazos HTTP previstos por pruebas negativas no son fallos de aceptación.

Stripe sandbox externo, entrega de correo, R2 remoto/CORS y Mapbox con token válido **los probará el usuario en Railway**, según su instrucción. No se accedió a Railway ni se modificaron sus variables. Esas pruebas no se presentan como ejecutadas aquí. Mantener `APP_ENV=staging` con clave sandbox; primero sincronizar backend a EAM16 y después ambos frontends. API local normal `8000/api/v1`; piloto `8001`; arnés aislado usado aquí `8002`.

## Reproducción local

Instalar dependencias con `npm ci`. Preparar exclusivamente `TEST_DATABASE_URL`, distinta de la base normal; ejecutar las regresiones/migraciones del backend y `python -m tests.e2e.seed_browser --reuse-phase4-professional --clear-memory-photos`. Iniciar `E2E_PORT=8002 python -m tests.e2e.local_server`; nunca resetear esa base mientras se ejecutan pruebas de navegador.

```powershell
$env:E2E_API_URL='http://127.0.0.1:8002/api/v1'
$env:E2E_FRONTEND_PORT='5180'
$env:VITE_API_BASE_URL='http://127.0.0.1:8002/api/v1'
npm run test:e2e
npm test
npm run lint
npm run build
```

Para la comparación del login, ejecutar la referencia `01295be` aparte, sin variables privadas, y `node tools/compare-login.mjs --reference=http://127.0.0.1:5174 --integrated=http://localhost:5173`. Para las 96 capturas originales: `node tools/capture-reference.mjs --reference=http://127.0.0.1:5174`. Los JSON y capturas versionados delimitan exactamente las regiones verificadas.

Backend compatible publicado y fusionado: [PR #4](https://github.com/AIAM7420/Back_end_Inmobiliaria/pull/4). La integración del frontend propio se entrega en [PR #3](https://github.com/AIAM7420/Front_end_Inmobiliaria/pull/3); la misma aplicación se entrega también en `angggsoft/inmo`, después del backend. Las variables privadas locales no se copian: un checkout nuevo debe configurar `VITE_API_BASE_URL` para desarrollo, pruebas unitarias y build.
