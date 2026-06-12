import { z } from 'zod'
import { handleValidator } from '../utils/handleValidator'

export const registerSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  correo: z.string().email('El correo electrónico no es válido'),
  rol: z.enum(['funcionario', 'tecnico'], {
    message: 'El rol no es válido',
  }),
  telefono: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^\d+$/, 'El teléfono debe ser un número'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      'La contraseña debe tener una longitud mínima de 6 caracteres y contener al menos una letra y un número'
    ),
})

export type RegisterDto = z.infer<typeof registerSchema>
export const validatorRegister = handleValidator(registerSchema)

export const loginSchema = z.object({
  correo: z.string().email('El correo electrónico no es válido'),
  password: z
    .string()
    .min(6, 'La contraseña es requerida')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      'La contraseña debe tener una longitud mínima de 6 caracteres y contener al menos una letra y un número'
    ),
})

export type LoginDto = z.infer<typeof loginSchema>
export const validatorLogin = handleValidator(loginSchema)

