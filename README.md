# Excelencia Inmobiliaria — frontend

React, TypeScript y Vite. La capa de API y hooks vive en `src/integrations/backend`.

Integración: [matriz de pantallas, contratos, procedencia, pruebas y capturas](./docs/Integracion_total_INMO.md). Referencia visual `01295be`. La entrega actual se publica sólo en `AIAM7420/Front_end_Inmobiliaria`; INMO copia conserva los cambios de su equipo.

Alta de asesores: [cuenta → correo → documentos → aprobación → suscripción → panel](./docs/Alta_asesor_verificacion.md). El expediente pendiente se completa desde `/registro-asesor` antes de acceder al panel profesional.

Si la PWA conserva una pantalla anterior, consulta [actualización del frontend y prueba con build productivo](./docs/Actualizacion_PWA_alta.md).

Correcciones actuales: [filtros, sectores, mapas, chat y galería](./docs/Correcciones_filtros_mapas_chat_galeria.md).

Nueva interfaz incorporada: [desplegables con estilo INMO, pestañas uniformes, marcadores y footer](./docs/Desplegables_e_integracion_interfaz.md), incluyendo los commits `38fed41` y `6a4c88e` de INMO copia.

## Local

Configura `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1` en `.env.local`
para la API normal. Reserva `http://127.0.0.1:8001/api/v1` para el piloto aislado. Si usas el launcher
local sin correo, añade `VITE_LOCAL_PILOT_NO_EMAIL=true`; **nunca** en producción.
`VITE_MAPBOX_PUBLIC_TOKEN` es opcional para ver el mapa local. Usa un token público
separado del de producción; la lista de inmuebles funciona sin él.

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm test
npm run build
```

Para recorridos de navegador con el backend piloto y la base E2E aislada activos:

```sh
npm run test:e2e -- e2e/local-pilot.spec.ts
```

## Railway

El servicio frontend usa este directorio como root y el `Dockerfile` local.
Configura `VITE_API_BASE_URL=https://<HOST_API>/api/v1` con el host HTTPS real,
`VITE_MAPBOX_PUBLIC_TOKEN` restringido por URL, y
`VITE_LOCAL_PILOT_NO_EMAIL=false` **antes del build**. El contenedor sirve la SPA
con Caddy y reenvía rutas del navegador a `index.html`. No pongas secretos en
variables `VITE_*`: quedan públicos en el JavaScript compilado.
# Integración de interfaz

La interfaz de `angggsoft/inmo@01295be` se adapta a los servicios reales V1. Consulta [procedencia y matriz](INTEGRACION_INTERFAZ.md) y [resultados de pruebas](docs/VERIFICACION_INTEGRACION.md).
