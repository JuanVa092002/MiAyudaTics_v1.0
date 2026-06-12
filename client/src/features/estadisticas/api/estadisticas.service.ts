import apiClient from '@/shared/api/axios'
import type { EstadisticasResponse } from '@/shared/types'

export const getSolicitudesPorAmbiente = async (year: number): Promise<EstadisticasResponse> => {
  const response = await apiClient.get<EstadisticasResponse>(
    `/graficaSolicitudesPorAmbiente?year=${year}`
  )
  return response.data
}

export const getSolicitudesPorMes = async (year: number): Promise<EstadisticasResponse> => {
  const response = await apiClient.get<EstadisticasResponse>(`/graficaSolicitudesPorMes?year=${year}`)
  return response.data
}
