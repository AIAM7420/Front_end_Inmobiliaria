# Fidelidad visual e inventario conectado

> Registro histórico de inventario y papelera. La integración completa, sus funciones nuevas y evidencia vigente están en [Integración total INMO](Integracion_total_INMO.md).

Referencia: [`angggsoft/inmo`, commit `01295bee792791081933a936c51d820f0b6877d3`](https://github.com/angggsoft/inmo/tree/01295bee792791081933a936c51d820f0b6877d3). Se aplicó la skill [`estilo-inmo`](../agent/skills/estilo-inmo/SKILL.md) y sus recursos de estilo, textos y arquitectura. No se incorporaron variables privadas, dependencias instaladas, scripts de recuperación ni datos de demostración de ese repositorio.

## Decisiones autorizadas

- Un único botón de inicio de sesión con correo y contraseña reales.
- Cada asesor conserva sus propiedades. No existen traspasos entre asesores.
- Las comisiones compartidas son visibles para todos los asesores, con datos públicos y ubicación aproximada.
- La papelera permite recuperar como borrador. La retirada definitiva elimina publicación y fotos confirmadas, conserva conversaciones, reportes y auditoría y no permite recuperación.
- Métricas, valoraciones, rankings y acciones sin soporte V1 mantienen estados honestos. No se muestran cifras simuladas.

## Pantallas y contratos

Todos los endpoints de esta tabla usan `/api/v1`.

| Pantalla / función | API real | Resultado |
| --- | --- | --- |
| Login, sesión y permisos | `POST /sesiones`, `GET /me` | Diseño base, botón único, JWT en memoria y rol del backend |
| Landing, catálogo y tarjetas | `GET /propiedades`, catálogos, búsquedas | Medidas del hero, carruseles, flechas, footer y tarjetas recuperadas del diseño; fotos reales y estados vacíos |
| Detalle público y privado | `/propiedades/{id}`, `/me/propiedades/{id}` y fotos correspondientes | Galería, mini mapa Mapbox, características reales y scroll; dirección exacta sólo en la ficha propia |
| Perfil y configuración | `GET/PATCH /me`, recuperación, expediente y suscripción | Layout de configuración del diseño, acciones reales y revisión de 412 sin perder el formulario |
| Inventario completo | `GET /me/propiedades` con todos los cursores | Tabla de escritorio, tarjetas móviles, búsqueda y filtros sobre el inventario completo |
| Crear y editar | `POST /propiedades`, `PATCH /me/propiedades/{id}` | Cinco pasos: operación, inmueble, ubicación, características y multimedia. Borrador real y fotos confirmadas antes de publicar |
| Fotos | Autorización, PUT directo y confirmación, `PUT .../fotografias/orden`, `DELETE .../fotografias/{foto}` | Portada según orden, movimiento con botones de teclado, confirmación de borrado y ETag actual |
| Orden manual | `PUT /me/inventario/orden` | Versiones por propiedad, guardado atómico y revisión explícita si hubo cambios concurrentes |
| Publicar / pausar / papelera / recuperar | Publicación, `DELETE /me/propiedades/{id}`, acción `RESTAURAR` | Confirmaciones sin temporizadores ficticios; recuperar nunca republica automáticamente |
| Retirada definitiva | `DELETE /me/propiedades/{id}/retiro` | Requiere papelera propia manual. La interfaz indica si la limpieza física está pendiente de reintento |
| Comisiones compartidas | `GET /colaboracion/propiedades` | Vista para asesores, sólo propiedades publicadas, visibles y disponibles; contacto entre asesores por chat |
| Mensajería y administración existentes | REST, WebSocket y rutas de administración V1 | Se mantienen permisos y funciones existentes; no se habilitan traspasos |

El contrato adicional del backend y la migración `0020_inventory_order` se entregan en el [PR complementario del backend](https://github.com/AIAM7420/Back_end_Inmobiliaria/pull/3) y se documentan en `docs/Inventario_y_retiro.md` de ese repositorio. Desplegar primero ese backend. El cursor por ID sigue siendo estable; el frontend aplica el orden manual después de cargar todas las páginas.

Las mutaciones usan `"vN"` real. La confirmación de fotos incrementa la versión y la interfaz consulta la ficha vigente. Ante 412 se conserva el formulario u orden propuesto; se consultan los datos actuales y se requiere aceptación explícita antes de otra mutación. Las listas y URL de fotos se actualizan evitando consultar recursos recién eliminados.

## Evidencia visual y límites

[`evidence/fidelity/login-pixel-comparison.json`](./evidence/fidelity/login-pixel-comparison.json) registra **ocho comparaciones con cero píxeles diferentes**: logo y campo de contraseña, en móvil/escritorio y claro/oscuro, bajo el mismo Chrome y viewport. No certifica toda la aplicación. El botón único de login, los datos reales, las acciones añadidas, Mapbox y los estados V1 sin métricas simuladas son diferencias funcionales deliberadas. Los paneles de administración, mensajería y el conjunto completo de pantallas no tienen certificación de igualdad de píxeles.

Reproducir las regiones comunes, con la referencia original ejecutándose aparte:

```powershell
node tools/compare-login.mjs --reference=http://127.0.0.1:5174 --integrated=http://localhost:5173
```

Capturas: [inventario escritorio](./evidence/inventory-published-desktop.png), [inventario móvil](./evidence/fidelity/inventory-scroll-mobile.png), [catálogo claro](./evidence/catalog-desktop-light.png) y [catálogo oscuro](./evidence/catalog-mobile-dark.png). Las imágenes contienen datos sintéticos de la base aislada.

## Validación ejecutada (2026-10-03)

- 22 pruebas unitarias del frontend pasaron, incluyendo carga completa de inventario, ausencia de ubicación privada pública y conservación/reconciliación del orden de fotos tras 412.
- 17 pruebas de navegador pasaron contra la API y MySQL de pruebas: tres roles, permisos negativos, registro, sesión revocada, WebSocket, edición concurrente del perfil, inventario largo en móvil y escritorio, guardar → fotos → ordenar → eliminar foto → publicar → comisión compartida → papelera → recuperar → retirada definitiva. El recorrido positivo ampliado exige cero errores de página y consola.
- Lint pasó sin errores; conserva seis advertencias de efectos y Fast Refresh. Build TypeScript/Vite/PWA pasó.
- Backend: 270 pruebas, cobertura 90,03 %, controles estáticos y arquitectura correctos. Tres pruebas de contratos externos se omitieron por requerir habilitación explícita.

Las pruebas de navegador usan almacenamiento y pagos de memoria. No verifican R2, pagos reales de Stripe sandbox, correo externo ni el mapa con token externo. El piloto especial de 8001 se excluye de esta suite y requiere su propio entorno.

La API normal local sigue en `http://127.0.0.1:8000/api/v1`. Para la suite de navegador usar un servidor aislado en 8002 y el frontend en 5180. El setup comprueba `/__e2e/identity` antes de mutar; no admite la API normal. Playwright no reutiliza un Vite ya abierto, para evitar probar contra otro backend por accidente.
