# Evidencia de integración

Fecha: 2026-10-03 UTC (sesión local iniciada el 2026-10-02).

## Controles ejecutados

| Control | Resultado |
| --- | --- |
| Frontend Vitest | 18 pruebas aprobadas en 8 archivos |
| TypeScript y Vite / PWA | Build aprobado; caché estática generada |
| Oxlint | Sin errores; advertencias de efectos de React y Fast Refresh |
| API en navegador | 8 pruebas aprobadas: catálogo/filtros, registro, acceso, JWT en memoria, chat, asesor, administración y permisos negativos |
| Revisión responsive | 4 pruebas aprobadas: 390×844 y 1440×900, claro/oscuro, teclado y ausencia de desbordamiento horizontal |
| Inventario en navegador | Guardar → cargar foto → publicar aprobado, usando la versión realmente consultada y sin JWT en el transporte de objetos |
| Backend completo | 214 pruebas aprobadas, 3 omitidas por activación explícita de proveedores; cobertura 90,04 % |
| Backend estático | Ruff check/format, mypy (219 archivos) y contrato de arquitectura aprobados |

La regresión MySQL se ejecutó únicamente después de verificar que TEST_DATABASE_URL difiere de DATABASE_URL. El lanzador `tools/run_isolated_tests.py` del backend inicia pytest en un proceso nuevo para incluir las importaciones en cobertura.

Las pruebas existentes de backend cubren selección de plan, webhook, periodo, documentos, publicación, moderación y concurrencia. La prueba frontend de editor verifica conservación del borrador tras 412, consulta de versión vigente y aceptación explícita antes de enviar otro PATCH. La prueba de modal comprueba que una operación fallida no se presenta como completada. Las regresiones de socket/historial verifican autenticación, deduplicación y recuperación REST.

## Capturas

Las capturas del catálogo corresponden al estado vacío real de la API aislada:

- [Escritorio claro](evidence/catalog-desktop-light.png)
- [Escritorio oscuro](evidence/catalog-desktop-dark.png)
- [Móvil claro](evidence/catalog-mobile-light.png)
- [Móvil oscuro](evidence/catalog-mobile-dark.png)
- [Inventario publicado](evidence/inventory-published-desktop.png)

Las 13 pruebas de navegador se ejecutaron juntas contra la API real local. Para inventario, el servidor `tests.e2e.local_server` ofrece rutas de almacenamiento únicamente en el arnés local; Playwright redirige `objects.test` hacia ellas. No se simulan autorización, confirmación, concurrencia ni publicación. La fixture profesional procede de la regresión fase 4 y `seed_browser --reuse-phase4-professional` extiende su periodo sólo en la base aislada. Las propiedades creadas por esa prueba se archivan al terminar.

## Dependencias externas pendientes

- Stripe sandbox, Checkout en el proveedor y webhook externo completo: las pruebas locales usan el proveedor en memoria.
- R2 remoto, firmas y políticas CORS del bucket configurado: la prueba de transporte sin JWT y las pruebas locales de objetos no acreditan el bucket externo.
- Entrega real de confirmación/recuperación mediante Resend y dominio verificado.
- Mapbox con token público restringido válido: se verificó la alternativa de lista sin token; no se acredita la renderización remota de tiles.
- Revisión visual de todos los estados administrativos con volúmenes representativos y documentos externos.

El build emite advertencia por el tamaño del chunk Mapbox (aproximadamente 1,84 MB minificado), cargado sólo por las vistas de mapa. Las advertencias de lint no impiden el build, pero quedan visibles para revisión. No se realizó despliegue productivo ni fusión a main.
