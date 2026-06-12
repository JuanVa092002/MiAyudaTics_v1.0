import apiClient from '@/shared/api/axios'
import type { TipoSolucion } from '@/shared/types'

export interface SolucionPayload {
  descripcionSolucion: string
  tipoCaso: string
  tipoSolucion: TipoSolucion
}

export const submitSolucionCaso = async (
  solicitudId: string,
  payload: SolucionPayload
): Promise<void> => {
  await apiClient.post(`/solucionCaso/${solicitudId}`, payload)
}
