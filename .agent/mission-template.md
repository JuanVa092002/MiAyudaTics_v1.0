# 🚀 Nueva Misión (Hybrid Mission OS)

Copia y pega este bloque al inicio de tu prompt cuando quieras iniciar una nueva sesión de desarrollo. Esto asegura que el agente cargue exclusivamente el contexto necesario, reduciendo el consumo de tokens y evitando leer historial innecesario.

```markdown
/mission

**Foco:** 
[Describe en 1-2 líneas el objetivo exacto. Ej: "Implementar vista de asignación de tickets"]

**Intent:** 
[Qué quieres que logre el agente. Ej: "Modificar el controller backend para reasignar y actualizar la tabla en React"]

**Contexto Inyectado:**
- `ruta/al/archivo1.ts`
- `ruta/al/archivo2.tsx`

**Restricciones Adicionales:**
- [Añade reglas específicas de esta misión, ej: "No instalar dependencias" o "Asegurar tiempo de respuesta < 200ms"]
```
