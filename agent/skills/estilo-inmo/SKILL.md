---
name: estilo-inmo
description: >-
  Skill para aplicar el sistema de diseño y la identidad visual de la marca INMO (Excelencia Inmobiliaria). Utiliza esta skill siempre que necesites crear, modificar o refactorizar interfaces de usuario para la aplicación INMO, para garantizar la coherencia de la marca en colores, formas, layout, iconos y textos.
---

# Skill de Marca: INMO (Excelencia Inmobiliaria)

Esta skill proporciona las directrices y recursos necesarios para implementar la interfaz de usuario de INMO, asegurando que se cumplan las reglas de marca, diseño y arquitectura técnica.

## Identidad Visual y Sistema de Diseño

Al implementar componentes y pantallas, debes adherirte estrictamente a la identidad de INMO. 
Revisa los siguientes recursos para conocer los detalles:

1. **Estilo Visual (Colores, Formas, Layout, Iconos):**
   [estilo-visual.json](./recursos/estilo-visual.json)
2. **Guía de Textos y Tono de Voz:**
   [guia-de-textos.md](./recursos/guia-de-textos.md)
3. **Reglas Técnicas y Arquitectura Frontend:**
   [reglas-tecnicas.md](./recursos/reglas-tecnicas.md)

## Flujo de Trabajo

1. Antes de crear o modificar componentes de UI, lee los tres archivos de recursos en la carpeta `recursos/`.
2. Aplica un enfoque **Mobile-First** para el diseño de interfaces.
3. Utiliza React, TypeScript y Tailwind CSS siguiendo las [reglas-tecnicas.md](./recursos/reglas-tecnicas.md).
4. Asegúrate de implementar la barra de navegación flotante inferior (píldora) y el FAB independiente para el chatbot en el layout principal.
