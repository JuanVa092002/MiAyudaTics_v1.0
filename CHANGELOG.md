# Changelog
Todos los cambios notables en el proyecto **AyudaTIC** serán documentados en este archivo.

## [2026-04-22] - Dashboards Técnico & Admin Redesign
### Añadido
- **UI Premium (AyudaTIC 2026)**: Extensión del lenguaje visual "Zero Noise" a los roles de Técnico y Admin.
- **Paginación & UX**: Sistema de navegación por páginas (límite 5) y buscadores reactivos en todos los módulos operativos.
- **Iconometría**: Estandarización de Material Symbols (peso 300) para una estética profesional.

### Cambios
- **Refactorización de Tablas**: Eliminación de `react-data-table-component` en favor de implementaciones HTML de alta fidelidad.
- **Workflow TIC**: Rediseño del panel de supervisión y el flujo de asignación de especialistas.
- **Workflow Técnico**: Reorientación hacia la base de conocimientos y la resolución ágil de tareas.

### Corregido
- **Clean Code**: Eliminación de warnings de ESLint y dependencias obsoletas en 7 componentes core.
- **Consistencia Visual**: Unificación total de la plataforma bajo un único estándar institucional.

## [2026-04-21] - Auth Hardening & Funcionario Redesign

### Añadido
- **UI Premium (AyudaTIC 2026)**: Nuevo lenguaje visual con bordes hairline, glassmorphism y minimalismo funcional.
- **Módulo Funcionario**: 
    - Paginación estricta (5 registros por página) con controles de navegación.
    - Componente `CustomSelect` para una experiencia de usuario de alta gama.
    - Categorización de casos (Hardware, Software, etc.) con sincronización backend.
- **Navbar**: Menús interactivos de notificaciones y perfil con lógica de cierre automático.
- **Seguridad**: Hash SHA-256 para tokens de recuperación de contraseña en la base de datos.
- **Infraestructura**: Middleware de Rate Limiting para prevenir abusos en el flujo de recuperación.

### Cambios
- **Backend TS**: Migración total de modelos, controladores y rutas a TypeScript finalizada.
- **Login/Register**: Rediseño completo alineado con la identidad institucional SENA.
- **Email Templates**: Nuevas plantillas HTML profesionales para notificaciones de soporte.

### Corregido
- **Reset Password**: Error de validación en el frontend al no enviar `confirmPassword`.
- **Overflow de Datos**: Corregido el desbordamiento de la tabla de historial mediante contenedores con scroll controlado y cabeceras pegajosas.
- **Rutas**: Permisos corregidos para que los funcionarios puedan ver las categorías de casos.

---
*Este proyecto sigue los estándares de Semantic Versioning y Conventional Commits.*
