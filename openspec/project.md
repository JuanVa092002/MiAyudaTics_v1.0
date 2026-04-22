# AyudaTIC
## Propósito
Mesa de ayuda institucional para gestión de solicitudes de soporte técnico.
Los funcionarios reportan daños/incidencias; los técnicos atienden y resuelven;
líder TIC supervisa operación y métricas.

## Stack actual
- **Frontend**: React + Vite (Javascript/JSX)
- **Backend**: Node.js + Express (TypeScript - Fase 2 completada)
- **Base de datos**: MongoDB + Mongoose
- **Validación**: Zod (Backend) + Joi (Legacy/Parcial)
- **Auth**: JWT + bcrypt
- **Estado migración TS**: Backend 100% migrado a TypeScript. Frontend permanece en JS con tipado dinámico.

## Roles del sistema
- **Funcionario**: Crea solicitudes, adjunta evidencia fotográfica, consulta historial con paginación y estado en tiempo real.
- **Técnico**: Visualiza solicitudes asignadas, gestiona estados y registra soluciones.
- **Líder TIC**: Supervisión global, creación de categorías (Tipos de Caso), gestión de usuarios y métricas operativas.

## Estado funcional actual
- Login ✅ (Hardened)
- Registro ✅ (Hardened)
- Recuperar contraseña ✅ (Functional)
- Restablecer contraseña ✅ (Secured with SHA256)
- Dashboard funcionario ✅ (Redesign AyudaTIC 2026 - Premium UI)
- Dashboard técnico ⚠️ (Funcional / Legacy UI)
- Dashboard líder TIC ⚠️ (Funcional / Legacy UI)
- Testing ⚠️ (Configuración base en backend / Cobertura baja)
- Migración frontend a TypeScript ❌ (Pendiente)

## Decisiones de arquitectura
- **Seguridad Auth**: Token de reset enviado en crudo por email, pero almacenado con hash SHA-256 en la base de datos para máxima seguridad.
- **Expiración**: Tokens de sesión y recuperación con expiración controlada (1 hora para reset).
- **Criptografía**: Uso de bcrypt con 12 rounds para almacenamiento de contraseñas.
- **Rate Limiting**: Implementado en el flujo de recuperación de contraseña (5 req / 15 min).
- **Validación**: Esquemas Zod en backend para asegurar integridad de contratos.
- **Frontend**: Manejo de errores por Status Code para feedback preciso al usuario.

## Filosofía UX/UI (AyudaTIC 2026)
- **Línea Visual**: Minimalismo funcional de alta gama ("Zero Noise").
- **Layout**: Cards blancas elevadas sobre fondo neutro (`#EEF0F5`).
- **Colores**: 
  - Primario: `#1B2A4A` (Confianza/Institucional).
  - Acento: `#39A900` (Verde SENA) usado con moderación semántica.
  - Superficie: `#FFFFFF` con bordes `hairline` (0.5px - 1px).
- **Componentes**: 
  - Custom Selects con Glassmorphism (`backdrop-blur`).
  - Scrollbars minimalistas (`hairline-scrollbar`).
  - Iconometría consistente (Material Symbols, wght 300).
- **Interacción**: Micro-animaciones de escala y opacidad para feedback táctil.

## Convenciones de trabajo
- **Modularidad**: Cambios pequeños, atómicos y verificables.
- **Consistencia**: Cualquier nuevo dashboard debe seguir el paradigma visual del Dashboard Funcionario.
- **Librerías**: Evitar introducir dependencias pesadas; preferir soluciones nativas o utilidades CSS.
- **Trazabilidad**: Todo cambio relevante debe impactar el CHANGELOG y el PROGRESS log.
