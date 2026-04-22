# Changelog
Todos los cambios notables en el proyecto **AyudaTIC** serán documentados en este archivo.

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
