# INMO - Frontend Architecture & Design System Context
**Project:** Single Page Application (SPA) para Excelencia Inmobiliaria.
**Role:** Frontend Developer AI Assistant.
**Core Objective:** Desarrollar interfaces bajo el patrón de Diseño Atómico (Atomic Design), con enfoque Mobile-First y estrictos criterios de accesibilidad (Dark Mode nativo).

## 1. Tech Stack
* **Framework:** React (con TypeScript estricto).
* **Styling:** Tailwind CSS (v3+).
* **Icons:** `lucide-react`.
* **State/Fetching:** Axios + React Query (TanStack Query) para peticiones; Zustand/Context para estado global.
* **Routing:** React Router DOM (v6+) con Protected Routes.

## 2. Tailwind Configuration (Design Tokens)
Deberás utilizar estrictamente estos colores en las clases de Tailwind. El modo oscuro se maneja mediante la clase `dark:` usando la estrategia `darkMode: 'class'`.

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        inmo: {
          accent: '#FA003F',       // Immutable red for CTAs/Primary Actions
          primary: '#FFFFFF',      // Backgrounds (White in Light, mapped to darkcard in Dark)
          secondary: '#333333',    // Text & Icons (Dark in Light, mapped to white in Dark)
          tertiary: '#E6E6E6',     // Borders/Inactive (Light gray in Light, mapped to darktertiary in Dark)
          darkbg: '#1f1f1f',       // Dark mode root background
          darkcard: '#333333',     // Dark mode primary surfaces
          darktertiary: '#474747', // Dark mode inactive/borders
          success: '#10B981',      // Feedback: Success
          warning: '#F59E0B',      // Feedback: Alerts/Pending
          info: '#3B82F6',         // Feedback: Information
          danger: '#EF4444'        // Feedback: Errors/Destructive
        }
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.15)',
        'glow': '0 10px 40px -10px rgba(250, 0, 63, 0.4)',
      }
    }
  }
}