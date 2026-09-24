# Documentación y Análisis de INMO

## 1. Funcionamiento de la Aplicación
INMO es una plataforma moderna de bienes raíces diseñada para buscar, visualizar, administrar y contactar propiedades (casas, departamentos y terrenos). El proyecto está construido con React, TypeScript y Tailwind CSS, apoyado por una estructura arquitectónica estricta bajo **Atomic Design** (Átomos, Moléculas, Organismos, Plantillas). Esto proporciona alta reusabilidad, escalabilidad y un soporte nativo de consistencia visual, incluyendo modos claros y oscuros fluidos.

La plataforma soporta flujos para distintos roles: usuarios buscando propiedades, asesores publicando inmuebles, y administradores del sistema.

---

## 2. Vistas Disponibles y sus Componentes

El ecosistema de vistas de la aplicación se agrupa en las carpetas `src/components/templates` y `src/components/templates/auth`. 

### LandingTemplate (Página de Inicio / Búsqueda Principal)
- **Funcionalidad**: Pantalla de aterrizaje. Presenta al usuario un buscador rápido, categorías de inmuebles y un catálogo destacado.
- **Componentes**: `NavHeader` (Desktop), `Header` (Móvil), `SearchBar`, `CategoryPills`, `FilterDropdown`, `CatalogSection`, `FloatingNavBar`, `GlobalChatbot`.
- **Alternativa PC / Escritorio**: 
  - La barra móvil `FloatingNavBar` desaparece y se muestra un `NavHeader` fijo superior.
  - El catálogo pasa de lista a cuadrícula (grid) multinivel para aprovechar el ancho.
  - El botón del Chatbot se ancla en la parte inferior derecha, abriendo un modal lateral estilo Popover, no a pantalla completa.

### MapTemplate (Búsqueda por Mapa)
- **Funcionalidad**: Interfaz inmersiva con Mapbox GL JS para localizar propiedades mediante zonas aproximadas.
- **Componentes**: `Mapbox GL JS`, `SearchBar` flotante, `FloatingFilterButton`, `PropertyCard`, `FloatingNavBar`.
- **Alternativa PC / Escritorio**: 
  - El mapa abarca la mayor parte del espacio visual.
  - Los resultados se muestran como un panel lateral izquierdo en lugar de una hoja inferior ("Bottom Sheet") deslizable, permitiendo al usuario interactuar simultáneamente con el mapa y la lista.

### FavoritesTemplate (Mis Favoritos)
- **Funcionalidad**: Listado de propiedades que el usuario ha guardado para seguirlas o contactar al asesor posteriormente.
- **Componentes**: `PropertyCard`, `FloatingNavBar`, `Header` / `NavHeader`.
- **Alternativa PC / Escritorio**: 
  - Emplea un encabezado superior de escritorio.
  - Las tarjetas (`PropertyCard`) se distribuyen en una cuadrícula en lugar de una lista apilada verticalmente.

### MessagesTemplate (Centro de Mensajes)
- **Funcionalidad**: Gestor de bandeja de entrada y chats directos entre usuarios y asesores.
- **Componentes**: `Input` (para buscar chats), `Select` (para filtros), `IconButton`, `FloatingNavBar`.
- **Alternativa PC / Escritorio**: 
  - Implementa un modelo "Split-Pane" (Vista dividida): Una columna izquierda permanente con la lista de conversaciones y el panel derecho principal con la conversación activa.

### AuthTemplate y Subvistas (Login, Registro, OTP, Perfil)
- **Funcionalidad**: Contenedor maestro y vistas derivadas para la autenticación y onboarding del usuario, localizadas en `templates/auth` (ej. `LoginView`, `RegisterView`, `OtpView`, `RecoveryView`, `AccountTypeView`, `AdvisorProfileView`, etc.).
- **Componentes**: `Input`, `OtpInput`, `Button`, `AccountTypeCard`, `IconButton`, `Select`.
- **Alternativa PC / Escritorio**: 
  - Las vistas ya no estiran sus formularios al ancho completo. Suelen utilizar tarjetas centralizadas con sombras pronunciadas o un diseño de pantalla dividida (imagen promocional en la mitad izquierda, formulario interactivo a la derecha).

### UiKitTemplate y CatalogWireframeTemplate
- **Funcionalidad**: Pantallas estrictamente internas para el equipo de desarrollo. Proveen un visor del UI Kit global y *wireframes* con datos mockeados.
- **Componentes**: Virtualmente todos los átomos y moléculas de la librería gráfica (ej. `Button`, `Input`, `SemanticToast`, `Badge`, `Tag`, `NumberField`).

---

## 3. Revisión de Componentes Hardcodeados

Se ha realizado una auditoría estricta para garantizar que la plataforma cumpla con los estándares definidos, los cuales dictan que no deben usarse etiquetas nativas interactivas de HTML (tales como `<button>`, `<input>`, `<select>`) en ninguna de las capas de Organismos o Plantillas, debiendo ser consumidas exclusivamente de la **biblioteca de Átomos**.

Tras refactorizar el código en fases anteriores, **el análisis actual confirma que no existe ninguna incidencia.** Adicionalmente, se realizó una auditoría específica en las vistas de `AsesorDashboard` y `AsesorOverview`:

- **Auditoría de Componentes y Sistema de Diseño (Asesor Dashboard)**: Se detectaron y corrigieron instancias de botones nativos (`<button>`) en las hojas inferiores de "Ranking" y "Portafolio", los cuales fueron migrados exitosamente a los átomos `Button` e `IconButton`. De igual manera, se consolidó el uso del sistema de diseño semántico definido en `tailwind.config.ts`, reemplazando geometrías estáticas (ej. `rounded-[32px]`) por `rounded-card`, y estandarizando tipografías con `text-body` y `text-caption`, logrando un 100% de cumplimiento del Atomic Design en estas vistas.
- **Excepción Técnica Evaluada**: El único elemento interactivo nativo existente a nivel global es un `<input type="file" className="hidden" />` situado dentro del átomo `FileDropZone.tsx`. Esto es semántica y arquitectónicamente correcto, ya que el Átomo debe encapsular el comportamiento subyacente de subida de archivos del navegador, exponiéndolo a través de su propia interfaz segura en React.

**Conclusión:**
La deuda técnica por *hardcoding* de componentes se ha eliminado por completo en el sistema, extendiéndose hasta los componentes del tablero del asesor. El patrón de Atomic Design de INMO está consolidado, preparado para escalar con consistencia, modularidad total y sin fugas visuales en los diseños oscuros o responsivos.
