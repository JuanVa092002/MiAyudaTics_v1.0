import apiClient from '@/shared/api/axios'
import type { AmbienteFormacion, ApiListResponse } from '@/shared/types'

export const getAmbientes = async (): Promise<ApiListResponse<AmbienteFormacion[]>> => {
  const response = await apiClient.get<ApiListResponse<AmbienteFormacion[]>>('/ambienteFormacion')
  return response.data
}

export const createAmbiente = async (
  ambiente: Pick<AmbienteFormacion, 'nombre'>
): Promise<AmbienteFormacion> => {
  const response = await apiClient.post<AmbienteFormacion>('/ambienteFormacion', ambiente)
  return response.data
}

export const updateAmbiente = async (
  id: string,
  ambiente: Pick<AmbienteFormacion, 'nombre'>
): Promise<AmbienteFormacion> => {
  const response = await apiClient.put<AmbienteFormacion>(`/ambienteFormacion/${id}`, ambiente)
  return response.data
}

export const inactivarAmbiente = async (id: string): Promise<AmbienteFormacion> => {
  const response = await apiClient.put<AmbienteFormacion>(`/ambienteFormacion/${id}/inactivar`, {})
  return response.data
}
