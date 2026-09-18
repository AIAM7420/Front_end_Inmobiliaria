# Reglas Técnicas y Arquitectura Frontend - INMO

Estas directrices definen las tecnologías y patrones a utilizar para el desarrollo frontend.

## Stack Tecnológico
- **Librería de UI:** React
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React

## Arquitectura y Diseño
- **Diseño Atómico (Atomic Design):** Estructura los componentes desde los elementos más básicos (átomos como botones, inputs) hasta estructuras complejas (organismos, plantillas, páginas).
- **Componentes Reutilizables:** Crea componentes genéricos que acepten props para variar su contenido y estilos según el contexto (evita duplicar código).
- **Tipado Fuerte:** Define interfaces o types explícitos para las props de cada componente.

## Tailwind CSS - Mejores Prácticas
- Utiliza las clases de utilidad de Tailwind en lugar de CSS personalizado siempre que sea posible.
- Aplica las formas de marca (`rounded-full` para botones/inputs, `rounded-2xl` o `rounded-3xl` para tarjetas).
- Usa los colores de marca (`bg-[#FA003F]` o extendiendo el tema de Tailwind para tener `bg-primary`, `text-[#333333]`).
- Ejemplo de configuración sugerida para `tailwind.config.js`:
  ```javascript
  module.exports = {
    theme: {
      extend: {
        colors: {
          primary: '#FA003F',
          charcoal: '#333333',
        }
      }
    }
  }
  ```

## Responsive Design
- Desarrolla siempre bajo el principio **Mobile-First**. Aplica las clases base para móviles y utiliza los prefijos `sm:`, `md:`, `lg:` para adaptar la interfaz a pantallas más grandes.
- Asegúrate de que la navegación inferior en píldora y el FAB del chatbot se comporten correctamente en diferentes resoluciones, posiblemente cambiando a una barra lateral o menú superior en escritorio.
