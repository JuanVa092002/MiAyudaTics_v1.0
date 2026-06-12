import apiClient from '@/shared/api/axios'
import type { Notificacion } from '@/shared/types'
import type { AxiosResponse } from 'axios'

export const getNotificaciones = (): Promise<AxiosResponse<Notificacion[]>> => {
  return apiClient.get<Notificacion[]>('/notificaciones')
}

export const marcarComoLeida = (id: string): Promise<AxiosResponse<Notificacion>> => {
  return apiClient.patch<Notificacion>(`/notificaciones/${id}/leer`)
}

export const marcarTodasComoLeidas = (): Promise<AxiosResponse<void>> => {
  return apiClient.patch<void>('/notificaciones/leer-todas')
}
