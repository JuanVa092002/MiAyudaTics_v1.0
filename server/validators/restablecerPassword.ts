import { z } from 'zod'
import { handleValidator } from '../utils/handleValidator'

export const passwordSchema = z.object({
  token: z.string().min(1, 'El token es requerido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      'La contraseña debe tener una longitud mínima de 6 caracteres y contener al menos una letra y un número'
    ),
})

export type PasswordDto = z.infer<typeof passwordSchema>
export const validatorPassword = handleValidator(passwordSchema)
