# Alta de asesor y actualización de la PWA

## Incidencia observada

El 2026-10-04 se consultaron únicamente el HTML público y sus archivos JavaScript de `https://frontendinmobiliaria-staging.up.railway.app/admin`. El recurso `index-C7i6SrmJ.js` ya contenía la ruta `/registro-asesor`, la guarda del panel y la aceptación explícita de la versión inicial `"v0"`. Las capturas del usuario mostraban el comportamiento anterior: panel accesible y rechazo de la versión inicial del expediente.

La configuración anterior de la PWA conservaba el HTML de la aplicación y esperaba una actualización manual sin ofrecer un control para aceptarla. La caché antigua es una explicación compatible con las capturas; no se inspeccionó el navegador del usuario y no se afirma que sea un diagnóstico confirmado de su sesión.

## Corrección

- El nuevo worker se activa y toma el control, eliminando la caché antigua. Sólo precarga recursos estáticos; HTML, API y documentos privados no se guardan. La navegación consulta el HTML desplegado.
- Caddy entrega el HTML y el worker con `Cache-Control: no-cache`. Los archivos compilados conservan nombres con hash.
- Una actualización muestra «Actualizar aplicación». No se recarga automáticamente ni se modifica el formulario. El aviso indica guardar primero y que será necesario iniciar sesión de nuevo; el JWT permanece en memoria.
- Se conserva la guarda: expediente aprobado y periodo pagado confirmado. El backend comprueba los documentos obligatorios al aprobar solicitudes nuevas y mantiene las aprobaciones anteriores; no se cambia ese contrato en esta corrección.

El recorrido continúa siendo cuenta y datos → correo confirmado → documentos → aprobación administrativa → Stripe → periodo confirmado → panel. Una sesión pendiente sólo muestra el alta; enlaces directos al panel, perfil/configuración, suscripción, catálogo, mapa o administración no permiten saltarla. La renovación de asesores que ya completaron el alta conserva el comportamiento documentado en [Alta de asesor](Alta_asesor_verificacion.md).

## Reproducción con build productivo

`e2e/pwa-release.spec.ts` usa Chrome, el build productivo y el backend/MySQL de pruebas reales. No sustituye la guarda ni las respuestas de autorización:

1. Sirve el frontend anterior `b1ad5f16765b78018285fbbfa9c6df40ceb624ca`, crea una cuenta sintética y confirma su correo. Con el worker anterior instalado se reproduce la entrada al panel sin documentos ni pago.
2. Sirve el nuevo build en el mismo origen y actualiza el worker. Espera la limpieza de activación, recarga y verifica la redirección al alta, los enlaces directos y el expediente inicial sin error de versión. Comprueba que las cachés no contienen HTML ni API.
3. Otra actualización de worker muestra el aviso sin perder una edición no guardada ni la sesión actual. La recarga explícita exige login y recupera los datos persistidos. Ambos recorridos comprueban ausencia de errores JavaScript.

Para repetir, compilar el commit anterior en una carpeta temporal (sin copiar secretos), compilar la versión actual con `VITE_API_BASE_URL` apuntando al arnés aislado, definir `PWA_PREVIOUS_DIST` con la ruta absoluta de su `dist`, definir `E2E_API_URL` y ejecutar `npm run test:pwa`. El servidor del arnés escucha sólo en loopback, puerto 5180; nunca debe usarse como servidor productivo. La configuración rechaza una API que no identifique una base de pruebas aislada.

Capturas sintéticas: [documentos tras actualizar](evidence/alta-pwa-production-documentos.png), [aviso y formulario conservado](evidence/alta-pwa-production-actualizacion.png). Los resultados de la entrega se registran en [Alta de asesor](Alta_asesor_verificacion.md).

El puerto por defecto de `e2e/real-api.spec.ts` se alinea con el 5180 de Playwright. Durante la primera ejecución se identificaron expectativas de URL con 5173 que no correspondían al servidor del arnés; se corrigieron y se verificaron nuevamente. Las capturas anteriores se conservan como evidencia histórica y se añaden únicamente las dos de la regresión productiva.

## Comprobación externa a cargo del usuario

Sincronizar ambos frontends desde sus `main` y el backend ya entregado; gestionar Railway fuera de esta tarea. Mantener `APP_ENV=staging` y Stripe sandbox. Para la primera comprobación, abrir una ventana privada en `/login` e iniciar sesión con el asesor pendiente: debe abrir `/registro-asesor`, no el panel. En una instalación antigua, cerrar las pestañas de INMO y volver a abrir; si persiste, eliminar el service worker y los datos del sitio desde el navegador. Esto no borra el expediente guardado en el backend, pero elimina preferencias locales y formularios no guardados.

No se modificaron Railway, variables, claves Stripe, base productiva ni contratos del backend. Correo, R2 y Stripe externos siguen siendo comprobaciones del usuario; las pruebas locales utilizan proveedores de memoria.
