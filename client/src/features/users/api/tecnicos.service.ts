import apiClient from '@/shared/api/axios'
import type { ApiListResponse, User } from '@/shared/types'

interface TecnicosPendientesResponse {
  tecnicosFalse: User[]
}

interface TecnicosAprobadosResponse {
  tecnicos: User[]
}

export const getTecnicosPendientes = async (): Promise<TecnicosPendientesResponse> => {
  const response = await apiClient.get<TecnicosPendientesResponse>('/tecnicos/tecnicosPendientes')
  return response.data
}

export const aprobarTecnico = async (id: string): Promise<User> => {
  const response = await apiClient.put<User>(`/tecnicos/${id}/aprobarTecnico`, {})
  return response.data
}

export const denegarTecnico = async (id: string): Promise<User> => {
  const response = await apiClient.put<User>(`/tecnicos/${id}/denegarTecnico`, {})
  return response.data
}

export const getTecnicosAprobados = async (): Promise<TecnicosAprobadosResponse> => {
  const response = await apiClient.get<TecnicosAprobadosResponse>('/tecnicos/tecnicosAprobados')
  return response.data
}

export const getTecnicosInactivos = async (): Promise<ApiListResponse<User[]>> => {
  const response = await apiClient.get<ApiListResponse<User[]>>('/usuarios/inactivos')
  return response.data
}

export const reactivarTecnico = async (id: string): Promise<User> => {
  const response = await apiClient.put<User>(`/usuarios/${id}/reactivar`, {})
  return response.data
}

export const getTecnicosActivos = async (): Promise<User[]> => {
  const response = await apiClient.get<ApiListResponse<User[]>>('/usuarios/activos')
  return response.data.data ?? []
}

export const inactivarTecnico = async (id: string): Promise<User> => {
  const response = await apiClient.put<User>(`/usuarios/${id}/inactivar`, {})
  return response.data
}
