import { z } from 'zod'
import { handleValidator } from '../utils/handleValidator'

export const updateUsuariosSchema = z
  .object({
    telefono: z
      .string()
      .regex(/^\d+$/, 'El teléfono debe ser un número')
      .optional(),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .optional(),
  })
  .strict()

export type UpdateUsuariosDto = z.infer<typeof updateUsuariosSchema>
export const validatorUpdateUsuarios = handleValidator(updateUsuariosSchema)

export const usuariosIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'El id es requerido'),
})

export type UsuariosIdDto = z.infer<typeof usuariosIdSchema>
export const validatorUsuariosId = handleValidator(usuariosIdSchema)

