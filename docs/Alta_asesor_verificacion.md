# Alta de asesor: documentos, autorización y suscripción

Corrección del 2026-10-04. El registro anterior creaba la cuenta y enviaba al asesor al panel; los documentos y la suscripción estaban dentro del perfil. Ahora el alta tiene un recorrido independiente y persistente en `/registro-asesor`.

## Recorrido real

1. En Login → Regístrate aquí → Asesor Inmobiliario, completar la cuenta y los datos profesionales. `POST /api/v1/asesores` crea la cuenta y su solicitud; no inicia una sesión ficticia.
2. Confirmar el enlace de correo e iniciar sesión con correo y contraseña. Antes de confirmar el correo, la API rechaza el login. La sesión del asesor pendiente permite completar el registro; la interfaz del panel profesional permanece bloqueada.
3. Guardar o corregir nombre comercial, teléfono y biografía. El perfil usa su versión real y `If-Match`. En un `412`, el formulario se conserva; consultar la versión vigente y aceptar la revisión no reenvía la mutación. Guardar requiere otra acción explícita.
4. Subir identificación y constancia de situación fiscal; licencia opcional. Expedientes V1 mantienen sus requisitos anteriores. PDF/JPEG/WebP de hasta 5 MB; autorización, hash SHA-256, PUT directo sin JWT y confirmación del backend. Los archivos recibidos aparecen en el expediente privado del superadministrador.
5. Consultar la revisión. El administrador decide desde Usuarios → Autorizaciones. Un rechazo muestra el motivo y permite abrir una nueva solicitud; la anterior se conserva. Cerrar sesión y volver a entrar recupera el expediente persistido.
6. Después de aprobarse el expediente, elegir un plan real y continuar a Stripe Checkout. Precio, duración y capacidad vienen de `/planes`; no hay captura local de tarjetas, cobros simulados ni capacidades ficticias.
7. El panel se habilita cuando la API devuelve aprobación y un periodo de pago confirmado. Un Checkout pendiente, cancelado o el simple regreso a `/pagos/exito` no concede acceso. «Actualizar estado» consulta nuevamente expediente y suscripción. Al volver de Stripe puede ser necesario iniciar sesión: el JWT permanece exclusivamente en memoria.

La guarda de `MainLayout` cubre también enlaces directos a inventario, catálogo y demás pantallas del asesor. El retorno de pago tiene una vista protegida independiente. Clientes y administradores conservan sus rutas. Un asesor previamente aprobado con historial de periodo pagado conserva las pantallas de renovación aunque su periodo haya vencido; las reglas del backend siguen restringiendo publicar sin vigencia.

## Referencia visual y contratos

Se recupera el recorrido de `angggsoft/inmo@01295be` mediante sus componentes `AuthHeader`, `StepIndicator`, `FileDropZone`, botones, tarjetas y estado de revisión. Se conservan tipografías, colores, sombras, tamaños y scroll móvil/escritorio. El login continúa con el único botón acordado. Se utilizan datos profesionales que la API persiste y los documentos V1/V2 vigentes; no se reproducen RFC/CURP/campos sin persistencia ni el formulario de tarjeta y temporizador ficticios del prototipo.

No hay nuevos endpoints productivos ni migraciones. Se reutilizan `/asesores`, `/auth/correo/confirmar`, `/sesiones`, `/me`, `/asesores/me/perfil`, `/asesores/me/solicitud`, sus autorizaciones/confirmaciones de documentos, `/asesores/me/solicitudes`, `/admin/solicitudes/{id}/decision`, `/planes`, `/me/suscripcion`, `/me/seleccion-plan` y `/me/pagos`.

El contrato inicial existente usa `version: 0` / ETag `"v0"` para una solicitud nueva y para la suscripción todavía inexistente (`id: null`). El frontend lo acepta expresamente en esos contratos. Los demás recursos mantienen la validación habitual; versiones negativas, no enteras o no seguras se rechazan. Después de seleccionar el primer plan se utiliza su nueva versión real.

## Pruebas y evidencia

Resultados ejecutados en ambos repositorios frontend: **32 unitarias en 14 archivos y 42 pruebas de navegador aprobadas en cada uno**; lint sin errores (ocho advertencias anteriores de efectos/Fast Refresh), TypeScript/Vite/PWA aprobados. Backend: Ruff check/format del arnés y **245 unitarias aprobadas**; la cobertura/regresión SQL de la entrega base se conserva como evidencia anterior, no como una ejecución nueva. El recorrido de inventario completo vuelve a comprobar guardar → fotos → publicar → papelera → recuperación → retirada definitiva.

`e2e/advisor-onboarding.spec.ts` ejecuta el recorrido completo con cuentas nuevas en escritorio claro (1440×960) y móvil oscuro (390×844), confirmación de correo, documentos privados, aprobación desde la interfaz administrativa, selección y creación de Checkout, bloqueo de enlaces directos, retorno sin pago y acceso después del webhook firmado. Incluye apertura del selector de archivo por teclado. Un tercer recorrido verifica un `412` real, ausencia de reenvío automático, preservación del formulario, rechazo con motivo y expediente nuevo sin borrar el anterior.

Capturas con documentos sintéticos: [documentos en escritorio](evidence/alta-asesor-desktop-light-documentos.png), [revisión en escritorio](evidence/alta-asesor-desktop-light-revision.png), [planes en escritorio](evidence/alta-asesor-desktop-light-planes.png), [documentos en móvil oscuro](evidence/alta-asesor-mobile-dark-documentos.png), [revisión en móvil oscuro](evidence/alta-asesor-mobile-dark-revision.png), [planes en móvil oscuro](evidence/alta-asesor-mobile-dark-planes.png).

La API y MySQL son reales en una base aislada. Correo, almacenamiento y pagos usan proveedores de memoria en el arnés `tests.e2e.local_server`; los helpers de confirmación sólo existen allí y nunca en la aplicación productiva. No se ha probado aquí la entrega externa de correo, R2 ni Stripe remoto. Esas comprobaciones las realizará el usuario en Railway con `APP_ENV=staging` y Stripe sandbox; no se accedió ni se modificó Railway.
