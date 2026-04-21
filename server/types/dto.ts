import { z } from 'zod'
import { registerSchema, loginSchema } from '../validators/auth'
import { updateUsuariosSchema, usuariosIdSchema } from '../validators/usuarios'
import { solicitudSchema } from '../validators/solicitud'
import { passwordSchema } from '../validators/restablecerPassword'

/**
 * Contratos de datos (DTOs) inferidos desde los esquemas de Zod.
 * Estos tipos aseguran la consistencia entre la validacin del backend
 * y el consumo de la API en el frontend.
 */

// Auth
export type RegisterDto = z.infer<typeof registerSchema>
export type LoginDto = z.infer<typeof loginSchema>

// Usuarios
export type UpdateUsuariosDto = z.infer<typeof updateUsuariosSchema>
export type UsuariosIdDto = z.infer<typeof usuariosIdSchema>

// Solicitud
export type SolicitudDto = z.infer<typeof solicitudSchema>

// Restablecer password
export type RestablecerPasswordDto = z.infer<typeof passwordSchema>
