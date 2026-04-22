# Instrucciones del proyecto AyudaTIC

## Principios
- **Consistencia Visual**: No romper la estética "Zero Noise". Respetar bordes hairline, sombras suaves y glassmorphism.
- **Colores**: No usar colores saturados (rojos/azules brillantes) fuera del sistema. Usar la paleta definida en `project.md`.
- **Feedback**: No usar `toasts` para errores de validación de campos; preferir feedback inline. Usar `toasts` solo para acciones globales (éxito/error de red).
- **Referencia**: Antes de rediseñar cualquier vista, leer el Dashboard de Funcionario como referencia de "Estado del Arte".
- **Integridad**: Antes de tocar el sistema de autenticación, validar impacto en ambos lados (frontend/backend).

## Flujo de trabajo obligatorio
1. **Consultar Contexto**: Leer `openspec/project.md`.
2. **Revisar Progreso**: Leer `openspec/PROGRESS.md`.
3. **Exploración**: Revisar los archivos del módulo a intervenir antes de proponer cambios.
4. **Iteración**: Proponer cambios pequeños y lógicos.
5. **Implementación**: Ejecutar siguiendo las convenciones de código (TS en backend, JSX en frontend).
6. **Actualización**: Al terminar, actualizar `PROGRESS.md` y `CHANGELOG.md`.

## Reglas técnicas
- **Endpoints**: No inventar ni asumir endpoints; verificar siempre en `server/routes`.
- **Contratos**: No cambiar tipos o estructuras de respuesta sin verificar el impacto en el cliente/servidor.
- **Seguridad**: Mantener y no degradar las validaciones de Zod ni el Rate Limiting.
- **Documentación**: Si se introduce un nuevo patrón (ej: un nuevo componente UI), documentarlo en `AGENTS.md` o `project.md`.

## Reglas de Token-Efficiency
- **Batching**: Priorizar cambios por lotes coherentes para evitar múltiples ediciones sobre el mismo archivo.
- **Precisión**: Leer solo los archivos estrictamente necesarios del módulo actual.
- **Memoria Viva**: Usar los archivos de `openspec/` para recuperar contexto rápidamente sin re-explorar todo el repo.
