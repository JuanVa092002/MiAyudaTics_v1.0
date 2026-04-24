import { z } from 'zod'
import { handleValidator } from '../utils/handleValidator'

export const passwordSchema = z.object({
  token: z.string().min(1, 'El token es requerido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
      'La contraseña debe tener al menos una letra y un número'
    ),
  confirmPassword: z.string().min(1, 'La confirmación es requerida'),
})


export type PasswordDto = z.infer<typeof passwordSchema>
export const validatorPassword = handleValidator(passwordSchema)

