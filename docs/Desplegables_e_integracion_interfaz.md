# Desplegables uniformes e integración de la interfaz nueva

Entrega del 2026-10-05 exclusivamente en `AIAM7420/Front_end_Inmobiliaria`. No se publica en `angggsoft/inmo` ni se accede a Railway. El backend no necesita cambios de contrato, endpoints ni migraciones para esta entrega.

## Procedencia

Se parte de nuestro `main` `bb007774eccbc1a6c680275ae5e13e1fc2e2c7de`, con los flujos reales y las correcciones de mapas ya integrados. La referencia original sigue siendo `01295be`, y se incorporan los cambios nuevos de INMO copia:

- [38fed41: marcadores, estados vacíos y navegación](https://github.com/angggsoft/inmo/commit/38fed41e80c96bcb465a1f8af0ee2aa20e740a7a), conservando su autoría mediante cherry-pick.
- [6a4c88e: footer y skyline](https://github.com/angggsoft/inmo/commit/6a4c88e905258b59b4adea615fdf39ad3a8b24f7), conservando su autoría mediante cherry-pick.

El conflicto de `MapTemplate` se resuelve conservando nuestra instancia persistente de Mapbox, geometría aproximada, búsqueda compartida y recuperación de errores; se incorporan sus marcadores por tipo y tarjetas con fotografía/precio al acercar el mapa. Se excluye únicamente la eliminación de metadatos de plataforma de `package-lock.json`: no hay cambios de versiones de dependencias.

Se aplica la skill [estilo-inmo](../agent/skills/estilo-inmo/SKILL.md): componentes React/TypeScript, Atomic Design, tokens existentes, píldoras, tarjetas redondeadas, Lucide y diseño adaptable.

## Controles y comportamiento

| Pantalla/control | Integración | Evidencia |
| --- | --- | --- |
| Sector, zona y precio de filtros | `DropdownSelect` sustituye los selectores nativos; lista flotante con selección resaltada, claro/oscuro, scroll y ajuste al viewport | Tres tamaños; petición real conserva sector/precio; teclado y pantalla de 320 px de alto |
| Menú dentro del panel de filtros | Portal propio identificado por dueño; seleccionar una opción no cierra el panel. Escape cierra primero las opciones y después los filtros; Tab, flechas, inicio/fin, búsqueda por texto y recuperación del foco | Pruebas unitarias y navegador |
| Usuarios / Autorizaciones | Navegación compartida de 44 px de alto y ancho mínimo 144 px, sin estirarse con el contador. Enlaces reales a `/admin/asesores` y `/admin/solicitudes` | Móvil/escritorio, claro/oscuro y navegación protegida |
| Cuenta activa / suspendida | Conserva sus filtros, consultas, exportación, detalle y cambios versionados. Se elimina la rama inalcanzable de autorizaciones dentro de la tabla de cuentas | Regresión de administración y navegación |
| Marcadores del mapa | Botón accesible por clic/Enter; iconos SVG codificados y tarjetas con fotografía real. Mapbox conserva la propiedad del transform y los marcadores no se desmontan en cada render | SDK real, zoom, teclado, cuatro alternancias de tema y cámara conservada |
| Catálogo, favoritos, chat y chatbot | Nuevos estados vacíos y de error de INMO copia, con resultados reales, acciones existentes y permisos vigentes | Recorridos de los tres roles y regresión funcional |
| Hero y footer | Carrusel ilustrativo de respaldo identificado como tal; fotografías reales prioritarias; nuevo skyline, enlaces y logo. Mensajes de asesores enlaza su ruta protegida | Capturas de catálogo y recorridos responsive |

Los selectores de formularios que no pertenecen a este panel conservan su contrato actual. Se mantienen el login único, el alta profesional previa al panel, JWT en memoria, documentos privados, R2 sin JWT, ETags y recuperación manual de `412`. No se reintroducen reseñas, calificaciones, Renta ni acceso administrativo a chats privados.

## Validación ejecutada

- `npm test`: 43 pruebas aprobadas en 16 archivos.
- `npm run lint`: cero errores, ocho advertencias anteriores a esta entrega.
- `npm run build`: TypeScript, Vite y PWA aprobados; 98 recursos estáticos precacheados. Continúa el aviso de tamaño de chunks de Mapbox/gráficos.
- `playwright.maps.config.ts`: 12 pruebas aprobadas con Chrome, SDK real de Mapbox y estilos locales controlados. Se comprueban filtros en ambos temas, foco, dimensiones, zoom, clic/teclado, cámara, recuperación del mapa, sectores, chat, propiedades sin coordenadas y el nuevo footer.
- Regresión general: 42 casos aprobados. La ejecución completa aprobó 41; el restante utilizaba `selectOption` sobre el nuevo botón combobox. Se adaptó al clic de opciones y se repitió con éxito, conservando la comprobación de petición real, filtros y ausencia de información privada. Incluye tres roles, seis configuraciones de pantalla/tema, alta con documentos/aprobación/pago, inventario/fotografías/publicación, `412`, chat, favoritos, soporte y operaciones administrativas.

En total, se validaron 54 casos de navegador distintos. En los paneles administrativos ocultos de móvil, Recharts sigue emitiendo avisos de dimensiones cero; no se observaron excepciones de página en los recorridos comprobados. Se corrigió el aviso de atributos SVG del nuevo skyline (`strokeWidth`).

La API E2E se ejecuta en `127.0.0.1:8002`, con identidad de base aislada comprobada. Utiliza MySQL de pruebas y proveedores en memoria para archivos, correo y pagos. No constituye evidencia de acceso remoto a R2, Stripe, correo o Mapbox. Las pruebas externas corresponden al usuario en Railway con `APP_ENV=staging` y Stripe sandbox; sincronizar EAM16 sigue siendo responsabilidad del usuario.

Las capturas históricas regeneradas se archivan localmente y se mantienen intactas en Git. Se añaden sólo capturas específicas de esta entrega.

## Capturas

- [Desplegable en escritorio](evidence/dropdown-filtros-desktop.png), [tableta](evidence/dropdown-filtros-tablet.png) y [móvil](evidence/dropdown-filtros-mobile.png).
- [Desplegable oscuro en escritorio](evidence/dropdown-filtros-desktop-oscuro.png), [tableta](evidence/dropdown-filtros-tablet-oscuro.png) y [móvil](evidence/dropdown-filtros-mobile-oscuro.png).
- [Autorizaciones claro](evidence/dropdown-admin-1440-claro.png) / [oscuro](evidence/dropdown-admin-1440-oscuro.png).
- [Autorizaciones móvil claro](evidence/dropdown-admin-390-claro.png) / [oscuro](evidence/dropdown-admin-390-oscuro.png).
- [Nuevo marcador y galería](evidence/dropdown-marcador-nuevo.png).
- [Catálogo claro](evidence/dropdown-catalogo-claro.png) / [oscuro](evidence/dropdown-catalogo-oscuro.png), [footer claro](evidence/dropdown-footer-claro.png) / [oscuro](evidence/dropdown-footer-oscuro.png).
