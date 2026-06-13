import { z } from 'zod'
import { handleValidator } from '../utils/handleValidator'

export const solucionCasoSchema = z.object({
  descripcionSolucion: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  tipoCaso: z.string().regex(/^[0-9a-fA-F]{24}$/, 'El ID del tipo de caso no es válido'),
  tipoSolucion: z.enum(['pendiente', 'finalizado']),
})

export type SolucionCasoDto = z.infer<typeof solucionCasoSchema>
export const validarSolucionCaso = handleValidator(solucionCasoSchema)
