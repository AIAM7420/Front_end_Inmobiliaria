# Integración con API V1

La matriz vigente de pantallas, endpoints, procedencia y decisiones está en [INTEGRACION_INTERFAZ.md](INTEGRACION_INTERFAZ.md). La evidencia ejecutada se mantiene en [docs/VERIFICACION_INTEGRACION.md](docs/VERIFICACION_INTEGRACION.md).

`src/integrations/backend` concentra transporte, DTO y servicios. Los hooks de TanStack Query conectan las vistas. El JWT se almacena en memoria; una respuesta 401 limpia la sesión y los datos privados. Los IDs e importes conservan el formato de cadenas del contrato.

La versión real del cuerpo genera `If-Match: "vN"`. Un conflicto 412 conserva los cambios, permite consultar el recurso vigente y exige revisión explícita antes de reenviar. No se reintentan automáticamente mutaciones.

Las cargas firmadas a R2 utilizan un cliente independiente, sin JWT. El mapa sólo usa geometría pública aproximada y muestra la lista cuando Mapbox no está configurado.

El socket recibe el token en el frame inicial `auth`, nunca en la URL. `auth.ok` activa recuperación REST; la fusión del historial elimina duplicados por conversación y secuencia. La infraestructura de publicación del backend sigue limitada a una instancia.

La API normal local se configura con `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1`. El puerto 8001 y las opciones `VITE_LOCAL_*` se reservan para pilotos aislados y se desactivan en producción. Los hosts productivos deben confirmarse antes del build.

El retorno de Checkout no acredita un pago: se espera conciliación del webhook. Stripe sandbox, R2 y correo real requieren configuración explícita y su verificación no debe confundirse con proveedores en memoria.
