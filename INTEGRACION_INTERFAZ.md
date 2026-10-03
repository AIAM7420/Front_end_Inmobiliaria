# Integración de interfaz INMO y API V1

## Procedencia y alcance

Base del frontend: `5149ce2`, repositorio `AIAM7420/Front_end_Inmobiliaria`.
Interfaz de referencia: `angggsoft/inmo`, commit `01295bee792791081933a936c51d820f0b6877d3`.
Backend de referencia: `AIAM7420/Back_end_Inmobiliaria`, commit `1596908`.

Se portaron selectivamente tokens, componentes atómicos, navegación, paneles divididos, hojas móviles, tarjetas, asistente, inventario y perfiles. Se conservaron servicios y hooks reales. Los paneles administrativos se adaptaron al diseño de referencia y al dominio V1. No se importaron `.env`, servicios simulados, autenticación ficticia, scripts de recuperación ni archivos generados. Los documentos de estilo y recursos de `agent/skills/estilo-inmo` orientan el diseño; los contratos de la API prevalecen sobre ejemplos del prototipo.

## Matriz de pantallas y contratos

Todas las rutas de API indicadas tienen prefijo `/api/v1`.

| Pantalla | Función | Endpoint | Integración |
| --- | --- | --- | --- |
| Inicio | Catálogo paginado, detalle, fotografías | `GET /propiedades`, `/propiedades/{id}`, `/propiedades/{id}/fotografias` | API real; carrusel y panel de detalle |
| Inicio / mapa | Filtros y búsqueda natural | `POST /busquedas`, `/chatbot/consultas` | API real; aclaraciones y vacíos explícitos |
| Mapa | Marcadores aproximados | Geometría pública del catálogo; Mapbox | Sin dirección ni coordenadas privadas; lista utilizable sin token |
| Acceso | Registro, login, confirmación, recuperación | `/cuentas`, `/asesores`, `/sesiones`, `/auth/correo/confirmar`, `/auth/password/*` | API real; correo externo pendiente de verificación en entorno configurado |
| Perfil | Datos de cuenta y cierre de sesión | `GET/PATCH /me`, `DELETE /sesiones/actual` | Perfil por rol; revisión explícita de conflictos |
| Asesor / validación | Expediente y documentos | `/me/solicitud-asesor`, `/me/documentos/*` | Carga firmada y confirmación real; sin datos de demostración |
| Asesor / suscripción | Plan, Checkout, portal y retorno | `/planes`, `/me/suscripcion`, `/me/seleccion-plan`, `/me/pagos`, `/me/pagos/portal` | API real; vigencia concedida por webhook |
| Asesor / inventario | Crear, editar, fotos, publicación, disponibilidad, comisión | `/me/propiedades`, `/me/propiedades/{id}` y subrecursos | Asistente y editor con versiones reales; autorización del backend |
| Asesor / inventario | Coincidencias inversas | `/me/propiedades/{id}/coincidencias` | API real; estado vacío |
| Asesor / resumen | Portafolio, capacidad y notificaciones | `/me/propiedades`, `/me/suscripcion`, `/me/notificaciones` | Contadores de página cargada; sin rankings inventados |
| Mensajes | Conversaciones e historial, envío | `/me/conversaciones`, `/me/conversaciones/{id}/mensajes`, `/ws/chat` | REST y WebSocket; autenticación en primer frame y recuperación REST |
| Administración / solicitudes | Revisión y documentos | `/admin/solicitudes-asesor` y subrecursos | Revisión, razón y control de concurrencia |
| Administración / cuentas | Estado y permisos | `/admin/cuentas` y subrecursos | API real; edición condicionada por versión |
| Administración / moderación | Publicaciones | `/admin/propiedades` y subrecursos | API real; razones obligatorias |
| Administración / reportes | Resolución de reportes | `/admin/reportes` y subrecursos | API real; no resolución simulada |
| Administración / finanzas | Suscripciones y auditoría | `/admin/suscripciones`, `/admin/auditoria` | Paginación real; sin métricas globales ficticias |
| Favoritos / valoraciones / rankings | Funciones sin recurso V1 | Ninguno | Estado honesto; acciones no operativas ocultas |

`/admin/cuentas` redirige a `/admin/asesores`; `/admin/propiedades` a `/admin/moderacion`. Se retiraron `ProfileView`, `AdvisorPropertiesView` y `PlaceholderTemplate` después de migrar sus funciones. La confirmación y recuperación permanecen en rutas propias compatibles con los enlaces de correo.

## Concurrencia, privacidad y PWA

Los IDs e importes se conservan como cadenas. El `If-Match` se calcula desde la versión real del recurso con formato `"vN"`. Guardar, confirmar fotografías o cambiar estado invalida la consulta para obtener la versión vigente. No hay reintento automático de mutaciones. Un `412` conserva el borrador y bloquea el guardado hasta consultar y aceptar la revisión; no sobrescribe ni reenvía automáticamente.

Confirmar una fotografía no incrementa por sí solo la versión de la propiedad en V1. La ficha se vuelve a consultar y la publicación utiliza el valor real resultante; nunca se presupone un incremento numérico.

El JWT vive en memoria. El cliente de R2 es independiente del cliente autenticado y nunca recibe su JWT. La PWA precachea únicamente archivos estáticos; no tiene reglas de caché de API ni documentos privados. El fallback de navegación excluye `/api/`. Las actualizaciones usan registro `prompt` para evitar recargar automáticamente un formulario.

La API normal local utiliza `http://127.0.0.1:8000/api/v1`; `8001` corresponde exclusivamente al piloto aislado. Los dominios de producción deben confirmarse antes del build. Las variables `VITE_*` son públicas: sólo token público restringido de Mapbox y configuración no secreta.

## Verificación

Los resultados ejecutados y dependencias pendientes se registran en `docs/VERIFICACION_INTEGRACION.md`. El build conserva un chunk grande de Mapbox cargado bajo demanda. La entrega no incluye fusión a main ni despliegue productivo.
