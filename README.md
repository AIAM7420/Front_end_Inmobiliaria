# Excelencia Inmobiliaria — frontend

React, TypeScript y Vite. La capa de API y hooks vive en `src/integrations/backend`.

## Local

Configura `VITE_API_BASE_URL=http://127.0.0.1:8001/api/v1` en `.env.local`
para el piloto aislado, o usa el puerto de tu backend normal. Si usas el launcher
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
