# Superficie API — MiAyudaTIC

Catálogo REST derivado de `server/src/core/routes.ts` y archivos de rutas en `features/`. Prefijo base: **`/api`**.

Leyenda auth: **Público** = sin `authMiddleware`; **Auth** = JWT requerido; **Rol** = auth + `checkRol`.

---

## Auth — `/api/auth`

| Método | Ruta | Auth | Validación Zod | Descripción |
|--------|------|------|----------------|-------------|
| POST | `/register` | Público | `registerSchema` | Registro con foto opcional (multer) |
| POST | `/login` | Público | `loginSchema` | Login; set cookie `token` |
| GET | `/verify-token` | Cookie/Bearer | — | Valida JWT y devuelve usuario |
| POST | `/logout` | Público | — | Limpia cookie |

### Password recovery

| Método | Ruta | Auth | Notas |
|--------|------|------|-------|
| POST | `/api/recuperarPassword` | Público | Sin rate limit |
| POST | `/api/restablecerPassword/:token` | Público | Rate limit; Zod password |

---

## Usuarios — `/api/usuarios`

| Método | Ruta | Auth | Rol | Validación |
|--------|------|------|-----|------------|
| GET | `/` | **Público** ⚠️ | — | Lista todos los usuarios |
| GET | `/:id` | **Público** ⚠️ | — | `usuariosIdSchema` |
| PUT | `/` | Auth | — | `updateUsuariosSchema` (perfil) |
| GET | `/activos` | Auth | lider | — |
| GET | `/inactivos` | Auth | lider | — |
| PUT | `/:id` | Auth | lider | Actualizar usuario |
| PUT | `/:id/activar` | Auth | lider | Activar cuenta |
| PUT | `/:id/inactivar` | Auth | lider | Inactivar cuenta |

---

## Técnicos — `/api/tecnicos`

| Método | Ruta | Auth | Rol |
|--------|------|------|-----|
| GET | `/tecnicosPendientes` | Auth | lider |
| GET | `/tecnicosAprobados` | Auth | lider |
| PUT | `/:id/aprobarTecnico` | Auth | lider |
| PUT | `/:id/denegarTecnico` | Auth | lider |

---

## Solicitudes (tickets) — `/api/solicitud`

| Método | Ruta | Auth | Rol | Validación |
|--------|------|------|-----|------------|
| GET | `/` | **Público** ⚠️ | — | Lista todas las solicitudes |
| GET | `/:id` | **Público** ⚠️ | — | Detalle |
| DELETE | `/:id` | **Público** ⚠️ | — | Elimina solicitud |
| POST | `/` | Auth | funcionario | `solicitudSchema` |
| GET | `/historialSolicitudes` | Auth | lider | Historial global |
| GET | `/pendientes` | Auth | lider | Cola pendiente |
| GET | `/asignadas` | Auth | tecnico | Casos asignados al técnico |
| GET | `/finalizadas` | Auth | tecnico | Casos resueltos |
| GET | `/historial` | Auth | funcionario | Historial propio |
| PUT | `/:id/asignarTecnico` | Auth | lider | Sin Zod en body |

---

## Solución de caso — `/api/solucionCaso`

| Método | Ruta | Auth | Rol | Validación |
|--------|------|------|-----|------------|
| POST | `/` | Auth | tecnico | **Sin Zod** ⚠️ |

---

## Tipos de caso — `/api/tipoCaso`

| Método | Ruta | Auth | Rol |
|--------|------|------|-----|
| GET | `/` | Auth | lider, tecnico, funcionario |
| GET | `/:id` | Auth | lider, tecnico, funcionario |
| POST | `/` | Auth | lider |
| PUT | `/:id` | Auth | lider |
| DELETE | `/:id` | Auth | lider |

---

## Gráficas — `/api/graficaSolicitudesPorMes` y `...PorAmbiente`

| Método | Ruta | Auth |
|--------|------|------|
| GET | `/` (cada prefijo) | **Público** ⚠️ |

Query `year` en gráfica por mes (sin validación Zod).

---

## Ambientes — `/api/ambienteFormacion`

| Método | Ruta | Auth | Rol |
|--------|------|------|-----|
| GET | `/` | Auth | lider, funcionario |
| GET | `/:id` | Auth | lider, funcionario |
| POST | `/` | Auth | lider |
| PUT | `/:id` | Auth | lider |
| PUT | `/:id/inactivar` | Auth | lider |

POST/PUT sin Zod dedicado.

---

## Notificaciones — `/api/notificaciones`

| Método | Ruta | Auth |
|--------|------|------|
| GET | `/` | Auth |
| PATCH | `/:id/leer` | Auth |
| PATCH | `/leer-todas` | Auth |

IDOR posible en `/:id/leer` sin verificar ownership.

---

## Storage — `/api/storage`

| Método | Ruta | Auth |
|--------|------|------|
| GET | `/` | **Público** ⚠️ |
| GET | `/:id` | **Público** ⚠️ |
| POST | `/` | **Público** ⚠️ |
| PUT | `/:id` | **Público** ⚠️ |
| DELETE | `/:id` | **Público** ⚠️ |

Archivos también servidos estáticamente desde `/storage` en `app.ts`.

---

## DTOs y validación (Zod)

Schemas en `server/src/shared/validators/`:

| Schema | Uso |
|--------|-----|
| `auth.ts` | register, login |
| `restablecerPassword.ts` | reset password |
| `solicitud.ts` | crear solicitud |
| `usuarios.ts` | update perfil, id param |

DTOs tipados exportados en `server/src/shared/types/dto.ts` (post Fase 2.5).

---

## Socket.IO

- Inicializado en `handleSocket.ts` sobre el mismo servidor HTTP.
- Eventos emitidos con `io.emit` global desde controladores de tickets (sin rooms por usuario).
- **Sin middleware de autenticación** en conexión.

---

## Resumen de exposición pública (P0 seguridad)

Endpoints sin auth que deberían protegerse:

1. `GET/DELETE /api/solicitud` y `GET /api/solicitud/:id`
2. `GET /api/usuarios` y `GET /api/usuarios/:id`
3. Todo `/api/storage`
4. Gráficas de estadísticas

---

## Siguiente paso

[06-code-review.md](./06-code-review.md) para remediación priorizada.
