# Integración de la interfaz con la API V1

La capa de transporte y hooks se usa ya en las vistas principales. Los componentes mantienen el diseño atómico y los tokens Tailwind del proyecto.

## Organización

- `src/integrations/backend/` concentra el cliente Axios, DTO, servicios por módulo, políticas de reintento y adaptadores de datos públicos.
- `src/integrations/backend/hooks/` concentra TanStack Query, WebSocket y conciliación del historial de chat. Las vistas no hacen peticiones HTTP ni abren sockets directamente.
- `src/components/` sólo representa los estados y llama a esos hooks; los componentes completos se conservan en el proyecto con sus estilos Tailwind.

## Contratos y límites

- `VITE_API_BASE_URL` debe terminar en `/api/v1`. El JWT vive únicamente en memoria; nunca se guarda en `localStorage`, `sessionStorage` ni en la URL del WebSocket.
- El login entrega la cuenta y el token. `GET /me` es la fuente de estado autenticado; los claims JWT no autorizan vistas por sí solos.
- `GET /propiedades` (`API_014`) pagina el catálogo sin filtros. `POST /busquedas` (`API_033`) aplica filtros. Los DTO públicos no incluyen dirección ni coordenadas exactas.
- Los IDs BIGINT y los importes son cadenas. ETag se conserva como texto y se reenvía literalmente en `If-Match`.
- Las fotografías se cargan directamente a R2 con la URL y los headers firmados; el cliente Axios de la API no participa en el PUT y nunca envía el JWT a R2.
- El socket recibe `auth` inmediatamente al abrirse. Sólo `auth.ok` marca la sesión en tiempo real como conectada. Cada autenticación llama `onAuthenticated` para recuperar mensajes por REST con `after_sequence`; `mergeMessages` elimina duplicados por `(conversacion_id, secuencia)`.
- El publicador WSS del backend es de una sola instancia. La recuperación REST cubre desconexiones; no se promete entrega instantánea entre varias instancias.

## Estado de las vistas

- Login, registro general y de asesor y solicitud de recuperación usan la API. El JWT y el rol derivado de la cuenta viven sólo en memoria; recargar requiere iniciar sesión otra vez. Un 401 protegido borra la caché privada.
- Landing y mapa consultan propiedades reales; el primero pagina `GET /propiedades` y los filtros usan `POST /busquedas`. El chatbot usa `API_045`. Detalle y fotos usan endpoints reales. No se proyecta dirección ni coordenadas exactas. Los marcadores, cuando hay GeoJSON público de zona, son aproximados.
- Asesor dispone ahora de rutas para validación documental, suscripción/Checkout, propiedades y mensajes. El backend decide la habilitación; la UI presenta el requisito concreto si falta expediente o periodo pagado. Administración dispone de bandejas para solicitudes, cuentas, publicaciones, reportes, suscripciones y auditoría. Los contadores del resumen siguen representando **sólo la página cargada**.
- La confirmación de correo y recuperación de contraseña reciben el token enviado por Resend en rutas reales. La URL se limpia al abrir la vista. El retorno de Stripe muestra el estado del periodo sin conceder vigencia por sí mismo.
- El mapa usa Mapbox GL JS con token público `VITE_MAPBOX_PUBLIC_TOKEN` y geometría aproximada. Si falta el token o Mapbox falla, los resultados de la lista permanecen disponibles.
- Mensajería muestra conversaciones e historial REST reales y envía por `API_044`. También consume `message.created`/`message.ack`; al autenticarse o reconectar recupera los mensajes posteriores a la última secuencia por REST y fusiona los resultados por identidad compuesta. El envío confirmado por REST se muestra aunque falle la entrega WSS.
- La portada y la muestra de tarjeta del UI Kit usan datos y fotografías reales del catálogo; cuando no hay fotografía, la portada muestra un fondo de marca. No quedan URLs de fotografías de inventario de ejemplo.
- Favoritos expone un estado vacío honesto: V1 no tiene recurso de favoritos. Se eliminó `mockProperties.ts` y no quedan importaciones.
- El pago simulado con tarjeta se retiró. El Checkout sólo debe iniciarse desde el flujo autenticado de suscripciones. Las pantallas heredadas de documentación/OTP no son un flujo de pago real.

## Pendientes explícitos

- El piloto local sin correo usa `VITE_LOCAL_PILOT_NO_EMAIL=true` sólo con Vite en localhost y el arranque backend aislado descrito en `../../PILOTO_LOCAL_SIN_CORREO.md`; no equivale a confirmación real.

- Conectar paginación visual completa en paneles y mensajes; actualmente se indica cuando hay `next_cursor`.
- Añadir paginación visual para mensajes antiguos; la recuperación por `after_sequence` ya cubre mensajes nuevos perdidos durante desconexiones.
- Probar positivamente selección de plan→Checkout→webhook→periodo y revisión documental con R2/Stripe sandbox desde navegador. La UI y los adaptadores están conectados, pero esa evidencia completa aún falta.
- Configurar Mapbox con token restringido al dominio y facturación controlada; confirmar visualmente marcadores en un navegador con token válido.
- Para probar confirmación de correo extremo a extremo hace falta Resend y dominio verificado; `EMAIL_PROVIDER=memory` no entrega mensajes.

## Verificación

- `npm test`: 13 pruebas aprobadas; incluyen Bearer, 401/Problem Details, PUT R2 sin JWT, deduplicación, WSS, recuperación del historial, proyección privada de tarjeta y posición aproximada de zona.
- `npm run build`: TypeScript y Vite aprobados.
- `npm run lint`: aprobado con avisos preexistentes del UI Kit y AppContext (sin errores).
- `npm run test:e2e -- e2e/local-pilot.spec.ts`: 4 recorridos aprobados en Chrome para registro/login y navegación de roles; son adicionales a la evidencia histórica de `../../VALIDACION_E2E_FRONT_BACKEND_PROVEEDORES.md`.
