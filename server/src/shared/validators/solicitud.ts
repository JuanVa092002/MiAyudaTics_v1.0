import { z } from 'zod'
import { handleValidator } from '../utils/handleValidator'

export const solicitudSchema = z.object({
  usuario: z.string().regex(/^[0-9a-fA-F]{24}$/, 'El ID del usuario no es válido'),
  ambiente: z.string().regex(/^[0-9a-fA-F]{24}$/, 'El ID del ambiente no es válido'),
  tipoCaso: z.string().regex(/^[0-9a-fA-F]{24}$/, 'El ID del tipo de caso no es válido'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  telefono: z.string().min(1, 'El campo teléfono es obligatorio'),
  fotoId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'El ID de la foto no es válido').optional(),
})

export type SolicitudDto = z.infer<typeof solicitudSchema>
export const validarSolicitud = handleValidator(solicitudSchema)

